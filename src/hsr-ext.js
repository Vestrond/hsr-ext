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
    return aBrowser().storage.local.set({[key]: data});
}

// hello -> Hello
function capitalize(string) {
    return string ? string[0].toUpperCase() + string.slice(1) : '';
}

// [...document.querySelectorAll('.c-hrdr-title > span')].map(e => e.textContent.trim()).join('\n')
// TODO: Add translations
// const translator = {
//     relics: {
//         'Head': ["Head", "Голова", "Kopf", "머리", "Cabeza", "Tête", "Cabeça", "头部", "頭部"],
//         'Hands': ["Hands", "Руки", "Hände", "핸드", "Manos", "Mains", "Mãos", "手部", "手部"],
//         'Body': ["Body", "Тело", "Körper", "바디", "Torso", "Corps", "Corpo", "躯干", "軀幹"],
//         'Feet': ["Feet", "Ноги", "Füße", "신발", "Piernas", "Pieds", "Pés", "脚部", "腳部"],
//         'Planar Sphere': ["Planar Sphere", "Планарная сфера", "Planarsphäre", "차원 구체", "Esfera de plano", "Sphère planaire", "Esfera Plana", "位面球", "次元球"],
//         'Link Rope': ["Link Rope", "Соединительная верёвка", "Verbindungsseil", "연결 매듭", "Cuerda de unión", "Corde de liaison", "Corda de Ligação", "连结绳", "連結繩"],
//     },
//     cones: {},
//     stats: {
//         'HP': ['HP'],
//         'DEF': ['DEF'],
//         'ATK': ['ATK'],
//         'SPD': ['SPD'],
//         'CRIT Rate': ['CRIT Rate'],
//         'CRIT DMG': ['CRIT DMG'],
//         'Fire DMG Boost': ['Fire DMG Boost'],
//         'Lightning DMG Boost': ['Lightning DMG Boost'],
//         'Wind DMG Boost': ['Wind DMG Boost'],
//         'Physical DMG Boost': ['Physical DMG Boost'],
//         'Imaginary DMG Boost': ['Imaginary DMG Boost'],
//         'Ice DMG Boost': ['Ice DMG Boost'],
//         'Quantum DMG Boost': ['Quantum DMG Boost'],
//         'Break Effect': ['Break Effect'],
//         'Outgoing Healing Boost': ['Outgoing Healing Boost'],
//         'Energy Regeneration Rate': ['Energy Regeneration Rate'],
//         'Effect Hit Rate': ['Effect Hit Rate'],
//         'Effect RES': ['Effect RES'],
//     },
// }

function getCharacterImagesUrls() {
    const imagesWrapperClassName = 'c-hrd-sa-wrapper';
    const allImgSrc = document.querySelectorAll(`.${imagesWrapperClassName} img`);
    const urls = [];

    for (let imgSrcElement of allImgSrc) {
        const imgSrc = imgSrcElement.attributes.getNamedItem('src').value;
        if (imgSrc) {
            urls.push(imgSrc);
        }
    }

    return urls;
}

function extractAccountMeta() {
    const avatarClassName = 'avatar';
    const uidClassName = 'uid';
    const nicknameClassName = 'nickname';
    const lvlClassName = 'level';

    const data = {};

    const avatarStyle = document.querySelector(`div.${avatarClassName}`).attributes.getNamedItem('style').value;
    let regex = /url\("([^)]*)"\)/;
    data.avatar = avatarStyle.match(regex)[1];

    data.uid = Number(document.querySelector(`.${uidClassName}`).textContent.trim().substring(3));
    data.nickname = document.querySelector(`.${nicknameClassName}`).textContent.trim();
    data.lvl = document.querySelector(`.${lvlClassName}`).textContent.trim().replace('Lv. ', '');
    // Will be filled in popup.js > finalizeCalculations()
    data.trailblazer = null;
    data.charactersAvatars = getCharacterImagesUrls();

    return data;
}

