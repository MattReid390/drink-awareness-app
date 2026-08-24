import { Venue } from '../types';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000';

export const getVenues = async (): Promise<Venue[]> => {
  try {
    const response = await fetch(`${API_URL}/api/venues`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return data.map((v: any) => ({
      id: String(v.id),
      name: v.name,
      type: v.type,
      address: v.address,
      phone: v.phone,
      coordinates: v.coordinates,
      distance: v.distance || 0,
    }));
  } catch (error) {
    console.error('Failed to fetch venues:', error);
    return [];
  }
};

export const getVenueDetail = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/api/venues/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return {
      id: String(data.id),
      name: data.name,
      type: data.type,
      address: data.address,
      phone: data.phone,
      hours: data.hours,
      coordinates: data.coordinates,
      drinks: data.drinks || [],
    };
  } catch (error) {
    console.error('Failed to fetch venue detail:', error);
    return null;
  }
};

export const searchVenues = async (query: string, type?: string): Promise<Venue[]> => {
  try {
    const response = await fetch(`${API_URL}/api/venues/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, type }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    return data.map((v: any) => ({
      id: String(v.id),
      name: v.name,
      type: v.type,
      address: v.address,
      phone: v.phone,
      coordinates: v.coordinates,
      distance: v.distance || 0,
    }));
  } catch (error) {
    console.error('Failed to search venues:', error);
    return [];
  }
};
