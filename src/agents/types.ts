export type AgentName = 'head' | 'follow-up' | 'appointment' | 'inventory-match' | 'lead-score';

export type AgentRisk = 'low' | 'medium' | 'high';

export interface AgentRecommendation {
  id: string;
  agent: AgentName;
  leadId?: string;
  title: string;
  rationale: string;
  confidence: number;
  risk: AgentRisk;
  requiresApproval: boolean;
  suggestedAction: string;
}

export interface AgentContext {
  dealershipHours: Record<string, string>;
  now: string;
  userId: string;
}
