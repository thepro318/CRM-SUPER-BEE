"""Super BDC demo-only backend. Python standard library; no outbound integration."""
from __future__ import annotations
import hmac
import json
import os
import secrets
import sqlite3
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

DB_PATH = os.environ.get("SUPER_BDC_DB", str(Path(__file__).with_name("demo.sqlite3")))
TOKEN = os.environ.get("SUPER_BDC_DEMO_TOKEN", "")
HOST = os.environ.get("SUPER_BDC_HOST", "127.0.0.1")
PORT = int(os.environ.get("SUPER_BDC_PORT", "8765"))
MAX_BODY = 16_384
DEFAULT_LEADS = [
    ("DEMO-1001", "Jordan Brooks", "2021 Toyota Camry", "financing", "Hot", 1, 0),
    ("DEMO-1002", "Taylor Morgan", "2019 Honda Accord", "appointment", "Hot", 1, 0),
    ("DEMO-1003", "Casey Rivera", "2020 Ford Escape", "price", "Warm", 1, 0),
    ("DEMO-1004", "Drew Bailey", "2017 Ford F-150", "optout", "Cold", 0, 1),
]


def connect():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys=ON")
    return db


def initialize():
    with connect() as db:
        db.executescript("""
          CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY, name TEXT NOT NULL, vehicle TEXT NOT NULL,
            intent TEXT NOT NULL, temperature TEXT NOT NULL,
            consent INTEGER NOT NULL, opted_out INTEGER NOT NULL, note TEXT NOT NULL DEFAULT ''
          );
          CREATE TABLE IF NOT EXISTS drafts (
            id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id),
            channel TEXT NOT NULL CHECK(channel IN ('sms','email')),
            text TEXT NOT NULL, created_at TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY, lead_id TEXT NOT NULL REFERENCES leads(id),
            starts_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'demo-confirmed'
          );
          CREATE TABLE IF NOT EXISTS audit (
            id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL,
            subject TEXT NOT NULL, at TEXT NOT NULL
          );
        """)
        db.executemany(
            "INSERT OR IGNORE INTO leads(id,name,vehicle,intent,temperature,consent,opted_out) VALUES (?,?,?,?,?,?,?)",
            DEFAULT_LEADS,
        )


def stamp():
    return datetime.now(timezone.utc).isoformat()


def record(db, action, subject):
    db.execute("INSERT INTO audit(action,subject,at) VALUES (?,?,?)", (action, subject, stamp()))


def lead_or_error(db, lead_id):
    item = db.execute("SELECT * FROM leads WHERE id = ?", (lead_id,)).fetchone()
    if item is None:
        raise ValueError("Unknown demo lead")
    return item


def draft_for(lead, channel):
    if lead["opted_out"] or not lead["consent"]:
        raise PermissionError("Lead is opted out or lacks verified demo consent")
    if channel not in ("sms", "email"):
        raise ValueError("Unsupported channel")
    first = lead["name"].split()[0]
    prompts = {
        "financing": "Is your bigger priority keeping the down payment low or finding a comfortable monthly payment?",
        "appointment": "What day and time would work for a visit? We will verify the schedule before confirming.",
        "price": "I can help you review the pricing. Are you considering financing or cash?",
        "optout": "",
    }
    body = f"Hi {first}, this is the Vic Garrett Motors sales team. {prompts.get(lead['intent'], 'What questions can I answer about your vehicle search?')}"
    return ("Subject: Your vehicle inquiry\n\n" + body if channel == "email" else body)


