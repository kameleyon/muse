import { safeJsonParse, convertToChartData, repairJson, deepRepairJson } from './jsonUtils';

// Test function to log results
function testJsonParsing(label: string, input: string) {
  console.log(`\n--- Testing: ${label} ---`);
  console.log('Input:', input);
  
  try {
    // Test direct JSON parse
    try {
      const directParse = JSON.parse(input);
      console.log('Direct JSON.parse succeeded:', directParse);
    } catch (e: any) {
      console.log('Direct JSON.parse failed:', e.message);
      
      // Test basic repair
      try {
        const repaired = repairJson(input);
        console.log('Basic repair result:', repaired);
        const basicRepairParse = JSON.parse(repaired);
        console.log('Basic repair parse succeeded:', basicRepairParse);
      } catch (e2: any) {
        console.log('Basic repair parse failed:', e2.message);
        
        // Test deep repair
        try {
          const deepRepaired = deepRepairJson(input);
          console.log('Deep repair result:', deepRepaired);
          const deepRepairParse = JSON.parse(deepRepaired);
          console.log('Deep repair parse succeeded:', deepRepairParse);
        } catch (e3: any) {
          console.log('Deep repair parse failed:', e3.message);
        }
      }
    }
    
    // Test safeJsonParse
    const safeResult = safeJsonParse(input);
    console.log('safeJsonParse result:', safeResult);
    
    // Test convertToChartData
    const chartData = convertToChartData(input);
    console.log('convertToChartData result:', chartData);
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Run tests with various malformed JSON inputs
console.log('=== JSON PARSING TEST SUITE ===');

// Test 1: Valid JSON
testJsonParsing('Valid JSON Array', '[{"name":"Category A","value":30},{"name":"Category B","value":45}]');

// Test 2: JSON with single quotes
testJsonParsing('JSON with single quotes', "[{'name':'Category A','value':30},{'name':'Category B','value':45}]");

// Test 3: JSON with unquoted property names
testJsonParsing('JSON with unquoted property names', '[{name:"Category A",value:30},{name:"Category B",value:45}]');

// Test 4: JSON with trailing commas
testJsonParsing('JSON with trailing commas', '[{"name":"Category A","value":30,},{"name":"Category B","value":45,}]');

// Test 5: JSON with missing commas
testJsonParsing('JSON with missing commas', '[{"name":"Category A" "value":30}{"name":"Category B" "value":45}]');

// Test 6: JSON with extra brackets
testJsonParsing('JSON with extra brackets', '[[{"name":"Category A","value":30},{"name":"Category B","value":45}]]');

// Test 7: JSON with missing brackets
testJsonParsing('JSON with missing brackets', '{"name":"Category A","value":30},{"name":"Category B","value":45}');

// Test 8: JSON with JavaScript undefined
testJsonParsing('JSON with JavaScript undefined', '[{"name":"Category A","value":undefined},{"name":"Category B","value":45}]');

// Test 9: JSON with unescaped quotes in strings
testJsonParsing('JSON with unescaped quotes', '[{"name":"Category "A"","value":30},{"name":"Category B","value":45}]');

// Test 10: JSON with line breaks
testJsonParsing('JSON with line breaks', `[
  {"name":"Category A","value":30},
  {"name":"Category B","value":45}
]`);

// Test 11: Severely malformed JSON
testJsonParsing('Severely malformed JSON', 'name: "Category A", value: 30, name: "Category B", value: 45');

// Test 12: CSV-like format
testJsonParsing('CSV-like format', `name,value
Category A,30
Category B,45`);

// Test 13: JSON with mixed types
testJsonParsing('JSON with mixed types', '[{"name":"Category A","value":"30"},{"name":"Category B","value":45}]');

// Test 14: Empty input
testJsonParsing('Empty input', '');

// Test 15: Non-JSON text with embedded JSON-like content
testJsonParsing('Text with embedded JSON', 'Here is some chart data: [{"name":"Category A","value":30},{"name":"Category B","value":45}] that should be extracted.');

// Test 16: Markdown code block with JSON
testJsonParsing('Markdown code block', '```chart\n[{"name":"Category A","value":30},{"name":"Category B","value":45}]\n```');

// Test 17: JSON with spaces in property names
testJsonParsing('JSON with spaces in property names', '[{"category name":"Category A","value":30},{"category name":"Category B","value":45}]');

// Test 18: JSON with numeric property names
testJsonParsing('JSON with numeric property names', '[{1:"Category A","value":30},{2:"Category B","value":45}]');

// Test 19: JSON with special characters
testJsonParsing('JSON with special characters', '[{"name":"Category A & B","value":30},{"name":"Category C > D","value":45}]');

// Test 20: JSON with nested objects
testJsonParsing('JSON with nested objects', '[{"name":"Category A","details":{"color":"red","size":10},"value":30},{"name":"Category B","value":45}]');

console.log('\n=== TEST SUITE COMPLETED ===');
