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

## Installation

```bash
npm install crosshot
```

## CLI Usage

### Basic usage
```bash
node screenshot.js
```

### With custom filename
```bash
node screenshot.js -n="my-screenshot"
node screenshot.js --name="important-capture"
```

### With custom output directory
```bash
node screenshot.js -o="./screenshots/"
node screenshot.js --output="~/Images/Screenshots/"
```

### Combined options
```bash
node screenshot.js -n="bug-report" -o="./captures/"
```

### Help
```bash
node screenshot.js --help
```

## Library Usage

### Basic Example

```javascript
import { captureScreen } from 'crosshot';

try {
  const result = await captureScreen({
    outputDir: './screenshots/',
    filename: 'my-capture',
    silent: true
  });
  
  console.log('Screenshot saved:', result.filepath);
  console.log('File size:', result.size.kb, 'KB');
  console.log('Tool used:', result.tool);
} catch (error) {
  console.error('Failed to take screenshot:', error.error);
}
```

### Advanced Example

```javascript
import { takeScreenshot, getAvailableTools } from 'crosshot';

// Check available tools first
const tools = await getAvailableTools();
console.log('Available tools:', tools.available);

if (tools.hasTools) {
  const result = await takeScreenshot('./output/', 'custom-name', {
    silent: false,    // Show console output
    verbose: true     // Show detailed information
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

**Returns:** Promise resolving to result object

### `takeScreenshot(destinationDir, customName, options)`

Main screenshot function with full control.

**Parameters:**
- `destinationDir` (string): Directory to save screenshot
- `customName` (string, optional): Custom filename without extension
- `options` (Object, optional)
  - `silent` (boolean): Suppress console output (default: false)
  - `verbose` (boolean): Show detailed information (default: false)

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
- **grim** (recommended for Wayland)
- **gnome-screenshot** (GNOME environments)
- **spectacle** (KDE Plasma)
- **wayshot** (Wayland alternative)
- **flameshot** (GUI with features)
- **scrot** (X11 systems)
- **maim** (X11 alternative)

### Windows
- **PowerShell** (native, built-in)
- **NirCmd** (third-party utility)

### macOS
- **screencapture** (native, built-in)

## Examples

See `example.js` for comprehensive usage examples including error handling and different configuration options.

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
- Cross-platform screenshot support
- CLI and library interfaces
- Colored terminal output
- Comprehensive error handling
