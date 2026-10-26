/**
 * Mock Service (Development Only)
 * 
 * Accurately implements the exact 15 feature extraction rules, trusted domain checks,
 * and explainability logic defined in the Python backend (feature_extraction.py & explain_prediction.py).
 * 
 * Strictly adheres to the future FastAPI JSON request/response contracts:
 * POST /analyze  -> { url } -> { url, prediction, result, phishing_probability, legitimate_probability, trusted_domain, features, reasons }
 * POST /feedback -> { url, prediction, correct_label } -> { status, message }
 */

const TRUSTED_DOMAINS = new Set([
  'google.com',
  'microsoft.com',
  'amazon.com',
  'flipkart.com',
  'wikipedia.org',
  'github.com',
  'apple.com',
  'youtube.com',
  'facebook.com',
  'instagram.com',
  'linkedin.com'
]);

const SHORTENED_DOMAINS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'cutt.ly',
  'rb.gy',
  'shorturl.at'
]);

const SUSPICIOUS_KEYWORDS = [
  'login',
  'signin',
  'verify',
  'verification',
  'secure',
  'account',
  'update',
  'confirm',
  'password',
  'credential',
  'payment',
  'bank',
  'suspended',
  'wallet'
];

/**
 * Calculate Shannon Entropy of a string
 */
function calculateEntropy(text) {
  if (!text) return 0.0;
  const len = text.length;
  const frequencies = {};
  for (let i = 0; i < len; i++) {
    const char = text[i];
    frequencies[char] = (frequencies[char] || 0) + 1;
  }
  let entropy = 0.0;
  for (const char in frequencies) {
    const p = frequencies[char] / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(4));
}

/**
 * Extract the 15 URL features identically to feature_extraction.py
 */