function extractCharacterBattleInfo() {
    const iconWrapperClassName = 'c-hrd-ri-attr-icon';

    const attrs = ['wind', 'ice', 'fire', 'quantum', 'lightning', 'imaginary', 'physical'];
    const paths = ['destruction', 'erudition', 'harmony', 'hunt', 'nihility', 'preservation', 'abundance'];

    let path;
    let attribute;

    function matchAttr(imgSrc) {
        for (let a of attrs) {
            if (imgSrc.includes(`${a}.`)) {
                return a;
            }
        }
    }

    function matchPath(imgSrc) {
        for (let p of paths) {
            if (imgSrc.includes(`${p}.`)) {
                return p;
            }
        }
    }

    for (const imgElement of document.querySelectorAll(`.${iconWrapperClassName} img`)) {
        const imgSrc = imgElement.attributes.getNamedItem('src').value.toLowerCase();
        if (!path) {
            path = matchPath(imgSrc);
        }
        if (!attribute) {
            attribute = matchAttr(imgSrc);
        }
    }

    return {
        attribute,
        path,
    }
}

function extractCone() {
    const noConeClassName = 'c-hrt-lct-lc-empty';
    const noConeElement = document.querySelector(`div.${noConeClassName} span`);
    if (noConeElement !== null && noConeElement.textContent === 'No Light Cone Equipped') {
        return undefined;
    }

    const coneNameClassName = 'c-hrt-lct-lc-name';
    const coneLvlClassName = 'c-hrt-lct-lc-lv';
    const coneRankClassName = 'c-hrt-lct-lc-rank';
    const coneImgClassName = 'c-hrd-dcp-ref';

    const name = document.querySelector(`.${coneNameClassName}`).textContent.trim();
    const rarity = Number(document.querySelector(`.${coneNameClassName}`).attributes.getNamedItem('rarity').value);
    const lvl = Number(document.querySelector(`.${coneLvlClassName}`).textContent.trim().replace('Lv. ', ''));
    const rank = Number(document.querySelector(`.${coneRankClassName}`).textContent.replace('Superimposition Lv. ', '').trim());
    const img = document.querySelector(`.${coneImgClassName} img`).attributes.getNamedItem('src').value;

    return {
        name,
        rarity,
        lvl,
        rank,
        img,
    };
}

function extractEidolon() {
    const imgWrapperClassName = 'c-hrd-icon-rank';
    const imgClassName = 'c-hrd-icon-rank-img';

    const images = document.querySelectorAll(`.${imgWrapperClassName} > .${imgClassName}`);
    let amount = 0;
    const icons = [];
    for (const image of images) {
        const lockAttr = image.attributes.getNamedItem('lock');
        if (lockAttr && lockAttr.value === 'true') {
            break;
        }
        amount += 1;
        icons.push(image.attributes.getNamedItem('src').value);
    }

    return {
        amount,
        icons,
    };
}

function extractTraces() {
    const tracesClassName = '.c-hrd-sk-ic > .c-hrd-sk-ic-inner';
    // const traces = document.querySelectorAll(tracesClassName);
    const tracesLvls = document.querySelectorAll(`${tracesClassName} > span`);

    return {
        skills: {
            basic: Number(tracesLvls[0].textContent.trim()),
            skill: Number(tracesLvls[1].textContent.trim()),
            ult: Number(tracesLvls[2].textContent.trim()),
            talent: Number(tracesLvls[3].textContent.trim()),
        },
        bonuses: {
            ability_1: false,
            ability_2: false,
            ability_3: false,
            stat_1: false,
            stat_2: false,
            stat_3: false,
            stat_4: false,
            stat_5: false,
            stat_6: false,
            stat_7: false,
            stat_8: false,
            stat_9: false,
            stat_10: false
        },
    }
}

