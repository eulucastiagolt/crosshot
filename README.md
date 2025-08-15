# Crosshot

Cross-platform desktop screenshot utility compatible with Linux (X11/Wayland), Windows, and macOS.

## Features

- 🖥️ **Cross-platform**: Works on Linux, Windows, and macOS
- 🎯 **Multiple backends**: Automatically detects and uses the best available screenshot tool
- 📦 **Library & CLI**: Can be used both as a standalone CLI tool and as a library
- 🎨 **Colored output**: Beautiful terminal output with chalk
- 🔧 **Configurable**: Silent mode, verbose mode, custom paths
- 📁 **Smart directory handling**: Automatically creates directories if needed
- 🔍 **Tool detection**: Check what screenshot tools are available on your system
- 🌍 **Global CLI**: Install globally via npm for system-wide access

## Installation

### Global Installation (Recommended)
```bash
npm install -g @ltcode/crosshot
```

After global installation, you can use `crosshot` command anywhere:
```bash
crosshot --help
```

### Local Installation
```bash
npm install @ltcode/crosshot
```

### Development/Local Usage
```bash
git clone https://github.com/ltcodedev/crosshot
cd crosshot
npm install
node index.js --help
# or use the bin directly
./bin/crosshot --help
```

## CLI Usage

### Global Usage (After `npm install -g crosshot`)

#### Basic usage
```bash
crosshot
```

#### With custom filename
```bash
crosshot -n="my-screenshot"
crosshot --name="important-capture"
```

#### With custom output directory
```bash
crosshot -o="./screenshots/"
crosshot --output="~/Images/Screenshots/"
```

#### With different formats
```bash
crosshot -f="jpg" -q=85
crosshot --format="webp"
crosshot -n="capture" -f="bmp"
```

#### Combined options
```bash
crosshot -n="bug-report" -o="./captures/" -f="jpg" -q=90
```

#### Help and version
```bash
crosshot --help
crosshot --version
```

### Local Usage (Development)

#### Basic usage
```bash
node index.js
```

#### With options
```bash
node index.js -n="my-screenshot"
node index.js -f="jpg" -q=85
```

#### Help
```bash
node index.js --help
```

## Library Usage

### Basic Example

```javascript
import { captureScreen } from '@ltcode/crosshot';

try {
  const result = await captureScreen({
    outputDir: './screenshots/',
    filename: 'my-capture',
    format: 'png',
    silent: true
  });
  
  console.log('Screenshot saved:', result.filepath);
  console.log('File size:', result.size.kb, 'KB');
  console.log('Format:', result.format);
  console.log('Tool used:', result.tool);
} catch (error) {
  console.error('Failed to take screenshot:', error.error);
}
```

### Format Examples

```javascript
import { captureScreen } from '@ltcode/crosshot';

// PNG (default, lossless)
const pngResult = await captureScreen({
  filename: 'screenshot',
  format: 'png'
});

// JPG with custom quality
const jpgResult = await captureScreen({
  filename: 'screenshot',
  format: 'jpg',
  quality: 85  // 1-100, affects file size
});

// WebP (modern format, good compression)
const webpResult = await captureScreen({
  filename: 'screenshot',
  format: 'webp',
  quality: 90
});

// BMP (uncompressed)
const bmpResult = await captureScreen({
  filename: 'screenshot',
  format: 'bmp'
});
```

### Base64 Examples (Library Feature)

```javascript
import { captureScreen } from '@ltcode/crosshot';

// Get screenshot as base64 data URL
const result = await captureScreen({
  filename: 'screenshot',
  format: 'png',
  returnBase64: true
});

console.log(result.filepath);    // File path: ./screenshot.png
console.log(result.base64);      // Data URL: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
console.log(result.base64Raw);   // Raw base64: iVBORw0KGgoAAAANSUhEUgAA...

// Use in web context
const img = document.createElement('img');
img.src = result.base64;

// Different formats with base64
const jpegBase64 = await captureScreen({
  format: 'jpg',
  quality: 85,
  returnBase64: true
});

const webpBase64 = await captureScreen({
  format: 'webp', 
  quality: 90,
  returnBase64: true
});
```

**Note**: The `returnBase64` option is only available when using Crosshot as a library. The CLI always saves to files.

### Advanced Example

```javascript
import { takeScreenshot, getAvailableTools } from '@ltcode/crosshot';

// Check available tools first
const tools = await getAvailableTools();
console.log('Available tools:', tools.available);

if (tools.hasTools) {
  const result = await takeScreenshot('./output/', 'custom-name', {
    silent: false,    // Show console output
    verbose: true,    // Show detailed information
    format: 'jpg',    // JPG format
    quality: 85       // Quality setting
  });
  
  console.log('Result:', result);
}
```

## API Reference

### `captureScreen(options)`

Convenience function for taking screenshots with simplified options.

