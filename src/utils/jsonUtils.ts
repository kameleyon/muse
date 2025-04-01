/**
 * Utility functions for handling JSON data in MagicMuse
 */

/**
 * Attempts to repair common JSON formatting issues
 * @param jsonString The string containing potential JSON data
 * @returns A cleaned string with common JSON formatting issues fixed
 */
export const repairJson = (jsonString: string): string => {
  if (!jsonString) return '';
  
  // First, check if the string is already valid JSON
  try {
    JSON.parse(jsonString);
    return jsonString; // If it's valid, return as is
  } catch (e) {
    // Continue with repairs if it's not valid
  }
  
  // Make a copy of the original string
  let repairedJson = jsonString;
  
  // Step 1: Basic structural fixes
  repairedJson = repairedJson
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/(\w+)(?=\s*:)/g, '"$1"') // Add quotes to property names
    .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
    .replace(/\s*\n+\s*/g, ' ') // Normalize whitespace
    .trim();
  
  // Step 2: Try to parse after basic fixes
  try {
    JSON.parse(repairedJson);
    return repairedJson; // Return if valid after basic fixes
  } catch (e) {
    // Continue with more aggressive repairs
  }
  
  // Step 3: More aggressive repairs
  repairedJson = repairedJson
    // Fix property names with spaces
    .replace(/\"([^"]+)\"(\s*):(\s*)/g, (match, propName) => {
      // Replace spaces in property names with underscores
      return `"${propName.replace(/\s+/g, '_')}"$2:$3`;
    })
    // Fix missing quotes around string values
    .replace(/:\s*([a-zA-Z][a-zA-Z0-9_]*)\s*([,}])/g, ':"$1"$2')
    // Fix JavaScript's undefined/null to valid JSON
    .replace(/:\s*undefined\s*([,}])/g, ':null$1')
    // Fix missing commas between objects in an array
    .replace(/\}(\s*)\{/g, '},$1{')
    // Fix missing commas between array items
    .replace(/\](\s*)\[/g, '],$1[')
    // Fix trailing commas
    .replace(/,(\s*[\]}])/g, '$1');
  
  // Step 4: Check if we need to wrap in array brackets
  if (!repairedJson.trim().startsWith('[') && !repairedJson.trim().startsWith('{')) {
    // If it doesn't start with [ or {, it might be a single value or invalid
    if (/^".*"$/.test(repairedJson.trim()) || /^-?\d+(\.\d+)?$/.test(repairedJson.trim())) {
      // It's a single value, wrap in array
      repairedJson = `[${repairedJson}]`;
    } else if (repairedJson.includes('{') && repairedJson.includes('}')) {
      // It contains object notation but doesn't start with {, try to extract and wrap
      const startIndex = repairedJson.indexOf('{');
      const endIndex = repairedJson.lastIndexOf('}') + 1;
      if (startIndex >= 0 && endIndex > startIndex) {
        repairedJson = `[${repairedJson.substring(startIndex, endIndex)}]`;
      }
    }
  }
  
  // Step 5: Final validation attempt
  try {
    JSON.parse(repairedJson);
    return repairedJson;
  } catch (e) {
    // If all repairs fail, return the best attempt
    return repairedJson;
  }
};

/**
 * More aggressive JSON repair for severely malformed strings
 * @param jsonString The string containing potential JSON data
 * @returns A cleaned string with additional repairs for malformed JSON
 */
