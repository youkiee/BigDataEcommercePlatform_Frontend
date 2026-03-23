import request from '../utils/request';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  reason: string;
  category: string;
  brand: string;
}

interface RecommendationStrategy {
  id: number;
  name: string;
  algorithm: 'collaborative' | 'content' | 'deep';
  parameters: Record<string, any>;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface ABTest {
  id: string;
  name: string;
  algorithms: string[];
  startTime: string;
  endTime: string;
  status: 'running' | 'completed' | 'stopped';
  trafficSplit: number[];
}

interface RecommendationLog {
  id: number;
  userId: number;
  productId: number;
  productName: string;
  reason: string;
  action: 'impression' | 'click' | 'cart' | 'purchase';
  time: string;
}

export const recommendApi = {
  getRecommendedProducts: (params: { scene: 'home' | 'cart' | 'like' | 'hot'; limit?: number }) => {
    return request.get<Product[]>('/api/recommend/products', { params });
  },
  markNotInterested: (productId: number) => {
    return request.post(`/api/recommend/products/${productId}/not-interested`);
  },
  getStrategies: () => {
    return request.get<RecommendationStrategy[]>('/api/recommend/strategies');
  },
  createStrategy: (data: Omit<RecommendationStrategy, 'id' | 'createdAt' | 'updatedAt'>) => {
    return request.post<RecommendationStrategy>('/api/recommend/strategies', data);
  },
  updateStrategy: (id: number, data: Partial<RecommendationStrategy>) => {
    return request.put<RecommendationStrategy>(`/api/recommend/strategies/${id}`, data);
  },
  deleteStrategy: (id: number) => {
    return request.delete(`/api/recommend/strategies/${id}`);
  },
  createABTest: (data: Omit<ABTest, 'id' | 'status'>) => {
    return request.post<ABTest>('/api/recommend/ab-test', data);
  },
  getABTests: () => {
    return request.get<ABTest[]>('/api/recommend/ab-test');
  },
  stopABTest: (id: string) => {
    return request.post(`/api/recommend/ab-test/${id}/stop`);
  },
  getRecommendationLogs: (params: { userId?: number; startTime?: string; endTime?: string; page?: number; limit?: number }) => {
    return request.get<{ list: RecommendationLog[]; total: number }>('/api/recommend/logs', { params });
  },
  getRecommendationEffect: (params: { startTime?: string; endTime?: string; strategyId?: number }) => {
    return request.get('/api/recommend/effect', { params });
  }
};
