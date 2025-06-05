# Custom Helvetica Font Weights Setup for PDF Generation

## Overview
To implement custom font weights (300, 450, 600) for Helvetica in the PDF generation, you need to add custom font files to jsPDF.

## Required Font Files
1. **Helvetica Light (300)** - For normal text
2. **Helvetica Medium (450)** - For semibold text  
3. **Helvetica Semibold (600)** - For bold text

## Implementation Steps

### 1. Obtain Font Files
Get the following Helvetica font files:
- `Helvetica-Light.ttf` or `.otf`
- `Helvetica-Medium.ttf` or `.otf`
- `Helvetica-Semibold.ttf` or `.otf`

### 2. Convert Fonts to Base64
Use an online converter or Node.js script to convert each font file to base64:

```javascript
const fs = require('fs');

// Convert font to base64
const fontBuffer = fs.readFileSync('./fonts/Helvetica-Light.ttf');
const fontBase64 = fontBuffer.toString('base64');
fs.writeFileSync('./fonts/helvetica-light-base64.txt', fontBase64);
```

### 3. Create Font Module
Create a new file `src/components/project/bookselfimp/helvetica-fonts.ts`:

```typescript
// helvetica-fonts.ts
export const helveticaFonts = {
  light: 'BASE64_STRING_HERE',     // Weight 300
  medium: 'BASE64_STRING_HERE',    // Weight 450
  semibold: 'BASE64_STRING_HERE'   // Weight 600
};
```

### 4. Update BookPreviewPage.tsx
Import and add the fonts after creating the jsPDF instance:

```typescript
import { helveticaFonts } from './helvetica-fonts';

// After: const pdf = new jsPDF({...});

// Add custom fonts
pdf.addFileToVFS('Helvetica-Light.ttf', helveticaFonts.light);
pdf.addFont('Helvetica-Light.ttf', 'helvetica-light', 'normal');

pdf.addFileToVFS('Helvetica-Medium.ttf', helveticaFonts.medium);
pdf.addFont('Helvetica-Medium.ttf', 'helvetica-medium', 'normal');

pdf.addFileToVFS('Helvetica-Semibold.ttf', helveticaFonts.semibold);
pdf.addFont('Helvetica-Semibold.ttf', 'helvetica-semibold', 'normal');
```

### 5. Enable Custom Fonts
Update the font selection logic to use custom fonts:

```typescript
// In addText function, replace the fallback comments with:
if (options.bold) {
  pdf.setFont('helvetica-semibold', 'normal'); // Weight 600
} else if (options.semibold) {
  pdf.setFont('helvetica-medium', 'normal');   // Weight 450
} else {
  pdf.setFont('helvetica-light', 'normal');    // Weight 300
}
```

## Font Weight Mapping
- **Normal text**: Helvetica Light (300)
- **Semibold text**: Helvetica Medium (450)
- **Bold text**: Helvetica Semibold (600)

## Alternative: Using Web Fonts
If you can't obtain the font files, consider using Google Fonts or other web font services that provide Helvetica alternatives like:
- Helvetica Neue
- Arial (similar metrics)
- Roboto (with custom weights)

## Testing
After implementation, test the PDF generation to ensure:
1. All three font weights display correctly
2. Text remains properly aligned
3. Font fallbacks work if custom fonts fail to load