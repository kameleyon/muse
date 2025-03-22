# MagicMuse.io Logo Versions

This document outlines the specifications for creating the secondary and dark mode logo versions based on the existing primary logo.

## Current Logo Assets

After reviewing the existing logo files in the `/public` directory, we have identified:

- `mmiologo.png`: Primary logo version (Gold/amber with navy text)
- `mmio.png`: Alternate version of the logo with different proportions
- `mmlogo.png`: Additional logo variant
- `favicon.ico.png`: Icon version for favicon and small applications

## Logo Versions to Create

### 1. Secondary Logo Version (Teal)

Based on the brand guidelines, we need to create a secondary logo version with the following specifications:

- **Base Design**: Use the same design as `mmiologo.png`
- **Color Scheme**: Replace gold/amber (#F2B705) elements with teal (#00A6A6)
- **Text Color**: Maintain navy (#2D3142) text color
- **Usage**: Alternative applications where the primary color scheme is not optimal
- **File Name**: `mmiologo_teal.png`

### 2. Dark Mode Logo Version

Based on the brand guidelines, we need to create a dark mode version with the following specifications:

- **Base Design**: Use the same design as `mmiologo.png`
- **Color Scheme**: Convert gold/amber elements to off-white (#F9F9F9)
- **Text Color**: Convert navy text to off-white (#F9F9F9)
- **Background**: Transparent (for placement on navy background)
- **Usage**: Applications on dark backgrounds (dark mode interfaces, dark presentations)
- **File Name**: `mmiologo_dark.png`

## Implementation Instructions for Design Team

1. Open the primary logo file (`mmiologo.png`) in Adobe Illustrator or similar vector editing software
2. Create two copies of the file for the secondary and dark mode versions
3. For the secondary (teal) version:
   - Identify all gold/amber elements and replace with teal (#00A6A6)
   - Maintain the navy text color
   - Export as PNG with transparency at multiple resolutions (1x, 2x, 3x)
4. For the dark mode version:
   - Convert all elements to off-white (#F9F9F9)
   - Export as PNG with transparency at multiple resolutions (1x, 2x, 3x)
5. Save the files to the `/public` directory with appropriate naming
6. Update the brand asset register with the new files

## Usage Guidelines

### Secondary (Teal) Logo
- Use when the primary gold/amber version would clash with surrounding design elements
- Appropriate for cooler color schemes where gold might not integrate well
- Suitable for partnership contexts where the primary color might conflict with partner branding

### Dark Mode Logo
- Use exclusively on dark backgrounds (navy, deep grey, or black)
- Default logo for dark mode UI
- Appropriate for dark-themed presentations or marketing materials

## Technical Specifications

Both new logo versions should be created and saved with the following specifications:

- **Format**: PNG with transparency
- **Color Profile**: sRGB
- **Resolution**: 
  - Standard: 600px width (with proportional height)
  - High-res (2x): 1200px width (with proportional height)
- **Quality**: High-quality compression (optimized for web)

## Implementation Timeline

- Design completion: March 25, 2025
- Review and approval: March 26, 2025
- Implementation in codebase: March 27, 2025
