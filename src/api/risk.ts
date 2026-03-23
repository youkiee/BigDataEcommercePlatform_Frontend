import request from '../utils/request';

interface RiskTransaction {
  id: string;
  userId: number;
  amount: number;
  device: string;
  ip: string;
  riskScore: number;
  riskFactors: string[];
  time: string;
  status: 'pending' | 'released' | 'frozen' | 'reviewing';
}

interface RiskRule {
  id: number;
  name: string;
  condition: string;
  riskLevel: 'high' | 'medium' | 'low';
  scoreThreshold: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface RiskEvent {
  id: number;
  type: string;
  description: string;
  level: 'high' | 'medium' | 'low';
  time: string;
  status: 'unprocessed' | 'processed' | 'reviewing';
  handler?: string;
}

interface RiskModel {
  id: number;
  name: string;
  version: string;
  accuracy: number;
  recall: number;
  f1Score: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export const riskApi = {
  getRiskOverview: () => {
    return request.get('/api/risk/overview');
  },
  getRiskTransactions: (params: { page?: number; limit?: number; status?: string }) => {
    return request.get<{ list: RiskTransaction[]; total: number }>('/api/risk/transactions', { params });
  },
  releaseTransaction: (id: string) => {
    return request.post(`/api/risk/transactions/${id}/release`);
  },
  freezeTransaction: (id: string) => {
    return request.post(`/api/risk/transactions/${id}/freeze`);
  },
  markReviewTransaction: (id: string) => {
    return request.post(`/api/risk/transactions/${id}/review`);
  },
  getRiskRules: () => {
    return request.get<RiskRule[]>('/api/risk/rules');
  },
  createRiskRule: (data: Omit<RiskRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    return request.post<RiskRule>('/api/risk/rules', data);
  },
  updateRiskRule: (id: number, data: Partial<RiskRule>) => {
    return request.put<RiskRule>(`/api/risk/rules/${id}`, data);
  },
  deleteRiskRule: (id: number) => {
    return request.delete(`/api/risk/rules/${id}`);
  },
  getRiskModels: () => {
    return request.get<RiskModel[]>('/api/risk/models');
  },
  getRiskModelMetrics: (modelId: number) => {
    return request.get(`/api/risk/models/${modelId}/metrics`);
  },
  getRiskEvents: (params: { page?: number; limit?: number; status?: string; startTime?: string; endTime?: string }) => {
    return request.get<{ list: RiskEvent[]; total: number }>('/api/risk/events', { params });
  },
  handleRiskEvent: (id: number, data: { status: 'processed' | 'reviewing'; notes?: string }) => {
    return request.put(`/api/risk/events/${id}/handle`, data);
  }
};
