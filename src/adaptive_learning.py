import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from feature_extraction import extract_features


DATASET_PATH = "dataset/PhiUSIIL_Phishing_URL_Dataset.csv"
FEEDBACK_PATH = "dataset/clean_feedback.csv"
MODEL_PATH = "model_adaptive.pkl"


def adaptive_retrain():

    print("Loading original dataset...")
    df = pd.read_csv(DATASET_PATH)

    print("Original records:", len(df))

    # Load corrected feedback
    if os.path.exists(FEEDBACK_PATH):
        feedback = pd.read_csv(FEEDBACK_PATH)
        feedback = feedback[
            feedback["user_label"].isin([0, 1])
        ]

        print("Corrected feedback records:", len(feedback))
    else:
        feedback = pd.DataFrame(
            columns=["URL", "user_label"]
        )

    # Add corrected feedback to training data
    if not feedback.empty:

        feedback_data = pd.DataFrame({
            "URL": feedback["URL"],
            "label": feedback["user_label"]
        })

        combined = pd.concat(
            [
                df[["URL", "label"]],
                feedback_data
            ],
            ignore_index=True
        )

    else:
        combined = df[["URL", "label"]]

    print("Combined records:", len(combined))

    # Extract features
    feature_rows = []

    for i, url in enumerate(combined["URL"]):

        feature_rows.append(
            extract_features(str(url))
        )

        if (i + 1) % 25000 == 0:
            print(f"Processed {i + 1} URLs...")

    X = pd.DataFrame(feature_rows)
    y = combined["label"].astype(int)

    print("\nFeature dataset:", X.shape)

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.20,
        random_state=42,
        stratify=y
    )

    print("Training samples:", len(X_train))
    print("Testing samples:", len(X_test))

    # Train updated model
    model = RandomForestClassifier(
        n_estimators=150,
        random_state=42,
        n_jobs=-1
    )

    print("\nTraining adaptive model...")

    model.fit(X_train, y_train)

    print("Adaptive training completed!")

    # Evaluation
    y_pred = model.predict(X_test)

    accuracy = accuracy_score(y_test, y_pred)

    print("\nAdaptive Model Accuracy:", accuracy)

    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    # Save updated model
    joblib.dump(model, MODEL_PATH)

    print("\nAdaptive model saved as:", MODEL_PATH)


if __name__ == "__main__":

    print("=" * 60)
    print("          ADAPTIVE PHISHING URL MODEL")
    print("=" * 60)

    adaptive_retrain()