# HSR-Ext

**HSR-Ext** is a powerful and intuitive browser extension that captures detailed information from the official website displaying your beloved game characters. It seamlessly copies the data at the precise moment when you are viewing your character. Users can later view the character information through the extension and conveniently download the data as a single file for further use. Curren


## Important Notice

Currently, HSR-Ext only functions if the interface language on the game website is set to English. We plan to add support for other languages and missing sets in future updates. Please stay tuned for improvements!

## Code Quality Notice

Note: The current codebase was developed hastily and may not adhere to best practices or maintainability standards. However, it is fully functional. We have plans to refactor and improve the code quality in future updates to make it more elegant and maintainable. Thank you for your understanding and patience.

## Features

- Effortless Data Capture: Automatically captures character information from the official game website.
- Easy Access: View your character's details directly through the extension.
- Downloadable Data: Download the captured data as a single JSON file for further use.
- Cross-Browser Compatibility: Works seamlessly in both Chrome and Firefox.
- Identical Format: The saved files are formatted identically to the repository HSR-Scanner.

## Installation

**HSR-Ext** can be installed from the respective browser stores:

* **Chrome Web Store**: Install HSR-Ext for Chrome (link will be provided after publication)
* **Firefox Add-ons**: Install HSR-Ext for Firefox (link will be provided after publication)

## Usage

- **Open the Official Game Website**: Navigate to the page where your game character is displayed.
- **View Your Character**: As you view your character, the extension will automatically capture the data.
- **Access Data Through Extension**: Click on the extension icon to view the captured character information.
- **Download Data**: Use the download button in the extension to save the data as a JSON file.

## Development

Prerequisites

- Node.js
- npm

Building the Project

1. Clone the repository:

```bash
git clone https://github.com/Vestrond/hsr-ext
cd hsr-ext
```

2. Install the dependencies:

```bash
npm install
```

3. Build the project:

```bash
npm run build
```

## Directory Structure

```text
HSR-Ext/
│
├── build/                  # Compiled extension files
│   ├── chrome/
│   └── firefox/
│
├── src/                    # Source files
│   ├── icons/
│   ├── popup/
│   ├── hsr-ext.js
│   └── ...
│
├── manifest/               # Manifest files
│   ├── manifest-chrome.json
│   └── manifest-firefox.json
│
├── build.js                # Build script
├── package.json
└── README.md
```

## Build Script

The build script (**build.js**) automates the process of copying source files and the appropriate manifest to the build directory for each browser.

```bash
node build.js
```

## Relic Hash Collection

If you need to collect hashes of relics from the current page, you can use the following script in the browser's console:

```javascript
'"' + [...document.querySelectorAll(".c-hrdrs-btm .c-hrd-dcp-ref img")]
    .map((img) => 
        img.attributes.getNamedItem('src').value
            .replace('https://act-webstatic.hoyoverse.com/darkmatter/hkrpg/prod_gf_cn/item_icon_uea52b/','')
            .split('.png')[0])
    .join('",\n"') + '",'
```


## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue to discuss any changes.

## License

This project is licensed under the MIT License.