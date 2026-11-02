# Backend development (DEMO ONLY)

The browser UI remains standalone using invented leads and browser-local demo storage. The new API is **a separate foundation**, not yet wired into the UI.

## Prerequisites

- Python 3.10+ (standard library only)
- No DealerSocket account, credentials, real lead files, or SMS/email provider

## Local API run

From the repository root, in PowerShell:

```powershell
$env:SUPER_BDC_DEMO_TOKEN = python -c "import secrets; print(secrets.token_urlsafe(36))"
python super-bdc/backend.py
```

The service listens on `127.0.0.1:8765` only.

For a second PowerShell window, set the same token securely from your first session (avoid committing it to GitHub):

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8765/api/health -Headers @{Authorization="Bearer YOUR_LOCAL_TOKEN"}
```

The database is automatically created as `super-bdc/demo.sqlite3` (locally only). Do not put real customer information into it.

## Tests

```powershell
python -m unittest discover -s super-bdc -p "test_*.py" -v
```

## Security and implementation boundary

- Local development bearer token only; **not** production identity or permission management
- SQLite persists fictional leads, draft history, mock appointment records, and audit events
- Server is loopback-only and never makes outgoing network requests
- Sending and DealerSocket endpoints return HTTP 403 unconditionally
- No AI model integration; current drafts use rule-based text
- Real deployment needs multi-user authentication, server-side authorization, encryption, logs without PII, secure secrets, provider contracts, verified opt-in/opt-out, consent audit, rate limits, and automated CI before live data
- Public repo: **never commit tokens, sqlite databases, or real customer records**

This is explicitly not ready for deployment on a public server.
