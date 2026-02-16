import secrets
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import os
from sqlalchemy.orm import Session
from models import OTPRecord
from config import RiskConfig

class OTPService:
    @staticmethod
    def generate_and_send_otp(db: Session, username: str, email: str) -> str:
        # 1. Generate Secure Crypto OTP
        otp_code = "".join([str(secrets.randbelow(10)) for _ in range(RiskConfig.OTP_LENGTH)])
        
        # 2. Store in Database
        expires_at = datetime.utcnow() + timedelta(seconds=RiskConfig.OTP_EXPIRY_SECONDS)
        
        # Invalidate old OTPs for this user
        db.query(OTPRecord).filter(OTPRecord.username == username).delete()
        
        new_otp = OTPRecord(
            username=username,
            otp_code=otp_code,
            expires_at=expires_at,
            is_used=False
        )
        db.add(new_otp)
        db.commit()

        # 3. Send Email
        OTPService._send_email(email, otp_code)
        
        return otp_code

    @staticmethod
    def _send_email(to_email: str, otp: str):
        sender = os.getenv("MAIL_USERNAME")
        password = os.getenv("MAIL_PASSWORD")
        smtp_server = os.getenv("MAIL_SERVER")
        smtp_port = int(os.getenv("MAIL_PORT", 587))

        # Check if email is configured
        if not sender or not password or "your-real-email" in sender:
            print(f"\n[MOCK MODE] OTP for {to_email}: {otp}\n(Check terminal for code. Configure .env for real email)\n")
            return

        msg = MIMEText(f"Your Security Code is: {otp}. It expires in 2 minutes.")
        msg['Subject'] = "Your MFA Login Code"
        msg['From'] = sender
        msg['To'] = to_email

        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(sender, password)
                server.sendmail(sender, to_email, msg.as_string())
            print(f"✅ [EMAIL SENT] OTP sent to {to_email}")
        except Exception as e:
            print(f"❌ [EMAIL ERROR] Failed to send: {e}")

    @staticmethod
    def verify_otp(db: Session, username: str, code: str) -> bool:
        record = db.query(OTPRecord).filter(
            OTPRecord.username == username,
            OTPRecord.is_used == False
        ).first()

        if not record:
            return False

        if datetime.utcnow() > record.expires_at:
            return False

        if record.otp_code == code:
            record.is_used = True
            db.commit()
            return True

        return False