// Example usage of the crosshot library
// This file demonstrates different ways to use the crosshot functionality

import { takeScreenshot, captureScreen, getAvailableTools } from './index.js';

// Example 1: Basic library usage (silent mode)
async function basicExample() {
  console.log('\n=== Basic Library Usage ===');
  
  try {
    const result = await captureScreen({
      outputDir: './examples/',
      filename: 'library-test',
      silent: true
    });
    
    console.log('Success!');
    console.log('File:', result.filename);
    console.log('Path:', result.filepath);
    console.log('Size:', result.size.kb, 'KB');
    console.log('Tool used:', result.tool);
    console.log('Platform:', result.platform);
    console.log('Format:', result.format);
    
  } catch (error) {
    console.error('Failed:', error.error || error.message);
  }
}

// Example 2: Different formats example
async function formatExample() {
  console.log('\n=== Different Formats Example ===');
  
  const formats = ['png', 'jpg', 'webp'];
  
  for (const format of formats) {
    try {
      console.log(`Taking screenshot in ${format.toUpperCase()} format...`);
      const result = await captureScreen({
        outputDir: './examples/',
        filename: `format-test-${format}`,
        format: format,
        quality: format === 'jpg' ? 85 : 100,
        silent: true
      });
      
      console.log(`✓ ${format.toUpperCase()}: ${result.filename} (${result.size.kb} KB)`);
      
    } catch (error) {
      console.error(`✗ ${format.toUpperCase()}: ${error.error || error.message}`);
    }
  }
}

// Example 3: Verbose mode with custom options
async function verboseExample() {
  console.log('\n=== Verbose Mode Example ===');
  
  try {
    const result = await takeScreenshot('./examples/', 'verbose-test', {
      silent: false,
      verbose: true,
      format: 'png'
    });
    
    console.log('\nDetailed result:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error details:', error);
  }
}

// Example 4: Check available tools before taking screenshot
async function toolCheckExample() {
  console.log('\n=== Tool Check Example ===');
  
  try {
    const tools = await getAvailableTools();
    console.log('Platform:', tools.platform);
    console.log('Available tools:', tools.available);
    console.log('Has screenshot tools:', tools.hasTools);
    
    if (tools.hasTools) {
      const result = await captureScreen({
        outputDir: './examples/',
        filename: 'tool-check-test',
        silent: false
      });
      console.log('Screenshot taken successfully with:', result.tool);
    } else {
      console.log('No screenshot tools available!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example 5: Error handling
async function errorHandlingExample() {
  console.log('\n=== Error Handling Example ===');
  
  try {
    // Try to save to a directory that doesn't exist and won't be created
    const result = await captureScreen({
      outputDir: './non-existent-dir/',
      filename: 'error-test',
      silent: true,
      createDir: false // Don't create directory - this should cause an error
    });
    
    console.log('Unexpected success:', result);
    
  } catch (error) {
    console.log('✓ Caught error as expected:');
    console.log('  Success:', error.success || false);
    console.log('  Error:', error.error || error.message);
    if (error.platform) {
      console.log('  Platform:', error.platform);
    }
    if (error.suggestions && error.suggestions.length > 0) {
      console.log('  Suggestions:');
      error.suggestions.forEach(suggestion => {
        console.log('    -', suggestion);
      });
    }
  }
}

// Run all examples
async function runExamples() {
  console.log('Screenshot Library Examples');
  console.log('===========================');
  
  await basicExample();
  await formatExample();
  await verboseExample();
  await toolCheckExample();
  await errorHandlingExample();
  
  console.log('\n=== Examples completed ===');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}
