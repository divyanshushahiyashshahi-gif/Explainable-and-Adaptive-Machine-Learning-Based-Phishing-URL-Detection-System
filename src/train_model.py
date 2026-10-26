import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from feature_extraction import extract_features


INPUT = "dataset/PhiUSIIL_Phishing_URL_Dataset.csv"
model = joblib.load("model_adaptive.pkl")

print("Loading dataset...")

df = pd.read_csv(INPUT)

# Extract exactly the same 15 features used by predict.py
feature_rows = []

for i, url in enumerate(df["URL"]):
    feature_rows.append(extract_features(str(url)))

    if (i + 1) % 25000 == 0:
        print(f"Processed {i + 1} URLs...")

X = pd.DataFrame(feature_rows)
y = df["label"].astype(int)

print("\nFeature dataset:", X.shape)

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training samples:", len(X_train))
print("Testing samples:", len(X_test))

# Model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=15,
    min_samples_leaf=2,
    class_weight="balanced",
    random_state=42,
    n_jobs=-1
)

print("\nTraining model...")
model.fit(X_train, y_train)

print("Training completed!")

# Evaluation
y_pred = model.predict(X_test)

print("\nAccuracy:", accuracy_score(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# Save
joblib.dump(model, MODEL_OUTPUT)

print("\nModel saved successfully as:", MODEL_OUTPUT)
print("Features:", list(X.columns))