// Cross-platform desktop screenshot utility
// Compatible with Linux (X11/Wayland), Windows and macOS

import { exec } from 'child_process';
import { join, dirname } from 'path';
import { existsSync, statSync, mkdirSync, readFileSync } from 'fs';
import { platform } from 'os';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function takeScreenshot(destinationDir = __dirname, customName = null, options = {}) {
  return new Promise((resolve, reject) => {
    const filename = customName ? `${customName}.png` : `screenshot-${Date.now()}.png`;
    const filepath = join(destinationDir, filename);
    const currentPlatform = platform();
    
    // Default options for library usage
    const config = {
      silent: false,        // If true, suppresses console output (useful for library usage)
      verbose: false,       // If true, shows more detailed information
      format: 'png',        // Screenshot format (currently only PNG supported)
      quality: 100,         // Quality (for future use)
      ...options
    };
    
    // Only log if not in silent mode
    const log = (...args) => !config.silent && config.verbose && console.log(...args);
    const logError = (...args) => !config.silent && console.error(...args);
    
    log(chalk.cyan(`Platform detected: ${currentPlatform}`));
    log(chalk.blue('Taking screenshot...'));
    
    let commands = [];
    
    // Platform-specific commands
    if (currentPlatform === 'win32') {
      // Windows
      commands = [
        `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; $screen = [System.Windows.Forms.Screen]::PrimaryScreen; $bitmap = New-Object System.Drawing.Bitmap($screen.Bounds.Width, $screen.Bounds.Height); $graphics = [System.Drawing.Graphics]::FromImage($bitmap); $graphics.CopyFromScreen($screen.Bounds.X, $screen.Bounds.Y, 0, 0, $screen.Bounds.Size); $bitmap.Save('${filepath.replace(/\\/g, '/')}', [System.Drawing.Imaging.ImageFormat]::Png); $graphics.Dispose(); $bitmap.Dispose()"`,
        `nircmd savescreenshot "${filepath}"`,
        `screencapture "${filepath}"`
      ];
    } else if (currentPlatform === 'darwin') {
      // macOS
      commands = [
        `screencapture "${filepath}"`,
        `screencapture -x "${filepath}"`
      ];
    } else {
      // Linux (X11/Wayland)
      commands = [
        `grim "${filepath}"`,                                  // Best for Wayland
        `gnome-screenshot -f "${filepath}"`,                   // Works with GNOME/Wayland
        `spectacle -b -n -o "${filepath}"`,                    // KDE Plasma/Wayland
        `wayshot -f "${filepath}"`,                            // Another Wayland option
        `flameshot full -p "${dirname(filepath)}" -d 0`,      // Flameshot (saves with own name)
        `scrot "${filepath}"`,                                 // Fallback for X11
        `maim "${filepath}"`                                   // Another X11 fallback
      ];
    }
    
    function tryCommand(index) {
      if (index >= commands.length) {
        const errorMessage = 'No screenshot tools found!';
        logError(chalk.red.bold(`ERROR: ${errorMessage}`));
        
        if (currentPlatform === 'win32') {
          log(chalk.yellow('\nFor Windows:'));
          log(chalk.white('  * PowerShell already tried (native to Windows)'));
          log(chalk.white('  * Install NirCmd: ') + chalk.cyan('https://www.nirsoft.net/utils/nircmd.html'));
          log(chalk.white('  * Or use npm: ') + chalk.green('npm install screenshot-desktop'));
          
        } else if (currentPlatform === 'darwin') {
          log(chalk.yellow('\nFor macOS:'));
          log(chalk.white('  * screencapture is native to macOS'));
          log(chalk.white('  * Check screen recording permissions in System Preferences'));
          
        } else {
          log(chalk.yellow('\nFor Linux systems, install one of these tools:'));
          log(chalk.green('  * grim') + chalk.gray(' (recommended for Wayland)'));
          log(chalk.green('  * gnome-screenshot') + chalk.gray(' (for GNOME environments)'));
          log(chalk.green('  * spectacle') + chalk.gray(' (for KDE Plasma)'));
          log(chalk.green('  * wayshot') + chalk.gray(' (alternative for Wayland)'));
          log(chalk.green('  * flameshot') + chalk.gray(' (GUI with extra features)'));
          log(chalk.green('  * scrot') + chalk.gray(' (for X11 systems)'));
          log(chalk.green('  * maim') + chalk.gray(' (alternative for X11)'));
          log(chalk.magenta('\nInstall using your system package manager ') + chalk.cyan('(apt, pacman, dnf, etc.)'));
        }
        
        // Return detailed error object for library usage
        reject({
          success: false,
          error: errorMessage,
          platform: currentPlatform,
          availableTools: commands.map(cmd => cmd.split(' ')[0]),
          timestamp: new Date().toISOString(),
          suggestions: getSuggestions(currentPlatform)
        });
        return;
      }
      
      const command = commands[index];
      const toolName = command.split(' ')[0];
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          log(chalk.yellow(`WARNING: ${toolName} not available, trying next...`));
          if (config.verbose) {
            log(chalk.gray(`Command failed: ${command}`));
            log(chalk.gray(`Error: ${error.message}`));
          }
          tryCommand(index + 1);
        } else {
          // Check if file was created
          if (existsSync(filepath)) {
            // Verbose logging only
            log(chalk.green.bold(`SUCCESS: Screenshot captured with ${toolName}!`));
            log(chalk.blue('File saved at: ') + chalk.white.underline(filepath));
            
            // Show file size
            const stats = statSync(filepath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            log(chalk.magenta('Size: ') + chalk.cyan(`${sizeKB} KB`));
            
            // Return comprehensive success object for library usage
            resolve({
              success: true,
              filename: filename,
              filepath: filepath,
              absolutePath: join(process.cwd(), filepath),
              directory: destinationDir,
              size: {
                bytes: stats.size,
                kb: parseFloat(sizeKB),
                mb: parseFloat(sizeMB)
              },
              tool: toolName,
              platform: currentPlatform,
              timestamp: new Date().toISOString(),
              format: 'png',
              metadata: {
                created: stats.birthtime,
                modified: stats.mtime,
                permissions: stats.mode
              }
            });
          } else {
            log(chalk.red(`ERROR: Failed to save with ${toolName}, trying next...`));
            tryCommand(index + 1);
          }
        }
      });
    }
    
    tryCommand(0);
  });
}

