import { SensorData, FeedingRecommendation } from '../types/aquaculture';
import { PARAMETER_THRESHOLDS } from './alertSystem';
import { calculateEnvironmentScoreWasm, calculateFeedingAdjustmentWasm, preloadFeedingWasm } from '../wasm/feeding';

export class FeedingOptimizer {
  private baselineFeedingRate = 280;

  generateRecommendation(
    currentData: SensorData,
    recentHistory: SensorData[]
  ): FeedingRecommendation {
    // Warm up WASM module; JS fallback remains available.
    void preloadFeedingWasm();

    const environmentScore = this.calculateEnvironmentScore(currentData);
    const adjustment = this.calculateFeedingAdjustment(currentData, environmentScore);
    const recommendedRate = Math.max(100, Math.min(400, this.baselineFeedingRate * (1 + adjustment / 100)));

    const reason = this.generateReason(currentData, adjustment, environmentScore);

    const fcr = this.calculateFCR(recentHistory);
    const wasteRatio = this.calculateWasteRatio(recentHistory);

    return {
      timestamp: currentData.timestamp,
      recommended_rate_gmin: Math.round(recommendedRate * 100) / 100,
      adjustment_percentage: Math.round(adjustment * 100) / 100,
      reason,
      environment_score: Math.round(environmentScore * 100) / 100,
      feed_conversion_ratio: fcr,
      feed_waste_ratio: wasteRatio,
      applied: false,
    };
  }

