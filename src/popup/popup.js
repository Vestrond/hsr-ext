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

function storageSet(key, data) {
    return aBrowser().storage.local.set({ [key]: data });
}

function storageClear() {
    return aBrowser().storage.local.clear();
}

function s(text) {
    return String(text).replace(/[^\p{L}0-9 %.\-'!?,:()]/gu, '');
}

function n(num) {
    return Number(num);
}

async function getImageHash(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = src;

        img.onload = async function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);

            try {
                const imageData = context.getImageData(0, 0, img.width, img.height).data;
                let bs = 0;
                let ws = 0;
                let ts = 0;

                for (let i = 0; i < imageData.length; i += 4) {
                    const r = imageData[i];
                    const g = imageData[i + 1];
                    const b = imageData[i + 2];
                    const a = imageData[i + 3];
                    if (r === 0 && g === 0 && b === 0 && a === 255) {
                        bs += 1;
                    } else if (r === 255 && g === 255 && b === 255 && a === 255) {
                        ws += 1;
                    } else if (a === 0) {
                        ts += 1;
                    }
                }
                resolve(`${ws}.${bs}.${ts}`);
            } catch (e) {
                reject(e);
            } finally {
                context.clearRect(0, 0, canvas.width, canvas.height);
                canvas.remove();
            }
        };

        img.onerror = reject;
    });
}

