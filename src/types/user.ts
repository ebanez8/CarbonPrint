
export interface ScanHistory {
  id: string;
  barcode: string;
  productName: string;
  timestamp: Date;
  carbonScore: number;
  brand?: string;
  category?: string;
  sustainabilityBadges?: string[];
  recyclable?: boolean;
  alternatives?: {
    name: string;
    carbonScore: number;
    savings: number;
  }[];
}

export interface UserStats {
  totalScans: number;
  totalEcoChoices: number;
  ecoPoints: number;
  carbonSaved: number;
}

export interface UserData {
  scanHistory: ScanHistory[];
  stats: UserStats;
}
