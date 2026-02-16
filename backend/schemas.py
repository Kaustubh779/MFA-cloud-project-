from pydantic import BaseModel, EmailStr
from typing import List, Optional

# --- Request Schemas ---
class LoginRequest(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None 
    known_device: bool
    known_location: bool
    login_time_normal: bool
    failed_attempts: int

class VerifyOTPRequest(BaseModel):
    username: str
    otp_code: str

# --- Response Schemas ---
class RiskAnalysis(BaseModel):
    score: int
    level: str
    reasons: List[str]

class LoginResponse(BaseModel):
    status: str
    message: str
    risk_analysis: RiskAnalysis
    mfa_required: bool
    token: Optional[str] = None