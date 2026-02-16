import json
import os
from datetime import datetime

LOG_FILE = "logs.json"

class AuditLogger:
    @staticmethod
    def log_event(username: str, action: str, details: dict):
        """
        Appends a structured JSON log entry to logs.json
        """
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "username": username,
            "action": action,
            "details": details
        }

        if not os.path.exists(LOG_FILE):
            with open(LOG_FILE, 'w') as f:
                json.dump([], f)

        try:
            with open(LOG_FILE, 'r+') as f:
                try:
                    logs = json.load(f)
                except json.JSONDecodeError:
                    logs = []
                
                logs.append(entry)
                f.seek(0)
                json.dump(logs, f, indent=4)
        except Exception as e:
            print(f"CRITICAL LOGGING ERROR: {e}")