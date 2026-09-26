import { CompensationBreakdown } from "@/types";

export interface CalculationInput {
  marketValuePerHa: number;
  areaHa: number;
  ruralMultiplier?: number;
  assetsAndTreesValue?: number;
  solatiumPercentage?: number;
  interestMonths?: number;
  annualInterestRate?: number;
}

/**
 * RFCTLARR Act 2013 Statutory Compensation Formula
 * 1. Base Market Value = Area (Ha) * Market Value per Ha
 * 2. Multiplied Value = Base Market Value * Rural Multiplier (typically 1.25 to 2.0, default 1.5 in Maharashtra)
 * 3. Total Land + Assets = Multiplied Value + Assets/Structures/Trees
 * 4. Solatium (Section 30(1)) = 100% of (Total Land + Assets)
 * 5. Additional Amount (Section 30(3)) = 12% p.a. on Market Value from Notification to Award
 * 6. Total Statutory Award = Total Land + Assets + Solatium + Additional Amount
 */
export function calculateRfctlarrCompensation(input: CalculationInput): CompensationBreakdown {
  const {
    marketValuePerHa,
    areaHa,
    ruralMultiplier = 1.5,
    assetsAndTreesValue = 0,
    solatiumPercentage = 100,
    interestMonths = 12,
    annualInterestRate = 12,
  } = input;

  const baseLandValue = marketValuePerHa * areaHa;
  const multipliedLandValue = baseLandValue * ruralMultiplier;
  const totalBaseAndAssets = multipliedLandValue + assetsAndTreesValue;
  const solatiumAmount = (totalBaseAndAssets * solatiumPercentage) / 100;
  
  // 12% per annum on base land value
  const additionalInterestAmount = (baseLandValue * (annualInterestRate / 100) * (interestMonths / 12));
  
  const totalCompensation = totalBaseAndAssets + solatiumAmount + additionalInterestAmount;

  return {
    marketValuePerHa,
    areaHa,
    baseLandValue: Math.round(baseLandValue),
    ruralMultiplier,
    multipliedLandValue: Math.round(multipliedLandValue),
    assetsAndTreesValue: Math.round(assetsAndTreesValue),
    solatiumPercentage,
    solatiumAmount: Math.round(solatiumAmount),
    additionalInterestMonths: interestMonths,
    additionalInterestRate: annualInterestRate,
    additionalInterestAmount: Math.round(additionalInterestAmount),
    totalCompensation: Math.round(totalCompensation),
  };
}
