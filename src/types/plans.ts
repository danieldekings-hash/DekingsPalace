export interface Plan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  roi: number; // Return on Investment percentage
  duration: number; // Duration in days
  features: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Investment {
  id: string;
  planId: string;
  userId: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'cancelled';
  currentReturn: number;
  expectedReturn: number;
  plan?: Plan;
}

export interface InvestmentStats {
  totalInvestment: number;
  activeInvestments: number;
  totalEarnings: number;
  availableBalance: number;
}
