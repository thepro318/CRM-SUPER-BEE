# Super Bee V1 Data Model

The CRM should be built around outcomes, not just contacts.

## Core entities

- **Customer**: person identity and stable contact data.
- **Lead**: a specific sales opportunity, source, vehicle interest, stage, score, owner, and timestamps.
- **Conversation**: channel thread (SMS/email/call) linked to a lead.
- **Message**: individual inbound/outbound communication with delivery and AI metadata.
- **Task**: next action with due date, priority, completion, and origin (human/agent).
- **Appointment**: scheduled store visit with confirmation, show/no-show, and reschedule state.
- **Vehicle**: inventory record used for matching.
- **AgentAction**: recommendation or executed AI action with confidence, rationale, approval state, and audit metadata.
- **Outcome**: appointment set, confirmation, show, sold, lost, gross, or other measurable result.

## Non-negotiable design rule

AI recommendations must be traceable to inputs and outcomes. Never store only the final AI text; store which agent produced it, confidence, rationale, approval state, and the resulting outcome so the system can be evaluated later.
