from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import engine, Base, get_db
from schemas import LoginRequest, LoginResponse, VerifyOTPRequest
from services.risk_engine import RiskEngine
from services.otp_service import OTPService
from services.audit_logger import AuditLogger

# Create Tables on Startup
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Risk-Based MFA API")

# Enable CORS for your Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Analyzes login context and determines if MFA is needed.
    """
    # 1. Evaluate Risk
    analysis = RiskEngine.evaluate_risk(request)
    
    # 2. Log the attempt
    AuditLogger.log_event(request.username, "LOGIN_ATTEMPT", {
        "risk_score": analysis.score,
        "risk_level": analysis.level,
        "reasons": analysis.reasons
    })

    # 3. Decision Logic
    mfa_required = False
    message = "Login successful"
    
    if analysis.level in ["MEDIUM", "HIGH"]:
        mfa_required = True
        message = "Risk detected. MFA required."
        
        # If no email provided in request, use a dummy one for the demo
        email_target = request.email if request.email else "demo-user@example.com"

        # Generate OTP (Sends email if configured, otherwise prints to console)
        OTPService.generate_and_send_otp(db, request.username, email_target)
        
        AuditLogger.log_event(request.username, "MFA_CHALLENGE", {
            "trigger": "risk_threshold_exceeded"
        })

    return LoginResponse(
        status="success" if not mfa_required else "mfa_pending",
        message=message,
        risk_analysis=analysis,
        mfa_required=mfa_required,
        token="demo-jwt-token" if not mfa_required else None
    )

@app.post("/verify-otp")
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Verifies the OTP provided by the user.
    """
    is_valid = OTPService.verify_otp(db, request.username, request.otp_code)
    
    if is_valid:
        AuditLogger.log_event(request.username, "MFA_SUCCESS", {})
        return {
            "status": "success", 
            "message": "OTP Verified. Access Granted.",
            "token": "demo-jwt-token-verified"
        }
    else:
        AuditLogger.log_event(request.username, "MFA_FAILED", {})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid or expired OTP"
        )

@app.get("/")
def read_root():
    return {"status": "System Operational", "service": "Risk-Based MFA Backend"}