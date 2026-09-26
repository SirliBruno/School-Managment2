export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  mimeType?: string;
}

export interface IImageCompressionService {
  compressImage(file: File, options?: CompressionOptions): Promise<Blob>;
}

export class ImageCompressionService implements IImageCompressionService {
  async compressImage(file: File, options: CompressionOptions = {}): Promise<Blob> {
    const { maxWidth = 1600, maxHeight = 1600, quality = 0.8, mimeType = "image/jpeg" } = options;

    if (typeof window === "undefined") {
      // In server/node test environment, return original buffer as Blob
      return file;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          mimeType,
          quality
        );
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error(`Failed to load image for compression: ${err}`));
      };

      img.src = objectUrl;
    });
  }
}

export const imageCompressionService = new ImageCompressionService();
