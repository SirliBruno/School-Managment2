import { deductionDecisionsRepository, IDeductionDecisionsRepository } from "@/repositories/deductionDecisionsRepository";
import type { DeductionDecision } from "@/types/database";

export interface CalculateDeductionParams {
  teacherId: string;
  absenceRecordIds: string[];
  delayNoticeIds?: string[];
  effectiveDate: string;
}

export interface DeductionCalculationResult {
  daysToDeduct: number;
  estimatedAmount?: number;
  reason: string;
}

export interface IDeductionService {
  calculateDeductions(params: CalculateDeductionParams): Promise<DeductionCalculationResult>;
  createDeductionDecision(params: CalculateDeductionParams): Promise<DeductionDecision>;
}

export class DeductionService implements IDeductionService {
  constructor(
    private readonly repo: IDeductionDecisionsRepository = deductionDecisionsRepository
  ) {}

  async calculateDeductions(_params: CalculateDeductionParams): Promise<DeductionCalculationResult> {
    // Architecture scaffold: Business logic to be implemented in respective sprint
    return {
      daysToDeduct: 0,
      reason: "مسودة حسم قيد التدقيق",
    };
  }

  async createDeductionDecision(_params: CalculateDeductionParams): Promise<DeductionDecision> {
    // Architecture scaffold: Business logic to be implemented in respective sprint
    throw new Error("DeductionService.createDeductionDecision: Business logic not implemented in Sprint 0.");
  }
}

export const deductionService = new DeductionService();
