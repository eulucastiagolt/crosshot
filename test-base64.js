import { captureScreen } from './index.js';

console.log('Testing Base64 functionality...\n');

try {
  const result = await captureScreen({
    filename: 'test-base64',
    format: 'png',
    returnBase64: true,
    silent: true
  });

  console.log('✓ Success!');
  console.log(`File: ${result.filename}`);
  console.log(`Size: ${result.size.kb} KB`);
  console.log(`Tool: ${result.tool}`);
  console.log(`Format: ${result.format}`);
  console.log(`Base64 available: ${!!result.base64}`);
  console.log(`Base64 Raw length: ${result.base64Raw?.length || 0} chars`);
  console.log(`Data URL length: ${result.base64?.length || 0} chars`);
  console.log(`Data URL preview: ${result.base64?.substring(0, 100)}...`);

  // Test with different format
  console.log('\n--- Testing JPG with base64 ---');
  const jpgResult = await captureScreen({
    filename: 'test-base64-jpg',
    format: 'jpg',
    quality: 85,
    returnBase64: true,
    silent: true
  });

  console.log(`✓ JPG Success! Size: ${jpgResult.size.kb} KB`);
  console.log(`MIME type: ${jpgResult.base64.split(';')[0].split(':')[1]}`);

} catch (error) {
  console.error('✗ Error:', error.error || error.message);
}
