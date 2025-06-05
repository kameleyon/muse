// Local font loader for jsPDF - uses pre-downloaded TTF files
import { jsPDF } from 'jspdf';

// Map of available fonts and their files
const AVAILABLE_FONTS: Record<string, {
  normal?: string;
  bold?: string;
  italic?: string;
  bolditalic?: string;
}> = {
  'roboto': {
    normal: '/fonts/Roboto-Regular.ttf',
    bold: '/fonts/Roboto-Bold.ttf',
  },
  'lora': {
    normal: '/fonts/Lora-Regular.ttf',
    bold: '/fonts/Lora-Bold.ttf',
  },
  'open sans': {
    normal: '/fonts/OpenSans-Regular.ttf',
    bold: '/fonts/OpenSans-Bold.ttf',
  },
  'montserrat': {
    normal: '/fonts/Montserrat-Regular.ttf',
    bold: '/fonts/Montserrat-Bold.ttf',
  },
  'merriweather': {
    normal: '/fonts/Merriweather-Regular.ttf',
    bold: '/fonts/Merriweather-Bold.ttf',
  },
  'playfair display': {
    normal: '/fonts/PlayfairDisplay-Regular.ttf',
    bold: '/fonts/PlayfairDisplay-Bold.ttf',
  },
  'raleway': {
    normal: '/fonts/Raleway-Regular.ttf',
    bold: '/fonts/Raleway-Bold.ttf',
  },
  'poppins': {
    normal: '/fonts/Poppins-Regular.ttf',
    bold: '/fonts/Poppins-Bold.ttf',
  }
};

/**
 * Loads a local TTF font file and converts to base64
 */
async function loadLocalFontFile(fontPath: string): Promise<string | null> {
  try {
    const response = await fetch(fontPath);
    if (!response.ok) {
      console.warn(`Font file not found: ${fontPath}`);
      return null;
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    
    // Convert to base64
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return btoa(binary);
  } catch (error) {
    console.error(`Error loading font file ${fontPath}:`, error);
    return null;
  }
}

/**
 * Registers a local font with jsPDF
 */
export async function registerLocalFont(
  pdf: jsPDF,
  fontName: string,
  weight: 'normal' | 'bold' = 'normal'
): Promise<boolean> {
  const fontConfig = AVAILABLE_FONTS[fontName.toLowerCase()];
  
  if (!fontConfig) {
    console.warn(`Font "${fontName}" is not available locally`);
    return false;
  }
  
  const fontPath = fontConfig[weight];
  if (!fontPath) {
    console.warn(`Font "${fontName}" does not have ${weight} variant`);
    return false;
  }
  
  try {
    const base64Data = await loadLocalFontFile(fontPath);
    if (!base64Data) {
      return false;
    }
    
    // Create a clean filename
    const sanitizedName = fontName.replace(/\s+/g, '');
    const fileName = `${sanitizedName}-${weight}.ttf`;
    
    // Add to jsPDF virtual file system
    pdf.addFileToVFS(fileName, base64Data);
    
    // Register with jsPDF
    const fontFamily = fontName.toLowerCase().replace(/\s+/g, '');
    pdf.addFont(fileName, fontFamily, weight);
    
    console.log(`✅ Registered local font: ${fontFamily} (${weight})`);
    return true;
    
  } catch (error) {
    console.error(`Failed to register font ${fontName}:`, error);
    return false;
  }
}

/**
 * Loads fonts for PDF generation using local TTF files
 */
export async function loadFontsForPdf(
  pdf: jsPDF,
  primaryFontName: string,
  secondaryFontName?: string
): Promise<{
  primaryFont: string;
  secondaryFont?: string;
}> {
  console.log(`Loading fonts from local TTF files...`);
  
  // Load primary font
  const primaryFontKey = primaryFontName.toLowerCase().replace(/\s+/g, '');
  let primaryLoaded = false;
  
  // Try to load both normal and bold weights
  const primaryNormal = await registerLocalFont(pdf, primaryFontName, 'normal');
  const primaryBold = await registerLocalFont(pdf, primaryFontName, 'bold');
  
  primaryLoaded = primaryNormal || primaryBold;
  
  if (!primaryLoaded) {
    console.error(`Primary font "${primaryFontName}" could not be loaded`);
    throw new Error(`Font "${primaryFontName}" is not available. Please ensure the TTF file is in /public/fonts/`);
  }
  
  // Load secondary font if specified
  let secondaryFontKey: string | undefined;
  if (secondaryFontName) {
    secondaryFontKey = secondaryFontName.toLowerCase().replace(/\s+/g, '');
    
    const secondaryNormal = await registerLocalFont(pdf, secondaryFontName, 'normal');
    const secondaryBold = await registerLocalFont(pdf, secondaryFontName, 'bold');
    
    if (!secondaryNormal && !secondaryBold) {
      console.warn(`Secondary font "${secondaryFontName}" could not be loaded`);
      secondaryFontKey = undefined;
    }
  }
  
  return {
    primaryFont: primaryFontKey,
    secondaryFont: secondaryFontKey
  };
}

/**
 * Check if a font is available locally
 */
export function isFontAvailable(fontName: string): boolean {
  return fontName.toLowerCase() in AVAILABLE_FONTS;
}

/**
 * Get list of available fonts
 */
export function getAvailableFonts(): string[] {
  return Object.keys(AVAILABLE_FONTS);
}