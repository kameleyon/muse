# Font Installation Guide

To use custom fonts in PDF generation, you need to download the TTF files and place them in this directory.

## Required Fonts

Download the following fonts from Google Fonts and save them with these exact filenames:

### Roboto
- `Roboto-Regular.ttf` - [Download Roboto](https://fonts.google.com/specimen/Roboto)
- `Roboto-Bold.ttf`

### Lora
- `Lora-Regular.ttf` - [Download Lora](https://fonts.google.com/specimen/Lora)
- `Lora-Bold.ttf`

### Open Sans
- `OpenSans-Regular.ttf` - [Download Open Sans](https://fonts.google.com/specimen/Open+Sans)
- `OpenSans-Bold.ttf`

### Montserrat
- `Montserrat-Regular.ttf` - [Download Montserrat](https://fonts.google.com/specimen/Montserrat)
- `Montserrat-Bold.ttf`

### Merriweather
- `Merriweather-Regular.ttf` - [Download Merriweather](https://fonts.google.com/specimen/Merriweather)
- `Merriweather-Bold.ttf`

### Playfair Display
- `PlayfairDisplay-Regular.ttf` - [Download Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- `PlayfairDisplay-Bold.ttf`

### Raleway
- `Raleway-Regular.ttf` - [Download Raleway](https://fonts.google.com/specimen/Raleway)
- `Raleway-Bold.ttf`

### Poppins
- `Poppins-Regular.ttf` - [Download Poppins](https://fonts.google.com/specimen/Poppins)
- `Poppins-Bold.ttf`

## How to Download

1. Click on the font link above
2. Click "Download family" button
3. Extract the ZIP file
4. Find the Regular and Bold .ttf files
5. Rename them to match the filenames above
6. Copy them to this `/public/fonts/` directory

## Important Notes

- Only TTF files are supported (not OTF, WOFF, or WOFF2)
- File names must match exactly as listed above
- The system will automatically fall back to built-in fonts if TTF files are not found
- Google Fonts will still be loaded in the browser for display consistency