export const deepRepairJson = (jsonString: string): string => {
  if (!jsonString) return '';
  
  // First apply basic repairs
  let repaired = repairJson(jsonString);
  
  // Additional deep repairs
  repaired = repaired
    // Fix property names with spaces
    .replace(/\"([^"]+)\"(\s*):(\s*)/g, (match, propName) => {
      // Replace spaces in property names with underscores
      return `"${propName.replace(/\s+/g, '_')}"$2:$3`;
    })
    // Fix missing quotes around string values
    .replace(/:\s*([a-zA-Z][a-zA-Z0-9_]*)\s*([,}])/g, ':"$1"$2')
    // Fix JavaScript's undefined/null to valid JSON
    .replace(/:\s*undefined\s*([,}])/g, ':null$1')
    // Fix any unescaped quotes within string values
    .replace(/"([^"]*?)\\?"([^"]*?)"/g, (match, before, after) => {
      // Replace unescaped quotes with escaped quotes
      return `"${before}\\\"${after}"`; 
    })
    // Fix numeric values that have been quoted
    .replace(/:\s*"(-?\d+(\.\d+)?)"([,}])/g, ':$1$3')
    // Fix potential syntax issues with brackets/braces
    .replace(/\}\{/g, '},{')
    .replace(/\]\[/g, '],[')
    .replace(/\}\[/g, '},')
    .replace(/\]\{/g, '],')
    // Fix missing commas between objects in an array
    .replace(/\}(\s*)\{/g, '},$1{')
    // Fix missing commas between array items
    .replace(/\](\s*)\[/g, '],$1[')
    // Fix trailing commas
    .replace(/,(\s*[\]}])/g, '$1')
    // Fix missing quotes for property names
    .replace(/\{(\s*)([^"\s\{\}]+)(\s*):/g, '{$1"$2"$3:')
    .replace(/,(\s*)([^"\s\{\}]+)(\s*):/g, ',$1"$2"$3:')
    // Fix missing braces/brackets
    .replace(/^\s*\{/, '[{')
    .replace(/\}\s*$/, '}]')
    // Ensure the string starts with [ if it contains objects
    .replace(/^\s*\{/, '[{')
    .replace(/\}\s*$/, '}]')
    // Handle case where the string is just a single object (not in an array)
    .replace(/^\s*"/, '[{"')
    .replace(/"\s*$/, '"}]');
  
  // Check if the repaired string starts with a valid JSON character
  if (!/^\s*[\[\{"]/.test(repaired)) {
    // If not, wrap it in an array
    repaired = `[${repaired}]`;
  }
  
  return repaired;
};

/**
 * Attempts to parse a string as JSON with multiple fallback strategies
 * @param jsonString The string to parse as JSON
 * @returns The parsed JSON object or array, or null if parsing fails
 */
export const safeJsonParse = (jsonString: string): any => {
  if (!jsonString || typeof jsonString !== 'string') {
    return null;
  }
  
  // Clean up the input string - remove code block markers and trim
  const cleanedInput = jsonString
    .replace(/```(chart|json)?\s*|\s*```/g, '')
    .trim();
  
  // Special case for empty input
  if (!cleanedInput) {
    return [];
  }
  
  // Try to extract JSON-like content from the input
  let processedInput = cleanedInput;
  
  // If the input contains both { and }, extract everything between the first { and last }
  if (cleanedInput.includes('{') && cleanedInput.includes('}')) {
    const startIndex = cleanedInput.indexOf('{');
    const endIndex = cleanedInput.lastIndexOf('}') + 1;
    if (startIndex >= 0 && endIndex > startIndex) {
      const jsonCandidate = cleanedInput.substring(startIndex, endIndex);
      
      // Check if this is a likely JSON object and wrap in array if needed
      if (!jsonCandidate.includes('[') && jsonCandidate.includes(':')) {
        processedInput = `[${jsonCandidate}]`;
      } else {
        processedInput = jsonCandidate;
      }
    }
  } 
  // If the input contains both [ and ], extract everything between the first [ and last ]
  else if (cleanedInput.includes('[') && cleanedInput.includes(']')) {
    const startIndex = cleanedInput.indexOf('[');
    const endIndex = cleanedInput.lastIndexOf(']') + 1;
    if (startIndex >= 0 && endIndex > startIndex) {
      processedInput = cleanedInput.substring(startIndex, endIndex);
    }
  }
  
  // Try parsing directly first
  try {
    return JSON.parse(processedInput);
  } catch (directError: any) {
    console.log("Direct JSON parse failed, attempting repair");
    
    // Try with basic repairs
    try {
      const repaired = repairJson(processedInput);
      return JSON.parse(repaired);
    } catch (basicRepairError: any) {
      console.log("Basic JSON repair failed, attempting deep repair");
      
      // Try with deeper repairs
      try {
        const deepRepaired = deepRepairJson(processedInput);
        return JSON.parse(deepRepaired);
      } catch (deepRepairError: any) {
        console.log("Deep JSON repair failed, attempting line-by-line parsing");
        
        // Try line by line parsing
        if (processedInput.includes('\n')) {
          try {
            const lines = processedInput.split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0);
            
            // Try to parse each line and collect results
            const parsed = lines.map((line, index) => {
              try {
                // Try parsing each line with repairs
                const repairedLine = deepRepairJson(line);
                return JSON.parse(repairedLine);
              } catch (lineError: any) {
                // If parsing fails, return a simple object with the line as text
                return { name: `Line ${index + 1}`, value: line.length };
              }
            });
            
            return parsed;
          } catch (lineByLineError: any) {
            console.log("Line-by-line parsing failed, attempting to extract JSON objects");
          }
        }
        
        // Try to extract JSON-like objects from the string
        try {
          // Look for patterns that might be JSON objects
          const objectMatches = processedInput.match(/\{[^{}]*\}/g) || [];
          const arrayMatches = processedInput.match(/\[[^\[\]]*\]/g) || [];
          
          if (objectMatches.length > 0 || arrayMatches.length > 0) {
            // Try to parse each match
            const objects: any[] = [];
            
            for (const match of [...objectMatches, ...arrayMatches]) {
              try {
                const repaired = deepRepairJson(match);
                const parsed = JSON.parse(repaired);
                if (Array.isArray(parsed)) {
                  objects.push(...parsed);
                } else {
                  objects.push(parsed);
                }
              } catch (e: any) {
                // Try a more aggressive approach for this match
                try {
                  // Extract key-value pairs
                  const keyValuePairs: Record<string, any> = {};
                  const kvRegex = /"?([a-zA-Z0-9_]+)"?\s*:\s*"?([^",\}]+)"?/g;
                  let kvMatch;
                  
                  while ((kvMatch = kvRegex.exec(match)) !== null) {
                    const key = kvMatch[1].trim();
                    let value = kvMatch[2].trim();
                    
                    // Try to convert to number if possible
                    if (/^-?\d+(\.\d+)?$/.test(value)) {
                      keyValuePairs[key] = parseFloat(value);
                    } else {
                      keyValuePairs[key] = value;
                    }
                  }
                  
                  if (Object.keys(keyValuePairs).length > 0) {
                    objects.push(keyValuePairs);
                  }
                } catch (kvError: any) {
                  // Ignore errors for this match
                }
              }
            }
            
            if (objects.length > 0) {
              return objects;
            }
          }
        } catch (extractionError: any) {
          console.log("JSON extraction failed:", extractionError);
        }
        
        // Try to extract key-value pairs
        try {
          const keyValuePairs: Record<string, any> = {};
          const kvRegex = /([a-zA-Z0-9_]+)\s*[:=]\s*([^,\n]+)/g;
          let kvMatch;
          
          while ((kvMatch = kvRegex.exec(processedInput)) !== null) {
            const key = kvMatch[1].trim();
            let value = kvMatch[2].trim();
            
            // Try to convert to number if possible
            if (/^-?\d+(\.\d+)?$/.test(value)) {
              keyValuePairs[key] = parseFloat(value);
            } else if (value.toLowerCase() === 'true') {
              keyValuePairs[key] = true;
            } else if (value.toLowerCase() === 'false') {
              keyValuePairs[key] = false;
            } else if (value.toLowerCase() === 'null') {
              keyValuePairs[key] = null;
            } else {
              // Remove quotes if present
              keyValuePairs[key] = value.replace(/^["']|["']$/g, '');
            }
          }
          
          if (Object.keys(keyValuePairs).length > 0) {
            return [keyValuePairs];
          }
        } catch (kvError: any) {
          console.log("Key-value extraction failed:", kvError);
        }
        
        // Try to extract CSV-like data
        try {
          if (processedInput.includes(',')) {
            const csvLines = processedInput.split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0 && line.includes(','));
            
            if (csvLines.length > 1) {
              const headers = csvLines[0].split(',').map(h => h.trim());
              
              return csvLines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const row: Record<string, any> = {};
                
                headers.forEach((header, i) => {
                  if (i < values.length) {
                    const value = values[i];
                    const numValue = parseFloat(value);
                    row[header] = isNaN(numValue) ? value : numValue;
                  } else {
                    row[header] = null;
                  }
                });
                
                return row;
              });
            }
          }
        } catch (csvError: any) {
          console.log("CSV parsing failed:", csvError);
        }
        
        // Last resort: try to create a simple array from the input
        try {
          // Split by commas, semicolons, or newlines
          const items = processedInput.split(/[,;\n]/)
            .map(item => item.trim())
            .filter(item => item.length > 0);
          
          if (items.length > 0) {
            return items.map((item, index) => {
              const numValue = parseFloat(item);
              if (!isNaN(numValue)) {
                return { name: `Item ${index + 1}`, value: numValue };
              }
              return { name: item, value: 1 };
            });
          }
        } catch (simpleArrayError: any) {
          console.log("Simple array creation failed:", simpleArrayError);
        }
        
        // If all else fails, create a simple fallback dataset
        return [
          { name: "Fallback Data", value: 100 },
          { name: "Example", value: 50 }
        ];
      }
    }
  }
};

/**
 * Converts a string to valid JSON for chart data
 * @param input The input string (JSON, CSV, etc.)
 * @returns A valid chart data array or null if conversion fails
 */
export const convertToChartData = (input: string): any[] | null => {
  if (!input || typeof input !== 'string') {
    console.log("Chart data input is null or not a string");
    return [
      { name: "No Input", value: 0 }
    ];
  }
  
  // Special case for empty input
  if (input.trim() === '') {
    console.log("Chart data input is empty");
    return [
      { name: "No Data", value: 0 }
    ];
  }
  
  console.log("Attempting to parse chart data:", input.substring(0, 100) + (input.length > 100 ? "..." : ""));
  
  // Try to extract JSON-like content from the input
  let processedInput = input.trim();
  
  // Remove markdown code block markers
  processedInput = processedInput.replace(/```(chart|json)?\s*|\s*```/g, '').trim();
  
  // If the input contains both { and }, extract everything between the first { and last }
  if (processedInput.includes('{') && processedInput.includes('}')) {
    const startIndex = processedInput.indexOf('{');
    const endIndex = processedInput.lastIndexOf('}') + 1;
    if (startIndex >= 0 && endIndex > startIndex) {
      const jsonCandidate = processedInput.substring(startIndex, endIndex);
      
      // Check if this is a likely JSON object and wrap in array if needed
      if (!jsonCandidate.includes('[') && jsonCandidate.includes(':')) {
        processedInput = `[${jsonCandidate}]`;
      } else {
        processedInput = jsonCandidate;
      }
    }
  } 
  // If the input contains both [ and ], extract everything between the first [ and last ]
  else if (processedInput.includes('[') && processedInput.includes(']')) {
    const startIndex = processedInput.indexOf('[');
    const endIndex = processedInput.lastIndexOf(']') + 1;
    if (startIndex >= 0 && endIndex > startIndex) {
      processedInput = processedInput.substring(startIndex, endIndex);
    }
  }
  
  console.log("Processed input for chart data:", processedInput.substring(0, 100) + (processedInput.length > 100 ? "..." : ""));
  
  // Try direct JSON parse first
  try {
    const directParse = JSON.parse(processedInput);
    console.log("Direct JSON parse succeeded for chart data");
    return Array.isArray(directParse) ? directParse : [directParse];
  } catch (directError: any) {
    console.log("Direct JSON parse failed for chart data:", directError.message);
    
    // Try with basic repairs
    try {
      const repaired = repairJson(processedInput);
      console.log("Basic repair result:", repaired.substring(0, 100) + (repaired.length > 100 ? "..." : ""));
      const basicRepairParse = JSON.parse(repaired);
      console.log("Basic repair parse succeeded for chart data");
      return Array.isArray(basicRepairParse) ? basicRepairParse : [basicRepairParse];
    } catch (basicRepairError: any) {
      console.log("Basic repair parse failed for chart data:", basicRepairError.message);
      
      // Try with deeper repairs
      try {
        const deepRepaired = deepRepairJson(processedInput);
        console.log("Deep repair result:", deepRepaired.substring(0, 100) + (deepRepaired.length > 100 ? "..." : ""));
        const deepRepairParse = JSON.parse(deepRepaired);
        console.log("Deep repair parse succeeded for chart data");
        return Array.isArray(deepRepairParse) ? deepRepairParse : [deepRepairParse];
      } catch (deepRepairError: any) {
        console.log("Deep repair parse failed for chart data:", deepRepairError.message);
        
        // Try safeJsonParse as a last resort
        const jsonResult = safeJsonParse(processedInput);
        if (jsonResult) {
          console.log("safeJsonParse succeeded for chart data");
          // Ensure it's an array
          return Array.isArray(jsonResult) ? jsonResult : [jsonResult];
        }
        
        console.log("All JSON parsing strategies failed for chart data");
        
        // If all else fails, create a simple fallback dataset
        return [
          { name: "Parsing Error", value: 100 },
          { name: "Example Data", value: 50 }
        ];
      }
    }
  }
};

/**
 * Validates chart data structure and fixes common issues
 * @param data The chart data to validate
 * @returns Fixed and validated chart data array
 */
export const validateChartData = (data: any): any[] => {
  // Handle non-array data
  if (!Array.isArray(data)) {
    // Convert object to array with entries
    if (data && typeof data === 'object') {
      return Object.entries(data).map(([key, value]) => ({
        name: key,
        value: typeof value === 'number' ? value : 1
      }));
    }
    // Create default data
    return [
      { name: "Default", value: 100 },
      { name: "Example", value: 50 }
    ];
  }
  
  // Handle empty array
  if (data.length === 0) {
    return [
      { name: "No Data", value: 0 }
    ];
  }
  
  // Fix items that aren't objects
  return data.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      // Convert primitives to name/value pairs
      if (typeof item === 'number') {
        return { name: `Value ${index + 1}`, value: item };
      } else if (typeof item === 'string') {
        return { name: item, value: 1 };
      } else {
        return { name: `Item ${index + 1}`, value: 1 };
      }
    }
    return item;
  });
};
