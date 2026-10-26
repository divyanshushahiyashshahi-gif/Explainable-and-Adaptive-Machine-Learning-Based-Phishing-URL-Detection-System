
import { mockAnalyzeURL, mockSubmitFeedback } from './mockService';

const ENV_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://explainable-and-adaptive-machine.onrender.com';

const ENV_USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

let runtimeMockMode = ENV_USE_MOCK;

export function isMockMode() {
  return runtimeMockMode;
}

export function setMockMode(enabled) {
  runtimeMockMode = !!enabled;
}

export const API_BASE_URL = ENV_API_BASE_URL;

export async function analyzeURL(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    throw new Error('Please enter a valid URL to analyze.');
  }

  if (isMockMode()) {
    return await mockAnalyzeURL(url.trim());
  }

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url.trim() }),
  });

  if (!response.ok) {
    throw new Error(`Server error (${response.status})`);
  }

  return await response.json();
}

export async function submitFeedback({ url, prediction, correct_label }) {
  if (!url || prediction === undefined || correct_label === undefined) {
    throw new Error('Invalid feedback payload.');
  }

  const payload = {
    url: url.trim(),
    prediction: Number(prediction),
    user_label: Number(correct_label),
  };

  if (isMockMode()) {
    return await mockSubmitFeedback({
      url: payload.url,
      prediction: payload.prediction,
      correct_label: payload.user_label,
    });
  }

  const response = await fetch(`${API_BASE_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Feedback submission failed (${response.status})`);
  }

  return await response.json();
}
