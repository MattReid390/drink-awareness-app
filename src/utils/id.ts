// ID generation utilities
// Generates unique identifiers for drinks and other entities

import { v4 as uuidv4 } from 'uuid';

// Generates a unique ID for a drink
export const generateId = (): string => {
  return uuidv4();
};
