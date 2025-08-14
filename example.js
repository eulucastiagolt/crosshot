// Example usage of the screenshot library
// This file demonstrates different ways to use the screenshot functionality

import { takeScreenshot, captureScreen, getAvailableTools } from './screenshot.js';

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
    
  } catch (error) {
    console.error('Failed:', error.error || error.message);
  }
}

// Example 2: Verbose mode with custom options
async function verboseExample() {
  console.log('\n=== Verbose Mode Example ===');
  
  try {
    const result = await takeScreenshot('./examples/', 'verbose-test', {
      silent: false,
      verbose: true
    });
    
    console.log('\nDetailed result:');
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('Error details:', error);
  }
}

// Example 3: Check available tools before taking screenshot
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

// Example 4: Error handling
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
  await verboseExample();
  await toolCheckExample();
  await errorHandlingExample();
  
  console.log('\n=== Examples completed ===');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runExamples().catch(console.error);
}