def process(method, path, body=None):
    """Service layer can be exercised without a server."""
    body = body or {}
    with connect() as db:
        if method == "GET" and path == "/api/health":
            return 200, {"mode": "demo", "dealerSocketConnected": False, "sendingEnabled": False}
        if method == "GET" and path == "/api/leads":
            return 200, {"leads": [dict(x) for x in db.execute("SELECT * FROM leads ORDER BY id")]}
        if method == "GET" and path == "/api/audit":
            return 200, {"events": [dict(x) for x in db.execute("SELECT * FROM audit ORDER BY id DESC LIMIT 100")]}
        if method == "POST" and path == "/api/drafts":
            lead = lead_or_error(db, str(body.get("leadId", "")))
            channel = body.get("channel", "sms")
            msg = draft_for(lead, channel)
            draft_id = "DEMO-" + secrets.token_hex(8)
            db.execute("INSERT INTO drafts VALUES (?,?,?,?,?)", (draft_id, lead["id"], channel, msg, stamp()))
            record(db, "draft.created", lead["id"])
            return 201, {"id": draft_id, "text": msg, "sent": False}
        if method == "GET" and path == "/api/drafts":
            return 200, {"drafts": [dict(x) for x in db.execute("SELECT * FROM drafts ORDER BY created_at DESC")]}
        if method == "POST" and path == "/api/appointments":
            lead = lead_or_error(db, str(body.get("leadId", "")))
            if lead["opted_out"]:
                raise PermissionError("Cannot book for opted-out demo contact")
            raw = body.get("startsAt", "")
            try:
                parsed = datetime.fromisoformat(raw)
                if parsed.tzinfo is None or parsed <= datetime.now(timezone.utc):
                    raise ValueError()
            except (TypeError, ValueError):
                raise ValueError("startsAt must be a future offset-aware ISO timestamp")
            appt_id = "DEMO-" + secrets.token_hex(8)
            db.execute("INSERT INTO appointments VALUES (?,?,?,?)", (appt_id, lead["id"], raw, "demo-confirmed"))
            record(db, "appointment.created", lead["id"])
            return 201, {"id": appt_id, "status": "demo-confirmed", "crmSynced": False}
        if method == "GET" and path == "/api/appointments":
            return 200, {"appointments": [dict(x) for x in db.execute("SELECT * FROM appointments ORDER BY starts_at")]}
        if path.startswith("/api/dealersocket") or path == "/api/send":
            return 403, {"error": "Live integrations and messaging are hard-disabled"}
        return 404, {"error": "Endpoint not found"}


class Handler(BaseHTTPRequestHandler):
    def respond(self, code, payload):
        data = json.dumps(payload).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Content-Security-Policy", "default-src 'none'")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def route(self, method):
        # A local development token is not user authentication or production authorization.
        header = self.headers.get("Authorization", "")
        if not TOKEN or not hmac.compare_digest(header, "Bearer " + TOKEN):
            return self.respond(401, {"error": "Valid local development token required"})
        parsed = urlparse(self.path)
        if not parsed.path.startswith("/api/"):
            return self.respond(404, {"error": "Not found"})
        body = {}
        if method == "POST":
            length = self.headers.get("Content-Length", "0")
            try:
                n = int(length)
            except ValueError:
                return self.respond(400, {"error": "Invalid content length"})
            if n <= 0 or n > MAX_BODY:
                return self.respond(413, {"error": "Invalid request size"})
            try:
                body = json.loads(self.rfile.read(n))
                if not isinstance(body, dict):
                    raise ValueError()
            except (ValueError, UnicodeDecodeError):
                return self.respond(400, {"error": "JSON object required"})
        try:
            code, payload = process(method, parsed.path, body)
            return self.respond(code, payload)
        except PermissionError as exc:
            return self.respond(403, {"error": str(exc)})
        except (ValueError, sqlite3.IntegrityError) as exc:
            return self.respond(400, {"error": str(exc)})

    def do_GET(self):
        self.route("GET")

    def do_POST(self):
        self.route("POST")

    def log_message(self, fmt, *args):
        return


if __name__ == "__main__":
    if not TOKEN or len(TOKEN) < 24:
        raise SystemExit("Set SUPER_BDC_DEMO_TOKEN to a random value of at least 24 characters.")
    if HOST not in ("127.0.0.1", "localhost", "::1"):
        raise SystemExit("Demo server must only bind to loopback.")
    initialize()
    print(f"Super BDC DEMO API: http://{HOST}:{PORT} (no external integrations)")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
