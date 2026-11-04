# Super BDC — AI Sales Command Center (Prototype v0.1)

A **mock-data-only**, responsive automotive BDC dashboard for evaluating workflows before any live CRM integration.

## Run
Open `super-bdc/index.html` in a modern desktop browser, preferably through a local static server:

```bash
cd super-bdc
python -m http.server 8000
```

Then open http://localhost:8000. The browser's ES module import requires serving over HTTP rather than opening the HTML as a `file://` URL.

## Features
- Dashboard: lead statistics, recent activity, safety state.
- Lead queue: search, temperature classification, fictional customer records, editable local notes.
- Messaging: fictional conversation history; rule-based text/email drafts; **no sending**.
- Appointments: create/cancel demo-only appointments, hours validation; **no live scheduling**.
- AI Sales Brain: documented coaching-inspired response strategy; deterministic draft-preview simulator, **not a production LLM**.
- Controls: approval/draft-only preferences, processing target, audit trail, reset local data.
- Analytics: metric definitions and mock counts, with no false claims about sales or appointments.
- DealerSocket adapter: fail-closed stubs for lead reads, conversation reads, notes, appointments, and outgoing messages.

## Security boundaries
- No customer identifiers, real phone numbers, API keys, credentials, or production communications are bundled.
- All example leads are invented. Do not import actual dealership customer records into this prototype.
- Demo state is saved only to the browser's localStorage; do not treat that as secure storage for real customer data.
- `sendMessage` and **every** DealerSocket adapter operation throws a disabled error.
- No third-party requests are performed.
- Opt-out and missing-consent conditions block draft generation; demo sending is disabled for all leads.
- This version is not production-hardened, authenticated, or suitable for protected customer information.
- A live implementation requires dealership authorization, secure backend authentication, role-based permissions, encryption, verified opt-out/consent management, retention policy, audited API use, and independent security/compliance review.

## Required next steps
1. Confirm DealerSocket partner/API eligibility and approved technical documentation.
2. Design a private backend, identity/role system, queue worker, rate limits, audit events, idempotent writes, and secure secret storage.
3. Build a human-reviewed messaging pilot with proven consent, opt-out handling, and actual appointment-slot verification.
4. Add unit, integration, accessibility, mobile viewport, and end-to-end tests before any live usage.
5. Implement operational cost accounting (model usage, SMS/email provider charges, and task completion rates).

## Project status
Proof-of-concept code on feature branch. No live DealerSocket connection, email/SMS integration, AI API, automatic execution, or deployment has been authorized or performed.