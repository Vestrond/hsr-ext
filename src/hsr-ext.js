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

function getTrailblazer() {
    const trailblazerMap = {
        // Caelus
        '02eea7ac314d20d84540a77d6fe2825e': { name: 'Caelus', path: 'Destruction', attribute: 'Physical' },
        '4454292f573e2aa4a640c7150edacf08': { name: 'Caelus', path: 'Preservation', attribute: 'Fire' },
        '701b1bdb773f881ed59a446d06ca91b7': { name: 'Caelus', path: 'Harmony', attribute: 'Imaginary' },
        // Stelle
        'f593aa0d1d51a6a5bc8223525bc1937f': { name: 'Stelle', path: 'Destruction', attribute: 'Physical' },
        'c816c8d66446eb4a9f0c44e4099d292c': { name: 'Stelle', path: 'Preservation', attribute: 'Fire' },
        'ImaginationStelle': { name: 'Stelle', path: 'Harmony', attribute: 'Imaginary' },
    }

    const imagesWrapperClassName = 'c-hrd-sa-wrapper';
    const allImgSrc = document.querySelectorAll(`.${imagesWrapperClassName} img`);
    for (let imgSrcElement of allImgSrc) {
        const imgSrc = imgSrcElement.attributes.getNamedItem('src').value;

        for (const [key, characterInfo] of Object.entries(trailblazerMap)) {
            if (imgSrc.includes(key)) {
                return { ...characterInfo };
            }
        }
    }
    return { name: 'Stelle', path: 'Destruction', attribute: 'Physical' };
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
    data.trailblazer = getTrailblazer();

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

function extractRelicSet(imgSrc) {
    // Average sets
    // Musketeer
    const musketeerSet = [
        // Head
        'c0987a519a467222290be01ad9985ca3',
        // Hands
        'a50ebe7e706d5786168e33aded131e94',
        // Body
        'b4b05b10c48c07eecebd75157901a8fe',
        // Foot
        'ef21325ff1a7c68a3cf462573488f821',
    ];
    // Watchmaker
    const watchmakerSet = [
        // Head
        "4ff34aa3236fe0bc5fd4b0e489785454",
        // Hands
        "2934f431478e0267fedae92b60e5e1f4",
        // Body
        "e555076d57660e7a1669b0a3de26710d",
        // Foot
        "e0f4c2e89f7a6bed2b187df337692493",
    ];
    // Thief
    const thiefSet = [
        // Head
        "1f38b8d397308cb57056d7f6dee2c6f4",
        // Hands
        "5e54ea18f949fde3292473b08e3a2a47",
        // Body
        "80690f4b05462c8d9582f5620623e560",
        // Foot
        "7f9fa40993ccf581fcde1c4427934484",
    ];
    // Knight
    const knightSet = [
        // Head
        "e330a017307d55fb849a16851db66b58",
        // Hands
        "????",
        // Body
        "????",
        // Foot
        "1d91c0384dc7e544a71d4ae65cc3b6e4",
    ];
    // Eagle
    const eagleSet = [
        // Head
        "????",
        // Hands
        "????",
        // Body
        "153ae62aa91c691ea1b010fce8ec459b",
        // Foot
        "????",
    ];
    // Band
    const bandSet = [
        // Head
        "????",
        // Hands
        "????",
        // Body
        "????",
        // Foot
        "????",
    ];
    // Prisoner
    const prisonerSet = [
        // Head
        "d3cb4c37529831cc4d18333fc5fc9afd",
        // Hands
        "b4ea623f35a455928c0f8c7df2ddc389",
        // Body
        "1a717379f24ef3184ba5dffbfc833303",
        // Foot
        "b45be0705accde692be795dcbb5c320d",
    ];
    // Genius
    const geniusSet = [
        // Head
        "c4d481ba6ca1d1c0869a78e9f4191e6d",
        // Hands
        "68bde5465f901053d0d14dbd3d61473a",
        // Body
        "9d0e5b46591fadd7f8f0031c5fbf0acc",
        // Foot
        "fc997a823f758328184eda3f670fed7a",
    ];
    // Messenger
    const messengerSet = [
        // Head
        "9ebf9dd5d0a29c31863bb121bc2e0eae",
        // Hands
        "8bb3a83c3ae7cef2ff56ff37c68df709",
        // Body
        "cf3da71040cddaa22138b12451fb97e9",
        // Foot
        "9d1b47c1a77d7f51dd5f23fca29cfa6c",
    ];
    // Firesmith
    const firesmithSet = [
        // Head
        "2c983af6a1551baa02baa45cd65b1f9e",
        // Hands
        "????",
        // Body
        "5fbfbcfa7b7d39f4e8a71f13a614103d",
        // Foot
        "e3dfb3c56fdbed31af85ba9c6cca46ac",
    ];
    // Hunter
    const hunterSet = [
        // Head
        "22340d41e3118708f04b11899cf202d7",
        // Hands
        "????",
        // Body
        "3060d1bd7d7a95dc231a01b739e90680",
        // Foot
        "4b62823b69817f1290e20b44e82a2f6e",
    ];
    // Grand Duke
    const grandDukeSet = [
        // Head
        "b64350f8478ee8640e1162e5b5854fc0",
        // Hands
        "834a4a0535c85ea563b71b1ad4b518f6",
        // Body
        "560a30d73f7f712247f5068925cf62c0",
        // Foot
        "85ca3a88fabb7a02a1497e54932931d1",
    ];
    // Passerby
    const passerbySet = [
        // Head
        "????",
        // Hands
        "9e5e797613fb2ca19145b1494d92c553",
        // Body
        "????",
        // Foot
        '????',
    ];
    // Disciple
    const discipleSet = [
        // Head
        "3b00f87124d037a6a99c5ea1e673b7d0",
        // Hands
        "95313b9f43b8a0b0c33302021f61c4a7",
        // Body
        "d37a0420f76b4308743531cf7abab4ce",
        // Foot
        "cc588a2802e006fd170fc43c93f4f47d",
    ];
    // Guard
    const guardSet = [
        // Head
        "6b570d518c6fa60e4e824958a92442a5",
        // Hands
        "b90000c24b5cb79e822ab13cb1bb2fe9",
        // Body
        "3b57f2cf3695bb102c5bfc82ff603d6b",
        // Foot
        "81dd31452203d0379c4b08e84d92bb9d",
    ];
    // Wastelander
    const wastelanderSet = [
        // Head
        '????',
        // Hands
        "05b984e639e7398ed502827309c28bcc",
        // Body
        'cb651e2eb6aa64d2049e4d4416f20f43',
        // Foot
        "f5df38839b346290fa8a798f48492be2",
    ];
    // Champion
    const championSet = [
        // Head
        '????',
        // Hands
        '????',
        // Body
        "78ea5763adc82de7b5beceea414d5cce",
        // Foot
        '????',
    ];
    // Pioneer
    const pioneerSet = [
        // Head
        "27f5c44c7a914c84571e1f624964d5b9",
        // Hands
        "cdea04880128862d1b77ee198f2b4b58",
        // Body
        "c704881ca213c957081a0caf767d0674",
        // Foot
        "ec89ead3306872d66cc8bc2c0f6ba205",
    ];

    // Accessories
    // Izumo
    const izumoAccessorySet = [
        // Sphere
        "7f54ffce62dc39d1f8ab5c6a5119315e",
        // Rope
        "0b53d7e7b7bddd9d61e909f42ddfb82b",
    ];
    // The Xianzhou Luofu's
    const theXianzhouLoufuAccessorySet = [
        // Sphere
        "c7ad8afccc845fde761569a5a33048e3",
        // Rope
        "8ab7909a9a8e67968dbce2fd5797cb34",
    ];
    // Talia
    const taliaAccessorySet = [
        // Sphere
        '????',
        // Rope
        '????',
    ];
    // Salsotto
    const salsottoAccessorySet = [
        // Sphere
        "6549d054a354f642b4e593762050a4b1",
        // Rope
        "283fee1ca8499da6e8de209cd98c2c87",
    ];
    // Vonwacq
    const vonwacqAccessorySet = [
        // Sphere
        '????',
        // Rope
        "6c272f6d5f14b0990e21b3f7753ecc48",
    ];
    // Belobog
    const belobogAccessorySet = [
        // Sphere
        "4ec46797712293ab953ff0daf0d7b861",
        // Rope
        "8c678390b130e15e8d8043a0ae252f54",
    ];
    // Taikiyan
    const taikiyanAccessorySet = [
        // Sphere
        "ad07460e3dc559dbd4ffb42713ed142a",
        // Rope
        "93132a48e1f1d93cdd591de94cac017e",
    ];
    // Sigonia
    const sigoniaAccessorySet = [
        // Sphere
        "36fadba83a0117ba00bc5f1c90f5f3a8",
        // Rope
        "66d95973ead12077ec3d6f90fb1149c3",
    ];
    // The IPC
    const theIPCAccessorySet = [
        // Sphere
        "????",
        // Rope
        "????",
    ];
    // Herta
    const hertaAccessorySet = [
        // Sphere
        "046bb6c4e21bff57379671fed17249e8",
        // Rope
        "23395a80a4c423f5b36fe81448016b59",
    ];
    // Insumousu
    const insumousuAccessorySet = [
        // Sphere
        "9eb50d3b1d233b1dfb2c92cc1dc59a69",
        // Rope
        "b85282d0ec6151ecbd64b9386ad64bc1",
    ];
    // Glamoth
    const glamothAccessorySet = [
        // Sphere
        "6e00c71ce971d3a842791ca447be1040",
        // Rope
        "cdb0921afd3fde063dfdff51407eb5f2",
    ];
    // Penacony
    const penaconyAccessorySet = [
        // Sphere
        "33171db7f02aaecf125e1af449b54607",
        // Rope
        "7d035746917a583b7e502ea1a76cde87",
    ];
    // Planet Screwllum
    const planetScrewllumAccessorySet = [
        // Sphere
        "????",
        // Rope
        "????",
    ];

    const setsMap = {
        clothes: {
            guard: { name: "Guard of Wuthering Snow", hashes: guardSet },
            musketeer: { name: "Musketeer of Wild Wheat", hashes: musketeerSet },
            watchmaker: { name: "Watchmaker, Master of Dream Machinations", hashes: watchmakerSet },
            thief: { name: "Thief of Shooting Meteor", hashes: thiefSet },
            knight: { name: "Knight of Purity Palace", hashes: knightSet },
            eagle: { name: "Eagle of Twilight Line", hashes: eagleSet },
            band: { name: "Band of Sizzling Thunder", hashes: bandSet },
            prisoner: { name: "Prisoner in Deep Confinement", hashes: prisonerSet },
            genius: { name: "Genius of Brilliant Stars", hashes: geniusSet },
            messenger: { name: "Messenger Traversing Hackerspace", hashes: messengerSet },
            firesmith: { name: "Firesmith of Lava-Forging", hashes: firesmithSet },
            hunter: { name: "Hunter of Glacial Forest", hashes: hunterSet },
            grandDuke: { name: "The Ashblazing Grand Duke", hashes: grandDukeSet },
            passerby: { name: "Passerby of Wandering Cloud", hashes: passerbySet },
            disciple: { name: "Longevous Disciple", hashes: discipleSet },
            wastelander: { name: "Wastelander of Banditry Desert", hashes: wastelanderSet },
            champion: { name: "Champion of Streetwise Boxing", hashes: championSet },
            pioneer: { name: "Pioneer Diver of Dead Waters", hashes: pioneerSet },
        },
        accessories: {
            izumo: { name: 'Izumo Gensei and Takama Divine Realm', hashes: izumoAccessorySet },
            theXianzhouLoufu: { name: "Fleet of the Ageless", hashes: theXianzhouLoufuAccessorySet },
            talia: { name: 'Talia: Kingdom of Banditry', hashes: taliaAccessorySet },
            salsotto: { name: 'Inert Salsotto', hashes: salsottoAccessorySet },
            vonwacq: { name: 'Sprightly Vonwacq', hashes: vonwacqAccessorySet },
            belobog: { name: 'Belobog of the Architects', hashes: belobogAccessorySet },
            taikiyan: { name: 'Rutilant Arena', hashes: taikiyanAccessorySet },
            sigonia: { name: 'Sigonia, the Unclaimed Desolation', hashes: sigoniaAccessorySet },
            theIpc: { name: 'Pan-Cosmic Commercial Enterprise', hashes: theIPCAccessorySet },
            herta: { name: 'Space Sealing Station', hashes: hertaAccessorySet },
            insumousu: { name: 'Broken Keel', hashes: insumousuAccessorySet },
            glamoth: { name: 'Firmament Frontline: Glamoth', hashes: glamothAccessorySet },
            penacony: { name: 'Penacony, Land of the Dreams', hashes: penaconyAccessorySet },
            planetScrewllum: { name: 'Celestial Differentiator', hashes: planetScrewllumAccessorySet },
        },
    }

    const imageHash = imgSrc.replace('https://act-webstatic.hoyoverse.com/darkmatter/hkrpg/prod_gf_cn/item_icon_u3294b/', '').split('.png')[0];
    for (const setEntry of Object.values({ ...setsMap.clothes, ...setsMap.accessories })) {
        if (setEntry.hashes.includes(imageHash)) {
            return setEntry.name;
        }
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
        const imgSrc = relic.querySelector(`.${titleClassName} > .${titleImageClassName} > .${imageWrapperClassName} > img`).attributes.getNamedItem('src').value;
        const setName = extractRelicSet(imgSrc);
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

function extractAllElements() {
    const characteristicsOverallContainer = 'c-hrdcs';
    const itemsContainerClassName = 'c-hrdcs-btm-half';
    const itemsClassName = 'c-hrdcs-item';
    const avatarContainerClassName = 'c-hrd-sa-wrapper';
    const lvlClassName = 'c-hrd-ri-lv';

    const items = document.querySelectorAll(`.${characteristicsOverallContainer} .${itemsContainerClassName} > .${itemsClassName}`);

    const data = {};
    data.avatar = document.querySelector(`.${avatarContainerClassName}[selected='selected'] img`).attributes.getNamedItem('src').value;
    const battleInfo = extractCharacterBattleInfo();
    data.attribute = battleInfo.attribute;
    data.path = battleInfo.path;
    data.rarity = Number(document.querySelector(`.${avatarContainerClassName}[selected='selected']`).attributes.getNamedItem('rarity').value);
    data.lvl = Number(document.querySelector(`.${lvlClassName}`).textContent.trim().replace('Lv. ', ''));
    data.cone = extractCone();
    data.relics = extractRelics();
    data.characteristics = {};
    data.eidolons = extractEidolon();
    data.traces = extractTraces();

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

function badFilter() {
    const avatarContainerClassName = 'c-hrd-sa-wrapper';

    const server = getServerName();
    if (!server) {
        return;
    }

    const avatars = document.querySelectorAll(`.${avatarContainerClassName} img`);
    const actualAvatars = [];
    for (const avatar of avatars) {
        actualAvatars.push(avatar.attributes.getNamedItem('src').value);
    }
    if (actualAvatars.length === 0) {
        return;
    }

    storageGet('hsr-ext').then((rawData) => {
        if (!rawData) {
            return;
        }
        const data = rawData['hsr-ext'];
        if (!data) {
            return;
        }

        const characters = data.servers[server]?.characters;
        if (!characters) {
            return;
        }
        if (characters.length === avatars.length) {
            return;
        }

        for (const [characterName, characterData] of Object.entries(characters)) {
            if (!characterData) {
                continue;
            }
            if (!actualAvatars.includes(characterData.avatar)) {
                delete characters[characterName];
            }
        }

        aBrowser().storage.local.set({ 'hsr-ext': data });
    });
}

window.currentCharName = undefined;
window.currentServerName = undefined;
window.addEventListener("load", (event) => {
    const intervalId = setInterval(() => {
        const uiLanguageClassName = 'mhy-hoyolab-lang-selector__current-lang';
        const lang = document.querySelector(`.${uiLanguageClassName}`).textContent.trim();
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

        const charName = charNameElement.textContent;

        if (charName !== window.currentCharName || server !== window.currentServerName) {
            window.currentCharName = charName;
            window.currentServerName = server;

            storageGet('hsr-ext')
                .then((allData) => {
                    const data = allData['hsr-ext'] || { servers: {}, currentServer: server };
                    const servers = data.servers;
                    if (server in servers) {
                        servers[server] = { ...servers[server], ...extractAccountMeta() };

                        if ('characters' in servers[server]) {
                            servers[server].characters[charName] = extractAllElements();
                        } else {
                            servers[server].characters = { [charName]: extractAllElements() };
                        }
                    } else {
                        servers[server] = {
                            ...extractAccountMeta(),
                            characters: {
                                [charName]: extractAllElements(),
                            },
                        };
                    }

                    aBrowser().storage.local.set({ 'hsr-ext': data })
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
