import { api } from './api';

export interface ExportResponse {
  message?: string;
  exportDate?: string;
  drinkCount?: number;
  totalUnits?: number;
}

export interface ImportValidationResponse {
  isValid: boolean;
  totalRows: number;
  validRows: number;
  issues?: string[];
  expectedFormat?: {
    requiredFields: string[];
    optionalFields: string[];
    exampleHeaders: string;
  };
}

export interface ImportResponse {
  message: string;
  successCount: number;
  errorCount: number;
  totalRows: number;
  errors?: string[];
}

export const exportToCSV = async (): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'}/api/export/csv`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'text/csv' },
      }
    );

    if (!response.ok) throw new Error('Export failed');
    return await response.blob();
  } catch (error) {
    console.error('Failed to export CSV:', error);
    return null;
  }
};

export const exportToJSON = async (): Promise<Blob | null> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'}/api/export/json`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!response.ok) throw new Error('Export failed');
    return await response.blob();
  } catch (error) {
    console.error('Failed to export JSON:', error);
    return null;
  }
};

export const exportReport = async (
  startDate?: string,
  endDate?: string
): Promise<string | null> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000'}/api/export/report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ startDate, endDate }),
      }
    );

    if (!response.ok) throw new Error('Report generation failed');
    return await response.text();
  } catch (error) {
    console.error('Failed to generate report:', error);
    return null;
  }
};

export const validateCSV = async (csvContent: string): Promise<ImportValidationResponse | null> => {
  try {
    return await api.post<ImportValidationResponse>('/import/validate', { csvContent });
  } catch (error) {
    console.error('Failed to validate CSV:', error);
    return null;
  }
};

export const importFromCSV = async (csvContent: string): Promise<ImportResponse | null> => {
  try {
    return await api.post<ImportResponse>('/import/csv', { csvContent });
  } catch (error) {
    console.error('Failed to import CSV:', error);
    throw error;
  }
};

// Helper to get auth token for direct fetch calls
const getAuthToken = async (): Promise<string | null> => {
  try {
    const { getAuthToken } = await import('./auth');
    return await getAuthToken();
  } catch {
    return null;
  }
};
