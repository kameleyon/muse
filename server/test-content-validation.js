// Test script for content validation functions
// Run with: node test-content-validation.js

// Copy the validation function for testing
function validateAndCleanContent(content, shouldRetry = true) {
  const trimmedContent = content.trim();
  
  if (!trimmedContent) {
    return { cleanedContent: '', isComplete: false, needsRetry: shouldRetry };
  }
  
  // Check if content ends with proper sentence punctuation
  const sentenceEndRegex = /[.!?]['"]?$/;
  const isComplete = sentenceEndRegex.test(trimmedContent);
  
  if (isComplete) {
    return { cleanedContent: trimmedContent, isComplete: true, needsRetry: false };
  }
  
  // Try to find the last complete sentence
  const punctuationMarks = ['.', '!', '?'];
  let bestCutOffPoint = -1;
  
  for (const mark of punctuationMarks) {
    const lastIndex = trimmedContent.lastIndexOf(mark);
    if (lastIndex > bestCutOffPoint) {
      bestCutOffPoint = lastIndex;
    }
  }
  
  if (bestCutOffPoint > 0) {
    let cutOffPoint = bestCutOffPoint + 1;
    
    // Include closing quotes if present
    if (cutOffPoint < trimmedContent.length && 
        (trimmedContent[cutOffPoint] === '"' || trimmedContent[cutOffPoint] === "'")) {
      cutOffPoint++;
    }
    
    const cleanedContent = trimmedContent.slice(0, cutOffPoint).trim();
    const removedText = trimmedContent.slice(cutOffPoint).trim();
    
    if (removedText) {
      console.warn(`Content ended mid-sentence. Removed: "${removedText.slice(0, 100)}..."`);
    }
    
    return { 
      cleanedContent, 
      isComplete: true, 
      needsRetry: shouldRetry && removedText.length > 50 // Only retry if significant content was lost
    };
  }
  
  // If no sentence ending found, return as-is but mark for retry
  console.warn(`No complete sentences found in content. Content ends with: "${trimmedContent.slice(-100)}"`);
  return { 
    cleanedContent: trimmedContent, 
    isComplete: false, 
    needsRetry: shouldRetry
  };
}

// Test cases
console.log('Testing content validation function...\n');

// Test 1: Complete content
const test1 = "This is a complete sentence. And this is another one.";
const result1 = validateAndCleanContent(test1);
console.log('Test 1 - Complete content:');
console.log('Input:', test1);
console.log('Result:', result1);
console.log('Expected: isComplete=true, needsRetry=false\n');

// Test 2: Incomplete content (your specific case)
const test2 = "This is a complete sentence. But this incomplete thought Does your";
const result2 = validateAndCleanContent(test2);
console.log('Test 2 - Incomplete content (Does your):');
console.log('Input:', test2);
console.log('Result:', result2);
console.log('Expected: isComplete=true, needsRetry=true (should remove "Does your")\n');

// Test 3: Content with quotes
const test3 = 'He said, "This is a complete sentence." But then he started to say "Something incompl';
const result3 = validateAndCleanContent(test3);
console.log('Test 3 - Content with quotes:');
console.log('Input:', test3);
console.log('Result:', result3);
console.log('Expected: isComplete=true, should clean up to end of quote\n');

// Test 4: Content ending with punctuation and quote
const test4 = 'He said, "This is complete."';
const result4 = validateAndCleanContent(test4);
console.log('Test 4 - Content ending with punctuation and quote:');
console.log('Input:', test4);
console.log('Result:', result4);
console.log('Expected: isComplete=true, needsRetry=false\n');

// Test 5: No sentences at all
const test5 = "This content has no punctuation marks at all just words";
const result5 = validateAndCleanContent(test5);
console.log('Test 5 - No punctuation:');
console.log('Input:', test5);
console.log('Result:', result5);
console.log('Expected: isComplete=false, needsRetry=true\n');

console.log('All tests completed!');