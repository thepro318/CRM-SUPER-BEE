/**
 * SUPER BDC TYPE DEFINITIONS
 * Core domain models for automotive CRM
 */

// ============================================================================
// LEAD MANAGEMENT
// ============================================================================

export type LeadSource = 'messenger' | 'phone' | 'email' | 'walk-in' | 'website' | 'facebook' | 'google' | 'craigslist' | 'referral' | 'other';

export type PipelineStage = 
  | 'new' 
  | 'attempting-contact' 
  | 'engaged' 
  | 'qualified' 
  | 'appointment-set' 
  | 'confirmed' 
  | 'showed' 
  | 'sold' 
  | 'long-term-followup' 
  | 'lost' 
  | 'do-not-contact';

export type LeadTemperature = 'hot' | 'warm' | 'cool' | 'cold';

export type ContactChannel = 'call' | 'text' | 'email' | 'messenger' | 'whatsapp';

export type ContactPermission = 'call' | 'text' | 'email' | 'messenger';

export interface ConsentRecord {
  channel: ContactChannel;
  granted: boolean;
  grantedAt: Date;
  source: 'explicit' | 'inferred' | 'legacy-import';
  lastVerifiedAt?: Date;
}

export interface Lead {
  // Identification
  id: string;
  uuid?: string;
  externalId?: string;

  // Customer Information
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  messengerUsername?: string;
  preferredChannel: ContactChannel;

  // Lead Metadata
  source: LeadSource;
  stage: PipelineStage;
  temperature: LeadTemperature;
  isQualified: boolean;
  isDuplicate?: boolean;

  // Vehicle Interest
  vehicleInterest?: {
    makeModel?: string;
    bodyType?: string;
    priceRange?: [number, number];
    features?: string[];
  };

  // Timeline & Contact
  createdAt: Date;
  updatedAt: Date;
  firstContactAt?: Date;
  lastContactAt?: Date;
  nextFollowUpAt?: Date;
  appointmentAt?: Date;

  // Ownership & Compliance
  assignedTo?: string;
  doNotContact: boolean;
  emailUnsubscribed: boolean;
  consent: ConsentRecord[];

  // Communication & Context
  notes?: string;
  internalTasks: Task[];
  communicationHistory: Communication[];

  // AI & Scoring
  aiSummary?: string;
  aiNextAction?: string;
  aiConfidence?: number;
  aiTags?: string[];

  // Metadata
  importedAt?: Date;
  importSource?: string;
  messengerOnly?: boolean;
}

// ============================================================================
// COMMUNICATION
// ============================================================================

export type CommunicationType = 'call' | 'text' | 'email' | 'messenger' | 'note' | 'appointment-reminder';

export interface Communication {
  id: string;
  leadId: string;
  type: CommunicationType;
  direction: 'inbound' | 'outbound';
  timestamp: Date;
  subject?: string;
  body: string;
  channel: ContactChannel;
  status: 'draft' | 'pending' | 'sent' | 'delivered' | 'failed' | 'read';
  sentBy?: string;
  externalId?: string;
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Date;
}

// ============================================================================
// TASKS & FOLLOW-UPS
// ============================================================================

export type TaskType = 'followup' | 'call' | 'email' | 'appointment' | 'custom';
export type TaskStatus = 'pending' | 'completed' | 'cancelled' | 'overdue';

export interface Task {
  id: string;
  leadId: string;
  type: TaskType;
  title: string;
  description?: string;
  dueAt: Date;
  completedAt?: Date;
  status: TaskStatus;
  assignedTo: string;
  priority: 'high' | 'normal' | 'low';
  createdAt: Date;
  createdBy: string;
}

// ============================================================================
// APPOINTMENTS
// ============================================================================

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'showed' | 'no-show' | 'cancelled';

export interface Appointment {
  id: string;
  leadId: string;
  customerId?: string;
  title: string;
  scheduledAt: Date;
  status: AppointmentStatus;
  attendees: string[];
  vehicleId?: string;
  notes?: string;
  remindersSent: boolean;
  reminderSentAt?: Date;
  createdAt: Date;
  createdBy: string;
}

// ============================================================================
// INVENTORY
// ============================================================================

export interface Vehicle {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  color?: string;
  bodyType: string;
  transmission?: string;
  mileage?: number;
  price: number;
  condition: 'new' | 'used' | 'certified-pre-owned';
  imageUrl?: string;
  source: 'internal' | 'external-api';
}

// ============================================================================
// ANALYTICS & REPORTING
// ============================================================================

export interface LeadMetrics {
  totalLeads: number;
  leadsBySource: Record<LeadSource, number>;
  leadsByStage: Record<PipelineStage, number>;
  leadsByTemperature: Record<LeadTemperature, number>;
  medianFirstResponseTime?: number;
  contactRate: number;
  appointmentSetRate: number;
  appointmentConfirmationRate: number;
  showRate: number;
  soldRate: number;
  leadToSaleConversion: number;
  noShowRate: number;
  overdueFollowUps: number;
}

export interface RepPerformance {
  repId: string;
  leadsOwned: number;
  leadsQualified: number;
  appointmentsSet: number;
  showsConfirmed: number;
  salesClosed: number;
  conversionRate: number;
  avgFirstResponseTime: number;
}

// ============================================================================
// AI AGENTS & OPERATIONS
// ============================================================================

export type AgentType = 'head' | 'builder' | 'tester' | 'qa' | 'patch' | 'release-manager';
export type AgentAction = 'analyze' | 'test' | 'recommend' | 'patch' | 'release' | 'rollback';

export interface AgentFinding {
  id: string;
  agentId: string;
  agentType: AgentType;
  action: AgentAction;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedFiles: string[];
  expectedBenefits?: string[];
  risks?: string[];
  createdAt: Date;
  status: 'pending-review' | 'approved' | 'rejected' | 'implemented' | 'rolled-back';
}

export interface TestResult {
  id: string;
  agentId: string;
  category: 'speed' | 'ease-of-use' | 'lead-visibility' | 'followup' | 'appointment' | 'customer-context' | 'ai-transparency' | 'data-safety' | 'accessibility' | 'responsiveness';
  score: number;
  notes: string;
  timestamp: Date;
  passed: boolean;
}

export interface Release {
  id: string;
  version: string;
  releaseDate: Date;
  changes: string[];
  testResults: TestResult[];
  averageScore: number;
  minScore: number;
  passed: boolean; // true only if all scores >= 8.5
  rollbackPointId?: string;
  createdBy: string;
}

// ============================================================================
// USER & PERMISSIONS
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'bdc-manager' | 'salesperson' | 'admin' | 'ai-operator';
  permissions: UserPermission[];
  teams?: string[];
  createdAt: Date;
}

export type UserPermission = 
  | 'lead.read' 
  | 'lead.write' 
  | 'lead.delete' 
  | 'communication.send' 
  | 'appointment.create' 
  | 'ai.approve' 
  | 'release.approve' 
  | 'settings.admin';

// ============================================================================
// APPLICATION STATE
// ============================================================================

export interface AppState {
  leads: Lead[];
  communications: Communication[];
  tasks: Task[];
  appointments: Appointment[];
  vehicles: Vehicle[];
  users: User[];
  currentUser?: User;
  uiState: {
    selectedLeadId?: string;
    sidePanel: 'today' | 'none';
    theme: 'light' | 'dark';
    density: 'compact' | 'comfortable';
  };
  agentOps: {
    findings: AgentFinding[];
    testResults: TestResult[];
    releases: Release[];
  };
}
