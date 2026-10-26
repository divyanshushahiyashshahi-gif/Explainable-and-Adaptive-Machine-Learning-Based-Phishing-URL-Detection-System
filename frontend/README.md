# Explainable & Adaptive Phishing URL Detection System — Frontend

A modern, responsive, cybersecurity-themed React + Vite dashboard for the Machine Learning-Based Phishing URL Detection pipeline.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The dashboard will be available at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## ⚙️ Configuration & Mock Mode

The frontend includes an isolated mock service matching the Python ML pipeline's 15 feature extraction rules, trusted domain checks, and explainable AI logic.

Configuration is handled in `.env`:

```env
# Backend Base URL for future FastAPI service
VITE_API_BASE_URL=http://127.0.0.1:8000

# Set to true for standalone frontend development (uses isolated mock service)
# Set to false to send live HTTP requests to the FastAPI backend
VITE_USE_MOCK_API=true
```

You can also toggle between **Mock API** and **Live API** at runtime using the environment badge button in the dashboard header.

---

## 📡 API Contracts for Future FastAPI Backend

The API service layer (`src/services/api.js`) is pre-wired to connect directly to FastAPI when ready.

### 1. Threat Analysis Endpoint
- **URL**: `POST /analyze`
- **Request Payload**:
  ```json
  {
    "url": "https://example.com"
  }
  ```
- **Response Payload**:
  ```json
  {
    "url": "https://example.com",
    "prediction": 0,
    "result": "PHISHING URL",
    "phishing_probability": 98.5,
    "legitimate_probability": 1.5,
    "trusted_domain": false,
    "features": {
      "URLLength": 52,
      "DomainLength": 24,
      "IsDomainIP": 0,
      "NoOfSubDomain": 0,
      "IsHTTPS": 0,
      "NoOfDegitsInURL": 5,
      "NoOfOtherSpecialCharsInURL": 2,
      "HasAtSymbol": 0,
      "HasSuspiciousKeyword": 1,
      "PathLength": 7,
      "QueryParameterCount": 1,
      "URLEntropy": 4.7029,
      "HasObfuscation": 0,
      "NoOfURLRedirect": 0,
      "IsShortenedURL": 0
    },
    "reasons": [
      "Suspicious keyword detected in URL",
      "URL does not use HTTPS",
      "URL has high character randomness (entropy)"
    ]
  }
  ```

### 2. Feedback Endpoint
- **URL**: `POST /feedback`
- **Request Payload**:
  ```json
  {
    "url": "https://example.com",
    "prediction": 0,
    "correct_label": 1
  }
  ```
- **Response Payload**:
  ```json
  {
    "status": "success",
    "message": "Feedback saved successfully"
  }
  ```

---

## 📁 Frontend Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx                 # Security-themed navbar, status indicator & mode toggle
│   │   ├── DashboardStats.jsx         # 4 value cards (15 Features, XAI, Adaptive Loop, ~99.5% Acc)
│   │   ├── URLAnalyzer.jsx            # Target URL input, validation, quick presets, submit/clear
│   │   ├── ResultCard.jsx             # High Risk vs Legitimate status, probabilities, trusted badge
│   │   ├── ExplanationSection.jsx     # "Why this result?" Explainable AI breakdown
│   │   ├── FeatureExtractorTable.jsx  # Collapsible inspector with all 15 URL features
│   │   ├── FeedbackSection.jsx        # "Was this prediction correct?" active feedback loop
│   │   ├── HowItWorks.jsx             # 5-step interactive workflow
│   │   └── Footer.jsx                 # Technical specs and API metadata
│   ├── services/
│   │   ├── api.js                     # API client layer (analyzeURL, submitFeedback)
│   │   └── mockService.js             # Isolated development mock engine
│   ├── App.jsx                        # Main state and layout coordinator
│   ├── main.jsx                       # React root mounting
│   └── index.css                      # Tailwind base & cyber theme styling
├── .env                               # Active configuration
├── .env.example                       # Template configuration
├── package.json                       # Dependencies & scripts
└── vite.config.js                     # Vite build configuration
```
