import type { AgentRecommendation } from './types';

export function canAutoExecute(recommendation: AgentRecommendation) {
  if (recommendation.requiresApproval) return false;
  if (recommendation.risk !== 'low') return false;
  return recommendation.confidence >= 0.9;
}

export const supervisedActions = [
  'send-sms',
  'send-email',
  'book-appointment',
  'change-lead-status',
  'quote-financing-terms',
] as const;