const tinyDB = {
    trailblazer: {
        caelus: {
            physical: { name: 'Caelus', path: 'Destruction', attribute: 'Physical' },
            fire: { name: 'Caelus', path: 'Preservation', attribute: 'Fire' },
            imaginary: { name: 'Caelus', path: 'Harmony', attribute: 'Imaginary' },
        },
        stelle: {
            physical: { name: 'Stelle', path: 'Destruction', attribute: 'Physical' },
            fire: { name: 'Stelle', path: 'Preservation', attribute: 'Fire' },
            imaginary: { name: 'Stelle', path: 'Harmony', attribute: 'Imaginary' },
        },
    },
    relics: {
        keyedSets: {
            clothes: {
                musketeer: { name: 'Musketeer of Wild Wheat' },
                watchmaker: { name: 'Watchmaker, Master of Dream Machinations' },
                thief: { name: 'Thief of Shooting Meteor' },
                knight: { name: 'Knight of Purity Palace' },
                eagle: { name: 'Eagle of Twilight Line' },
                band: { name: 'Band of Sizzling Thunder' },
                prisoner: { name: 'Prisoner in Deep Confinement' },
                genius: { name: 'Genius of Brilliant Stars' },
                messenger: { name: 'Messenger Traversing Hackerspace' },
                firesmith: { name: 'Firesmith of Lava-Forging' },
                hunter: { name: 'Hunter of Glacial Forest' },
                grandDuke: { name: 'The Ashblazing Grand Duke' },
                passerby: { name: 'Passerby of Wandering Cloud' },
                disciple: { name: 'Longevous Disciple' },
                wastelander: { name: 'Wastelander of Banditry Desert' },
                champion: { name: 'Champion of Streetwise Boxing' },
                pioneer: { name: 'Pioneer Diver of Dead Waters' },
            },
            accessories: {
                izumo: { name: 'Izumo Gensei and Takama Divine Realm' },
                theXianzhouLoufu: { name: 'Fleet of the Ageless' },
                talia: { name: 'Talia: Kingdom of Banditry' },
                salsotto: { name: 'Inert Salsotto' },
                vonwacq: { name: 'Sprightly Vonwacq' },
                belobog: { name: 'Belobog of the Architects' },
                taikiyan: { name: 'Rutilant Arena' },
                sigonia: { name: 'Sigonia, the Unclaimed Desolation' },
                theIpc: { name: 'Pan-Cosmic Commercial Enterprise' },
                herta: { name: 'Space Sealing Station' },
                insumousu: { name: 'Broken Keel' },
                glamoth: { name: 'Firmament Frontline: Glamoth' },
                penacony: { name: 'Penacony, Land of the Dreams' },
                planetScrewllum: { name: 'Celestial Differentiator' },
            },
        },
        hashToKey: {
            clothes: {
                // Head
                '41.29.6223': 'knight',
                // Hands
                '12.0.10690': 'knight',
                // Body
                '36.23.6380': 'knight',
                // Foot
                '26.6.8531': 'knight',
                // Head
                '1.3.6774': 'pioneer',
                // Hands
                '5.1.8263': 'pioneer',
                // Body
                '1.3.6880': 'pioneer',
                // Foot
                '5.0.6439': 'pioneer',
                // Head
                '0.1.8018': 'prisoner',
                // Hands
                '0.0.7156': 'prisoner',
                // Body
                '0.2.8327': 'prisoner',
                // Foot
                '0.0.6828': 'prisoner',
                // Head
                '0.3.7729': 'messenger',
                // Hands
                '4.3.7644': 'messenger',
                // Body
                '3.1.9212': 'messenger',
                // Foot
                '2.2.7347': 'messenger',
                // Head
                '5.0.9527': 'genius',
                // Hands
                '20.3.7458': 'genius',
                // Body
                '9.1.5995': 'genius',
                // Foot
                '36.2.6151': 'genius',
                // Head
                '50.0.10267': 'band',
                // Hands
                '16.0.8046': 'band',
                // Body
                '16.0.6891': 'band',
                // Foot
                '25.0.6229': 'band',
                // Head
                '133.11.5166': 'eagle',
                // Hands
                '44.3.8167': 'eagle',
                // Body
                '39.6.6607': 'eagle',
                // Foot
                '45.3.5892': 'eagle',
                // Head
                '40.1.9482': 'thief',
                // Hands
                '75.0.7885': 'thief',
                // Body
                '87.0.7086': 'thief',
                // Foot
                '31.1.6833': 'thief',
                // Head
                '2.0.8024': 'disciple',
                // Hands
                '0.0.9259': 'disciple',
                // Body
                '0.1.7798': 'disciple',
                // Foot
                '0.1.6731': 'disciple',
                // Head
                '4.5.9078': 'musketeer',
                // Hands
                '0.19.7924': 'musketeer',
                // Body
                '6.4.6179': 'musketeer',
                // Foot
                '5.2.6898': 'musketeer',
                // Head
                '2.0.9076': 'watchmaker',
                // Hands
                '5.0.7766': 'watchmaker',
                // Body
                '17.1.6828': 'watchmaker',
                // Foot
                '0.1.9385': 'watchmaker',
                // Head
                '36.5.7035': 'hunter',
                // Hands
                '45.0.6478': 'hunter',
                // Body
                '46.4.7276': 'hunter',
                // Foot
                '81.3.5870': 'hunter',
                // Head
                '0.0.7719': 'grandDuke',
                // Hands
                '5.0.9011': 'grandDuke',
                // Body
                '0.1.7569': 'grandDuke',
                // Foot
                '0.0.8714': 'grandDuke',
                // Head
                '34.24.5621': 'champion',
                // Hands
                '37.8.7082': 'champion',
                // Body
                '25.10.6663': 'champion',
                // Foot
                '6.30.7744': 'champion',
                // Head
                '0.7.7303': 'wastelander',
                // Hands
                '6.19.7362': 'wastelander',
                // Body
                '2.5.7352': 'wastelander',
                // Foot
                '16.28.7038': 'wastelander',
                // Head
                '12.0.11583': 'passerby',
                // Hands
                '1.0.9532': 'passerby',
                // Body
                '0.1.7473': 'passerby',
                // Foot
                '3.2.8668': 'passerby',
                // Head
                "1.0.7349": 'firesmith',
                // Hands
                "0.0.7354": 'firesmith',
                // Body
                "0.0.6965": 'firesmith',
                // Foot
                "2.0.8244": 'firesmith',
            },
            accessories: {
                // Sphere
                '15.0.6491': 'theXianzhouLoufu',
                // Rope
                '11.0.10285': 'theXianzhouLoufu',
                // Sphere
                '23.0.5384': 'izumo',
                // Rope
                '6.0.12429': 'izumo',
                // Sphere
                '4.8.6136': 'theIpc',
                // Rope
                '2.0.12125': 'theIpc',
                // Sphere
                '4.0.6164': 'insumousu',
                // Rope
                '0.0.12545': 'insumousu',
                // Sphere
                '40.5.6128': 'taikiyan',
                // Rope
                '7.0.12207': 'taikiyan',
                // Sphere
                '35.0.5729': 'sigonia',
                // Rope
                '25.0.11715': 'sigonia',
                // Sphere
                '11.0.6307': 'belobog',
                // Rope
                '9.0.12184': 'belobog',
                // Sphere
                '28.2.6148': 'talia',
                // Rope
                '13.1.12881': 'talia',
                // Sphere
                '8.0.6344': 'vonwacq',
                // Rope
                '26.0.12548': 'vonwacq',
                // Sphere
                '76.0.6201': 'salsotto',
                // Rope
                '13.0.12305': 'salsotto',
                // Sphere
                '27.1.6129': 'penacony',
                // Rope
                '41.0.11700': 'penacony',
                // Sphere
                '36.0.5535': 'planetScrewllum',
                // Rope
                '96.0.13526': 'planetScrewllum',
                // Sphere
                '109.3.4679': 'herta',
                // Rope
                '24.0.11921': 'herta',
                // Sphere
                '40.0.5677': 'glamoth',
                // Rope
                '14.0.11789': 'glamoth',
            },
        },
    },
};

