import { describe, it, expect } from "vitest";
import { whatsappService } from "@/services/whatsappService";

describe("WhatsAppService", () => {
  it("builds correct direct wa.me link with encoded text", () => {
    const phone = "+966512345678";
    const text = "السلام عليكم، تم رصد غياب اليوم";
    const url = whatsappService.buildDirectWhatsAppUrl(phone, text);

    expect(url).toContain("https://wa.me/966512345678?text=");
    expect(url).toContain(encodeURIComponent(text));
  });

  it("sends message payload returning directUrl and success true", async () => {
    const payload = {
      recipientPhone: "0555555555",
      customText: "إشعار تأخر إداري",
    };

    const result = await whatsappService.sendMessage(payload);
    expect(result.success).toBe(true);
    expect(result.directUrl).toBeDefined();
    expect(result.directUrl).toContain("https://wa.me/0555555555");
  });
});
