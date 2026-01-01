import { supabase } from '../lib/supabase';
import type { FarmLocation } from '../types/aquaculture';

export async function loadFarms(): Promise<FarmLocation[]> {
  try {
    const { data, error } = await supabase
      .from('farms')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading farms:', error);
      return getDefaultFarms();
    }

    if (!data || data.length === 0) {
      return getDefaultFarms();
    }

    return data.map(farm => ({
      id: farm.id,
      name: farm.name,
      lat: parseFloat(farm.latitude),
      lng: parseFloat(farm.longitude),
    }));
  } catch (error) {
    console.error('Error loading farms:', error);
    return getDefaultFarms();
  }
}

export async function addFarm(farm: {
  name: string;
  latitude: number;
  longitude: number;
  region: string;
}): Promise<{ success: boolean; error?: string; farm?: FarmLocation }> {
  try {
    const farmId = `farm_${Date.now()}`;

    const { data, error } = await supabase
      .from('farms')
      .insert([
        {
          id: farmId,
          name: farm.name,
          latitude: farm.latitude,
          longitude: farm.longitude,
          region: farm.region,
          status: 'active',
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding farm:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      farm: {
        id: data.id,
        name: data.name,
        lat: parseFloat(data.latitude),
        lng: parseFloat(data.longitude),
      },
    };
  } catch (error) {
    console.error('Error adding farm:', error);
    return { success: false, error: 'Failed to add farm' };
  }
}

function getDefaultFarms(): FarmLocation[] {
  return [
    { id: '1', name: 'Muscat Marine', lat: 23.614, lng: 58.545 },
    { id: '2', name: 'Sur Coastal', lat: 22.567, lng: 59.529 },
    { id: '3', name: 'Sohar Blue', lat: 24.347, lng: 56.709 },
    { id: '4', name: 'Salalah Deep', lat: 17.015, lng: 54.092 },
    { id: '5', name: 'Khasab Ocean', lat: 26.18, lng: 56.239 },
  ];
}
