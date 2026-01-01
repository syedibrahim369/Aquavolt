import { WasteDetection } from '../types/aquaculture';

export interface DetectionSimulation {
  type: string;
  confidence: number;
  location: string;
  bbox: { x: number; y: number; width: number; height: number };
  imageUrl: string;
}

export class WasteDetector {
  private detectionTypes = [
    { type: 'plastic_bottle', weight: 0.25, icon: '🧴' },
    { type: 'plastic_bag', weight: 0.20, icon: '🛍️' },
    { type: 'fishing_net', weight: 0.15, icon: '🕸️' },
    { type: 'oil_slick', weight: 0.12, icon: '🛢️' },
    { type: 'debris', weight: 0.18, icon: '🗑️' },
    { type: 'microplastics', weight: 0.10, icon: '⚠️' },
  ];

  private locations = [
    'Cage 1 - North',
    'Cage 2 - East',
    'Cage 3 - South',
    'Cage 4 - West',
    'Feed Area',
    'Perimeter Zone A',
    'Perimeter Zone B',
  ];

  simulateDetection(timestamp: Date): WasteDetection | null {
    const detectionProbability = 0.15;

    if (Math.random() > detectionProbability) {
      return null;
    }

    const detectionType = this.selectWeightedRandom(this.detectionTypes);
    const confidence = 0.70 + Math.random() * 0.25;
    const location = this.locations[Math.floor(Math.random() * this.locations.length)];

    const bbox = {
      x: Math.floor(Math.random() * 400) + 50,
      y: Math.floor(Math.random() * 300) + 50,
      width: Math.floor(Math.random() * 150) + 80,
      height: Math.floor(Math.random() * 120) + 60,
    };

    return {
      timestamp,
      detection_type: detectionType.type,
      confidence_score: Math.round(confidence * 100) / 100,
      location,
      image_url: this.getImagePlaceholder(detectionType.type),
      bbox_data: bbox,
      action_taken: false,
    };
  }

  generateMultipleDetections(count: number = 10): WasteDetection[] {
    const detections: WasteDetection[] = [];
    const now = new Date();

    for (let i = 0; i < count; i++) {
      const timestamp = new Date(now.getTime() - (i * 3 * 60 * 60 * 1000));
      const detection = this.simulateDetection(timestamp);

      if (detection) {
        detections.push(detection);
      }
    }

    return detections;
  }

  private selectWeightedRandom(items: { type: string; weight: number; icon: string }[]): { type: string; weight: number; icon: string } {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of items) {
      random -= item.weight;
      if (random <= 0) {
        return item;
      }
    }

    return items[0];
  }

  private getImagePlaceholder(type: string): string {
    const imageMap: Record<string, string> = {
      plastic_bottle: 'https://images.pexels.com/photos/3850512/pexels-photo-3850512.jpeg?auto=compress&cs=tinysrgb&w=400',
      plastic_bag: 'https://images.pexels.com/photos/2768961/pexels-photo-2768961.jpeg?auto=compress&cs=tinysrgb&w=400',
      fishing_net: 'https://images.pexels.com/photos/4666748/pexels-photo-4666748.jpeg?auto=compress&cs=tinysrgb&w=400',
      oil_slick: 'https://images.pexels.com/photos/2175952/pexels-photo-2175952.jpeg?auto=compress&cs=tinysrgb&w=400',
      debris: 'https://images.pexels.com/photos/3182750/pexels-photo-3182750.jpeg?auto=compress&cs=tinysrgb&w=400',
      microplastics: 'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=400',
    };

    return imageMap[type] || imageMap.debris;
  }

  getDetectionIcon(type: string): string {
    const found = this.detectionTypes.find(d => d.type === type);
    return found?.icon || '🗑️';
  }

  getConfidenceLevel(confidence: number): { level: string; color: string } {
    if (confidence >= 0.90) return { level: 'Very High', color: 'text-green-600' };
    if (confidence >= 0.80) return { level: 'High', color: 'text-blue-600' };
    if (confidence >= 0.70) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-orange-600' };
  }
}
