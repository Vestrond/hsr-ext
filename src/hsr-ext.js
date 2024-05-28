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
        '02eea7ac314d20d84540a77d6fe2825e': {name: 'Caelus', path: 'Destruction', attribute: 'Physical'},
        '4454292f573e2aa4a640c7150edacf08': {name: 'Caelus', path: 'Preservation', attribute: 'Fire'},
        '701b1bdb773f881ed59a446d06ca91b7': {name: 'Caelus', path: 'Harmony', attribute: 'Imaginary'},
        // Stelle
        'f593aa0d1d51a6a5bc8223525bc1937f': {name: 'Stelle', path: 'Destruction', attribute: 'Physical'},
        'c816c8d66446eb4a9f0c44e4099d292c': {name: 'Stelle', path: 'Preservation', attribute: 'Fire'},
        'ImaginationStelle': {name: 'Stelle', path: 'Harmony', attribute: 'Imaginary'},
    }

    const imagesWrapperClassName = 'c-hrd-sa-wrapper';
    const allImgSrc = document.querySelectorAll(`.${imagesWrapperClassName} img`);
    for (let imgSrcElement of allImgSrc) {
        const imgSrc = imgSrcElement.attributes.getNamedItem('src').value;

        for (const [key, characterInfo] of Object.entries(trailblazerMap)) {
            if (imgSrc.includes(key)) {
                return {...characterInfo};
            }
        }
    }
    return {name: 'Stelle', path: 'Destruction', attribute: 'Physical'};
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
        '1c131a1272f5634a2b0a73c637894f6a',
        // Hands
        '1fe52ad40054091a96f0a51ac5cc3d41',
        // Body
        'f9343d61b1c6bba4a2599337d8e0854c',
        // Foot
        '4165ae60d05b4bf558c4a171452de030',
    ];
    // Watchmaker
    const watchmakerSet = [
        // Head
        '07c8963e8417fc8ab7c60618cb3188d9',
        // Hands
        '5e81d1901faf2800fa1260f0cf3ade48',
        // Body
        'c02920ca6f5b1b71ab605b8f69f496d7',
        // Foot
        '80d00dae4571f5a3b62a580f459c8017',
    ];
    // Thief
    const thiefSet = [
        // Head
        "bbbe6c1e5904e0da9b8ee72c403fd789",
        // Hands
        "99034e3c6ed73028e60e72df8c1b9a98",
        // Body
        "85fb682c80f6599d4721b7ff3869ec2b",
        // Foot
        "b4fb65841d8214b1efffb2b530e5555b",
    ];
    // Knight
    const knightSet = [
        // Head
        "7b2d48b104b36e250fe0d436c4b6fa32",
        // Hands
        "15659626cc6e06145afb314d729fa2e2",
        // Body
        "43370ddbc7f099f72698373eda2bd853",
        // Foot
        "7765258662c113fa7b0df8605c96bd55",
    ];
    // Eagle
    const eagleSet = [
        // Head
        "3cca4672ee1595ea85e694223b12640b",
        // Hands
        "a34ac649757ccf5a501c8ddd57dfb8a1",
        // Body
        "a7e2c41eefd7ae28273d274632a2b4e3",
        // Foot
        "66954efffb224f98df46fd06db222c12",
    ];
    // Band
    const bandSet = [
        // Head
        "435674a13ebe6c1f391266fa274a2b3a",
        // Hands
        "1c317e4386ef240342bbbb88c2206eb2",
        // Body
        "49120d90ba66127c0b96c78f76d69b69",
        // Foot
        "6fe37ab2aea063aced02e5e61f69b55c",
    ];
    // Prisoner
    const prisonerSet = [
        // Head
        "3f56c8b44eab706bbfa20277b1d24965",
        // Hands
        "535d5c2d35b43831d4e92763518ac8e4",
        // Body
        "463ee0c54d3da745735769b5ffb61f79",
        // Foot
        "7b857707a49b1ec00aca0de2ae23b916",
    ];
    // Genius
    const geniusSet = [
        // Head
        "4a74fe65c7fb4faeab1e340fe4da040b",
        // Hands
        "4906179a34340a6a783f65ee6cfbfe88",
        // Body
        "45643d2a89845272e3e49b639b0a3043",
        // Foot
        "2c0a9279295796f32a3fec1742d7dfcb",
    ];
    // Messenger
    const messengerSet = [
        // Head
        "67eead241b97d3d866b2559ccb3a13ac",
        // Hands
        "ff94f576433175003fa70b4a3250c757",
        // Body
        "f2e85db095202eeb2969f5cdca50fef4",
        // Foot
        "27878de0890fb56c277dc93d5bf735c8",
    ];
    // Firesmith
    const firesmithSet = [
        // Head
        "f4d29fc0d426ec39c3a0d33fd51afda6",
        // Hands
        "f7327ece7aad15d4d6d25e3ca962f354",
        // Body
        "3cfe5dd9aeacc9294e9d993ee57b17aa",
        // Foot
        "e8a2048c335a241f5c037fa64ac9d57c",
    ];
    // Hunter
    const hunterSet = [
        // Head
        "6395d9ec863504bd2fc615dd9cbf3c73",
        // Hands
        "31bdcd73a1aea01d1f589af9a0211e07",
        // Body
        "b536a51704faab4e01375f749ea034df",
        // Foot
        "f3202a0bf01e72fad7952a97da6dcb3a",
    ];
    // Grand Duke
    const grandDukeSet = [
        // Head
        "585ec00aea32bd8568460a027d8bffe4",
        // Hands
        "db478b13b9cd1ce2b06a677e8e04592b",
        // Body
        '0111e70a748ab038215832f3a7f77437',
        // Foot
        '95b003736aaebaea072164258b072c10',
    ];
    // Passerby
    const passerbySet = [
        // Head
        "31e0d4408c4bffb134e295e7710f1773",
        // Hands
        '7d63fc940e2adec54fec369946359bb1',
        // Body
        "e4887aec85eee27dc7c164bfe7dc4d52",
        // Foot
        '????',
    ];
    // Disciple
    const discipleSet = [
        // Head
        'd2d8120bc38fa753803b5c2360932cf6',
        // Hands
        "9a0d6a128d075ee8d2559c3e20017d44",
        // Body
        '8a767343c98412b9178e6184facee401',
        // Foot
        "33170305f9b2779c5adb99df75a5f5a1",
    ];
    // Wastelander
    const wastelanderSet = [
        // Head
        '448da9b999e9c782a2115edc7b8045e0',
        // Hands
        '????',
        // Body
        '????',
        // Foot
        '63aabd362eb7bd68e498ae01a29120d2',
    ];
    // Champion
    const championSet = [
        // Head
        '1c0b810b64e76477f1d43dd9bc762fc1',
        // Hands
        '????',
        // Body
        '64e226fbc6823cfac99f3b3fa608ad0c',
        // Foot
        'fbe41043cab1929a5acc5870c6d80888',
    ];
    // Pioneer
    const pioneerSet = [
        // Head
        "c8d713fbf8b78f18bbeed84dd857144f",
        // Hands
        "e95c45b797450c7a5dbb7382b4e63748",
        // Body
        "2d29c77a827f9a8ced17f8184d5c4d0b",
        // Foot
        "f0fc4465922412eb5ac84278568ab95b",
    ];

    // Accessories
    // Izumo
    const izumoAccessorySet = [
        // Sphere
        "8f5de19383f0b3a11869ba27462f9f82",
        // Rope
        "c817bb6015f8c62761728f77c6e3bcab",
    ];
    // The Xianzhou Luofu's
    const theXianzhouLoufuAccessorySet = [
        // Sphere
        'c887fc6bc0b28b8b8c2891a0e819633f',
        // Rope
        '15b07ce198f55e336309718d03bde46a',
    ];
    // Talia
    const taliaAccessorySet = [
        // Sphere
        '73f4f027892c4a630e2753f39030270f',
        // Rope
        '1dbc2bff94442bade38d3befcfebde8d',
    ];
    // Salsotto
    const salsottoAccessorySet = [
        // Sphere
        "79a39be3927eff5d083a86c0e55d6b88",
        // Rope
        "d265ea91af67885e4be71023d14a741b",
    ];
    // Vonwacq
    const vonwacqAccessorySet = [
        // Sphere
        "75d92d23901e92c7812a52e243e03c62",
        // Rope
        "a949d8c1583ec2fabf76ac7c480877e7"
    ];
    // Belobog
    const belobogAccessorySet = [
        // Sphere
        "9af92e3cac9a963a956815159dc48f36",
        // Rope
        "28a4090515cef0b829b89261cfc6a1bd",
    ];
    // Taikiyan
    const taikiyanAccessorySet = [
        // Sphere
        "eced8972bb9eef40d598c39caa2bcc88",
        // Rope
        "3932cfc0723ac2726aef393c3a6e23ac",
    ];
    // Sigonia
    const sigoniaAccessorySet = [
        // Sphere
        "f12fa1a7bc4df71496cac94dd604f70c",
        // Rope
        "1bc30be3ed1f96007a32238f37036c33",
    ];
    // The IPC
    const theIPCAccessorySet = [
        // Sphere
        "99f7d4119127b9986a057c91610235b4",
        // Rope
        "c251a33c85c1a7c3effe3561850674c5",
    ];
    // Herta
    const hertaAccessorySet = [
        // Sphere
        "76923cbaf87904bc46b0f12e7fa1a440",
        // Rope
        "0c047f309a1395314b9752eb6adb4ab4",
    ];
    // Insumousu
    const insumousuAccessorySet = [
        // Sphere
        "167ea86176279b67aa1c204dab13fc74",
        // Rope
        "96c7c279a12364a9c7d4437e4469802a",
    ];
    // Glamoth
    const glamothAccessorySet = [
        // Sphere
        "666421e9bb2759b6b9d0c8ee0274a320",
        // Rope
        "f0604c51d18ed4d6224a1c38b7f3bf27",
    ];
    // Penacony
    const penaconyAccessorySet = [
        // Sphere
        "3c46bed41e55e2553df1cf7a2262bb42",
        // Rope
        "57c29053d4558c9947af1840014d0aab",
    ];
    // Planet Screwllum
    const planetScrewllumAccessorySet = [
        // Sphere
        "9e22ad1c14e25f3d1cc2a39e5a2fe6e4",
        // Rope
        "585a9a0e953bd3d017ebc386408656b5",
    ];

    const setsMap = {
        clothes: {
            musketeer: {name: "Musketeer of Wild Wheat", hashes: musketeerSet},
            watchmaker: {name: "Watchmaker, Master of Dream Machinations", hashes: watchmakerSet},
            thief: {name: "Thief of Shooting Meteor", hashes: thiefSet},
            knight: {name: "Knight of Purity Palace", hashes: knightSet},
            eagle: {name: "Eagle of Twilight Line", hashes: eagleSet},
            band: {name: "Band of Sizzling Thunder", hashes: bandSet},
            prisoner: {name: "Prisoner in Deep Confinement", hashes: prisonerSet},
            genius: {name: "Genius of Brilliant Stars", hashes: geniusSet},
            messenger: {name: "Messenger Traversing Hackerspace", hashes: messengerSet},
            firesmith: {name: "Firesmith of Lava-Forging", hashes: firesmithSet},
            hunter: {name: "Hunter of Glacial Forest", hashes: hunterSet},
            grandDuke: {name: "The Ashblazing Grand Duke", hashes: grandDukeSet},
            passerby: {name: "Passerby of Wandering Cloud", hashes: passerbySet},
            disciple: {name: "Longevous Disciple", hashes: discipleSet},
            wastelander: {name: "Wastelander of Banditry Desert", hashes: wastelanderSet},
            champion: {name: "Champion of Streetwise Boxing", hashes: championSet},
            pioneer: {name: "Pioneer Diver of Dead Waters", hashes: pioneerSet},
        },
        accessories: {
            izumo: {name: 'Izumo Gensei and Takama Divine Realm', hashes: izumoAccessorySet},
            theXianzhouLoufu: {name: "Fleet of the Ageless", hashes: theXianzhouLoufuAccessorySet},
            talia: {name: 'Talia: Kingdom of Banditry', hashes: taliaAccessorySet},
            salsotto: {name: 'Inert Salsotto', hashes: salsottoAccessorySet},
            vonwacq: {name: 'Sprightly Vonwacq', hashes: vonwacqAccessorySet},
            belobog: {name: 'Belobog of the Architects', hashes: belobogAccessorySet},
            taikiyan: {name: 'Rutilant Arena', hashes: taikiyanAccessorySet},
            sigonia: {name: 'Sigonia, the Unclaimed Desolation', hashes: sigoniaAccessorySet},
            theIpc: {name: 'Pan-Cosmic Commercial Enterprise', hashes: theIPCAccessorySet},
            herta: {name: 'Space Sealing Station', hashes: hertaAccessorySet},
            insumousu: {name: 'Broken Keel', hashes: insumousuAccessorySet},
            glamoth: {name: 'Firmament Frontline: Glamoth', hashes: glamothAccessorySet},
            penacony: {name: 'Penacony, Land of the Dreams', hashes: penaconyAccessorySet},
            planetScrewllum: {name: 'Celestial Differentiator', hashes: planetScrewllumAccessorySet},
        },
    }

    const imageHash = imgSrc.replace('https://act-webstatic.hoyoverse.com/darkmatter/hkrpg/prod_gf_cn/item_icon_uea52b/', '').split('.png')[0];
    for (const setEntry of Object.values({...setsMap.clothes, ...setsMap.accessories})) {
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

        aBrowser().storage.local.set({'hsr-ext': data});
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
                    const data = allData['hsr-ext'] || {servers: {}, currentServer: server};
                    const servers = data.servers;
                    if (server in servers) {
                        servers[server] = {...servers[server], ...extractAccountMeta()};

                        if ('characters' in servers[server]) {
                            servers[server].characters[charName] = extractAllElements();
                        } else {
                            servers[server].characters = {[charName]: extractAllElements()};
                        }
                    } else {
                        servers[server] = {
                            ...extractAccountMeta(),
                            characters: {
                                [charName]: extractAllElements(),
                            },
                        };
                    }

                    aBrowser().storage.local.set({'hsr-ext': data})
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
