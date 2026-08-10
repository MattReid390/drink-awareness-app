// Data models for venue discovery
// Matches the MVP venue features from doc 11

export interface Venue {
  id: string; // Unique identifier
  name: string; // Venue name (e.g. De Beers)
  type: string; // Venue type (e.g. Pub, Bar, Cocktail Bar)
  address: string; // Full street address
  distance?: number; // Distance from user in metres - optional
  phone?: string; // Contact phone number - optional
  hours?: OpeningHours; // Opening hours - optional
  coordinates?: Coordinates; // Lat/lng for map view - optional
}

export interface OpeningHours {
  monday?: string; // Opening hours string (e.g. 11:00 - 23:00)
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Coordinates {
  latitude: number; // Latitude for map pin
  longitude: number; // Longitude for map pin
}

export interface DrinkMenuItem {
  id: string; // Unique identifier
  venueId: string; // Parent venue reference
  name: string; // Drink name (e.g. Pint of Guinness)
  category: string; // Menu category (e.g. Beers, Wines, Spirits)
  price: number; // Price in GBP
  abv?: number; // Alcohol by volume percentage - optional
  description?: string; // Short description - optional (max 1 line)
}
