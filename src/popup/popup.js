function aBrowser() {
    if (typeof browser !== 'undefined') {
        return browser;
    } else if (typeof chrome !== 'undefined') {
        return chrome;
    } else {
        return undefined;
    }
}
function storageGet(key) {
    if (typeof browser !== 'undefined') {
        return browser.storage.local.get(key);
    } else if (typeof chrome !== 'undefined') {
        return chrome.storage.local.get([key]);
    } else {
        return undefined;
    }
}
function s(text) {
    return String(text).replace(/[^a-zA-Z0-9 %.\-'!?,:()]/g, "");
}
function n(num) {
    return Number(num);
}

function getChromeTabID() {
    return new Promise((resolve, reject) => {
        try {
            chrome?.tabs?.query({
                active: true,
            }, function (tabs) {
                resolve(tabs.find(t => t.url?.includes('act.hoyolab.com'))?.id);
            })
        } catch (e) {
            reject(e);
        }
    })
}

async function executor(path) {
    if (typeof browser !== 'undefined') {
        return browser.tabs.executeScript({file: path});
    } else if (typeof chrome !== 'undefined') {
        return chrome.scripting.executeScript({
            target : {tabId : await getChromeTabID(), allFrames : true},
            files: [path],
        });
    } else {
        return undefined;
    }
}

function setMessage() {
    document.getElementById('message').textContent = JSON.stringify([...arguments], null, 2);
}

function CopyToClipboard(value) {
    navigator.clipboard.writeText(value);
}

const rankMap = {
    1: 'I',
    2: 'II',
    3: 'III',
    4: 'IV',
    5: 'V',
}

function genScanDataForUser(callback) {
    storageGet('hsr-ext').then((storageData) => {
        const data = storageData['hsr-ext'];
        const currentServerName = data.currentServer || Object.keys(data)[0];
        const currentServer = data.servers[currentServerName];

        const cones = [];
        const characters = [];
        const relics = [];
        Object.entries(currentServer.characters).forEach(([characterName, characterData], index) => {
            const cone = characterData.cone;
            if (cone !== undefined) {
                cones.push({
                    "key": cone.name,
                    "level": cone.lvl,
                    "ascension": index + 1,
                    "superimposition": cone.rank,
                    "location": characterName,
                    "lock": true,
                    "_id": `light_cone_${index + 1}`
                });
            }

            characters.push({
                "key": characterName,
                "level": characterData.lvl,
                "ascension": index + 1,
                "eidolon": characterData.eidolons.amount || 0,
                "skills": characterData.traces.skills,
                "traces": characterData.traces.bonuses,
            });

            let relicId = 0;
            for (const relic of Object.values(characterData.relics)) {
                relicId++;
                relics.push({
                    "set": relic.set,
                    "slot": relic.slot,
                    "rarity": relic.rarity,
                    "level": relic.lvl,
                    "mainstat": relic.mainStat.name,
                    "substats": relic.subStats.map((ss) => ({
                        "key": ss.key,
                        "value": ss.pureValue,
                    })),
                    "location": characterName,
                    "lock": false,
                    "discard": false,
                    "_id": `relic_${relicId}`
                });
            }
        });


        const outputData = {
            "source": "HSR-Scanner",
            "build": "v1.0.0",
            "version": 3,
            "metadata": {
                "uid": currentServer.uid,
                "trailblazer": currentServer.trailblazer.name,
                // "current_trailblazer_path": currentServer.trailblazer.path,
            },
            "light_cones": cones,
            "relics": relics,
            "characters": characters,
        };

        callback(outputData);
    }).catch(error => {
        console.error('Error retrieving label texts:', error);
    });
}

function copyData() {
    genScanDataForUser((outputData) => {
        CopyToClipboard(JSON.stringify(outputData));
    });
}

function downloadData() {
    genScanDataForUser((outputData) => {
        const a = document.createElement('a');
        const blob = new Blob([JSON.stringify(outputData)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);

        a.href = url;
        a.download = 'HSRScanData.json';
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }, 0);
    });
}

function clearData() {
    aBrowser().storage.local.set({'hsr-ext': undefined}).then(() => {
        rerender();
    }).catch(error => {
        document.getElementById('popup-content').innerHTML = JSON.stringify(error);
    });
}

function accountInfoAsHTML(serverName, data) {
    return `
<div class="account">
    <div class="avatarContainer">
        <img class="avatar" src="${data.avatar}" alt="avatar" />
    </div>
    <div class="accountRows">
        <div class="accountRow">
            <div class="nickname">${s(data.nickname)}</div>
            <div class="lvl">${n(data.lvl)}</div>
        </div>
        <div class="accountRow">
            <div class="serverName">${s(serverName)}</div>
            <div class="uid">${n(data.uid)}</div>
        </div>    
    </div>
</div>
`;
}

function coneAsHTML(data) {
    if (data === undefined) {
        return 'No cone'
    }

    return `
<div class="coneInfo rarity-${data.rarity}">
    <div class="coneMainInfo">
        <div class="coneNameBlock">
            <div class="coneName" title="${s(data.name)}">${s(data.name)}</div>
            <div class="coneRank">${rankMap[data.rank]}</div>
        </div>
        <div class="coneLvl">Lv. ${n(data.lvl)}</div>
    </div>
    <img class="coneImg" src="${data.img}" alt="cone" />
</div>
    `;
}

function characterAsHtml(charName, data) {
    const characteristicsLines = [];
    for (const [characteristicName, characteristic] of Object.entries(data.characteristics)) {
        characteristicsLines.push(characteristicAsHTML(characteristicName, characteristic));
    }

    const battleInfoLines = [];
    let battleInfo = '';
    if (data.attribute) {
        battleInfoLines.push(`<img class="battleInfoIcon" src="/icons/attribute/${s(data.attribute)}.png" alt="attr" />`);
    }
    if (data.path) {
        battleInfoLines.push(`<img class="battleInfoIcon" src="/icons/path/${s(data.path)}.png" alt="path" />`);
    }
    const progressInfoLines = [];
    if (data.eidolons?.amount !== undefined) {
        progressInfoLines.push(`<div class="battleTextIcon">E${n(data.eidolons.amount)}</div>`)
    }
    if (data.traces?.skills !== undefined) {
        progressInfoLines.push(`<div class="battleTextIconExt">Basic: ${n(data.traces.skills.basic)}</div>`);
        progressInfoLines.push(`<div class="battleTextIconExt">Skill: ${n(data.traces.skills.skill)}</div>`);
        progressInfoLines.push(`<div class="battleTextIconExt">Ult: ${n(data.traces.skills.ult)}</div>`);
        progressInfoLines.push(`<div class="battleTextIconExt">Talent: ${n(data.traces.skills.talent)}</div>`);
    }
    if (battleInfoLines.length > 0) {
        let progressInfo = '';
        if (progressInfoLines.length > 0) {
            progressInfo = `
<div class="progressInfo">
    ${progressInfoLines.join('')}
</div>
`;
        }

        battleInfo = `
<div class="battleInfo">
    ${battleInfoLines.join('')}
    ${progressInfo}
</div>
`;
    }

    // Relics
    let relicsInfo = '';
    const relics = [];
    const emptyRelic = '<div class="relic emptyRelic">Empty</div>';

    function shortSlot(name) {
        if (name === 'Planar Sphere') return 'Sphere'
        if (name === 'Link Rope') return 'Rope';
        return name;
    }
    function shortParam(name) {
        if (name === 'CRIT Rate') return 'CR';
        if (name === 'CRIT DMG') return 'CD';
        if (name === 'Effect Hit Rate') return 'EHR';
        if (name === 'Break Effect') return 'BE';
        if (name === 'Outgoing Healing Boost') return 'OHB';
        if (name === 'Effect RES') return 'RES';
        if (name === 'Energy Regeneration Rate') return 'ERR';
        if (name.endsWith('DMG Boost')) return name[0] + name[1] + 'B';
        return name;
    }

    function prepareStat(stat, isMain=false) {
        const relicClasses = ['relicStat'];
        if (stat.hasPriority) {
            relicClasses.push('highlight');
        }
        const multiplier = stat.multiplier
            ? `<div class="relicStatMultiplier">+${n(stat.multiplier)}</div>`
            : '';
        return `
<div class="${relicClasses.join(' ')}">
    <!--<img class="relicStatIcon" src="${stat.icon}" alt="" />-->
    <div class="relicStatName" title="${s(stat.name)}">${shortParam(s(stat.name))}</div>
    ${multiplier}
    <div class="relicStatValue">${s(stat.value)}</div>
</div>
`;
    }

    function prepareRelic(key) {
        if (data.relics?.[key] !== undefined) {
            const relic = data.relics[key];
            relics.push(`
<div class="relic rarity-${n(relic.rarity)}" title="${s(relic.set)} +${n(relic.lvl)}">
    <div class="relicInfo">
        <div class="relicSlot">${shortSlot(s(relic.slot))}</div>
        <div class="relicLvl">${n(relic.lvl)}</div>
        <img class="relicImage" src="${relic.icon}" alt="relic" />    
    </div>
    <div class="relicStats">
        ${prepareStat(relic.mainStat, true)}
        ${relic.subStats.map((stat) => prepareStat(stat)).join('')}
    </div>
</div>
`);
        } else {
            relics.push(emptyRelic);
        }
    }

    prepareRelic('head');
    prepareRelic('hands');
    prepareRelic('body');
    prepareRelic('feet');
    prepareRelic('planar_sphere');
    prepareRelic('link_rope');
    relicsInfo = relics.join('');
    // /Relics

    // let eidolonInfo = '';
    // if (data.eidolons) {
    //     const eidolonsLines = [];
    //     for (const eidolonIcon of data.eidolons.icons) {
    //         eidolonsLines.push(`<img class="eidolon" src="${eidolonIcon}" alt="e" />`);
    //     }
    //     eidolonInfo = eidolonsLines.join('');
    // }

    return `
<div class="characterLine">
    <div class="characterInfo rarity-${data.rarity}">
        <div class="characterMainInfo">
            <div class="avatarContainer">
                <img class="avatar" src="${data.avatar}" alt="avatar" />
            </div>
            <div class="vert-8">
                <div class="hor-4">
                    <div class="characterName">${s(charName)}</div>
                    <div class="characterLvl">${n(data.lvl)}</div>               
                </div>
                ${battleInfo}
            </div>
            
        </div>
        <div class="characterCone">
            ${coneAsHTML(data.cone)}  
        </div>
    </div>
    <div class="characterData">
        <div class="characteristics">
            ${characteristicsLines.join('')}
        </div>
        <div class="relics">
            ${relicsInfo}
        </div>
    </div>
<!--    <div class="characterProgress">-->
<!--    </div>-->
</div>
`
}

function validServerName(serverName) {
    return serverName.replace(' ', '_');
}

function hfServerName(serverName) {
    return serverName.replace('_', ' ');
}

function serverAsHTML(serverNames, current, content) {
    const serverNamesAsStrings = [];
    for (let serverName of serverNames) {
        if (serverName === current) {
            serverNamesAsStrings.push(`<div id="toggle-${validServerName(serverName)}" class="serverName selected">${s(serverName)}</div>`);
        } else {
            serverNamesAsStrings.push(`<div id="toggle-${validServerName(serverName)}" class="serverName">${s(serverName)}</div>`);
        }
    }
    const contentLines = [];
    for (let [serverName, strLine] of Object.entries(content)) {
        const classes = ['serverContent'];
        if (serverName === current) {
            classes.push('selected')
        }
        contentLines.push(`
<div class="${classes.join(' ')}" id="server-${validServerName(serverName)}">
    ${strLine}
</div>
`);
    }

    return `
<div class="servers">
    <div class="serversNames">${serverNamesAsStrings.join('')}</div>
    <div class="serversContent">${contentLines.join('')}</div>
</div>
`
}

function characteristicAsHTML(name, characteristic) {
    const classes = ['characteristic'];
    if (characteristic.hasPriority) {
        classes.push('highlight');
    }

    if (
        !('extra' in characteristic) ||
        !('base' in characteristic) ||
        !characteristic.extra ||
        !characteristic.base
    ) {
        return `
<div class="${classes.join(' ')}">
    <div class="name">
        <img class="characteristicIcon" src="${characteristic.icon}" alt="" /> ${s(name)}
    </div>
    <div class="characteristicValues">
        <div class="sumValue">${s(characteristic.sum)}</div>
    </div>
</div>    
`;
    }

    return `
<div class="${classes.join(' ')}">
    <div class="name">
        <img class="characteristicIcon" src="${characteristic.icon}" alt="" /> ${s(name)}
    </div>
    <div class="characteristicValues">
        <div class="value">${s(characteristic.base)}</div>
        <div class="additionalValue">${s(characteristic.extra)}</div>
        <div class="sumValue">${s(characteristic.sum)}</div>
    </div>
</div>    
`;
}

function changeServer(event) {
    const newServerName = event.target.id.replace('toggle-', '');
    storageGet('hsr-ext').then((rawData) => {
        document.querySelector('.serverContent.selected').classList.remove('selected');
        document.querySelector('.serversNames > .serverName.selected').classList.remove('selected');
        document.getElementById(`server-${newServerName}`).classList.add('selected');
        document.getElementById(`toggle-${newServerName}`).classList.add('selected');

        const data = rawData['hsr-ext'];
        aBrowser().storage.local.set({
            'hsr-ext': {...data, currentServer: hfServerName(newServerName)},
        });
    });
}

function rerender() {
    storageGet('hsr-ext').then((rawData) => {
        setMessage(rawData);
        const data = rawData['hsr-ext'];
        if (Object.keys(data).length === 0 || Object.keys(data.servers).length === 0) {
            document.getElementById('popup-content').innerHTML = 'No data found';
            return;
        }

        const currentServer = data.currentServer || Object.keys(data)[0];

        const strContent = {};
        for (const [serverName, serverData] of Object.entries(data.servers)) {
            // setMessage('2', serverName);
            const innerLines = [];

            const startLine = accountInfoAsHTML(serverName, serverData);
            innerLines.push(startLine);

            for (const [charName, charData] of Object.entries(serverData.characters)) {
                const innerLine = characterAsHtml(charName, charData);
                innerLines.push(innerLine);
            }

            strContent[serverName] = innerLines.join('');
        }

        const serversData = serverAsHTML(Object.keys(data.servers), currentServer, strContent);
        // setMessage('3', serversData);
        document.getElementById('popup-content').innerHTML = serversData;

        setTimeout(() => {
            const serverLabelSelector = '.serversNames > .serverName';
            for (const serverLabel of document.querySelectorAll(serverLabelSelector)) {
                serverLabel.onclick = changeServer;
            }
        }, 0);
        // document.getElementById('popup-content').textContent = JSON.stringify(data, null, 2);
    }).catch(error => {
        console.error('Error retrieving label texts:', error);
    });
}

function listenForClicks() {
    rerender();
    // document.getElementById('copyData').onclick = copyData;
    document.getElementById('downloadData').onclick = downloadData;
    document.getElementById('clearData').onclick = clearData;
    // document.getElementById('refresh').onclick = rerender;
}

function reportExecuteScriptError(error) {
    console.error(error);
}
//
// aBrowser().tabs
//     .executeScript({file: "/script/main.js"})
//     .then(listenForClicks)
//     .catch(reportExecuteScriptError);
debugger;
executor('/script/main.js')
    .then(listenForClicks)
    .catch(reportExecuteScriptError);