  private calculateEnvironmentScore(data: SensorData): number {
    const thresholds = [
      PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.min,
      PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.critical_min,
      PARAMETER_THRESHOLDS.ph.min,
      PARAMETER_THRESHOLDS.ph.max,
      PARAMETER_THRESHOLDS.ph.critical_min,
      PARAMETER_THRESHOLDS.ph.critical_max,
      PARAMETER_THRESHOLDS.turbidity_ntu.max,
      PARAMETER_THRESHOLDS.turbidity_ntu.critical_max,
      PARAMETER_THRESHOLDS.ammonia_mgl.max,
      PARAMETER_THRESHOLDS.ammonia_mgl.critical_max,
      PARAMETER_THRESHOLDS.temperature_c.min,
      PARAMETER_THRESHOLDS.temperature_c.max,
      PARAMETER_THRESHOLDS.fish_activity_index.min,
    ];

    const wasmScore = calculateEnvironmentScoreWasm({
      dissolved_oxygen_mgl: data.dissolved_oxygen_mgl,
      ph: data.ph,
      turbidity_ntu: data.turbidity_ntu,
      ammonia_mgl: data.ammonia_mgl,
      temperature_c: data.temperature_c,
      fish_activity_index: data.fish_activity_index,
    }, thresholds);

    if (wasmScore !== null) {
      return Math.max(0, Math.min(1, wasmScore));
    }

    let score = 1.0;

    if (data.dissolved_oxygen_mgl < PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.min) {
      score -= 0.25;
    } else if (data.dissolved_oxygen_mgl < PARAMETER_THRESHOLDS.dissolved_oxygen_mgl.critical_min) {
      score -= 0.40;
    }

    if (data.ph < PARAMETER_THRESHOLDS.ph.min || data.ph > PARAMETER_THRESHOLDS.ph.max) {
      score -= 0.15;
    }
    if (data.ph < PARAMETER_THRESHOLDS.ph.critical_min || data.ph > PARAMETER_THRESHOLDS.ph.critical_max) {
      score -= 0.25;
    }

    if (data.turbidity_ntu > PARAMETER_THRESHOLDS.turbidity_ntu.max) {
      score -= 0.15;
    }
    if (data.turbidity_ntu > PARAMETER_THRESHOLDS.turbidity_ntu.critical_max) {
      score -= 0.20;
    }

    if (data.ammonia_mgl > PARAMETER_THRESHOLDS.ammonia_mgl.max) {
      score -= 0.20;
    }
    if (data.ammonia_mgl > PARAMETER_THRESHOLDS.ammonia_mgl.critical_max) {
      score -= 0.30;
    }

    if (data.temperature_c < PARAMETER_THRESHOLDS.temperature_c.min ||
        data.temperature_c > PARAMETER_THRESHOLDS.temperature_c.max) {
      score -= 0.10;
    }

    if (data.fish_activity_index < PARAMETER_THRESHOLDS.fish_activity_index.min) {
      score -= 0.15;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateFeedingAdjustment(data: SensorData, envScore: number): number {
    const wasmAdjustment = calculateFeedingAdjustmentWasm({
      dissolved_oxygen_mgl: data.dissolved_oxygen_mgl,
      turbidity_ntu: data.turbidity_ntu,
      ammonia_mgl: data.ammonia_mgl,
      fish_activity_index: data.fish_activity_index,
      temperature_c: data.temperature_c,
      envScore,
    });

    if (wasmAdjustment !== null) {
      return Math.max(-40, Math.min(15, wasmAdjustment));
    }

    let adjustment = 0;

    if (envScore < 0.5) {
      adjustment -= 30;
    } else if (envScore < 0.7) {
      adjustment -= 15;
    } else if (envScore > 0.9) {
      adjustment += 5;
    }

    if (data.dissolved_oxygen_mgl < 5.5) {
      adjustment -= 20;
    } else if (data.dissolved_oxygen_mgl < 6.0) {
      adjustment -= 10;
    }

    if (data.turbidity_ntu > 30) {
      adjustment -= 15;
    } else if (data.turbidity_ntu > 25) {
      adjustment -= 8;
    }

    if (data.ammonia_mgl > 0.4) {
      adjustment -= 20;
    } else if (data.ammonia_mgl > 0.25) {
      adjustment -= 10;
    }

    if (data.fish_activity_index < 0.6) {
      adjustment -= 12;
    } else if (data.fish_activity_index > 0.85) {
      adjustment += 5;
    }

    if (data.temperature_c < 24 || data.temperature_c > 31) {
      adjustment -= 10;
    }

    return Math.max(-40, Math.min(15, adjustment));
  }

  private generateReason(data: SensorData, adjustment: number, envScore: number): string {
    const reasons: string[] = [];

    if (envScore < 0.6) {
      reasons.push('Poor water quality conditions');
    }

    if (data.dissolved_oxygen_mgl < 6.0) {
      reasons.push('Low dissolved oxygen levels');
    }

    if (data.turbidity_ntu > 28) {
      reasons.push('High turbidity indicating feed waste');
    }

    if (data.ammonia_mgl > 0.3) {
      reasons.push('Elevated ammonia levels');
    }

    if (data.fish_activity_index < 0.65) {
      reasons.push('Reduced fish activity');
    }

    if (data.temperature_c < 24 || data.temperature_c > 31) {
      reasons.push('Suboptimal temperature');
    }

    if (reasons.length === 0) {
      if (adjustment > 0) {
        return 'Optimal feeding conditions - slight increase recommended';
      } else if (adjustment === 0) {
        return 'Environment stable - maintain current feeding rate';
      } else {
        return 'Preventive adjustment to maintain water quality';
      }
    }

    const action = adjustment < -15 ? 'Reduce feeding' : adjustment < 0 ? 'Slightly reduce feeding' : 'Maintain feeding';
    return `${action} due to: ${reasons.join(', ')}`;
  }

  private calculateFCR(history: SensorData[]): number {
    if (history.length < 24) return 1.5;

    const avgActivity = history.reduce((sum, d) => sum + d.fish_activity_index, 0) / history.length;
    const avgEnvironmentQuality = history.reduce((sum, d) => {
      const doScore = d.dissolved_oxygen_mgl >= 6 ? 1 : 0.7;
      const phScore = (d.ph >= 7.5 && d.ph <= 8.5) ? 1 : 0.8;
      return sum + ((doScore + phScore) / 2);
    }, 0) / history.length;

    const baseFCR = 1.5;
    const activityBonus = (avgActivity - 0.7) * 0.5;
    const qualityBonus = (avgEnvironmentQuality - 0.8) * 0.3;

    return Math.max(1.1, Math.min(2.2, baseFCR - activityBonus - qualityBonus));
  }

  private calculateWasteRatio(history: SensorData[]): number {
    if (history.length < 12) return 15;

    const avgTurbidity = history.reduce((sum, d) => sum + d.turbidity_ntu, 0) / history.length;
    const avgAmmonia = history.reduce((sum, d) => sum + d.ammonia_mgl, 0) / history.length;

    const turbidityWaste = Math.max(0, (avgTurbidity - 15) * 0.8);
    const ammoniaWaste = Math.max(0, (avgAmmonia - 0.15) * 20);

    return Math.min(35, turbidityWaste + ammoniaWaste + 5);
  }

  calculateMetrics(history: SensorData[]): {
    avgFCR: number;
    avgWasteRatio: number;
    energyCostPerKg: number;
    feedEfficiency: number;
  } {
    const fcr = this.calculateFCR(history);
    const wasteRatio = this.calculateWasteRatio(history);
    const energyCostPerKg = fcr * 0.45 + (wasteRatio / 100) * 0.20;
    const feedEfficiency = Math.max(0, 100 - wasteRatio);

    return {
      avgFCR: Math.round(fcr * 100) / 100,
      avgWasteRatio: Math.round(wasteRatio * 100) / 100,
      energyCostPerKg: Math.round(energyCostPerKg * 100) / 100,
      feedEfficiency: Math.round(feedEfficiency * 100) / 100,
    };
  }
}