// Export function for use in other modules
export default takeScreenshot;

// Function to get package version
function getVersion() {
  try {
    const packagePath = join(__dirname, 'package.json');
    const packageContent = readFileSync(packagePath, 'utf8');
    const packageInfo = JSON.parse(packageContent);
    return packageInfo.version || 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

// Function to display version information
function showVersion() {
  const version = getVersion();
  const currentPlatform = platform();
  
  console.log(chalk.cyan.bold('Crosshot'));
  console.log(chalk.white(`Version: ${version}`));
  console.log(chalk.gray(`Platform: ${currentPlatform}`));
  console.log(chalk.gray('Cross-platform desktop screenshot utility'));
  console.log(chalk.blue('\nRepository: ') + chalk.underline('https://github.com/user/crosshot'));
  console.log(chalk.green('License: MIT'));
}

// Helper function to get installation suggestions based on platform
function getSuggestions(currentPlatform) {
  if (currentPlatform === 'win32') {
    return [
      'PowerShell (native to Windows)',
      'NirCmd from https://www.nirsoft.net/utils/nircmd.html',
      'npm install screenshot-desktop'
    ];
  } else if (currentPlatform === 'darwin') {
    return [
      'screencapture (native to macOS)',
      'Check screen recording permissions in System Preferences'
    ];
  } else {
    return [
      'grim (recommended for Wayland)',
      'gnome-screenshot (for GNOME environments)', 
      'spectacle (for KDE Plasma)',
      'wayshot (alternative for Wayland)',
      'flameshot (GUI with extra features)',
      'scrot (for X11 systems)',
      'maim (alternative for X11)'
    ];
  }
}

// Convenience function for library usage with better error handling
export async function captureScreen(options = {}) {
  const {
    outputDir = process.cwd(),
    filename = null,
    silent = true,
    verbose = false,
    createDir = true
  } = options;

  try {
    // Check if directory exists
    if (!existsSync(outputDir)) {
      if (createDir) {
        mkdirSync(outputDir, { recursive: true });
      } else {
        throw {
          success: false,
          error: `Directory does not exist: ${outputDir}`,
          platform: platform(),
          timestamp: new Date().toISOString(),
          suggestions: ['Set createDir: true to automatically create directories', 'Create the directory manually before taking screenshot']
        };
      }
    }

    const result = await takeScreenshot(outputDir, filename, { 
      silent, 
      verbose 
    });
    
    return result;
  } catch (error) {
    throw error;
  }
}

// Function to check available screenshot tools
export function getAvailableTools() {
  return new Promise((resolve) => {
    const currentPlatform = platform();
    let commands = [];
    
    if (currentPlatform === 'win32') {
      commands = ['powershell', 'nircmd', 'screencapture'];
    } else if (currentPlatform === 'darwin') {
      commands = ['screencapture'];
    } else {
      commands = ['grim', 'gnome-screenshot', 'spectacle', 'wayshot', 'flameshot', 'scrot', 'maim'];
    }
    
    const availableTools = [];
    let checkedTools = 0;
    
    commands.forEach(tool => {
      exec(`which ${tool}`, (error) => {
        checkedTools++;
        if (!error) {
          availableTools.push(tool);
        }
        
        if (checkedTools === commands.length) {
          resolve({
            platform: currentPlatform,
            available: availableTools,
            total: commands.length,
            hasTools: availableTools.length > 0
          });
        }
      });
    });
  });
}

// Export function to get library version
export function getLibraryVersion() {
  return {
    version: getVersion(),
    platform: platform(),
    name: 'crosshot',
    description: 'Cross-platform desktop screenshot utility'
  };
}

// Function to parse command line arguments
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--name=') || arg.startsWith('-n=')) {
      options.name = arg.split('=')[1].replace(/["']/g, ''); // Remove quotes
    } else if (arg.startsWith('-o=') || arg.startsWith('--output=')) {
      const outputPath = arg.split('=')[1].replace(/["']/g, ''); // Remove quotes
      // Expand tilde (~) to home directory
      options.output = outputPath.startsWith('~/') 
        ? join(process.env.HOME || process.env.USERPROFILE, outputPath.slice(2))
        : outputPath;
    } else if (arg.startsWith('--help') || arg.startsWith('-h')) {
      options.help = true;
    } else if (arg.startsWith('--verbose')) {
      options.verbose = true;
    } else if (arg.startsWith('--version') || arg === '-v') {
      options.version = true;
    }
  });
  
  return options;
}

// Function to display help information
function showHelp() {
  console.log(chalk.cyan.bold(`
Cross-Platform Screenshot Utility
`));
  console.log(chalk.white.bold('Usage:'));
  console.log(chalk.gray('  node screenshot.js [options]'));
  
  console.log(chalk.white.bold('\nOptions:'));
  console.log(chalk.green('  -n, --name=<filename>') + chalk.gray('  Set custom filename for the screenshot (without extension)'));
  console.log(chalk.gray('                        Example: ') + chalk.yellow('-n="my-capture"') + chalk.gray(' or ') + chalk.yellow('--name=desktop-screenshot'));
  
  console.log(chalk.green('  -o, --output=<path>') + chalk.gray('   Set output directory for the screenshot'));
  console.log(chalk.gray('                       Example: ') + chalk.yellow('-o="~/Images/Screenshots/"') + chalk.gray(' or ') + chalk.yellow('--output="./"'));
  console.log(chalk.gray('                       Note: Directory will be created if it doesn\'t exist'));
  
  console.log(chalk.green('  --verbose') + chalk.gray('            Show detailed information and result object'));
  console.log(chalk.green('  -v, --version') + chalk.gray('        Show version information'));
  console.log(chalk.green('  -h, --help') + chalk.gray('           Show this help message'));

  console.log(chalk.white.bold('\nExamples:'));
  console.log(chalk.cyan('  node screenshot.js'));
  console.log(chalk.cyan('  node screenshot.js ') + chalk.yellow('-n="important-capture"'));
  console.log(chalk.cyan('  node screenshot.js ') + chalk.yellow('--name="important-capture"'));
  console.log(chalk.cyan('  node screenshot.js ') + chalk.yellow('-o="~/Images/Screenshots/"'));
  console.log(chalk.cyan('  node screenshot.js ') + chalk.yellow('-n="bug-report" -o="./captures/"'));
  console.log(chalk.cyan('  node screenshot.js ') + chalk.yellow('--verbose') + chalk.gray(' (show detailed information)'));
  console.log(chalk.cyan('  node screenshot.js ') + chalk.yellow('-v') + chalk.gray(' (show version)'));
  console.log(chalk.cyan('  node screenshot.js ') + chalk.yellow('--help'));

  console.log(chalk.magenta('\nThe screenshot will be saved as PNG format in the specified or current directory.'));
  console.log(chalk.gray('Tilde (~) expands to your home directory on Unix-like systems.'));
}

// If executed directly, run the capture
if (import.meta.url === `file://${process.argv[1]}`) {
  const options = parseArguments();
  
  if (options.help) {
    showHelp();
    process.exit(0);
  }
  
  if (options.version) {
    showVersion();
    process.exit(0);
  }
  
  // Determine output directory
  const outputDir = options.output || __dirname;
  
  // Create directory if it doesn't exist
  try {
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      if (options.verbose) {
        console.log(chalk.blue('Created directory: ') + chalk.white.underline(outputDir));
      }
    }
  } catch (error) {
    console.error(chalk.red.bold(`ERROR: Error creating directory: ${error.message}`));
    process.exit(1);
  }
  
  takeScreenshot(outputDir, options.name, { 
    silent: false, 
    verbose: options.verbose || false 
  })
    .then(result => {
      if (options.verbose) {
        console.log(chalk.green.bold('Screenshot taken successfully!'));
        console.log(chalk.gray('Detailed result:'));
        console.log(JSON.stringify(result, null, 2));
      } else {
        // Minimal output for CLI - just success and path
        console.log(chalk.green('✓ Success'));
        console.log(chalk.white(result.filepath));
      }
    })
    .catch(error => {
      console.error(chalk.red.bold('ERROR:'), chalk.red(error.error || error.message));
      if (options.verbose && error.suggestions) {
        console.log(chalk.yellow('\nSuggestions:'));
        error.suggestions.forEach(suggestion => {
          console.log(chalk.gray('  - ') + chalk.white(suggestion));
        });
      }
      process.exit(1);
    });
}
