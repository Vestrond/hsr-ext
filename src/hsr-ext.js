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
//
// async function getImageHash(src) {
//     return new Promise((resolve, reject) => {
//         const img = new Image();
//         img.crossOrigin = 'anonymous';
//         img.src = src;
//
//         img.onload = async function () {
//             const canvas = document.createElement('canvas');
//             const context = canvas.getContext('2d');
//             canvas.width = img.width;
//             canvas.height = img.height;
//             context.drawImage(img, 0, 0);
//
//             try {
//                 const imageData = context.getImageData(0, 0, img.width, img.height).data;
//                 const buffer = new Uint8Array(imageData).buffer;
//                 const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
//                 const hashArray = Array.from(new Uint8Array(hashBuffer));
//                 const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
//                 resolve(hashHex);
//             } catch (e) {
//                 reject(e);
//             } finally {
//                 context.clearRect(0, 0, canvas.width, canvas.height);
//                 canvas.remove();
//             }
//         };
//
//         img.onerror = reject;
//     });
// }

// async function getTrailblazer() {
//     const trailblazerMap = {
//         // Caelus
//         // 'e207927cf98cb4cbeaca2a4e7677132fc94efc5f2e84125500e3c61991285597': {name: 'Caelus', path: 'Destruction', attribute: 'Physical'},
//         '105.10.9084': {name: 'Caelus', path: 'Destruction', attribute: 'Physical'},
//         // '4454292f573e2aa4a640c7150edacf08': {name: 'Caelus', path: 'Preservation', attribute: 'Fire'},
//         // '76deab481fd1557524fbc18ec7ef06eba41c5dd2eac84c8a910714b7c386fdbe': {name: 'Caelus', path: 'Preservation', attribute: 'Fire'},
//         '0.1.10225': {name: 'Caelus', path: 'Preservation', attribute: 'Fire'},
//         '701b1bdb773f881ed59a446d06ca91b7': {name: 'Caelus', path: 'Harmony', attribute: 'Imaginary'},
//         // Stelle
//         // '007c89f3f9bf9eb5183d44b69f080e382ea142a646b5b832c5139da3036d452a': {name: 'Stelle', path: 'Destruction', attribute: 'Physical'},
//         '158.6.6001': {name: 'Stelle', path: 'Destruction', attribute: 'Physical'},
//         'c816c8d66446eb4a9f0c44e4099d292c': {name: 'Stelle', path: 'Preservation', attribute: 'Fire'},
//         'ImaginationStelle': {name: 'Stelle', path: 'Harmony', attribute: 'Imaginary'},
//     }
//
//     const imagesWrapperClassName = 'c-hrd-sa-wrapper';
//     const allImgSrc = document.querySelectorAll(`.${imagesWrapperClassName} img`);
//     for (let imgSrcElement of allImgSrc) {
//         const imgSrc = imgSrcElement.attributes.getNamedItem('src').value;
//         console.warn(`>> src:${imgSrc}`)
//         const imgHash = await getImageHash(imgSrc);
//
//         for (const [key, characterInfo] of Object.entries(trailblazerMap)) {
//             // if (imgSrc.includes(key)) {
//             if (imgHash === key) {
//                 return {...characterInfo};
//             }
//         }
//     }
//     return {name: 'Stelle', path: 'Destruction', attribute: 'Physical'};
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
    data.trailblazer = null;
    data.charactersAvatars = getCharacterImagesUrls();
    // try {
    //     data.trailblazer = await getTrailblazer();
    // } catch (e) {
    //     console.error('Failed to get trailblazer', e);
    //     throw new Error(`Failed to get trailblazer: ${e.message}`);
    // }

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

