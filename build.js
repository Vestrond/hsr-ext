const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const browsers = ['chrome', 'firefox'];
const srcDir = path.join(__dirname, 'src');
const manifestDir = path.join(__dirname, 'manifest');
const buildDir = path.join(__dirname, 'build');

function archiveAddon(browser) {
    if (browser === 'firefox') {
        const browserBuildDir = path.join(buildDir, browser);
        const archiveFilename = `${browser}.zip`;
        const zipArchivePath = path.join(buildDir, archiveFilename);

        const outputZip = fs.createWriteStream(zipArchivePath);
        const archiveZip = archiver('zip', { zlib: { level: 9 } });

        outputZip.on('close', () => {
            console.log(`${archiveFilename} has been created.`);
        });
        archiveZip.on('error', (err) => {
            throw err;
        });

        archiveZip.pipe(outputZip);
        archiveZip.directory(browserBuildDir, false);
        archiveZip.finalize();
    } else if (browser === 'chrome') {
        const browserBuildDir = path.join(buildDir, browser);
        const archiveFilename = `${browser}.zip`;
        const zipArchivePath = path.join(buildDir, archiveFilename);

        const outputZip = fs.createWriteStream(zipArchivePath);
        const archiveZip = archiver('zip', { zlib: { level: 9 } });

        outputZip.on('close', () => {
            console.log(`${archiveFilename} has been created.`);
        });
        archiveZip.on('error', (err) => {
            throw err;
        });

        archiveZip.pipe(outputZip);
        archiveZip.directory(browserBuildDir, false);
        archiveZip.finalize();
    }
}

function buildExtension(browser) {
    const manifestFile = `manifest-${browser}.json`;
    const manifestSrcPath = path.join(manifestDir, manifestFile);
    const manifestDestPath = path.join(buildDir, browser, 'manifest.json');

    if (!fs.existsSync(manifestSrcPath)) {
        console.error(`Manifest file for ${browser} not found: ${manifestSrcPath}`);
        return;
    }

    const browserBuildDir = path.join(buildDir, browser);
    if (!fs.existsSync(browserBuildDir)) {
        fs.mkdirSync(browserBuildDir, {recursive: true});
    }

    fs.cpSync(srcDir, browserBuildDir, {recursive: true});
    fs.copyFileSync(manifestSrcPath, manifestDestPath);
    console.log(`Built extension for ${browser} in ${browserBuildDir}`);
    archiveAddon(browser);
}

function main() {
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }

    browsers.forEach(buildExtension);
}

main();
