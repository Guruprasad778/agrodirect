/**
 * Demand Forecasting Service - XGBoost / Prophet ML Architecture
 * 
 * Future Integration Note:
 * In a production deployment, this module calls a Python microservice hosting
 * trained Prophet or XGBoost regressors with lag features, festival calendars,
 * weather forecasts, and historical APMC intake.
 * 
 * Example Python FastAPI endpoint:
 * POST /api/v1/forecast/demand
 * Payload: { fpo_id: "FPO-KLR-01", crop_id: "PROD-TOMATO", horizon_days: 7 }
 * 
 * Below is the modular client abstraction simulating realistic model output.
 */

import { DemandForecastPoint } from '../types/supplyChain';

export interface ModelMetadata {
  algorithm: 'XGBoost Regressor v2.4' | 'Prophet Additive Seasonality';
  meanAbsoluteError: number; // e.g. 4.2%
  trainingDataPoints: number;
  featuresUsed: string[];
  lastRetrained: string;
}

export const demandForecastService = {
  getModelMetadata(): ModelMetadata {
    return {
      algorithm: 'XGBoost Regressor v2.4',
      meanAbsoluteError: 3.8,
      trainingDataPoints: 14200,
      featuresUsed: [
        '7-day rolling order volume',
        'Institutional meal calendar (Hostels/Temples)',
        'Rainfall & Mandi arrival trends',
        'Day-of-week retail consumption index'
      ],
      lastRetrained: '2026-09-20 02:00 UTC'
    };
  },

  /**
   * Recalculate forecast when a new large bulk order is ingested
   */
  projectDemandWithNewOrder(
    currentData: DemandForecastPoint[], 
    additionalDemandKg: number
  ): DemandForecastPoint[] {
    return currentData.map(pt => {
      if (pt.day.includes('Today')) {
        const newCur = (pt.currentDemandKg || 1280) + additionalDemandKg;
        return {
          ...pt,
          currentDemandKg: newCur,
          forecastKg: Math.round(newCur * 1.02),
          upperBoundKg: Math.round(newCur * 1.06),
          lowerBoundKg: Math.round(newCur * 0.98),
        };
      }
      if (pt.day.includes('Tmrw')) {
        const newForecast = (pt.forecastKg || 1450) + Math.round(additionalDemandKg * 1.15);
        return {
          ...pt,
          forecastKg: newForecast,
          upperBoundKg: Math.round(newForecast * 1.05),
          lowerBoundKg: Math.round(newForecast * 0.95),
        };
      }
      return pt;
    });
  }
};