// async function extractRelicSet(imgSrc) {
//     const reverseMap = {
//         // Head
//         "41.29.6223": 'knight',
//         // Hands
//         "12.0.10690": 'knight',
//         // Body
//         "36.23.6380": 'knight',
//         // Foot
//         "26.6.8531": 'knight',
//         // Head
//         "1.3.6774": 'pioneer',
//         // Hands
//         "5.1.8263": 'pioneer',
//         // Body
//         "1.3.6880": 'pioneer',
//         // Foot
//         "5.0.6439": 'pioneer',
//         // Head
//         "0.1.8018": 'prisoner',
//         // Hands
//         "0.0.7156": 'prisoner',
//         // Body
//         "0.2.8327": 'prisoner',
//         // Foot
//         "0.0.6828": 'prisoner',
//         // Head
//         "0.3.7729": 'messenger',
//         // Hands
//         "4.3.7644": 'messenger',
//         // Body
//         "3.1.9212": 'messenger',
//         // Foot
//         "2.2.7347": 'messenger',
//         // Head
//         "5.0.9527": 'genius',
//         // Hands
//         "20.3.7458": 'genius',
//         // Body
//         "9.1.5995": 'genius',
//         // Foot
//         "36.2.6151": 'genius',
//         // Head
//         "50.0.10267": 'band',
//         // Hands
//         "16.0.8046": 'band',
//         // Body
//         "16.0.6891": 'band',
//         // Foot
//         "25.0.6229": 'band',
//         // Head
//         "133.11.5166": 'eagle',
//         // Hands
//         "44.3.8167": 'eagle',
//         // Body
//         "39.6.6607": 'eagle',
//         // Foot
//         "45.3.5892": 'eagle',
//         // Head
//         "40.1.9482": 'thief',
//         // Hands
//         "75.0.7885": 'thief',
//         // Body
//         "87.0.7086": 'thief',
//         // Foot
//         "31.1.6833": 'thief',
//         // Head
//         "2.0.8024": 'disciple',
//         // Hands
//         "0.0.9259": 'disciple',
//         // Body
//         "0.1.7798": 'disciple',
//         // Foot
//         "0.1.6731": 'disciple',
//         // Head
//         "4.5.9078": 'musketeer',
//         // Hands
//         "0.19.7924": 'musketeer',
//         // Body
//         "6.4.6179": 'musketeer',
//         // Foot
//         "5.2.6898": 'musketeer',
//         // Head
//         "2.0.9076": 'watchmaker',
//         // Hands
//         "5.0.7766": 'watchmaker',
//         // Body
//         "17.1.6828": 'watchmaker',
//         // Foot
//         "0.1.9385": 'watchmaker',
//         // Head
//         "36.5.7035": 'hunter',
//         // Hands
//         "45.0.6478": 'hunter',
//         // Body
//         "46.4.7276": 'hunter',
//         // Foot
//         "81.3.5870": 'hunter',
//         // Head
//         "0.0.7719": 'grandDuke',
//         // Hands
//         "5.0.9011": 'grandDuke',
//         // Body
//         "0.1.7569": 'grandDuke',
//         // Foot
//         "0.0.8714": 'grandDuke',
//         // Head
//         "34.24.5621": 'champion',
//         // Hands
//         "37.8.7082": 'champion',
//         // Body
//         "25.10.6663": 'champion',
//         // Foot
//         "6.30.7744": 'champion',
//         // Head
//         "0.7.7303": 'wastelander',
//         // Hands
//         "6.19.7362": 'wastelander',
//         // Body
//         "2.5.7352": 'wastelander',
//         // Foot
//         "16.28.7038": 'wastelander',
//         // Head
//         "12.0.11583": 'passerby',
//         // Hands
//         "1.0.9532": 'passerby',
//         // Body
//         "0.1.7473": 'passerby',
//         // Foot
//         "3.2.8668": 'passerby',
//
//         // Sphere
//         "15.0.6491": 'theXianzhouLoufu',
//         // Rope
//         "11.0.10285": 'theXianzhouLoufu',
//         // Sphere
//         "23.0.5384": 'izumo',
//         // Rope
//         "6.0.12429": 'izumo',
//         // Sphere
//         "4.8.6136": 'theIpc',
//         // Rope
//         "2.0.12125": 'theIpc',
//         // Sphere
//         "4.0.6164": 'insumousu',
//         // Rope
//         "0.0.12545": 'insumousu',
//         // Sphere
//         "40.5.6128": 'taikiyan',
//         // Rope
//         "7.0.12207": 'taikiyan',
//         // Sphere
//         "35.0.5729": 'sigonia',
//         // Rope
//         "25.0.11715": 'sigonia',
//         // Sphere
//         "11.0.6307": 'belobog',
//         // Rope
//         "9.0.12184": 'belobog',
//         // Sphere
//         "28.2.6148": 'talia',
//         // Rope
//         "13.1.12881": 'talia',
//         // Sphere
//         "8.0.6344": 'vonwacq',
//         // Rope
//         "26.0.12548": 'vonwacq',
//         // Sphere
//         "76.0.6201": 'salsotto',
//         // Rope
//         "13.0.12305": 'salsotto',
//         // Sphere
//         "27.1.6129": 'penacony',
//         // Rope
//         "41.0.11700": 'penacony',
//         // Sphere
//         "36.0.5535": 'planetScrewllum',
//         // Rope
//         "96.0.13526": 'planetScrewllum',
//         // Sphere
//         "109.3.4679": 'herta',
//         // Rope
//         "24.0.11921": 'herta',
//         // Sphere
//         "40.0.5677": 'glamoth',
//         // Rope
//         "14.0.11789": 'glamoth',
//     }
//
//     // Average sets
//     // Musketeer
//     const musketeerSet = [
//         // // Head
//         // '1c131a1272f5634a2b0a73c637894f6a',
//         // // Hands
//         // '1fe52ad40054091a96f0a51ac5cc3d41',
//         // // Body
//         // 'f9343d61b1c6bba4a2599337d8e0854c',
//         // // Foot
//         // '4165ae60d05b4bf558c4a171452de030',
//         // // Head
//         // "e639f78b74585c94c825115a1bed731f066bb1472a868bf05b1db2017218a9d4",
//         // // Hands
//         // "dc6f279482998abac357f83e4f3ce972a7470cb7c1bce18e0a2cd675ab682d8f",
//         // // Body
//         // "dc573213854d340e10764883544ed3372c1a1e5f34362f9aba4f2298a8754528",
//         // // Foot
//         // "ba58c81375a05a0c7b86ffa0de4bc4df795fffaf669f59f9279f2dfb28d76ab0",
//         // Head
//         "4.5.9078",
//         // Hands
//         "0.19.7924",
//         // Body
//         "6.4.6179",
//         // Foot
//         "5.2.6898",
//     ];
//     // Watchmaker
//     const watchmakerSet = [
//         // // Head
//         // '07c8963e8417fc8ab7c60618cb3188d9',
//         // // Hands
//         // '5e81d1901faf2800fa1260f0cf3ade48',
//         // // Body
//         // 'c02920ca6f5b1b71ab605b8f69f496d7',
//         // // Foot
//         // '80d00dae4571f5a3b62a580f459c8017',
//         // // Head
//         // "fab0f0c59289d213c16b7021ca056e5511fef28456a7547954b43ac127c5eb82",
//         // // Hands
//         // "72cabdaa5a8e5c9311f05ae1a1180088d6c16365fbf38f951f68bb456c893cf0",
//         // // Body
//         // "c318c573c1068f8e3994a4f9556be5e8bb037c80b14ac7ddd93f5bd9ed2b61d7",
//         // // Foot
//         // "101fcbd1a086e83b643faa212770a898b87edc68522ba2f76c5655337cfc72f0",
//         // Head
//         "2.0.9076",
//         // Hands
//         "5.0.7766",
//         // Body
//         "17.1.6828",
//         // Foot
//         "0.1.9385",
//     ];
//     // Thief
//     const thiefSet = [
//         // // Head
//         // "bbbe6c1e5904e0da9b8ee72c403fd789",
//         // // Hands
//         // "99034e3c6ed73028e60e72df8c1b9a98",
//         // // Body
//         // "85fb682c80f6599d4721b7ff3869ec2b",
//         // // Foot
//         // "b4fb65841d8214b1efffb2b530e5555b",
//         // // Head
//         // "44ee094880f749b17e55b641a5abbae6b62c06940cdf1d3cabd0a25767bf9b04",
//         // // Hands
//         // "58c3cbdc4d0c65cc0c520853403058bbe8fde9a45665711531124a88bffd0153",
//         // // Body
//         // "60b496fdcc51b4e13d0a84b34924befa215803d26dd6f05ec2c6df8c27d4e9e2",
//         // // Foot
//         // "6f5ec2df0daef161f6c0d3c54159afa48df302ad4ae97154573748f100fb5981",
//         // Head
//         "40.1.9482",
//         // Hands
//         "75.0.7885",
//         // Body
//         "87.0.7086",
//         // Foot
//         "31.1.6833",
//     ];
//     // Knight
//     const knightSet = [
//         // // Head
//         // "7b2d48b104b36e250fe0d436c4b6fa32",
//         // // Hands
//         // "15659626cc6e06145afb314d729fa2e2",
//         // // Body
//         // "43370ddbc7f099f72698373eda2bd853",
//         // // Foot
//         // "7765258662c113fa7b0df8605c96bd55",
//         // // Head
//         // "5200adda941d1bf2ce0c11ee1c89ffbdad3dc497afd82a9e929260c1cab58431",
//         // // Hands
//         // "12335d7c6523427294fe0fb7c9c6e8c669b52a95a00a832177b9bdf6e89a0919",
//         // // Body
//         // "5c680ed1b1a83186b50623900a107cddb55c3c951dfe5cae6b3ae1c983cdfca5",
//         // // Foot
//         // "d76ad7b9132d646322d5861dcde08100b0b3ba3adb3309a8b65c9316eef39f7d",
//         // Head
//         "41.29.6223",
//         // Hands
//         "12.0.10690",
//         // Body
//         "36.23.6380",
//         // Foot
//         "26.6.8531",
//     ];
//     // Eagle
//     const eagleSet = [
//         // // Head
//         // "3cca4672ee1595ea85e694223b12640b",
//         // // Hands
//         // "a34ac649757ccf5a501c8ddd57dfb8a1",
//         // // Body
//         // "a7e2c41eefd7ae28273d274632a2b4e3",
//         // // Foot
//         // "66954efffb224f98df46fd06db222c12",
//         // // Head
//         // "a8cb1d7ef465facb3aab8cc37c54e47735ce06289edec15470f2f9dc3a959a79",
//         // // Hands
//         // "6714788b64a7a6bc8d49c3570fca41373f29ea775b24ad9db79659a602920844",
//         // // Body
//         // "258679d722f2273794c4370d0b14d5edd5d22f47718fc4190852da3476569b8c",
//         // // Foot
//         // "b5d3e4e2ff966290c90ca9513a40554293e856a10e854174ef19daf65b8cc1fd",
//         // Head
//         "133.11.5166",
//         // Hands
//         "44.3.8167",
//         // Body
//         "39.6.6607",
//         // Foot
//         "45.3.5892",
//     ];
//     // Band
//     const bandSet = [
//         // // Head
//         // "435674a13ebe6c1f391266fa274a2b3a",
//         // // Hands
//         // "1c317e4386ef240342bbbb88c2206eb2",
//         // // Body
//         // "49120d90ba66127c0b96c78f76d69b69",
//         // // Foot
//         // "6fe37ab2aea063aced02e5e61f69b55c",
//         // // Head
//         // "8900173a1efae5147580109bc676cec4eb93753b8e88bcd64448ce633491b002",
//         // // Hands
//         // "bec988947a62cd59597438d06e11c04f56c5d61e4e3576ce54bf085694d5d361",
//         // // Body
//         // "5f75bfa82fad28fe3a885e8dd517560ffa6af44c573a5b141b024e43a7f54cad",
//         // // Foot
//         // "8f25d5d36d765969f4255e81f872dddeb41e27c79166f38dfec74869259fc588",
//         // Head
//         "50.0.10267",
//         // Hands
//         "16.0.8046",
//         // Body
//         "16.0.6891",
//         // Foot
//         "25.0.6229",
//     ];
//     // Prisoner
//     const prisonerSet = [
//         // // Head
//         // "3f56c8b44eab706bbfa20277b1d24965",
//         // // Hands
//         // "535d5c2d35b43831d4e92763518ac8e4",
//         // // Body
//         // "463ee0c54d3da745735769b5ffb61f79",
//         // // Foot
//         // "7b857707a49b1ec00aca0de2ae23b916",
//         // // Head
//         // "825d77f454d20f6331e6fbeb3eb7a4f02c0a068cff1b9eb80f7b494241e7b8f8",
//         // // Hands
//         // "61130bc1903efe3ae830e0037d1812cb4901418ee793d5dc51b29f2163254289",
//         // // Body
//         // "b8560085402cb61801a8f2e7a84c0999d076b87ef4ca19cdcf8d442ce43550a8",
//         // // Foot
//         // "04d17977c24aeaf4abde12842d69f6ea68c301178b7190ff9e942a475e82f140",
//         // Head
//         "0.1.8018",
//         // Hands
//         "0.0.7156",
//         // Body
//         "0.2.8327",
//         // Foot
//         "0.0.6828",
//     ];
//     // Genius
//     const geniusSet = [
//         // // Head
//         // "4a74fe65c7fb4faeab1e340fe4da040b",
//         // // Hands
//         // "4906179a34340a6a783f65ee6cfbfe88",
//         // // Body
//         // "45643d2a89845272e3e49b639b0a3043",
//         // // Foot
//         // "2c0a9279295796f32a3fec1742d7dfcb",
//         // // Head
//         // "1151f3945dfdf341399fdf77acfadcc741b3e06b73584200cabbe22b4f218930",
//         // // Hands
//         // "480f7084fb2026953a1e66c1767cb082610b4e24b42f215bea92cfb0a6c71603",
//         // // Body
//         // "cdaf52ceb1ecdc7e74e41334be741cc6085755b84215b543df197a192afb624b",
//         // // Foot
//         // "4055cbf5340d2a2779bb090ec82b6de0bc5318579a4dda7bc57486f0724ae87b",
//         // Head
//         "5.0.9527",
//         // Hands
//         "20.3.7458",
//         // Body
//         "9.1.5995",
//         // Foot
//         "36.2.6151",
//     ];
//     // Messenger
//     const messengerSet = [
//         // // Head
//         // "67eead241b97d3d866b2559ccb3a13ac",
//         // // Hands
//         // "ff94f576433175003fa70b4a3250c757",
//         // // Body
//         // "f2e85db095202eeb2969f5cdca50fef4",
//         // // Foot
//         // "27878de0890fb56c277dc93d5bf735c8",
//         // // Head
//         // "955d602ea97a4f43c3ff22c81f46fec81a15c0cf1b71c20aac4354c189cec8a8",
//         // // Hands
//         // "772eb99d5c6d1f6e15d1c1fb36507b057123d57236b9fa18935d33d8994ee9eb",
//         // // Body
//         // "72b1acfd5c224b538b4239e1d40a857ff05247366be22f6f5fa4a4d1f62cbed3",
//         // // Foot
//         // "6cd883c7ddbef7b5d14bd38b731c3fa332368e71e5bc70a18cc448d7298920ec",
//         // Head
//         "0.3.7729",
//         // Hands
//         "4.3.7644",
//         // Body
//         "3.1.9212",
//         // Foot
//         "2.2.7347",
//     ];
//     // Firesmith
//     const firesmithSet = [
//         // Head
//         "f4d29fc0d426ec39c3a0d33fd51afda6",
//         // Hands
//         "f7327ece7aad15d4d6d25e3ca962f354",
//         // Body
//         "3cfe5dd9aeacc9294e9d993ee57b17aa",
//         // Foot
//         "e8a2048c335a241f5c037fa64ac9d57c",
//     ];
//     // Hunter
//     const hunterSet = [
//         // // Head
//         // "6395d9ec863504bd2fc615dd9cbf3c73",
//         // // Hands
//         // "31bdcd73a1aea01d1f589af9a0211e07",
//         // // Body
//         // "b536a51704faab4e01375f749ea034df",
//         // // Foot
//         // "f3202a0bf01e72fad7952a97da6dcb3a",
//         // // Head
//         // "9f06aeaabe60f45eaae7b6f7914dbed06e1f631be259aacfc0fb8906e6fa6bf2",
//         // // Hands
//         // "418849421fc3a0e41c30e8356eba75af34085dfeb4321c9029baf2794aaa376e",
//         // // Body
//         // "c20371c58ccba5ef892c9c617da6f0f2c0f188f1d99323cee525f4828ffbb4fb",
//         // // Foot
//         // "d97ae7b047eb66f8f5d2a9c982f833a9d907012570664bb8921818a0453d3c5c",
//         // Head
//         "36.5.7035",
//         // Hands
//         "45.0.6478",
//         // Body
//         "46.4.7276",
//         // Foot
//         "81.3.5870",
//     ];
//     // Grand Duke
//     const grandDukeSet = [
//         // // Head
//         // "585ec00aea32bd8568460a027d8bffe4",
//         // // Hands
//         // "db478b13b9cd1ce2b06a677e8e04592b",
//         // // Body
//         // '0111e70a748ab038215832f3a7f77437',
//         // // Foot
//         // '95b003736aaebaea072164258b072c10',
//         // // Head
//         // "4c8840149ac270d87f2bec203df4264b293f11b2ce42ff0622c4ad0d9f76346d",
//         // // Hands
//         // "1e00b7ab372c5e98225284ae68eacda86f392246efa1ad10c5758a5405ec9d15",
//         // // Body
//         // "8b8f29c265b5d0991decc6e1fd7cea4738446b8115a7eaf69f94027ad4aba615",
//         // // Foot
//         // "0aaa3be1adeeaa6c4ba05763548b9cea6444e76785c0740bc96eca19940d8ec8",
//         // Head
//         "0.0.7719",
//         // Hands
//         "5.0.9011",
//         // Body
//         "0.1.7569",
//         // Foot
//         "0.0.8714",
//     ];
//     // Passerby
//     const passerbySet = [
//         // // Head
//         // "31e0d4408c4bffb134e295e7710f1773",
//         // // Hands
//         // '7d63fc940e2adec54fec369946359bb1',
//         // // Body
//         // "e4887aec85eee27dc7c164bfe7dc4d52",
//         // // Foot
//         // '????',
//         // // Head
//         // "92ffbd98b9ba9841884bd9d0bfa9fd0d45088ee8c779f5159502f97f88bc5a49",
//         // // Hands
//         // '????',
//         // // Body
//         // "f5ccbaf321e5f0775a8a6f12a85175191888e58693d708f6e38feedf15621f5f",
//         // // Foot
//         // '????',
//         // Head
//         "12.0.11583",
//         // Hands
//         "1.0.9532",
//         // Body
//         "0.1.7473",
//         // Foot
//         "3.2.8668",
//     ];
//     // Disciple
//     const discipleSet = [
//         // // Head
//         // 'd2d8120bc38fa753803b5c2360932cf6',
//         // // Hands
//         // "9a0d6a128d075ee8d2559c3e20017d44",
//         // // Body
//         // '8a767343c98412b9178e6184facee401',
//         // // Foot
//         // "33170305f9b2779c5adb99df75a5f5a1",
//         // // Head
//         // "56e8deefbe18598c769dc0e571f0c087ee9b3fbc16e1dc03c6346dcf50c9ebd6",
//         // // Hands
//         // "c2c6cdf980d0671a14951e4c94ae2cd471d3499d87246570741d9e8671816d3f",
//         // // Body
//         // '????',
//         // // Foot
//         // "dfad9770d9bdc1c1a3b5253f0c881ca75f32554256cc2357b771f537c2caef66",
//         // Head
//         "2.0.8024",
//         // Hands
//         "0.0.9259",
//         // Body
//         "0.1.7798",
//         // Foot
//         "0.1.6731",
//     ];
//     // Wastelander
//     const wastelanderSet = [
//         // // Head
//         // '448da9b999e9c782a2115edc7b8045e0',
//         // // Hands
//         // '????',
//         // // Body
//         // '????',
//         // // Foot
//         // '63aabd362eb7bd68e498ae01a29120d2',
//         // // Head
//         // "3da5b05c307af0c62f449dc3e6c07554cbe874734bbc1997f3988f6ec27cfb81",
//         // // Hands
//         // '????',
//         // // Body
//         // '????',
//         // // Foot
//         // "6db01573d5fb28f6bcce237b3e7614d1b51b493d9dff7091906951e3cb7052e1",
//         // Head
//         "0.7.7303",
//         // Hands
//         "6.19.7362",
//         // Body
//         "2.5.7352",
//         // Foot
//         "16.28.7038",
//     ];
//     // Champion
//     const championSet = [
//         // // Head
//         // '1c0b810b64e76477f1d43dd9bc762fc1',
//         // // Hands
//         // '????',
//         // // Body
//         // '64e226fbc6823cfac99f3b3fa608ad0c',
//         // // Foot
//         // 'fbe41043cab1929a5acc5870c6d80888',
//         // // Head
//         // '????',
//         // // Hands
//         // '????',
//         // // Body
//         // "53dfc97f812d88a83b03723cd1bbfc374801df5c737c69a63e3f7e2fb1f8315a",
//         // // Foot
//         // "4fbf54ab26bf7bd503cb104d584da523c4e0a23006880761fba9a1aa62cd0cd4",
//         // Head
//         "34.24.5621",
//         // Hands
//         "37.8.7082",
//         // Body
//         "25.10.6663",
//         // Foot
//         "6.30.7744",
//     ];
//     // Pioneer
//     const pioneerSet = [
//         // // Head
//         // "c8d713fbf8b78f18bbeed84dd857144f",
//         // // Hands
//         // "e95c45b797450c7a5dbb7382b4e63748",
//         // // Body
//         // "2d29c77a827f9a8ced17f8184d5c4d0b",
//         // // Foot
//         // "f0fc4465922412eb5ac84278568ab95b",
//         // // Head
//         // "4214e57b0f13358d1bc78de088870438b3b3f8351aa57f5832b1861d0a1519e9",
//         // // Hands
//         // "5c8befe74e0da3f4b87ef595cafd5cd0087984b8e683e4ff61b8f52035dc0605",
//         // // Body
//         // "6c6ef029c88dc9306dc1b2ee2a4d0b73dd57fcecd4200efba2d37d709f1c1394",
//         // // Foot
//         // "5ec5cbf9b3db25aa30d7197fe6c8a806de9061b4a56718a06c64941d18654e53",
//         // Head
//         "1.3.6774",
//         // Hands
//         "5.1.8263",
//         // Body
//         "1.3.6880",
//         // Foot
//         "5.0.6439",
//     ];
//
//     // Accessories
//     // Izumo
//     const izumoAccessorySet = [
//         // // Sphere
//         // "8f5de19383f0b3a11869ba27462f9f82",
//         // // Rope
//         // "c817bb6015f8c62761728f77c6e3bcab",
//         // // Sphere
//         // "7dbec67820b29757eb35b4b752575e9d384595fbec2186a7d4a83b14dca8344a",
//         // // Rope
//         // "4b95a865bb9ebdc1673b425c1fa878b7d03cb9c21b9a708c300e9f64c5fed600",
//         // Sphere
//         "23.0.5384",
//         // Rope
//         "6.0.12429",
//     ];
//     // The Xianzhou Luofu's
//     const theXianzhouLoufuAccessorySet = [
//         // // Sphere
//         // 'c887fc6bc0b28b8b8c2891a0e819633f',
//         // // Rope
//         // '15b07ce198f55e336309718d03bde46a',
//         // Sphere
//         // "53f94aefbf90da159bd769322910f4e3e2002ab2c2b0e7e617c158f91871fff1",
//         // // Rope
//         // "b44897759de94cc4263e53ed3838b04760a7cc50a29cd0ad0a5b5198e3538b39",
//         // Sphere
//         "15.0.6491",
//         // Rope
//         "11.0.10285",
//     ];
//     // Talia
//     const taliaAccessorySet = [
//         // // Sphere
//         // '73f4f027892c4a630e2753f39030270f',
//         // // Rope
//         // '1dbc2bff94442bade38d3befcfebde8d',
//         // // Sphere
//         // "c809bc832b12523e3f972d094413d672bb637bd630c844b09ffc2967c40f5e61",
//         // // Rope
//         // "72526ad99387b82ffaca0d127591de556a404ad86ebc77e969d6765d008fe318",
//         // Sphere
//         "28.2.6148",
//         // Rope
//         "13.1.12881",
//     ];
//     // Salsotto
//     const salsottoAccessorySet = [
//         // // Sphere
//         // "79a39be3927eff5d083a86c0e55d6b88",
//         // // Rope
//         // "d265ea91af67885e4be71023d14a741b",
//         // // Sphere
//         // "4a1ad227ad41dc905e56ef80a7a6b22febd5564a1a07cd35b840928712a6399b",
//         // // Rope
//         // "b069620e3ed7cad1db91bf0d9242a729b3af49eceec661944ca6eaf890fbe603",
//         // Sphere
//         "76.0.6201",
//         // Rope
//         "13.0.12305",
//     ];
//     // Vonwacq
//     const vonwacqAccessorySet = [
//         // // Sphere
//         // "75d92d23901e92c7812a52e243e03c62",
//         // // Rope
//         // "a949d8c1583ec2fabf76ac7c480877e7"
//         // // Sphere
//         // "c690a4b41c9001077f4e17e884523d381b1ee09b3b49c4b1299471f7c7d83fec",
//         // // Rope
//         // "8b79634f7a3834a5841653a3af26b2189c59b9eccc8c2ce1f495dca8288b2ca4",
//         // Sphere
//         "8.0.6344",
//         // Rope
//         "26.0.12548",
//     ];
//     // Belobog
//     const belobogAccessorySet = [
//         // // Sphere
//         // "9af92e3cac9a963a956815159dc48f36",
//         // // Rope
//         // "28a4090515cef0b829b89261cfc6a1bd",
//         // // Sphere
//         // "e51ccb0e63e42331ef526487b7e2b78d9bb5194a70a929297be769448a2d1f66",
//         // // Rope
//         // "a0db4d4ba21e09381f3274b83e05d56a2a40af158b85eef79c6c25baeddcc659",
//         // Sphere
//         "11.0.6307",
//         // Rope
//         "9.0.12184",
//     ];
//     // Taikiyan
//     const taikiyanAccessorySet = [
//         // // Sphere
//         // "eced8972bb9eef40d598c39caa2bcc88",
//         // // Rope
//         // "3932cfc0723ac2726aef393c3a6e23ac",
//         // // Sphere
//         // "6a54dbfced950f9ddd6c0e3776f9de8601d0cf9103e419c5ce8808ed37b406d4",
//         // // Rope
//         // "28d7e3f3c6820855c65340f02a60bb0a3e2210be4f8d4f9edb4be9e69e6c4048",
//         // Sphere
//         "40.5.6128",
//         // Rope
//         "7.0.12207",
//     ];
//     // Sigonia
//     const sigoniaAccessorySet = [
//         // // Sphere
//         // "f12fa1a7bc4df71496cac94dd604f70c",
//         // // Rope
//         // "1bc30be3ed1f96007a32238f37036c33",
//         // // Sphere
//         // "4cf6004e527df736e69ad6b922e66681f38e16fbd8b5e5025aa880720679ec6b",
//         // // Rope
//         // "47e6c645954026c81c1abdbf639c2c9261be14a2f4ab4e5ee14ab99a95398549",
//         // Sphere
//         "35.0.5729",
//         // Rope
//         "25.0.11715",
//     ];
//     // The IPC
//     const theIPCAccessorySet = [
//         // // Sphere
//         // "99f7d4119127b9986a057c91610235b4",
//         // // Rope
//         // "c251a33c85c1a7c3effe3561850674c5",
//         // // Sphere
//         // "6473fb8d9e1c57990a520247606ff682c86049c469639da13179d58295be9dd7",
//         // // Rope
//         // "704c0f9568630a26ff43a861d3aa0e95b27dc6a003843fd7f00f8112cc9cd0c0",
//         // Sphere
//         "4.8.6136",
//         // Rope
//         "2.0.12125",
//     ];
//     // Herta
//     const hertaAccessorySet = [
//         // // Sphere
//         // "76923cbaf87904bc46b0f12e7fa1a440",
//         // // Rope
//         // "0c047f309a1395314b9752eb6adb4ab4",
//         // // Sphere
//         // "e2d65c9c884b45d72869970c633caf0e59af71bfc09406ff88afba8cf215f2e4",
//         // // Rope
//         // "6ff77b170c1c5703bdcbb08fe906a3a769ccc142d2a65c63fc451037cb92f7fd",
//         // Sphere
//         "109.3.4679",
//         // Rope
//         "24.0.11921",
//     ];
//     // Insumousu
//     const insumousuAccessorySet = [
//         // // Sphere
//         // "167ea86176279b67aa1c204dab13fc74",
//         // // Rope
//         // "96c7c279a12364a9c7d4437e4469802a",
//         // // Sphere
//         // "95802c656739f7c7d910698166f2f45eb908c42331f0541032ed8fc8bd62a4a0",
//         // // Rope
//         // "912ab5a1eae1675001ffd97d554b3af2681584a93cecdd1c025d069a761d7cf9",
//         // Sphere
//         "4.0.6164",
//         // Rope
//         "0.0.12545",
//     ];
//     // Glamoth
//     const glamothAccessorySet = [
//         // // Sphere
//         // "666421e9bb2759b6b9d0c8ee0274a320",
//         // // Rope
//         // "f0604c51d18ed4d6224a1c38b7f3bf27",
//         // // Sphere
//         // "3fe647942f17e5f748912de226b4e8c36daccb79ccbf7cac2bc37ea70eeaed3d",
//         // // Rope
//         // "f17f63caa6dd189132efa43b1692163fb663bd4de6c019357151c5dd91d5d0a6",
//         // Sphere
//         "40.0.5677",
//         // Rope
//         "14.0.11789",
//     ];
//     // Penacony
//     const penaconyAccessorySet = [
//         // // Sphere
//         // "3c46bed41e55e2553df1cf7a2262bb42",
//         // // Rope
//         // "57c29053d4558c9947af1840014d0aab",
//         // // Sphere
//         // "f2197ebe891356ccde5d51a0285af898c3220d6acccaa2205781b3eafeb0f372",
//         // // Rope
//         // "6d285f9cd034ebc3248c3de6610400e69831254959586b79e4d62d65f856641b",
//         // Sphere
//         "27.1.6129",
//         // Rope
//         "41.0.11700",
//     ];
//     // Planet Screwllum
//     const planetScrewllumAccessorySet = [
//         // // Sphere
//         // "9e22ad1c14e25f3d1cc2a39e5a2fe6e4",
//         // // Rope
//         // "585a9a0e953bd3d017ebc386408656b5",
//         // // Sphere
//         // "60efc399eef5f63d99964f9b77f5ac55cc505cddc934d96c841bdc3d77cac781",
//         // // Rope
//         // "e7fafd6b8b55dd2335b9524c79c837a9f2bfd1090c1129879beadcb8c460b36b",
//         // Sphere
//         "36.0.5535",
//         // Rope
//         "96.0.13526",
//     ];
//
//     const setsMap = {
//         clothes: {
//             musketeer: {name: "Musketeer of Wild Wheat", hashes: musketeerSet},
//             watchmaker: {name: "Watchmaker, Master of Dream Machinations", hashes: watchmakerSet},
//             thief: {name: "Thief of Shooting Meteor", hashes: thiefSet},
//             knight: {name: "Knight of Purity Palace", hashes: knightSet},
//             eagle: {name: "Eagle of Twilight Line", hashes: eagleSet},
//             band: {name: "Band of Sizzling Thunder", hashes: bandSet},
//             prisoner: {name: "Prisoner in Deep Confinement", hashes: prisonerSet},
//             genius: {name: "Genius of Brilliant Stars", hashes: geniusSet},
//             messenger: {name: "Messenger Traversing Hackerspace", hashes: messengerSet},
//             firesmith: {name: "Firesmith of Lava-Forging", hashes: firesmithSet},
//             hunter: {name: "Hunter of Glacial Forest", hashes: hunterSet},
//             grandDuke: {name: "The Ashblazing Grand Duke", hashes: grandDukeSet},
//             passerby: {name: "Passerby of Wandering Cloud", hashes: passerbySet},
//             disciple: {name: "Longevous Disciple", hashes: discipleSet},
//             wastelander: {name: "Wastelander of Banditry Desert", hashes: wastelanderSet},
//             champion: {name: "Champion of Streetwise Boxing", hashes: championSet},
//             pioneer: {name: "Pioneer Diver of Dead Waters", hashes: pioneerSet},
//         },
//         accessories: {
//             izumo: {name: 'Izumo Gensei and Takama Divine Realm', hashes: izumoAccessorySet},
//             theXianzhouLoufu: {name: "Fleet of the Ageless", hashes: theXianzhouLoufuAccessorySet},
//             talia: {name: 'Talia: Kingdom of Banditry', hashes: taliaAccessorySet},
//             salsotto: {name: 'Inert Salsotto', hashes: salsottoAccessorySet},
//             vonwacq: {name: 'Sprightly Vonwacq', hashes: vonwacqAccessorySet},
//             belobog: {name: 'Belobog of the Architects', hashes: belobogAccessorySet},
//             taikiyan: {name: 'Rutilant Arena', hashes: taikiyanAccessorySet},
//             sigonia: {name: 'Sigonia, the Unclaimed Desolation', hashes: sigoniaAccessorySet},
//             theIpc: {name: 'Pan-Cosmic Commercial Enterprise', hashes: theIPCAccessorySet},
//             herta: {name: 'Space Sealing Station', hashes: hertaAccessorySet},
//             insumousu: {name: 'Broken Keel', hashes: insumousuAccessorySet},
//             glamoth: {name: 'Firmament Frontline: Glamoth', hashes: glamothAccessorySet},
//             penacony: {name: 'Penacony, Land of the Dreams', hashes: penaconyAccessorySet},
//             planetScrewllum: {name: 'Celestial Differentiator', hashes: planetScrewllumAccessorySet},
//         },
//     }
//
//     // const imageHash = imgSrc.match(/.+\/(\w{32})\.png\?.+/)?.[1];
//     const imageHash = await getImageHash(imgSrc);
//     // TODO: send error to popup if no hash
//     for (const setEntry of Object.values({...setsMap.clothes, ...setsMap.accessories})) {
//         if (setEntry.hashes.includes(imageHash)) {
//             return setEntry.name;
//         }
//     }
// }

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
        // extractRelicSetV2(imgElement);
        // console.error(getImageHash(imgSrc));
        // const setName = await extractRelicSet(imgSrc);
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

        const charName = charNameElement.textContent;

        if (charName !== window.currentCharName || server !== window.currentServerName) {
            window.currentCharName = charName;
            window.currentServerName = server;

            storageGet('hsr-ext')
                .then((allData) => {
                    const data = allData['hsr-ext'] || {servers: {}, currentServer: server};
                    const servers = data.servers;

                    const accountMeta = extractAccountMeta();
                    const allElements = extractAllElements();

                    if (server in servers) {
                        servers[server] = {...servers[server], ...accountMeta};

                        if ('characters' in servers[server]) {
                            servers[server].characters[charName] = allElements;
                        } else {
                            servers[server].characters = {[charName]: allElements};
                        }
                    } else {
                        servers[server] = {
                            ...accountMeta,
                            characters: {
                                [charName]: allElements,
                            },
                        };
                    }

                    storageSet('hsr-ext', data)
                    // aBrowser().storage.local.set({'hsr-ext': data})
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
