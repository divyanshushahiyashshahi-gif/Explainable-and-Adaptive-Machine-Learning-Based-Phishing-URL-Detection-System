from feature_extraction import extract_features


def explain_prediction(url):
    features = extract_features(url)

    reasons = []

    if features["HasSuspiciousKeyword"]:
        reasons.append("Suspicious keyword detected in URL")

    if features["IsDomainIP"]:
        reasons.append("URL uses an IP address instead of a normal domain")

    if features["HasAtSymbol"]:
        reasons.append("@ symbol detected in URL")

    if features["IsShortenedURL"]:
        reasons.append("URL uses a known URL-shortening service")

    if features["HasObfuscation"]:
        reasons.append("Possible URL obfuscation detected")

    if features["NoOfURLRedirect"] > 0:
        reasons.append("Multiple redirect indicators detected")

    if features["NoOfSubDomain"] >= 2:
        reasons.append("Multiple subdomains detected")

    if features["NoOfOtherSpecialCharsInURL"] >= 5:
        reasons.append("High number of special characters")

    if features["NoOfDegitsInURL"] >= 5:
        reasons.append("High number of digits in URL")

    if features["URLEntropy"] >= 4.5:
        reasons.append("URL has high character randomness (entropy)")

    if not features["IsHTTPS"]:
        reasons.append("URL does not use HTTPS")

    if not reasons:
        reasons.append("No major suspicious URL characteristics detected")

    return reasons