import csv
import os
from datetime import datetime


FEEDBACK_FILE = "dataset/feedback.csv"


def save_feedback(url, prediction, user_label):

    file_exists = os.path.exists(FEEDBACK_FILE)

    with open(FEEDBACK_FILE, "a", newline="", encoding="utf-8") as file:

        writer = csv.writer(file)

        if not file_exists:
            writer.writerow([
                "timestamp",
                "URL",
                "model_prediction",
                "user_label"
            ])

        writer.writerow([
            datetime.now().isoformat(),
            url,
            prediction,
            user_label
        ])


if __name__ == "__main__":

    print("Adaptive Learning Feedback System")
    print("-" * 40)

    url = input("Enter URL: ").strip()

    prediction = input(
        "Model prediction (0 = Legitimate, 1 = Phishing): "
    ).strip()

    user_label = input(
        "Correct label (0 = Legitimate, 1 = Phishing): "
    ).strip()

    save_feedback(url, prediction, user_label)

    print("\nFeedback saved successfully!")
    print("File:", FEEDBACK_FILE)