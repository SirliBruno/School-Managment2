import { delayNoticesRepository, IDelayNoticesRepository } from "@/repositories/delayNoticesRepository";
import type { DelayNotice } from "@/types/database";

export interface LogDelayParams {
  teacherId: string;
  delayDate: string;
  delayMinutes: number;
  notes?: string;
}

export interface IDelayNoticeService {
  recordDelay(params: LogDelayParams): Promise<DelayNotice>;
  getAccumulatedDelayMinutes(teacherId: string, startDate?: string, endDate?: string): Promise<number>;
}

export class DelayNoticeService implements IDelayNoticeService {
  constructor(
    private readonly repo: IDelayNoticesRepository = delayNoticesRepository
  ) {}

  async recordDelay(_params: LogDelayParams): Promise<DelayNotice> {
    // Architecture scaffold: Business logic to be implemented in respective sprint
    throw new Error("DelayNoticeService.recordDelay: Business logic not implemented in Sprint 0.");
  }

  async getAccumulatedDelayMinutes(_teacherId: string, _startDate?: string, _endDate?: string): Promise<number> {
    // Architecture scaffold: Business logic to be implemented in respective sprint
    return 0;
  }
}

export const delayNoticeService = new DelayNoticeService();
