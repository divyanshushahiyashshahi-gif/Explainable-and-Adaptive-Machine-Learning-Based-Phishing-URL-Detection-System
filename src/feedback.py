import csv
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FEEDBACK_DIR = os.path.join(BASE_DIR, "dataset")
FEEDBACK_FILE = os.path.join(FEEDBACK_DIR, "feedback.csv")


def save_feedback(url, prediction, user_label):
    os.makedirs(FEEDBACK_DIR, exist_ok=True)

    file_exists = os.path.exists(FEEDBACK_FILE)

    with open(FEEDBACK_FILE, "a", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "timestamp", "URL", "model_prediction", "user_label"
            ])

        writer.writerow([
            datetime.now().isoformat(), url, prediction, user_label
        ])

    return {"message": "Feedback saved successfully."}