from config import RiskConfig
from schemas import LoginRequest, RiskAnalysis

class RiskEngine:
    @staticmethod
    def evaluate_risk(data: LoginRequest) -> RiskAnalysis:
        score = 0
        reasons = []

        # 1. Evaluate Device
        if not data.known_device:
            score += RiskConfig.WEIGHTS["unknown_device"]
            reasons.append("Unknown Device Detected")

        # 2. Evaluate Location
        if not data.known_location:
            score += RiskConfig.WEIGHTS["unknown_location"]
            reasons.append("Unusual Location Detected")

        # 3. Evaluate Time
        if not data.login_time_normal:
            score += RiskConfig.WEIGHTS["abnormal_time"]
            reasons.append("Login outside standard business hours")

        # 4. Evaluate Failed Attempts
        if data.failed_attempts >= 3:
            score += RiskConfig.WEIGHTS["failed_attempts_3_plus"]
            reasons.append(f"High volume of failed attempts ({data.failed_attempts})")
        elif data.failed_attempts == 2:
            score += RiskConfig.WEIGHTS["failed_attempts_2"]
            reasons.append("Multiple failed attempts detected")
        elif data.failed_attempts == 1:
            score += RiskConfig.WEIGHTS["failed_attempts_1"]
            reasons.append("Previous login attempt failed")

        # 5. Determine Risk Level
        if score >= RiskConfig.THRESHOLD_HIGH:
            level = "HIGH"
        elif score >= RiskConfig.THRESHOLD_MEDIUM:
            level = "MEDIUM"
        else:
            level = "LOW"

        return RiskAnalysis(
            score=score,
            level=level,
            reasons=reasons
        )