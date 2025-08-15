# @ltcode/crosshot

> Cross-platform desktop screenshot utility for Node.js applications

[![npm version](https://badge.fury.io/js/%40ltcode%2Fcrosshot.svg)](https://badge.fury.io/js/%40ltcode%2Fcrosshot)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start

```bash
# Install globally
npm install -g @ltcode/crosshot

# Use CLI
crosshot --help
crosshot -n="screenshot" -f="jpg" -q=85
```

```javascript
// Use as library
import { captureScreen } from '@ltcode/crosshot';

const result = await captureScreen({
  filename: 'my-screenshot',
  format: 'png',
  returnBase64: true  // ✨ NEW: Get base64 data
});

console.log(result.filepath);  // File saved
console.log(result.base64);    // Data URL for web use
```

## ✨ Features

- 🖥️ **Cross-platform**: Linux, Windows, macOS
- 📸 **Multiple formats**: PNG, JPG, WebP, BMP
- 📦 **Library & CLI**: Use as package or command-line tool
- 🎨 **Base64 support**: Get screenshots as base64 data URLs
- 🎯 **Smart detection**: Auto-detects best screenshot tool
- 🔧 **TypeScript**: Full type definitions included

## 📖 API Reference

### `captureScreen(options)`

```javascript
const result = await captureScreen({
  outputDir: './screenshots/',     // Output directory
  filename: 'capture',             // Filename (without extension)
  format: 'png',                   // png, jpg, webp, bmp
  quality: 100,                    // 1-100 for lossy formats
  returnBase64: false,             // Include base64 in result
  silent: true                     // Suppress console output
});
```

**Returns:**
```javascript
{
  success: true,
  filename: "capture.png",
  filepath: "./screenshots/capture.png",
  size: { bytes: 1024, kb: 1.0, mb: 0.001 },
  tool: "spectacle",
  platform: "linux",
  format: "png",
  base64?: "data:image/png;base64,iVBORw0KGg...",  // if returnBase64: true
  base64Raw?: "iVBORw0KGg..."                      // if returnBase64: true
}
```

### CLI Usage

```bash
# Basic usage
crosshot

# Custom filename and format  
crosshot -n="screenshot" -f="jpg" -q=85

# Custom output directory
crosshot -o="~/Screenshots/" -f="webp"

# Help
crosshot --help
```

## 🛠️ Supported Tools

**Linux**: grim, spectacle, gnome-screenshot, wayshot, scrot, maim  
**Windows**: PowerShell (native), NirCmd  
**macOS**: screencapture (native)

## 💻 Use Cases

- **Web Applications**: Screenshots as base64 data URLs
- **Desktop Apps**: Capture screenshots in Electron/Node.js apps
- **CI/CD**: Automated screenshot generation
- **Testing**: Visual regression testing
- **Documentation**: Automated screenshot generation

## 📝 License

MIT © [Lucas Tiago](https://github.com/ltcodedev)

## 🔗 Links

- [GitHub Repository](https://github.com/ltcodedev/crosshot)
- [npm Package](https://www.npmjs.com/package/@ltcode/crosshot)
- [Issues](https://github.com/ltcodedev/crosshot/issues)
