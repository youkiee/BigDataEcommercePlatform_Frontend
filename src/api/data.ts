import request from '../utils/request';

interface EncryptionConfig {
  tls: boolean;
  aes: boolean;
  keyManagement: 'local' | 'cloud' | 'hsm';
}

interface MaskingScenario {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

interface MaskingRule {
  id: number;
  field: string;
  type: string;
  rule: string;
  status: 'active' | 'inactive';
}

interface AuditLog {
  id: number;
  time: string;
  user: string;
  action: string;
  dataRange: string;
  ip: string;
  status: 'success' | 'failure';
}

interface SecurityEvent {
  id: number;
  time: string;
  type: string;
  description: string;
  level: 'high' | 'medium' | 'low';
  status: 'unprocessed' | 'processed' | 'reviewing';
}

export const dataApi = {
  getEncryptionConfig: () => {
    return request.get<EncryptionConfig>('/api/data/encryption');
  },
  updateEncryptionConfig: (data: EncryptionConfig) => {
    return request.put('/api/data/encryption', data);
  },
  getMaskingScenarios: () => {
    return request.get<MaskingScenario[]>('/api/data/masking/scenarios');
  },
  updateMaskingScenario: (id: number, data: { status: boolean }) => {
    return request.put(`/api/data/masking/scenarios/${id}`, data);
  },
  getMaskingRules: () => {
    return request.get<MaskingRule[]>('/api/data/masking/rules');
  },
  createMaskingRule: (data: Omit<MaskingRule, 'id'>) => {
    return request.post<MaskingRule>('/api/data/masking/rules', data);
  },
  updateMaskingRule: (id: number, data: Partial<MaskingRule>) => {
    return request.put<MaskingRule>(`/api/data/masking/rules/${id}`, data);
  },
  deleteMaskingRule: (id: number) => {
    return request.delete(`/api/data/masking/rules/${id}`);
  },
  getAuditLogs: (params: { page?: number; limit?: number; user?: string; action?: string; startTime?: string; endTime?: string }) => {
    return request.get<{ list: AuditLog[]; total: number }>('/api/data/audit/logs', { params });
  },
  getSecurityEvents: (params: { page?: number; limit?: number; level?: string; status?: string }) => {
    return request.get<{ list: SecurityEvent[]; total: number }>('/api/data/security/events', { params });
  },
  handleSecurityEvent: (id: number, data: { status: 'processed' | 'reviewing'; notes?: string }) => {
    return request.put(`/api/data/security/events/${id}/handle`, data);
  }
};
