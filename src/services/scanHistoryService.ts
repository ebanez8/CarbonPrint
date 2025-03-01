import { ScanHistory } from "../types/user";

const API_URL = 'http://localhost:5000/api/scan-history';

// Get all scan history
export const getScanHistory = async (): Promise<ScanHistory[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch scan history');
    
    const data = await response.json();
    return data.map((item: any) => ({
      ...item,
      id: item._id, // MongoDB uses _id
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
};

// Add new scan to history
export const addScanToHistory = async (scanData: Omit<ScanHistory, 'id'>): Promise<ScanHistory | null> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scanData),
    });
    
    if (!response.ok) throw new Error('Failed to add scan to history');
    
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      timestamp: new Date(data.timestamp)
    };
  } catch (error) {
    console.error('Error adding scan to history:', error);
    return null;
  }
};

// Get user stats
export const getUserStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Failed to fetch user stats');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return {
      totalScans: 0,
      ecoPoints: 0,
      carbonSaved: 0
    };
  }
};