function extractRelics() {
    const relicsClassName = 'c-hrdr-item';
    const titleClassName = 'c-hrdr-title';
    const titleLvlClassName = 'c-hrdr-title-tag';
    const titleImageClassName = 'c-hrdr-title-img';
    const imageWrapperClassName = 'c-hrd-dcp-ref';
    const bodyClassName = 'c-hrdr-btm';
    const paramClassName = 'c-hrdr-btm-item';
    const paramNameClassName = 'c-hrdr-name';
    const paramValueClassName = 'c-hrdr-num';
    const paramMultiplierClassName = 'c-hrdr-strength';

    const relics = {};

    for (const relic of document.querySelectorAll(`.${relicsClassName}`)) {
        // Title
        const rawSlot = relic.querySelector(`.${titleClassName} > span`).textContent.trim();
        const slot = rawSlot.toLowerCase().replace(' ', '_');
        const rarity = Number(relic.querySelector(`.${titleClassName}`).attributes.getNamedItem('rarity').value);
        const lvlLabelElement = relic.querySelector(`.${titleClassName} > .${titleLvlClassName} > span`);
        const lvl = lvlLabelElement ? Number(lvlLabelElement.textContent.replace('+', '')) : 1;
        const imgElement = relic.querySelector(`.${titleClassName} > .${titleImageClassName} > .${imageWrapperClassName} > img`);
        const imgSrc = imgElement.attributes.getNamedItem('src').value;
        // Will be filled in popup.js > finalizeCalculations()
        const setName = null;
        // Body
        const params = relic.querySelectorAll(`.${bodyClassName} > .${paramClassName}`);
        let mainStat = undefined;
        const subStats = [];

        for (const param of params) {
            if (param.childElementCount === 0) {
                continue;
            }

            const paramIcon = param.querySelector('img').attributes.getNamedItem('src').value;
            const paramName = param.querySelector(`.${paramNameClassName}`).textContent.trim();
            const paramValue = param.querySelector(`.${paramValueClassName}`).textContent.trim();
            const paramKey = paramName + (paramValue.endsWith('%') && !paramName.endsWith('Boost') ? '_' : '');
            const hasPriority = param.querySelector(`.${paramNameClassName}`).attributes.getNamedItem('highlight')?.value === 'true';
            const multiplierElement = param.querySelector(`.${paramMultiplierClassName}`);
            const multiplier = multiplierElement ? Number(multiplierElement.querySelector('span').textContent.trim()) : 0;


            const stat = {
                icon: paramIcon,
                key: paramKey,
                name: paramName,
                pureValue: Number(paramValue.replace('%', '')),
                value: paramValue,
                hasPriority,
                multiplier,
            };

            if (mainStat === undefined) {
                mainStat = stat;
            } else {
                subStats.push(stat);
            }
        }

        relics[slot] = {
            slot: rawSlot,
            set: setName,
            icon: imgSrc,
            lvl,
            rarity,
            mainStat,
            subStats,
        };
    }

    return relics;
}

function checkAvatarAvailability() {
    const avatarContainerClassName = 'c-hrd-sa-wrapper';
    const avatarElement = document.querySelector(`.${avatarContainerClassName}[selected='selected'] img`);
    return !!avatarElement;
}

function getCurrentCharacterKey() {
    if (window.currentCharName === 'Trailblazer') {
        return `Trailblazer${capitalize(window.currentCharPath)}`;
    }
    return window.currentCharName;
}

function extractAllElements() {
    const characteristicsOverallContainer = 'c-hrdcs';
    const itemsContainerClassName = 'c-hrdcs-btm-half';
    const itemsClassName = 'c-hrdcs-item';
    const avatarContainerClassName = 'c-hrd-sa-wrapper';
    const lvlClassName = 'c-hrd-ri-lv';

    const items = document.querySelectorAll(`.${characteristicsOverallContainer} .${itemsContainerClassName} > .${itemsClassName}`);

    const data = {};
    data.key = getCurrentCharacterKey();
    data.name = window.currentCharName;
    data.avatar = document.querySelector(`.${avatarContainerClassName}[selected='selected'] img`).attributes.getNamedItem('src').value;
    data.attribute = window.currentCharAttr;
    data.path = window.currentCharPath;
    data.rarity = Number(document.querySelector(`.${avatarContainerClassName}[selected='selected']`).attributes.getNamedItem('rarity').value);
    data.lvl = Number(document.querySelector(`.${lvlClassName}`).textContent.trim().replace('Lv. ', ''));
    data.cone = extractCone();
    data.relics = extractRelics();
    data.eidolons = extractEidolon();
    data.traces = extractTraces();
    data.characteristics = {};

    items.forEach((item) => {
        const attrNameClassName = 'c-hrdcs-name';
        const sumClassName = 'c-hrdcs-num';
        const detailsContainerClassName = 'c-hrdcs-extra';
        const itemIconClassName = 'c-hrdcs-icon';

        const name = item.getElementsByClassName(attrNameClassName)[0].textContent;
        const sum = item.getElementsByClassName(sumClassName)[0].textContent;
        const icon = item.getElementsByClassName(itemIconClassName)[0].attributes.getNamedItem('src').value;
        const hasPriority = name.toLowerCase().includes('dmg boost') || item.attributes.getNamedItem('highlight')?.value === 'true';
        let base = undefined;
        let extra = undefined;

        const detailsContainer = item.getElementsByClassName(detailsContainerClassName);
        if (detailsContainer.length > 0) {
            const baseClassName = 'c-hrdcs-base';
            const extraClassName = 'c-hrdcs-add';
            base = item.getElementsByClassName(baseClassName)[0].textContent;
            extra = item.getElementsByClassName(extraClassName)[0].textContent.replace('+', '');
        }

        data.characteristics[name] = {
            base,
            extra,
            sum,
            icon,
            hasPriority,
        }
    });

    const avatarContainer = document.querySelector(`.${avatarContainerClassName}[selected='selected']`);
    if (avatarContainer) {
        avatarContainer.style.border = '1px solid lime';
    }

    return data;
}

