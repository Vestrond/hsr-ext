const fs = require('fs');
const path = require('path');

const browsers = ['chrome', 'firefox'];
const srcDir = path.join(__dirname, 'src');
const manifestDir = path.join(__dirname, 'manifest');
const buildDir = path.join(__dirname, 'build');

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
        fs.mkdirSync(browserBuildDir, { recursive: true });
    }

    fs.cpSync(srcDir, browserBuildDir, { recursive: true });
    fs.copyFileSync(manifestSrcPath, manifestDestPath);
    console.log(`Built extension for ${browser} in ${browserBuildDir}`);
}

function main() {
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }

    browsers.forEach(buildExtension);
}

main();
