export interface PrintDocumentConfig {
  title: string;
  documentNumber?: string;
  orientation?: "portrait" | "landscape";
  contentElementId?: string;
}

export interface IPdfPrintService {
  printElement(elementId: string): void;
  exportToPdf(elementId: string, filename: string): Promise<void>;
}

export class PdfPrintService implements IPdfPrintService {
  printElement(elementId: string): void {
    if (typeof window === "undefined") return;

    const el = document.getElementById(elementId);
    if (!el) {
      console.warn(`PdfPrintService.printElement: element with id "${elementId}" not found`);
      return;
    }

    window.print();
  }

  async exportToPdf(_elementId: string, _filename: string): Promise<void> {
    // Architecture scaffold: PDF generator integration in future sprint
    if (typeof window !== "undefined") {
      window.print();
    }
  }
}

export const pdfPrintService = new PdfPrintService();
