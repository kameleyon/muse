export function cleanJsonResponse(response: string): any {
  try {
    // Attempt 1: Direct JSON parse
    return JSON.parse(response);
  } catch (e1) {
    try {
      // Attempt 2: Extract JSON from markdown code blocks
      const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1].trim());
      }
      throw new Error('No JSON code block found');
    } catch (e2) {
      throw new Error('Failed to parse AI response as JSON after attempting to clean it.');
    }
  }
}
