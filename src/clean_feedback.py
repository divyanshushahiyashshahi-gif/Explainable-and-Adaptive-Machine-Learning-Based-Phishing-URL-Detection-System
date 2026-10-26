import pandas as pd

INPUT_FILE = "dataset/feedback.csv"
OUTPUT_FILE = "dataset/clean_feedback.csv"

df = pd.read_csv(INPUT_FILE)

# Dataset convention:
# 0 = Phishing
# 1 = Legitimate

# Keep only valid labels
df = df[df["user_label"].isin([0, 1])].copy()

# Save cleaned feedback
df.to_csv(OUTPUT_FILE, index=False)

print("Feedback cleaned successfully!")
print("Records:", len(df))
print("Saved to:", OUTPUT_FILE)

print("\nLabel distribution:")
print(df["user_label"].value_counts())