class RiskConfig:
    # Risk Weights (The "Cost" of an anomaly)
    WEIGHTS = {
        "unknown_device": 25,
        "unknown_location": 25,
        "abnormal_time": 20,
        "failed_attempts_1": 10,
        "failed_attempts_2": 20,
        "failed_attempts_3_plus": 30,
    }

    # Thresholds
    # < 30 = LOW
    # 30 - 69 = MEDIUM
    # >= 70 = HIGH
    THRESHOLD_MEDIUM = 30
    THRESHOLD_HIGH = 70

    # MFA Settings
    OTP_EXPIRY_SECONDS = 120
    OTP_LENGTH = 6