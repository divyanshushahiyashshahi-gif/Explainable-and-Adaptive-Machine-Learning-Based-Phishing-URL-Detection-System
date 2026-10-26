import joblib
import pandas as pd

model = joblib.load("model_adaptive.pkl")

features = [
    "URLLength",
    "DomainLength",
    "IsDomainIP",
    "NoOfSubDomain",
    "IsHTTPS",
    "NoOfDegitsInURL",
    "NoOfOtherSpecialCharsInURL",
    "HasAtSymbol",
    "HasSuspiciousKeyword",
    "PathLength",
    "QueryParameterCount",
    "URLEntropy",
    "HasObfuscation",
    "NoOfURLRedirect",
    "IsShortenedURL"
]

importance = pd.DataFrame({
    "Feature": features,
    "Importance": model.feature_importances_
})

importance = importance.sort_values(
    "Importance",
    ascending=False
)

print("\nFEATURE IMPORTANCE")
print("=" * 50)
print(importance.to_string(index=False))