function getServerName() {
    const serverElement = document.querySelector('.account-right .account-btm > span');
    return serverElement?.textContent;
}

// function badFilter() {
//     const avatarContainerClassName = 'c-hrd-sa-wrapper';
//
//     const server = getServerName();
//     if (!server) {
//         return;
//     }
//
//     const avatars = document.querySelectorAll(`.${avatarContainerClassName} img`);
//     const actualAvatars = [];
//     for (const avatar of avatars) {
//         actualAvatars.push(avatar.attributes.getNamedItem('src').value);
//     }
//     if (actualAvatars.length === 0) {
//         return;
//     }
//
//     storageGet('hsr-ext').then((rawData) => {
//         if (!rawData) {
//             return;
//         }
//         const data = rawData['hsr-ext'];
//         if (!data) {
//             return;
//         }
//
//         const characters = data.servers[server]?.characters;
//         if (!characters) {
//             return;
//         }
//         if (characters.length === avatars.length) {
//             return;
//         }
//
//         for (const [characterName, characterData] of Object.entries(characters)) {
//             if (!characterData) {
//                 continue;
//             }
//             if (!actualAvatars.includes(characterData.avatar)) {
//                 delete characters[characterName];
//             }
//         }
//
//         aBrowser().storage.local.set({'hsr-ext': data});
//     });
// }

window.currentCharName = undefined;
window.currentCharPath = undefined;
window.currentCharAttr = undefined;
window.currentServerName = undefined;
window.addEventListener("load", (event) => {
    const intervalId = setInterval(() => {
        const uiLanguageClassName = 'mhy-hoyolab-lang-selector__current-lang';
        const langElement = document.querySelector(`.${uiLanguageClassName}`);
        if (!langElement) {
            return;
        }
        const lang = langElement.textContent.trim();
        if (!lang) {
            return;
        }
        if (lang !== 'EN') {
            clearInterval(intervalId);
            return;
        }

        const server = getServerName();
        const charNameElement = document.querySelector('.c-hrd-ri-name');

        if (!charNameElement || !server || !checkAvatarAvailability()) {
            return;
        }

        const charName = charNameElement.textContent.trim();
        const { attribute: charAttr, path: charPath } = extractCharacterBattleInfo();

        if (
          charName !== window.currentCharName ||
          charPath !== window.currentCharPath ||
          charAttr !== window.currentCharAttr ||
          server !== window.currentServerName
        ) {
            window.currentCharName = charName;
            window.currentCharPath = charPath;
            window.currentCharAttr = charAttr;
            window.currentServerName = server;

            storageGet('hsr-ext')
                .then((allData) => {
                    const data = allData['hsr-ext'] || {servers: {}, currentServer: server};
                    const servers = data.servers;

                    const accountMeta = extractAccountMeta();
                    const allElements = extractAllElements();
                    const charKey = getCurrentCharacterKey();

                    if (server in servers) {
                        servers[server] = {...servers[server], ...accountMeta};

                        if ('characters' in servers[server]) {
                            servers[server].characters[charKey] = allElements;
                        } else {
                            servers[server].characters = {[charKey]: allElements};
                        }
                    } else {
                        servers[server] = {
                            ...accountMeta,
                            characters: {
                                [charKey]: allElements,
                            },
                        };
                    }

                    storageSet('hsr-ext', data)
                        // .then(() => {
                        //     badFilter();
                        // })
                        .catch(error => {
                            console.error('Error saving label texts:', error);
                        });
                })
                .catch(error => {
                    console.error('Error retrieving label texts:', error);
                });
        }
    }, 500);
});