async function getTrailblazerFromUrls(avatarUrls) {
    const trailblazerMap = {
        // Caelus
        '105.10.9084': tinyDB.trailblazer.caelus.physical,
        '0.1.10225': tinyDB.trailblazer.caelus.fire,
        '??caelus.imaginary??': tinyDB.trailblazer.caelus.imaginary,
        // Stelle
        '158.6.6001': tinyDB.trailblazer.stelle.physical,
        '??stelle.fire??': tinyDB.trailblazer.stelle.fire,
        '??stelle.imaginary??': tinyDB.trailblazer.stelle.imaginary,
    };

    for (let avatarUrl of avatarUrls) {
        const imgHash = await getImageHash(avatarUrl);

        for (const [key, characterInfo] of Object.entries(trailblazerMap)) {
            if (imgHash === key) {
                return structuredClone(characterInfo);
            }
        }
    }
    return tinyDB.trailblazer.stelle.physical;
}

async function extractRelicSet(iconUrl) {
    const iconHash = await getImageHash(iconUrl);
    if (iconHash in tinyDB.relics.hashToKey.clothes) {
        const setKey = tinyDB.relics.hashToKey.clothes[iconHash];
        return tinyDB.relics.keyedSets.clothes[setKey].name;
    } else if (iconHash in tinyDB.relics.hashToKey.accessories) {
        const setKey = tinyDB.relics.hashToKey.accessories[iconHash];
        return tinyDB.relics.keyedSets.accessories[setKey].name;
    } else {
        throw new Error(`Cannot extract Relic Set for ${iconUrl} (${iconHash})`);
    }
}

function getChromeTabID() {
    return new Promise((resolve, reject) => {
        try {
            chrome?.tabs?.query({
                active: true,
            }, function(tabs) {
                resolve(tabs.find(t => t.url?.includes('act.hoyolab.com'))?.id);
            });
        } catch (e) {
            reject(e);
        }
    });
}

async function executor(path) {
    if (typeof browser !== 'undefined') {
        return browser.tabs.executeScript({ file: path });
    } else if (typeof chrome !== 'undefined') {
        return chrome.scripting.executeScript({
            target: { tabId: await getChromeTabID(), allFrames: true },
            files: [path],
        });
    } else {
        return undefined;
    }
}

function setMessage() {
    try {
        document.getElementById('message').textContent = JSON.stringify([...arguments], null, 2);
    } catch (e) {
        document.getElementById('message').textContent = 'Cannot set message';
    }
}

function setDataMessage() {
    try {
        document.getElementById('data').textContent = JSON.stringify([...arguments], null, 2);
    } catch (e) {
        document.getElementById('data').textContent = 'Cannot set message';
    }
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
};

