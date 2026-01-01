import type { Metrics } from '../types/aquaculture';

export interface AeratorRecommendation {
  action: 'turn_on' | 'turn_off' | 'maintain';
  confidence: number;
  reasoning: string[];
  urgency: 'high' | 'medium' | 'low';
  expectedImpact?: string;
}

export function getAeratorRecommendation(
  metrics: Metrics,
  aeratorActive: boolean,
  historicalData: Metrics[]
): AeratorRecommendation {
  const reasons: string[] = [];
  let action: 'turn_on' | 'turn_off' | 'maintain' = 'maintain';
  let urgency: 'high' | 'medium' | 'low' = 'low';
  let confidence = 0;

  const recentData = historicalData.slice(-10);
  const doTrend = recentData.length >= 2
    ? recentData[recentData.length - 1].dissolvedOxygen - recentData[0].dissolvedOxygen
    : 0;
  const isDoStable = Math.abs(doTrend) < 0.3;
  const avgDO = recentData.reduce((sum, m) => sum + m.dissolvedOxygen, 0) / recentData.length;

  if (!aeratorActive) {
    if (metrics.dissolvedOxygen < 5.5) {
      action = 'turn_on';
      urgency = 'high';
      confidence = 95;
      reasons.push(`Critical DO level: ${metrics.dissolvedOxygen.toFixed(1)} mg/L (below safe threshold of 5.5 mg/L)`);
      reasons.push('Immediate aeration required to prevent fish stress and mortality');
      reasons.push(`Expected DO increase: +1.5 mg/L within 30 minutes of activation`);
      return {
        action,
        confidence,
        reasoning: reasons,
        urgency,
        expectedImpact: `DO will rise from ${metrics.dissolvedOxygen.toFixed(1)} to ~${(metrics.dissolvedOxygen + 1.5).toFixed(1)} mg/L`
      };
    }

    if (metrics.ammonia > 0.1) {
      action = 'turn_on';
      urgency = 'high';
      confidence = 92;
      reasons.push(`Dangerous ammonia level: ${metrics.ammonia.toFixed(3)} mg/L (exceeds 0.1 mg/L limit)`);
      reasons.push('Increased water circulation needed to reduce ammonia concentration');
      reasons.push('Aerator will improve water mixing and reduce toxic buildup');
      return {
        action,
        confidence,
        reasoning: reasons,
        urgency,
        expectedImpact: `Ammonia will decrease by approximately 20% within 1 hour`
      };
    }

    if (metrics.dissolvedOxygen < 6.2 && doTrend < -0.15) {
      action = 'turn_on';
      urgency = 'medium';
      confidence = 88;
      reasons.push(`DO declining: ${metrics.dissolvedOxygen.toFixed(1)} mg/L with downward trend of ${doTrend.toFixed(2)} mg/L`);
      reasons.push('Preventive activation recommended before reaching critical threshold');
      reasons.push(`Average DO over last hour: ${avgDO.toFixed(1)} mg/L`);
      return {
        action,
        confidence,
        reasoning: reasons,
        urgency,
        expectedImpact: `Will stabilize DO and prevent further decline`
      };
    }

    if (metrics.dissolvedOxygen < 6.5 && metrics.ammonia > 0.05) {
      action = 'turn_on';
      urgency = 'medium';
      confidence = 82;
      reasons.push(`Sub-optimal conditions detected: DO at ${metrics.dissolvedOxygen.toFixed(1)} mg/L, ammonia at ${metrics.ammonia.toFixed(3)} mg/L`);
      reasons.push('Aerator activation will improve both oxygen levels and ammonia dispersion');
      reasons.push('Proactive water quality management to maintain fish health');
      return {
        action,
        confidence,
        reasoning: reasons,
        urgency,
        expectedImpact: `Both DO and ammonia levels will improve within 45 minutes`
      };
    }

    confidence = 75;
    reasons.push(`Current DO: ${metrics.dissolvedOxygen.toFixed(1)} mg/L - within optimal range`);
    reasons.push(`Ammonia: ${metrics.ammonia.toFixed(3)} mg/L - acceptable level`);
    reasons.push('All parameters stable, aerator activation not required at this time');
    return { action: 'maintain', confidence, reasoning: reasons, urgency: 'low' };
  } else {
    if (metrics.dissolvedOxygen > 6.5 && isDoStable && metrics.ammonia < 0.05 && metrics.temperature < 29) {
      action = 'turn_off';
      urgency = 'low';
      confidence = 88;
      reasons.push(`Excellent DO level: ${metrics.dissolvedOxygen.toFixed(1)} mg/L (above 6.5 mg/L target)`);
      reasons.push(`Ammonia well controlled: ${metrics.ammonia.toFixed(3)} mg/L`);
      reasons.push('All parameters stable and within optimal ranges');
      reasons.push('Energy conservation: aerator can be deactivated safely');
      return { action, confidence, reasoning: reasons, urgency };
    }

    if (metrics.dissolvedOxygen > 7.0 && metrics.ammonia < 0.03) {
      action = 'turn_off';
      urgency = 'low';
      confidence = 82;
      reasons.push(`DO exceeds target: ${metrics.dissolvedOxygen.toFixed(1)} mg/L`);
      reasons.push('Minimal ammonia detected, excellent water quality');
      reasons.push('Aerator no longer required, can reduce operational costs');
      return { action, confidence, reasoning: reasons, urgency };
    }

    confidence = 75;
    reasons.push(`Aerator maintaining DO at ${metrics.dissolvedOxygen.toFixed(1)} mg/L`);
    reasons.push('Continue operation to sustain optimal conditions');
    if (metrics.ammonia > 0.05) {
      reasons.push(`Ammonia at ${metrics.ammonia.toFixed(3)} mg/L - continued circulation beneficial`);
    }
    return { action: 'maintain', confidence, reasoning: reasons, urgency: 'low' };
  }
}
