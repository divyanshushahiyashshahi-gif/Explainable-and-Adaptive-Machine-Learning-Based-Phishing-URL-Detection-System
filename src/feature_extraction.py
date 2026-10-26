import re
import math
from collections import Counter
from urllib.parse import urlparse


SHORTENED_DOMAINS = {
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
    "buff.ly",
    "cutt.ly",
    "rb.gy",
    "shorturl.at"
}


SUSPICIOUS_KEYWORDS = {
    "login",
    "signin",
    "verify",
    "verification",
    "secure",
    "account",
    "update",
    "confirm",
    "password",
    "credential",
    "payment",
    "bank",
    "suspended",
    "wallet"
}


def calculate_entropy(text):
    """Calculate Shannon entropy of a URL."""

    if not text:
        return 0.0

    counter = Counter(text)
    length = len(text)

    entropy = 0.0

    for count in counter.values():
        probability = count / length
        entropy -= probability * math.log2(probability)

    return entropy


def is_ip_address(domain):
    """Check whether domain is an IPv4 address."""

    pattern = r"^\d{1,3}(\.\d{1,3}){3}$"

    return int(bool(re.match(pattern, domain)))


def count_subdomains(domain):
    """Count subdomains."""

    if not domain:
        return 0

    parts = domain.split(".")

    if len(parts) <= 2:
        return 0

    return len(parts) - 2


def contains_suspicious_keyword(url):
    """Check for suspicious phishing-related keywords."""

    url_lower = url.lower()

    for keyword in SUSPICIOUS_KEYWORDS:
        if keyword in url_lower:
            return 1

    return 0


def is_shortened_url(domain):
    """Check whether URL belongs to a known URL-shortening service."""

    domain = domain.lower()

    if domain.startswith("www."):
        domain = domain[4:]

    return int(domain in SHORTENED_DOMAINS)


def extract_features(url):
    """Extract the 15 selected features from a URL."""

    parsed = urlparse(url)

    domain = parsed.netloc
    path = parsed.path
    query = parsed.query

    domain_without_port = domain.split(":")[0]

    if query:
        query_parameter_count = len(
            [item for item in query.split("&") if item]
        )
    else:
        query_parameter_count = 0

    special_characters = sum(
    1 for char in url
    if char in "@?=&;%_~"
)

    features = {

        # 1. URL Length
        "URLLength": len(url),

        # 2. Domain Length
        "DomainLength": len(domain_without_port),

        # 3. IP Address
        "IsDomainIP": is_ip_address(domain_without_port),

        # 4. Subdomain Count
        "NoOfSubDomain": count_subdomains(domain_without_port),

        # 5. HTTPS
        "IsHTTPS": int(parsed.scheme.lower() == "https"),

        # 6. Digit Count
        "NoOfDegitsInURL": sum(
            char.isdigit() for char in url
        ),

        # 7. Special Character Count
        "NoOfOtherSpecialCharsInURL": special_characters,

        # 8. @ Symbol
        "HasAtSymbol": int("@" in url),

        # 9. Suspicious Keyword
        "HasSuspiciousKeyword": contains_suspicious_keyword(url),

        # 10. Path Length
        "PathLength": len(path),

        # 11. Query Parameter Count
        "QueryParameterCount": query_parameter_count,

        # 12. URL Entropy
        "URLEntropy": calculate_entropy(url),

        # 13. Obfuscation
        "HasObfuscation": int(
            "%" in url or "\\x" in url.lower()
        ),

        # 14. Redirect Count
        "NoOfURLRedirect": max(
            0,
            url.count("//") - 1
        ),

        # 15. Shortened URL
        "IsShortenedURL": is_shortened_url(
            domain_without_port
        )
    }

    return features


# Test
if __name__ == "__main__":

    test_url = "https://secure-login-example.com/verify?account=123"

    features = extract_features(test_url)

    print("\nExtracted Features:")
    print("-" * 40)

    for feature, value in features.items():
        print(f"{feature}: {value}")