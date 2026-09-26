import { inquiriesRepository, IInquiriesRepository } from "@/repositories/inquiriesRepository";
import type { Inquiry } from "@/types/database";

export interface CreateInquiryParams {
  teacherId: string;
  recordId?: string;
  subject: string;
  body: string;
}

export interface SubmitResponseParams {
  inquiryId: string;
  responseText: string;
}

export interface IInquiryService {
  issueInquiry(params: CreateInquiryParams): Promise<Inquiry>;
  submitTeacherResponse(params: SubmitResponseParams): Promise<Inquiry>;
  closeInquiry(inquiryId: string): Promise<Inquiry>;
}

export class InquiryService implements IDequiryService {
  constructor(
    private readonly repo: IInquiriesRepository = inquiriesRepository
  ) {}

  async issueInquiry(_params: CreateInquiryParams): Promise<Inquiry> {
    // Architecture scaffold: Business logic to be implemented in respective sprint
    throw new Error("InquiryService.issueInquiry: Business logic not implemented in Sprint 0.");
  }

  async submitTeacherResponse(_params: SubmitResponseParams): Promise<Inquiry> {
    // Architecture scaffold: Business logic to be implemented in respective sprint
    throw new Error("InquiryService.submitTeacherResponse: Business logic not implemented in Sprint 0.");
  }

  async closeInquiry(_inquiryId: string): Promise<Inquiry> {
    // Architecture scaffold: Business logic to be implemented in respective sprint
    throw new Error("InquiryService.closeInquiry: Business logic not implemented in Sprint 0.");
  }
}

type IDequiryService = IInquiryService;

export const inquiryService = new InquiryService();