**Parameters:**
- `options` (Object, optional)
  - `outputDir` (string): Output directory (default: current working directory)
  - `filename` (string): Custom filename without extension (default: auto-generated)
  - `silent` (boolean): Suppress console output (default: true)
  - `verbose` (boolean): Show detailed information (default: false)
  - `createDir` (boolean): Create directory if it doesn't exist (default: true)
  - `format` (string): Output format - 'png', 'jpg', 'jpeg', 'bmp', 'webp' (default: 'png')
  - `quality` (number): Quality for lossy formats, 1-100 (default: 100)
  - `returnBase64` (boolean): Include base64 data in result (default: false)

**Returns:** Promise resolving to result object

### `takeScreenshot(destinationDir, customName, options)`

Main screenshot function with full control.

**Parameters:**
- `destinationDir` (string): Directory to save screenshot
- `customName` (string, optional): Custom filename without extension
- `options` (Object, optional)
  - `silent` (boolean): Suppress console output (default: false)
  - `verbose` (boolean): Show detailed information (default: false)
  - `format` (string): Output format - 'png', 'jpg', 'jpeg', 'bmp', 'webp' (default: 'png')
  - `quality` (number): Quality for lossy formats, 1-100 (default: 100)
  - `returnBase64` (boolean): Include base64 data in result (default: false)

**Returns:** Promise resolving to result object

### `getAvailableTools()`

Check what screenshot tools are available on the system.

**Returns:** Promise resolving to tools information object

## Result Object

When successful, functions return a detailed result object:

```javascript
{
  success: true,
  filename: "screenshot-1234567890.png",
  filepath: "./output/screenshot-1234567890.png",
  absolutePath: "/full/path/to/screenshot-1234567890.png",
  directory: "./output/",
  size: {
    bytes: 1048576,
    kb: 1024.0,
    mb: 1.0
  },
  tool: "spectacle",
  platform: "linux",
  timestamp: "2025-08-14T12:34:56.789Z",
  format: "png",
  metadata: {
    created: Date,
    modified: Date,
    permissions: 33188
  }
}
```

## Error Object

When failed, functions reject with detailed error information:

```javascript
{
  success: false,
  error: "No screenshot tools found!",
  platform: "linux",
  availableTools: ["grim", "spectacle", "scrot"],
  timestamp: "2025-08-14T12:34:56.789Z",
  suggestions: [
    "grim (recommended for Wayland)",
    "spectacle (for KDE Plasma)",
    // ... more suggestions
  ]
}
```

## Supported Tools

### Linux
- **grim** (recommended for Wayland) - supports PNG, JPG, WebP, PPM
- **gnome-screenshot** (GNOME environments) - PNG only
- **spectacle** (KDE Plasma) - multiple formats based on extension
- **wayshot** (Wayland alternative) - PNG and JPG
- **flameshot** (GUI with features) - PNG and JPG
- **scrot** (X11 systems) - PNG, JPG based on extension
- **maim** (X11 alternative) - PNG, JPG based on extension

### Windows
- **PowerShell** (native, built-in) - PNG, JPG, BMP (WebP fallback to PNG)
- **NirCmd** (third-party utility) - multiple formats

### macOS
- **screencapture** (native, built-in) - PNG, JPG

## Supported Formats

| Format | Extension | Type | Quality Setting | Notes |
|--------|-----------|------|-----------------|--------|
| PNG    | `.png`    | Lossless | N/A | Default format, best quality |
| JPG    | `.jpg`    | Lossy | 1-100 | Good compression, use quality setting |
| JPEG   | `.jpg`    | Lossy | 1-100 | Same as JPG |
| WebP   | `.webp`   | Lossy/Lossless | 1-100 | Modern format, excellent compression |
| BMP    | `.bmp`    | Uncompressed | N/A | Large files, maximum compatibility |

**Format Recommendations:**
- **PNG**: Best for screenshots with text, UI elements, or when quality is priority
- **JPG**: Good for photos or when smaller file size is needed (use quality 80-90)
- **WebP**: Modern format with excellent compression, good browser support
- **BMP**: Only when maximum compatibility is required (creates large files)

## Examples

See `example.js` for comprehensive usage examples including error handling and different configuration options.

### Quick Start

```bash
# Install globally
npm install -g @ltcode/crosshot

# Take a screenshot
crosshot

# With custom name and format
crosshot -n="my-screenshot" -f="jpg" -q=85

# See all options
crosshot --help
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Changelog

### v1.0.0
- Initial release
- Cross-platform screenshot support (Linux, Windows, macOS)
- Multiple format support (PNG, JPG, WebP, BMP)
- Quality settings for lossy formats
- CLI and library interfaces
- Colored terminal output with Chalk
- Automatic tool detection and fallbacks
- Comprehensive error handling with suggestions
- Comprehensive error handling
