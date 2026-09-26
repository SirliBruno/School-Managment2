export interface WhatsAppMessagePayload {
  recipientPhone: string;
  templateName?: string;
  variables?: Record<string, string>;
  customText?: string;
}

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  directUrl?: string;
  error?: string;
}

export interface IWhatsAppService {
  buildDirectWhatsAppUrl(phone: string, text: string): string;
  sendMessage(payload: WhatsAppMessagePayload): Promise<WhatsAppSendResult>;
}

export class WhatsAppService implements IWhatsAppService {
  buildDirectWhatsAppUrl(phone: string, text: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(text);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }

  async sendMessage(payload: WhatsAppMessagePayload): Promise<WhatsAppSendResult> {
    const text = payload.customText ?? "";
    const directUrl = this.buildDirectWhatsAppUrl(payload.recipientPhone, text);
    return {
      success: true,
      directUrl,
    };
  }
}

export const whatsappService = new WhatsAppService();
