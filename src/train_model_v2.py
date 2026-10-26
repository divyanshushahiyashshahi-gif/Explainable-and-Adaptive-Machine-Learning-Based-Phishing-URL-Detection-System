import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

from feature_extraction import extract_features


DATASET_PATH = "dataset/PhiUSIIL_Phishing_URL_Dataset.csv"


print("Loading dataset...")
df = pd.read_csv(DATASET_PATH)

print("Dataset:", df.shape)

features = []

for i, url in enumerate(df["URL"]):
    features.append(extract_features(str(url)))

    if (i + 1) % 25000 == 0:
        print(f"Processed {i + 1} URLs...")

X = pd.DataFrame(features)
y = df["label"].astype(int)

print("\nFeature dataset:", X.shape)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Training:", X_train.shape)
print("Testing:", X_test.shape)

print("\nTraining improved model...")

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_leaf=2,
    class_weight="balanced_subsample",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

print("Training completed!")

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)

print("\nAccuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

model = joblib.load("model_adaptive.pkl")

print("\nModel saved as: model_v2.pkl")