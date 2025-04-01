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
  
  return jsonString
    .replace(/'/g, '"') // Replace single quotes with double quotes
    .replace(/(\w+)(?=\s*:)/g, '"$1"') // Add quotes to property names
    .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
    .replace(/\s*\n+\s*/g, ' ') // Normalize whitespace
    .trim();
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
    .replace(/\]\{/g, '],');
  
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
  
  // Try parsing directly first
  try {
    return JSON.parse(jsonString);
  } catch (directError) {
    console.log("Direct JSON parse failed, attempting repair");
    
    // Try with basic repairs
    try {
      const repaired = repairJson(jsonString);
      return JSON.parse(repaired);
    } catch (basicRepairError) {
      console.log("Basic JSON repair failed, attempting deep repair");
      
      // Try with deeper repairs
      try {
        const deepRepaired = deepRepairJson(jsonString);
        return JSON.parse(deepRepaired);
      } catch (deepRepairError) {
        console.log("Deep JSON repair failed, attempting line-by-line parsing");
        
        // Try line by line parsing as last resort
        if (jsonString.includes('\n')) {
          try {
            const lines = jsonString.split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0);
            
            // Try to parse each line and collect results
            const parsed = lines.map((line, index) => {
              try {
                // Try parsing each line with repairs
                const repairedLine = deepRepairJson(line);
                return JSON.parse(repairedLine);
              } catch (lineError) {
                // If parsing fails, return a simple object with the line as text
                return { name: `Line ${index + 1}`, value: line.length };
              }
            });
            
            return parsed;
          } catch (lineByLineError) {
            console.error("All JSON parsing strategies failed");
            return null;
          }
        }
        
        // If we reach here, nothing worked
        console.error("All JSON parsing strategies failed");
        return null;
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
    return null;
  }
  
  // First, try to handle common cases where AI-generated chart data might be malformed
  let processedInput = input;
  
  // Look for patterns indicating chart data and clean up surrounding text
  if (input.includes('{') && input.includes('}')) {
    // Extract everything between the first { and last }
    const startIndex = input.indexOf('{');
    const endIndex = input.lastIndexOf('}') + 1;
    if (startIndex >= 0 && endIndex > startIndex) {
      const jsonCandidate = input.substring(startIndex, endIndex);
      
      // Check if this is a likely JSON object and wrap in array if needed
      if (!jsonCandidate.includes('[') && jsonCandidate.includes(':')) {
        processedInput = `[${jsonCandidate}]`;
      } else {
        processedInput = jsonCandidate;
      }
    }
  } else if (input.includes('[') && input.includes(']')) {
    // Extract everything between the first [ and last ]
    const startIndex = input.indexOf('[');
    const endIndex = input.lastIndexOf(']') + 1;
    if (startIndex >= 0 && endIndex > startIndex) {
      processedInput = input.substring(startIndex, endIndex);
    }
  }
  
  // Try the repaired string first
  let repairedInput = deepRepairJson(processedInput);
  
  // Try JSON parsing with all fallbacks
  const jsonResult = safeJsonParse(repairedInput);
  if (jsonResult) {
    // Ensure it's an array
    return Array.isArray(jsonResult) ? jsonResult : [jsonResult];
  }
  
  // Second attempt with line-by-line parsing
  try {
    const lines = processedInput.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
    
    // Try to extract JSON objects from each line
    const objects: any[] = [];
    for (const line of lines) {
      // Look for JSON-like content in the line
      if (line.includes('{') && line.includes('}')) {
        try {
          const match = line.match(/\{[^}]*\}/);
          if (match) {
            const fixed = deepRepairJson(match[0]);
            const parsed = JSON.parse(fixed);
            objects.push(parsed);
          }
        } catch (e) {
          // Ignore parsing errors for individual lines
        }
      }
    }
    
    if (objects.length > 0) {
      return objects;
    }
  } catch (lineError) {
    console.error("Line-by-line parsing failed:", lineError);
  }
  
  // Try as CSV if JSON parsing fails
  try {
    if (input.includes(',')) {
      const lines = input.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      
      if (lines.length > 0) {
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Process remaining lines as data
        if (lines.length > 1) {
          return lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const row: Record<string, any> = {};
            
            headers.forEach((header, i) => {
              if (i < values.length) {
                // Try to convert numeric values
                const value = values[i];
                const numValue = parseFloat(value);
                row[header] = isNaN(numValue) ? value : numValue;
              } else {
                // Handle missing values
                row[header] = null;
              }
            });
            
            return row;
          });
        }
      }
    }
  } catch (csvError) {
    console.error("CSV parsing failed:", csvError);
  }
  
  // Try extracting key-value pairs as a last resort
  try {
    const keyValuePattern = /(\w+)\s*[:=]\s*([^,\n]+)/g;
    const matches = [...input.matchAll(keyValuePattern)];
    
    if (matches.length > 0) {
      const extractedObject: Record<string, any> = {};
      
      for (const match of matches) {
        const key = match[1].trim();
        let value = match[2].trim();
        
        // Try to convert to number if possible
        const numValue = parseFloat(value);
        extractedObject[key] = isNaN(numValue) ? value : numValue;
      }
      
      if (Object.keys(extractedObject).length > 0) {
        return [extractedObject];
      }
    }
  } catch (kvError) {
    console.error("Key-value extraction failed:", kvError);
  }
  
  // If all else fails, create a simple fallback dataset
  return [
    { name: "Fallback Data", value: 100 },
    { name: "Example", value: 50 }
  ];
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
