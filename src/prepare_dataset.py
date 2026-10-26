import pandas as pd
from pathlib import Path

INPUT = "dataset/PhiUSIIL_Phishing_URL_Dataset.csv"
OUTPUT = "dataset/processed_dataset.csv"

df = pd.read_csv(INPUT)

print("Original shape:", df.shape)

# Keep only useful URL-based features
features = [
    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "NoOfSubDomain",
    "HasObfuscation",
    "NoOfObfuscatedChar",
    "ObfuscationRatio",
    "NoOfLettersInURL",
    "NoOfDegitsInURL",
    "NoOfEqualsInURL",
    "NoOfQMarkInURL",
    "NoOfAmpersandInURL",
    "NoOfOtherSpecialCharsInURL",
    "IsHTTPS",
    "NoOfURLRedirect",
    "label"
]

df = df[features]

df = df.dropna()

df.to_csv(OUTPUT, index=False)

print("Processed shape:", df.shape)
print("Saved to:", OUTPUT)
print("Label distribution:")
print(df["label"].value_counts())