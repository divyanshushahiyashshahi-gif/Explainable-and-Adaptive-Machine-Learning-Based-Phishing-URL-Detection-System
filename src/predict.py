import sys
import os
import joblib
import pandas as pd
from urllib.parse import urlparse

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from feature_extraction import extract_features
from explain_prediction import explain_prediction
from feedback import save_feedback


# ============================================================
# LOAD MODEL
# ============================================================

model = joblib.load("model.pkl")


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
# HEADER
# ============================================================

print("=" * 60)
print("       EXPLAINABLE PHISHING URL DETECTION SYSTEM")
print("=" * 60)


# ============================================================
# INPUT
# ============================================================

url = input("\nEnter URL: ").strip()

if not url:
    print("Please enter a URL.")
    sys.exit()


# ============================================================
# DOMAIN
# ============================================================

parsed_url = urlparse(url)

domain = parsed_url.netloc.lower().split(":")[0]

if domain.startswith("www."):
    domain = domain[4:]


# ============================================================
# EXTRACT 15 FEATURES
# ============================================================

features = extract_features(url)

print("\nEXTRACTED URL FEATURES")
print("-" * 60)

for feature, value in features.items():
    if isinstance(value, float):
        print(f"{feature:30} : {value:.4f}")
    else:
        print(f"{feature:30} : {value}")

print("-" * 60)


# ============================================================
# TRUSTED DOMAIN CHECK
# ============================================================

if domain in TRUSTED_DOMAINS:

    print("\n" + "=" * 60)
    print("RESULT: LEGITIMATE URL")
    print("Phishing Probability  : 0.00%")
    print("Legitimate Probability: 100.00%")
    print("=" * 60)

    print("\nWHY THIS RESULT?")
    print("-" * 60)
    print("• Verified trusted domain")
    print("=" * 60)

    sys.exit()


# ============================================================
# CONVERT FEATURES TO DATAFRAME
# ============================================================

input_data = pd.DataFrame([features])


# ============================================================
# ML PREDICTION
# ============================================================

prediction = model.predict(input_data)[0]

probability = model.predict_proba(input_data)[0]


# Dataset mapping:
# 0 = Phishing
# 1 = Legitimate

phishing_probability = probability[0] * 100
legitimate_probability = probability[1] * 100


# ============================================================
# RESULT
# ============================================================

print("\n" + "=" * 60)

if prediction == 0:
    result = "PHISHING URL"
else:
    result = "LEGITIMATE URL"

print(f"RESULT: {result}")

print(f"Phishing Probability  : {phishing_probability:.2f}%")
print(f"Legitimate Probability: {legitimate_probability:.2f}%")

print("=" * 60)


# ============================================================
# EXPLANATION
# ============================================================

print("\nWHY THIS RESULT?")
print("-" * 60)

reasons = explain_prediction(url)

for reason in reasons:
    print("•", reason)

print("=" * 60)


# ============================================================
# FEEDBACK
# ============================================================

print("\nWas this prediction correct?")

feedback = input(
    "Enter Y for Yes / N for No: "
).strip().lower()


if feedback == "y":

    user_label = prediction

    save_feedback(
        url,
        prediction,
        user_label
    )

    print("✅ Feedback saved.")


elif feedback == "n":

    correct_label = input(
        "Enter correct label (0 = Phishing, 1 = Legitimate): "
    ).strip()

    if correct_label in ["0", "1"]:

        save_feedback(
            url,
            prediction,
            int(correct_label)
        )

        print("✅ Corrected feedback saved.")

    else:

        print("Invalid label. Feedback not saved.")


else:

    print("Feedback skipped.")