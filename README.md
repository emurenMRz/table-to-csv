# Table to CSV Chrome Extension

## Overview

Table to CSV is a Chrome extension that extracts table elements from web pages and allows you to download them as CSV files.

## Features

- Works on any domain
- Displays a UI in a popup menu
- Lists table elements on the current page
- Extracts all elements in the header and body in the order they appear into a 2D array
- Converts the 2D array into a CSV string with rows separated by newlines and columns separated by commas. If a cell contains a comma, the cell content is enclosed in double quotes.
- Generates a download button for each table in the popup menu
- The label of the download button displays the first non-empty header element of the table
- Closes the extension popup when the download button is clicked

## Installation

1. Clone or download this repository.
    ```sh
    git clone https://github.com/emurenMRz/table-to-csv.git
    ```
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the downloaded folder.

## Usage

1. Click the extension icon to open the popup menu.
2. The table elements on the page will be listed, each with a corresponding download button.
3. Click the download button to download the corresponding table as a CSV file.

## File Structure

- `manifest.json`: Extension configuration file
- `popup.html`: Popup menu HTML file
- `popup.js`: Popup menu JavaScript file
- `icons/`: Directory for extension icon images

## Developer Information

### Script Explanation

- `popup.js`:
    - `extractTables`: Extracts table elements from the page and converts them to CSV format.
    - `downloadCsv`: Downloads the CSV file.
    - `DOMContentLoaded` event listener: Extracts table elements and generates download buttons when the popup menu is loaded.

### Adding Icons

Add icon images of the following sizes to the `icons` directory:
- `icon16.png`
- `icon48.png`
- `icon128.png`

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
