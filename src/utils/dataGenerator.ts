import { SensorData } from '../types/aquaculture';

export class AquacultureDataGenerator {
  private baselineTemp = 27.5;
  private baselineDO = 7.0;
  private baselinePH = 8.0;
  private baselineAmmonia = 0.15;
  private baselineTurbidity = 15;
  private baselineFeedingRate = 250;
  private baselineActivity = 0.8;
  private baselineCurrentSpeed = 0.5;

  generateTimeSeriesData(daysCount: number = 30): SensorData[] {
    const data: SensorData[] = [];
    const hoursCount = daysCount * 24;
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - daysCount);

    for (let hour = 0; hour < hoursCount; hour++) {
      const timestamp = new Date(startTime.getTime() + hour * 60 * 60 * 1000);
      const timeOfDay = timestamp.getHours();
      const dayProgress = hour / hoursCount;

      const temp = this.generateTemperature(hour, timeOfDay, dayProgress);
      const feedingRate = this.generateFeedingRate(timeOfDay);
      const currentSpeed = this.generateCurrentSpeed(timeOfDay);

      const turbidity = this.generateTurbidity(feedingRate, hour);
      const ammonia = this.generateAmmonia(feedingRate, turbidity, hour);
      const dissolvedOxygen = this.generateDissolvedOxygen(temp, turbidity, currentSpeed, timeOfDay);
      const ph = this.generatePH(ammonia, dissolvedOxygen, hour);
      const fishActivity = this.generateFishActivity(dissolvedOxygen, ph, temp, timeOfDay);

      data.push({
        timestamp,
        temperature_c: this.roundTo(temp, 2),
        dissolved_oxygen_mgl: this.roundTo(dissolvedOxygen, 2),
        ph: this.roundTo(ph, 2),
        ammonia_mgl: this.roundTo(ammonia, 3),
        turbidity_ntu: this.roundTo(turbidity, 2),
        feeding_rate_gmin: this.roundTo(feedingRate, 2),
        fish_activity_index: this.roundTo(fishActivity, 2),
        current_speed_ms: this.roundTo(currentSpeed, 2),
      });
    }

    return data;
  }

  private generateTemperature(hour: number, timeOfDay: number, dayProgress: number): number {
    const dailyCycle = Math.sin((timeOfDay / 24) * 2 * Math.PI) * 2;
    const seasonalTrend = Math.sin(dayProgress * 2 * Math.PI) * 3;
    const noise = (Math.random() - 0.5) * 1.5;
    const anomaly = hour % 120 === 0 ? (Math.random() > 0.5 ? 5 : -4) : 0;

    return this.baselineTemp + dailyCycle + seasonalTrend + noise + anomaly;
  }

  private generateDissolvedOxygen(temp: number, turbidity: number, currentSpeed: number, timeOfDay: number): number {
    const tempEffect = (30 - temp) * 0.15;
    const turbidityEffect = (25 - turbidity) * 0.05;
    const currentEffect = (currentSpeed - 0.5) * 2;
    const photosynthesisCycle = timeOfDay >= 6 && timeOfDay <= 18 ? 0.5 : -0.3;
    const noise = (Math.random() - 0.5) * 0.4;

    return Math.max(3, this.baselineDO + tempEffect + turbidityEffect + currentEffect + photosynthesisCycle + noise);
  }

  private generatePH(ammonia: number, dissolvedOxygen: number, hour: number): number {
    const ammoniaEffect = ammonia > 0.3 ? -0.3 : 0;
    const oxygenEffect = (dissolvedOxygen - 7) * 0.05;
    const drift = Math.sin((hour / 24) * 2 * Math.PI) * 0.2;
    const noise = (Math.random() - 0.5) * 0.15;
    const anomaly = hour % 150 === 0 ? (Math.random() > 0.5 ? -1.5 : 0.5) : 0;

    return this.baselinePH + ammoniaEffect + oxygenEffect + drift + noise + anomaly;
  }

  private generateAmmonia(feedingRate: number, turbidity: number, hour: number): number {
    const feedingEffect = (feedingRate - 250) * 0.0008;
    const turbidityEffect = (turbidity - 15) * 0.003;
    const accumulation = Math.sin((hour % 168) / 168 * 2 * Math.PI) * 0.1;
    const noise = Math.random() * 0.05;
    const spike = hour % 100 === 0 && Math.random() > 0.7 ? 0.4 : 0;

    return Math.max(0, this.baselineAmmonia + feedingEffect + turbidityEffect + accumulation + noise + spike);
  }

  private generateTurbidity(feedingRate: number, hour: number): number {
    const feedingEffect = (feedingRate - 250) * 0.04;
    const settlingEffect = -Math.min((hour % 24) * 0.3, 3);
    const noise = (Math.random() - 0.5) * 3;
    const wasteEvent = hour % 80 === 0 && Math.random() > 0.6 ? 15 : 0;

    return Math.max(0, this.baselineTurbidity + feedingEffect + settlingEffect + noise + wasteEvent);
  }

  private generateFeedingRate(timeOfDay: number): number {
    if (timeOfDay >= 6 && timeOfDay < 8) {
      return 300 + (Math.random() - 0.5) * 50;
    } else if (timeOfDay >= 12 && timeOfDay < 14) {
      return 320 + (Math.random() - 0.5) * 60;
    } else if (timeOfDay >= 18 && timeOfDay < 20) {
      return 280 + (Math.random() - 0.5) * 50;
    } else {
      return 50 + Math.random() * 30;
    }
  }

  private generateFishActivity(dissolvedOxygen: number, ph: number, temp: number, timeOfDay: number): number {
    const oxygenEffect = dissolvedOxygen < 5.5 ? -0.3 : 0;
    const phEffect = (ph < 7.0 || ph > 8.8) ? -0.2 : 0;
    const tempEffect = (temp < 24 || temp > 32) ? -0.15 : 0;
    const nightEffect = (timeOfDay < 6 || timeOfDay > 20) ? -0.2 : 0;
    const noise = (Math.random() - 0.5) * 0.1;

    return Math.max(0.2, Math.min(1.0, this.baselineActivity + oxygenEffect + phEffect + tempEffect + nightEffect + noise));
  }

  private generateCurrentSpeed(timeOfDay: number): number {
    const tidalCycle = Math.sin((timeOfDay / 12) * 2 * Math.PI) * 0.15;
    const noise = (Math.random() - 0.5) * 0.1;

    return Math.max(0.1, this.baselineCurrentSpeed + tidalCycle + noise);
  }

  private roundTo(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}
