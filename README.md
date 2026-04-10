[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue)](https://chrome.google.com/webstore/...)
[![Edge Add-on](https://img.shields.io/badge/Edge-Add--on-green)](https://microsoftedge.microsoft.com/...)
[![GitHub stars](https://img.shields.io/github/stars/fatimaeg/element-id-finder)](https://github.com/fatimaeg/element-id-finder/stargazers)
# 🔍 ID Finder - Chrome & Edge Extension

**Instantly see and copy HTML element IDs** by hovering and clicking. Perfect for web developers, testers, and automation engineers.

![Demo](screenshots/demo.gif) 

## ✨ Features

- **Hover** over any element → instantly see its tag and ID and the input type
- **Click** any element → automatically copy its ID to clipboard
- **Highlight** effect shows exactly which element you're targeting
- **ESC key** to disable inspector mode
- Works on **any website**
- **100% free** and open source

## Now when you hover over different input types, you'll see:

- **Text input** → `<input type="text" id="username">`
- **Password field** → `<input type="password" id="pass" >`
- **Email field** → `<input type="email" id="user-email">`
- **Date picker** → `<input type="date" id="birthday">`
- **Number field** → `<input type="number" id="quantity">`
- **Checkbox** → `<input type="checkbox" id="agree">`
- **Radio button** → `<input type="radio" id="option1">`
- **Textarea** → `<textarea type="textarea" id="message">`
- **Submit button** → `<button type="submit" id="submitBtn">`
- **Select dropdown** → `<select type="select" id="country">`

## 🚀 Installation

### From Chrome Web Store (coming soon)
[Link will be here]

### Manual Installation (Developer Mode)

1. Download or clone this repo
2. Open Chrome/Edge and go to `chrome://extensions/`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked**
5. Select the extension folder

## 🎮 How to Use

1. Click the extension icon to turn it **ON** (you'll see a green "ON" badge)
2. **Hover** over any element → tooltip shows `<div id="example">`
3. **Click** any element → ID copied to clipboard with confirmation
4. Click the icon again or press **ESC** to turn it **OFF**

## 🛠️ Development

## 📁 Project Structure

- `id-finder-extension/`
  - `manifest.json`
  - `background.js`
  - `content.js`
  - `styles.css`
  - `README.md`
  - `LICENSE`
  - `.gitignore`
  - `icons/`
    - `icon16.png`
    - `icon32.png`
    - `icon48.png`
    - `icon128.png`
  - `screenshots/`
    - `demobig.gif`
    - `demo.gif`
    - `screenshot0.png`
    - `screenshot1.png`
    - `screenshot2.png`