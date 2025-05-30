declare module 'pdf-lib' {
  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    static load(pdfBytes: Uint8Array): Promise<PDFDocument>;
    copyPages(srcDoc: PDFDocument, indices: number[]): Promise<PDFPage[]>;
    addPage(page?: PDFPage): PDFPage;
    insertPage(index: number, page?: PDFPage): PDFPage;
    getPages(): PDFPage[];
    getPageCount(): number;
    save(): Promise<Uint8Array>;
  }

  export interface PDFPage {
    // Basic PDFPage interface
  }
}