"""Run with python -m unittest discover -s super-bdc -p 'test_*.py'."""
import importlib.util
import os
from pathlib import Path
import tempfile
import unittest
from datetime import datetime, timedelta, timezone

spec = importlib.util.spec_from_file_location("backend", Path(__file__).with_name("backend.py"))
backend = importlib.util.module_from_spec(spec)
spec.loader.exec_module(backend)


class BackendTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        backend.DB_PATH = str(Path(self.tmp.name) / "demo.sqlite3")
        backend.initialize()

    def tearDown(self):
        self.tmp.cleanup()

    def test_healthy_and_never_connected(self):
        code, result = backend.process("GET", "/api/health")
        self.assertEqual(code, 200)
        self.assertFalse(result["dealerSocketConnected"])
        self.assertFalse(result["sendingEnabled"])

    def test_seeded_leads_and_persistent_draft(self):
        _, result = backend.process("GET", "/api/leads")
        self.assertEqual(len(result["leads"]), 4)
        code, draft = backend.process("POST", "/api/drafts", {"leadId": "DEMO-1001", "channel": "sms"})
        self.assertEqual(code, 201)
        self.assertFalse(draft["sent"])
        _, saved = backend.process("GET", "/api/drafts")
        self.assertEqual(saved["drafts"][0]["id"], draft["id"])

    def test_opt_out_blocks_drafts(self):
        with self.assertRaises(PermissionError):
            backend.process("POST", "/api/drafts", {"leadId": "DEMO-1004"})

    def test_unknown_lead_rejected(self):
        with self.assertRaises(ValueError):
            backend.process("POST", "/api/drafts", {"leadId": "UNKNOWN"})

    def test_appointment_is_demo_only(self):
        time = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        code, result = backend.process("POST", "/api/appointments", {"leadId": "DEMO-1002", "startsAt": time})
        self.assertEqual(code, 201)
        self.assertFalse(result["crmSynced"])
        _, saved = backend.process("GET", "/api/appointments")
        self.assertEqual(len(saved["appointments"]), 1)

    def test_reject_past_or_naive_appointments(self):
        for time in ["2020-01-01T12:00:00+00:00", "2099-01-01T12:00:00", "nonsense"]:
            with self.assertRaises(ValueError):
                backend.process("POST", "/api/appointments", {"leadId": "DEMO-1001", "startsAt": time})

    def test_send_and_dealersocket_hard_disabled(self):
        for path in ["/api/send", "/api/dealersocket/leads", "/api/dealersocket/send"]:
            code, result = backend.process("POST", path, {"message": "test"})
            self.assertEqual(code, 403)
            self.assertIn("disabled", result["error"])


if __name__ == "__main__":
    unittest.main()