function genScanDataForUser(callback) {
    storageGet('hsr-ext').then((storageData) => {
        const data = storageData['hsr-ext'];
        const currentServerName = data.currentServer || Object.keys(data)[0];
        const currentServer = data.servers[currentServerName];

        const cones = [];
        const characters = [];
        const relics = [];
        Object.entries(currentServer.characters).forEach(([characterKey, characterData], index) => {
            const cone = characterData.cone;
            if (cone !== undefined) {
                cones.push({
                    'key': cone.name,
                    'level': cone.lvl,
                    'ascension': index + 1,
                    'superimposition': cone.rank,
                    'location': characterKey,
                    'lock': true,
                    '_id': `light_cone_${index + 1}`,
                });
            }

            characters.push({
                'key': characterKey,
                'level': characterData.lvl,
                'ascension': index + 1,
                'eidolon': characterData.eidolons.amount || 0,
                'skills': characterData.traces.skills,
                'traces': characterData.traces.bonuses,
            });

            let relicId = 0;
            for (const relic of Object.values(characterData.relics)) {
                relicId++;
                relics.push({
                    'set': relic.set,
                    'slot': relic.slot,
                    'rarity': relic.rarity,
                    'level': relic.lvl,
                    'mainstat': relic.mainStat.name,
                    'substats': relic.subStats.map((ss) => ({
                        'key': ss.key,
                        'value': ss.pureValue,
                    })),
                    'location': characterKey,
                    'lock': false,
                    'discard': false,
                    '_id': `relic_${relicId}`,
                });
            }
        });


        const outputData = {
            'source': 'HSR-Scanner',
            'build': 'v1.0.0',
            'version': 3,
            'metadata': {
                'uid': currentServer.uid,
                'trailblazer': currentServer.trailblazer.name,
                // "current_trailblazer_path": currentServer.trailblazer.path,
            },
            'light_cones': cones,
            'relics': relics,
            'characters': characters,
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
        const blob = new Blob([JSON.stringify(outputData)], { type: 'application/json' });
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
    storageClear().then(() => {
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

const allAttrs = ['wind', 'ice', 'fire', 'quantum', 'lightning', 'imaginary', 'physical'];
const allPaths = ['destruction', 'erudition', 'harmony', 'hunt', 'nihility', 'preservation', 'abundance'];

function sortsHTML() {
    function selectedAdder(sortId) {
        if (window.sortSettings === sortId) return ' selected';
        else return '';
    }

    return `
<div class="sorts">
    <div class="sortsLine">
        <div class="sortItem${selectedAdder('az')}" id="az">A - Z</div>
        —
        <div class="sortItem${selectedAdder('za')}" id="za">Z - A</div>
    </div>
    <div class="sortsLine">
        <div class="sortItem${selectedAdder('lvlDown')}" id="lvlDown">80 - 1</div>
        —
        <div class="sortItem${selectedAdder('lvlUp')}" id="lvlUp">1 - 80</div>
    </div>
    <div class="sortsLine">
        <div class="sortItem${selectedAdder('starDown')}" id="starDown">5★ - 4★</div>
        —
        <div class="sortItem${selectedAdder('starUp')}" id="starUp">4★ - 5★</div>
    </div>
</div>
`;
}

function filtersHTML() {
    const attributesBlocks = [];
    for (const attr of allAttrs) {
        const attrClasses = ['attributeBlock'];
        if (window.filters.attributes.includes(attr)) {
            attrClasses.push('selected');
        }
        attributesBlocks.push(`
            <div role="button" id="filter-attribute-${attr}" class="${attrClasses.join(' ')}" title="${attr}">
                <img class="icon" src="/icons/attribute/${attr}.png" alt="attr" />
            </div>
        `);
    }

    const pathsBlocks = [];
    for (const path of allPaths) {
        const pathClasses = ['pathBlock'];
        if (window.filters.paths.includes(path)) {
            pathClasses.push('selected');
        }
        pathsBlocks.push(`
            <div role="button" id="filter-path-${path}" class="${pathClasses.join(' ')}" title="${path}">
                <img class="icon" src="/icons/path/${path}.png" alt="path" />
            </div>
        `);
    }

    function selectedStarFilter(elemId) {
        if (window.filters.rarity.includes(elemId)) return ' selected';
        return '';
    }

    return `
<div class="filters">
    <div class="attributesFilters">${attributesBlocks.join('')}</div>
    <div class="pathsFilters">${pathsBlocks.join('')}</div>
    <div class="rarityFilters">
        <div class="rarityFilterItem${selectedStarFilter('4s')}" id="4s">
            4<span class="rarityStar">★</span>
        </div>
        <div class="rarityFilterItem${selectedStarFilter('5s')}" id="5s">
            5<span class="rarityStar">★</span>
        </div>
    </div>
</div>
`;
}

function coneAsHTML(data) {
    if (data === undefined) {
        return 'No cone';
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

function characterAsHtml(charKey, data) {
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
        progressInfoLines.push(`<div class="battleTextIcon">E${n(data.eidolons.amount)}</div>`);
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
        if (name === 'Planar Sphere') return 'Sphere';
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

    function prepareStat(stat, isMain = false) {
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
                    <div class="characterName">${s(data.name)}</div>
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
`;
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
            classes.push('selected');
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
`;
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
        storageSet('hsr-ext', { ...data, currentServer: hfServerName(newServerName) });
    });
}

function rerender() {
    storageGet('hsr-ext').then((rawData) => {
        setDataMessage(rawData);
        console.log('Rerender with data:', rawData);
        const data = rawData['hsr-ext'] || {};
        if (Object.keys(data).length === 0 || Object.keys(data.servers).length === 0) {
            document.getElementById('popup-content').innerHTML = `
<div class="noData">
    <img class="noDataImg" src="/icons/empty.png" alt="-" />
    <div>No data found</div>
</div>`;
            return;
        }

        const currentServer = data.currentServer || Object.keys(data)[0];

        const strContent = {};
        for (const [serverName, serverData] of Object.entries(data.servers)) {
            // setMessage('2', serverName);
            const innerLines = [];

            const startLine = accountInfoAsHTML(serverName, serverData);
            innerLines.push(startLine);
            const sortsBlock = sortsHTML();
            const filterBlock = filtersHTML();
            innerLines.push(`
<div class="listSettings">
    ${sortsBlock}${filterBlock}
    <div class="clearListSettings">∅</div>
</div>
`);

            const characters = Object.entries(serverData.characters);
            if (window.sortSettings !== undefined) {
                characters.sort(([aName, aData], [bName, bData]) => {
                    if (window.sortSettings === 'az') return aName.localeCompare(bName);
                    if (window.sortSettings === 'za') return bName.localeCompare(aName);
                    if (window.sortSettings === 'lvlDown') return bData.lvl - aData.lvl;
                    if (window.sortSettings === 'lvlUp') return aData.lvl - bData.lvl;
                    if (window.sortSettings === 'starDown') return bData.rarity - aData.rarity;
                    if (window.sortSettings === 'starUp') return aData.rarity - bData.rarity;
                });
            }

            for (const [charKey, charData] of characters) {
                if (
                    (window.filters.attributes.length > 0 && !window.filters.attributes.includes(charData.attribute))
                    || (window.filters.paths.length > 0 && !window.filters.paths.includes(charData.path))
                    || (window.filters.rarity.length > 0 && !window.filters.rarity.includes(`${charData.rarity}s`))
                ) {
                    continue;
                }

                if (serverName in window.cache && charKey in window.cache[serverName]) {
                    innerLines.push(window.cache[serverName][charKey]);
                } else {
                    const innerLine = characterAsHtml(charKey, charData);
                    if (serverName in window.cache) {
                        window.cache[serverName][charKey] = innerLine;
                    } else {
                        window.cache[serverName] = { [charKey]: innerLine };
                    }
                    innerLines.push(innerLine);
                }
            }

            strContent[serverName] = innerLines.join('');
        }

        const serversData = serverAsHTML(Object.keys(data.servers), currentServer, strContent);
        // setMessage('3', serversData);
        document.getElementById('popup-content').innerHTML = serversData;
        linkFilters();

        setTimeout(() => {
            const serverLabelSelector = '.serversNames > .serverName';
            for (const serverLabel of document.querySelectorAll(serverLabelSelector)) {
                serverLabel.onclick = changeServer;
            }
        }, 0);
        // document.getElementById('popup-content').textContent = JSON.stringify(data, null, 2);
    }).catch(error => {
        console.error('Error retrieving label texts:', error);
        setMessage('Error retrieving label texts:', error.message);
    });
}

function linkFilters() {
    for (const item of document.querySelectorAll('.sortItem')) {
        item.onclick = (e) => {
            if (window.sortSettings === e.target.id) {
                window.sortSettings = undefined;
            } else {
                window.sortSettings = e.target.id;
            }
            rerender();
        };
    }
    for (const item of document.querySelectorAll('.rarityFilters > .rarityFilterItem')) {
        item.onclick = (e) => {
            let target = e.target;
            if (e.target.tagName === 'SPAN') {
                target = e.target.parentNode;
            }

            const rarity = target.id;
            if (window.filters.rarity.includes(rarity)) {
                window.filters.rarity = window.filters.rarity.filter(r => r !== rarity);
            } else {
                window.filters.rarity.push(rarity);
            }
            rerender();
        };
    }

    document.querySelector('.clearListSettings').onclick = (e) => {
        resetSettings();
        rerender();
    };

    for (const attr of allAttrs) {
        document.getElementById(`filter-attribute-${attr}`).onclick = (e) => {
            if (window.filters.attributes.includes(attr)) {
                window.filters.attributes = window.filters.attributes.filter(a => a !== attr);
            } else {
                window.filters.attributes.push(attr);
            }
            rerender();
        };
    }
    for (const path of allPaths) {
        document.getElementById(`filter-path-${path}`).onclick = (e) => {
            if (window.filters.paths.includes(path)) {
                window.filters.paths = window.filters.paths.filter(p => p !== path);
            } else {
                window.filters.paths.push(path);
            }
            rerender();
        };
    }
}

// The only reliable way to calculate image hashes is via popup.
async function finalizeCalculations() {
    const rawData = await storageGet('hsr-ext');
    const data = rawData['hsr-ext'] || {};

    // debugger;
    if (Object.keys(data).length === 0 || Object.keys(data.servers).length === 0) {
        return;
    }

    for (const [serverName, serverData] of Object.entries(data.servers)) {
        if (serverData.trailblazer === null) {
            if (!serverData.charactersAvatars?.length) {
                throw new Error('Fail to analyze the trailblazer.');
            }
            serverData.trailblazer = await getTrailblazerFromUrls(serverData.charactersAvatars);
        }

        for (const [characterName, character] of Object.entries(serverData.characters)) {
            for (const [relicSlot, relic] of Object.entries(character.relics)) {
                if (relic.set === null) {
                    if (!relic.icon) {
                        throw new Error(`Fail to analyze the relic ${serverName}.${characterName}.${relicSlot}.`);
                    }
                    relic.set = await extractRelicSet(relic.icon);
                }
            }
        }
    }

    try {
        console.log('data to set:', data);
        await storageSet('hsr-ext', data);
    } catch (error) {
        console.error('Error in finalization', error);
    }
}

function startLoadingAnimation() {
    document.getElementById('loading-animation').style.display = 'flex';
}
function finishLoadingAnimation() {
    document.getElementById('loading-animation').style.display = 'none';
}

function listenForClicks() {
    startLoadingAnimation();
    finalizeCalculations().then(() => {
        finishLoadingAnimation();
        rerender();
    });

    // getImageHash('https://act-webstatic.hoyoverse.com/darkmatter/hkrpg/prod_gf_cn/item_icon_u3294b/583abf2fb9e8c0f0b3ae962e17bd8e83.png?x-oss-process=image%2Fformat%2Cwebp')
    //     .then((result) => {
    //         setMessage(`Result: ${JSON.stringify(result)}`);
    //     }).catch((error) => {
    //         setMessage(`Error: ${JSON.stringify(error)}`);
    //     });

    // document.getElementById('copyData').onclick = copyData;
    document.getElementById('downloadData').onclick = downloadData;
    document.getElementById('clearData').onclick = clearData;
    // document.getElementById('refresh').onclick = rerender;
}

function reportExecuteScriptError(error) {
    // setMessage(error.message);
    listenForClicks();
}

function resetSettings() {
    window.filters = {
        attributes: [],
        paths: [],
        rarity: [],
        // lvl: {
        //     a: 0,
        //     b: 80,
        // },
    };
    window.sortSettings = undefined;
}

resetSettings();
window.cache = {};
executor('/script/main.js')
    .then(listenForClicks)
    .catch(reportExecuteScriptError);