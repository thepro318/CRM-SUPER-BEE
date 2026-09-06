import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AppState, Lead, Communication, Task, Appointment, User } from '@/types';

/**
 * SUPER BDC ZUSTAND STORE
 * 
 * Core state management with:
 * - localStorage persistence
 * - Migration support for schema changes
 * - Selective hydration to prevent data loss
 * - Typed actions for all mutations
 */

const initialState: AppState = {
  leads: [],
  communications: [],
  tasks: [],
  appointments: [],
  vehicles: [],
  users: [],
  currentUser: undefined,
  uiState: {
    selectedLeadId: undefined,
    sidePanel: 'none',
    theme: 'light',
    density: 'comfortable',
  },
  agentOps: {
    findings: [],
    testResults: [],
    releases: [],
  },
};

interface StoreActions {
  // LEADS
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  findLeadById: (id: string) => Lead | undefined;

  // COMMUNICATIONS
  addCommunication: (comm: Communication) => void;
  updateCommunication: (id: string, comm: Partial<Communication>) => void;
  getLeadCommunications: (leadId: string) => Communication[];

  // TASKS
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  completeTask: (id: string) => void;
  getLeadTasks: (leadId: string) => Task[];

  // APPOINTMENTS
  addAppointment: (apt: Appointment) => void;
  updateAppointment: (id: string, apt: Partial<Appointment>) => void;
  getLeadAppointments: (leadId: string) => Appointment[];

  // UI STATE
  setSelectedLeadId: (id?: string) => void;
  setSidePanel: (panel: 'today' | 'none') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setDensity: (density: 'compact' | 'comfortable') => void;

  // CURRENT USER
  setCurrentUser: (user: User | undefined) => void;
}

type CRMStore = AppState & StoreActions;

/**
 * MIGRATION HISTORY
 * 
 * Version 0: Initial schema
 * - Basic leads, communications, tasks, appointments
 * - No migrations needed
 * 
 * If schema changes, document migration functions here
 */

const migrate = (persistedState: unknown, version: number): AppState => {
  // Version 0 -> 1 example:
  // if (version === 0 && persistedState) {
  //   const state = persistedState as AppState;
  //   return {
  //     ...state,
  //     // transformation here
  //   };
  // }
  return persistedState as AppState || initialState;
};

export const useCRMStore = create<CRMStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // LEADS
      setLeads: (leads) => set({ leads }),
      addLead: (lead) => set((state) => ({ leads: [...state.leads, lead] })),
      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
        })),
      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),
      findLeadById: (id) => get().leads.find((l) => l.id === id),

      // COMMUNICATIONS
      addCommunication: (comm) =>
        set((state) => ({
          communications: [...state.communications, comm],
        })),
      updateCommunication: (id, updates) =>
        set((state) => ({
          communications: state.communications.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      getLeadCommunications: (leadId) => {
        const state = get();
        return state.communications.filter((c) => c.leadId === leadId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      },

      // TASKS
      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      completeTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'completed' as const, completedAt: new Date() } : t
          ),
        })),
      getLeadTasks: (leadId) => {
        const state = get();
        return state.tasks.filter((t) => t.leadId === leadId).sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
      },

      // APPOINTMENTS
      addAppointment: (apt) =>
        set((state) => ({
          appointments: [...state.appointments, apt],
        })),
      updateAppointment: (id, updates) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      getLeadAppointments: (leadId) => {
        const state = get();
        return state.appointments.filter((a) => a.leadId === leadId).sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());
      },

      // UI STATE
      setSelectedLeadId: (id) =>
        set((state) => ({ uiState: { ...state.uiState, selectedLeadId: id } })),
      setSidePanel: (panel) =>
        set((state) => ({ uiState: { ...state.uiState, sidePanel: panel } })),
      setTheme: (theme) =>
        set((state) => ({ uiState: { ...state.uiState, theme } })),
      setDensity: (density) =>
        set((state) => ({ uiState: { ...state.uiState, density } })),

      // CURRENT USER
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: 'super-bdc-crm',
      storage: createJSONStorage(() => localStorage),
      version: 0,
      migrate,
      partialize: (state) => ({
        leads: state.leads,
        communications: state.communications,
        tasks: state.tasks,
        appointments: state.appointments,
        vehicles: state.vehicles,
        users: state.users,
        uiState: state.uiState,
      }),
    }
  )
);

// Subscribe to store changes for debugging (remove in production)
if (import.meta.env.DEV) {
  useCRMStore.subscribe(
    (state) => state.leads,
    (leads) => {
      console.debug(`[Store] Leads updated: ${leads.length} leads`);
    }
  );
}