export function extractFeatures(rawUrl) {
  let parsed;
  try {
    const urlToParse = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') 
      ? rawUrl 
      : `http://${rawUrl}`;
    parsed = new URL(urlToParse);
  } catch {
    // Fallback parser if invalid URL format
    parsed = {
      hostname: rawUrl.split('/')[0].split('?')[0],
      pathname: rawUrl.includes('/') ? '/' + rawUrl.split('/').slice(1).join('/').split('?')[0] : '',
      search: rawUrl.includes('?') ? '?' + rawUrl.split('?')[1] : '',
      protocol: rawUrl.startsWith('https') ? 'https:' : 'http:'
    };
  }

  let domain = (parsed.hostname || parsed.host || '').toLowerCase().split(':')[0];
  if (domain.startsWith('www.')) {
    domain = domain.slice(4);
  }

  const path = parsed.pathname || '';
  const query = parsed.search ? parsed.search.replace(/^\?/, '') : '';

  // 1. URL Length
  const URLLength = rawUrl.length;

  // 2. Domain Length
  const DomainLength = domain.length;

  // 3. IP Address check (IPv4)
  const isIpRegex = /^\d{1,3}(\.\d{1,3}){3}$/;
  const IsDomainIP = isIpRegex.test(domain) ? 1 : 0;

  // 4. Subdomain Count
  const parts = domain ? domain.split('.') : [];
  const NoOfSubDomain = parts.length <= 2 ? 0 : parts.length - 2;

  // 5. HTTPS
  const IsHTTPS = (parsed.protocol === 'https:' || rawUrl.toLowerCase().startsWith('https://')) ? 1 : 0;

  // 6. Digit Count
  const digitsMatch = rawUrl.match(/\d/g);
  const NoOfDegitsInURL = digitsMatch ? digitsMatch.length : 0;

  // 7. Special Character Count (@?=&;%_~)
  let specialCount = 0;
  const targetChars = new Set(['@', '?', '=', '&', ';', '%', '_', '~']);
  for (let char of rawUrl) {
    if (targetChars.has(char)) specialCount++;
  }
  const NoOfOtherSpecialCharsInURL = specialCount;

  // 8. Has @ Symbol
  const HasAtSymbol = rawUrl.includes('@') ? 1 : 0;

  // 9. Suspicious Keywords
  const urlLower = rawUrl.toLowerCase();
  let HasSuspiciousKeyword = 0;
  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (urlLower.includes(kw)) {
      HasSuspiciousKeyword = 1;
      break;
    }
  }

  // 10. Path Length
  const PathLength = path.length;

  // 11. Query Parameter Count
  const QueryParameterCount = query ? query.split('&').filter(Boolean).length : 0;

  // 12. URL Entropy
  const URLEntropy = calculateEntropy(rawUrl);

  // 13. Obfuscation (% or \x)
  const HasObfuscation = (rawUrl.includes('%') || urlLower.includes('\\x')) ? 1 : 0;

  // 14. Redirect Count (// occurrences - 1)
  const slashPairs = (rawUrl.match(/\/\//g) || []).length;
  const NoOfURLRedirect = Math.max(0, slashPairs - 1);

  // 15. Shortened URL
  const IsShortenedURL = SHORTENED_DOMAINS.has(domain) ? 1 : 0;

  return {
    URLLength,
    DomainLength,
    IsDomainIP,
    NoOfSubDomain,
    IsHTTPS,
    NoOfDegitsInURL,
    NoOfOtherSpecialCharsInURL,
    HasAtSymbol,
    HasSuspiciousKeyword,
    PathLength,
    QueryParameterCount,
    URLEntropy,
    HasObfuscation,
    NoOfURLRedirect,
    IsShortenedURL
  };
}

/**
 * Generate explainable prediction reasons identically to explain_prediction.py
 */
export function generateExplanations(features) {
  const reasons = [];

  if (features.HasSuspiciousKeyword) {
    reasons.push("Suspicious keyword detected in URL");
  }
  if (features.IsDomainIP) {
    reasons.push("URL uses an IP address instead of a normal domain");
  }
  if (features.HasAtSymbol) {
    reasons.push("@ symbol detected in URL");
  }
  if (features.IsShortenedURL) {
    reasons.push("URL uses a known URL-shortening service");
  }
  if (features.HasObfuscation) {
    reasons.push("Possible URL obfuscation detected");
  }
  if (features.NoOfURLRedirect > 0) {
    reasons.push("Multiple redirect indicators detected");
  }
  if (features.NoOfSubDomain >= 2) {
    reasons.push("Multiple subdomains detected");
  }
  if (features.NoOfOtherSpecialCharsInURL >= 5) {
    reasons.push("High number of special characters");
  }
  if (features.NoOfDegitsInURL >= 5) {
    reasons.push("High number of digits in URL");
  }
  if (features.URLEntropy >= 4.5) {
    reasons.push("URL has high character randomness (entropy)");
  }
  if (!features.IsHTTPS) {
    reasons.push("URL does not use HTTPS");
  }

  if (reasons.length === 0) {
    reasons.push("No major suspicious URL characteristics detected");
  }

  return reasons;
}

/**
 * Mock analyze endpoint handler
 */
export async function mockAnalyzeURL(url) {
  // Simulate network latency (300-450ms)
  await new Promise(resolve => setTimeout(resolve, 350));

  let cleanDomain = '';
  try {
    const urlToParse = url.startsWith('http://') || url.startsWith('https://') 
      ? url 
      : `http://${url}`;
    const parsed = new URL(urlToParse);
    cleanDomain = (parsed.hostname || parsed.host || '').toLowerCase().split(':')[0];
    if (cleanDomain.startsWith('www.')) {
      cleanDomain = cleanDomain.slice(4);
    }
  } catch {
    cleanDomain = url.split('/')[0].toLowerCase();
  }

  const isTrusted = TRUSTED_DOMAINS.has(cleanDomain);
  const features = extractFeatures(url);

  // Case 1: Trusted Domain
  if (isTrusted) {
    return {
      url,
      prediction: 1, // 1 = Legitimate
      result: "LEGITIMATE URL",
      phishing_probability: 0.0,
      legitimate_probability: 100.0,
      trusted_domain: true,
      features,
      reasons: ["Verified trusted domain"]
    };
  }

  // Case 2: Risk Scoring based on ML heuristics
  const reasons = generateExplanations(features);
  
  // Calculate a composite risk score from extracted features
  let riskScore = 0;
  if (features.IsDomainIP) riskScore += 45;
  if (features.HasSuspiciousKeyword) riskScore += 35;
  if (features.HasAtSymbol) riskScore += 30;
  if (features.IsShortenedURL) riskScore += 25;
  if (features.HasObfuscation) riskScore += 25;
  if (!features.IsHTTPS) riskScore += 18;
  if (features.URLEntropy >= 4.5) riskScore += 20;
  if (features.NoOfDegitsInURL >= 5) riskScore += 15;
  if (features.NoOfOtherSpecialCharsInURL >= 5) riskScore += 15;
  if (features.NoOfSubDomain >= 2) riskScore += 15;
  if (features.NoOfURLRedirect > 0) riskScore += 20;
  if (features.URLLength > 75) riskScore += 12;

  // ML decision boundary
  const isPhishing = riskScore >= 35;
  const prediction = isPhishing ? 0 : 1; // 0 = Phishing, 1 = Legitimate

  let phishingProb = 0;
  if (isPhishing) {
    phishingProb = Math.min(99.8, 65.0 + (riskScore * 0.35));
  } else {
    phishingProb = Math.max(0.4, Math.min(28.0, riskScore * 0.7));
  }
  const legitimateProb = parseFloat((100.0 - phishingProb).toFixed(2));
  phishingProb = parseFloat(phishingProb.toFixed(2));

  return {
    url,
    prediction,
    result: prediction === 0 ? "PHISHING URL" : "LEGITIMATE URL",
    phishing_probability: phishingProb,
    legitimate_probability: legitimateProb,
    trusted_domain: false,
    features,
    reasons
  };
}

/**
 * Mock feedback endpoint handler
 */
export async function mockSubmitFeedback(feedbackData) {
  // Simulate network latency (250ms)
  await new Promise(resolve => setTimeout(resolve, 250));

  console.log('[MOCK_FEEDBACK_SAVED]', {
    timestamp: new Date().toISOString(),
    ...feedbackData
  });

  return {
    status: "success",
    message: "Feedback recorded successfully for adaptive learning."
  };
}
