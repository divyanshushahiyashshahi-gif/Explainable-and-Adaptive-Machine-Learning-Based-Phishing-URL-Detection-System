import os
import sys
import joblib
import pandas as pd
from urllib.parse import urlparse

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

sys.path.append(
    os.path.join(
        os.path.dirname(os.path.abspath(__file__)),
        "src"
    )
)

from feature_extraction import extract_features
from explain_prediction import explain_prediction
from feedback import save_feedback


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="Explainable Phishing URL Detection System",
    description="Explainable and Adaptive Machine Learning-Based Phishing URL Detection System",
    version="1.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# LOAD MODEL
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model.pkl")

model = joblib.load(MODEL_PATH)


# ============================================================
# TRUSTED DOMAINS
# ============================================================

TRUSTED_DOMAINS = {
    "google.com",
    "microsoft.com",
    "amazon.com",
    "flipkart.com",
    "wikipedia.org",
    "github.com",
    "apple.com",
    "youtube.com",
    "facebook.com",
    "instagram.com",
    "linkedin.com"
}


# ============================================================
# REQUEST MODEL
# ============================================================

class URLRequest(BaseModel):
    url: str


class FeedbackRequest(BaseModel):
    url: str
    prediction: int
    user_label: int


# ============================================================
# ROOT API
# ============================================================

@app.get("/")
def home():

    return {
        "message": "Explainable Phishing URL Detection API",
        "status": "running"
    }


# ============================================================
# URL PREDICTION
# ============================================================

@app.post("/predict")
def predict_url(request: URLRequest):

    url = request.url.strip()

    # --------------------------------------------------------
    # CHECK EMPTY URL
    # --------------------------------------------------------

    if not url:

        return {
            "error": "Please enter a URL."
        }


    # --------------------------------------------------------
    # PARSE DOMAIN
    # --------------------------------------------------------

    parsed_url = urlparse(url)

    domain = parsed_url.netloc.lower().split(":")[0]

    if domain.startswith("www."):
        domain = domain[4:]


    # --------------------------------------------------------
    # EXTRACT 15 FEATURES
    # --------------------------------------------------------

    features = extract_features(url)


    # --------------------------------------------------------
    # TRUSTED DOMAIN CHECK
    # --------------------------------------------------------

    if domain in TRUSTED_DOMAINS:

        return {

            "url": url,

            "domain": domain,

            "trusted_domain": True,

            "prediction": 1,

            "result": "LEGITIMATE URL",

            "phishing_probability": 0.0,

            "legitimate_probability": 100.0,

            "features": features,

            "reasons": [
                "Verified trusted domain"
            ]

        }


    # --------------------------------------------------------
    # CONVERT FEATURES TO DATAFRAME
    # --------------------------------------------------------

    input_data = pd.DataFrame([features])


    # --------------------------------------------------------
    # ML PREDICTION
    # --------------------------------------------------------

    prediction = model.predict(input_data)[0]

    probability = model.predict_proba(input_data)[0]


    # Dataset mapping:
    # 0 = Phishing
    # 1 = Legitimate

    phishing_probability = probability[0] * 100

    legitimate_probability = probability[1] * 100


    # --------------------------------------------------------
    # RESULT
    # --------------------------------------------------------

    if prediction == 0:

        result = "PHISHING URL"

    else:

        result = "LEGITIMATE URL"


    # --------------------------------------------------------
    # EXPLANATION
    # --------------------------------------------------------

    reasons = explain_prediction(url)


    # --------------------------------------------------------
    # RESPONSE
    # --------------------------------------------------------

    return {

        "url": url,

        "domain": domain,

        "trusted_domain": False,

        "prediction": int(prediction),

        "result": result,

        "phishing_probability": round(
            phishing_probability,
            2
        ),

        "legitimate_probability": round(
            legitimate_probability,
            2
        ),

        "features": features,

        "reasons": reasons

    }


# ============================================================
# SAVE USER FEEDBACK
# ============================================================

@app.post("/feedback")
def submit_feedback(request: FeedbackRequest):

    save_feedback(
        request.url,
        request.prediction,
        request.user_label
    )

    return {

        "message": "Feedback saved successfully.",

        "url": request.url,

        "model_prediction": request.prediction,

        "user_label": request.user_label

    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {

        "status": "healthy",

        "model_loaded": model is not None

    }