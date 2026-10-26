/**
 * API Service Layer for Phishing URL Detection System
 * 
 * Supports both standalone development mock mode (VITE_USE_MOCK_API = true)
 * and seamless connection to FastAPI backend (VITE_USE_MOCK_API = false).
 * 
 * Future FastAPI Endpoints:
 * - POST /analyze   -> Request: { url }
 * - POST /feedback  -> Request: { url, prediction, correct_label }
 */

import { mockAnalyzeURL, mockSubmitFeedback } from './mockService';

const ENV_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';
const ENV_USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

// Runtime mock mode override capability for frontend demonstration
let runtimeMockMode = ENV_USE_MOCK;

export function isMockMode() {
  return runtimeMockMode;
}

export function setMockMode(enabled) {
  runtimeMockMode = !!enabled;
}

export const API_BASE_URL = ENV_API_BASE_URL;

/**
 * Analyze a URL for phishing threats
 * @param {string} url - The URL string to inspect
 * @returns {Promise<Object>} The ML prediction & analysis payload
 */
export async function analyzeURL(url) {
  if (!url || typeof url !== 'string' || !url.trim()) {
    throw new Error('Please enter a valid URL to analyze.');
  }

  const cleanUrl = url.trim();

  // If Mock Mode is enabled, route to isolated mock service
  if (isMockMode()) {
    return await mockAnalyzeURL(cleanUrl);
  }

  // Live FastAPI Backend request
  try {
     const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: cleanUrl }),
    });

    if (!response.ok) {
      let errorMessage = `Server error (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.detail) errorMessage = errorData.detail;
      } catch {
        // Fallback to generic status error
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Unable to reach backend API at ${API_BASE_URL}. Ensure your FastAPI server is running or enable Mock Mode.`
      );
    }
    throw err;
  }
}

/**
 * Submit user feedback to improve the model via adaptive learning
 * @param {Object} data - Feedback payload { url, prediction, correct_label }
 * @returns {Promise<Object>} API response status
 */
export async function submitFeedback({ url, prediction, correct_label }) {
  if (!url || prediction === undefined || correct_label === undefined) {
    throw new Error('Invalid feedback payload.');
  }

  const payload = {
    url: url.trim(),
    prediction: Number(prediction),
    correct_label: Number(correct_label),
  };

  // If Mock Mode is enabled, route to isolated mock service
  if (isMockMode()) {
    return await mockSubmitFeedback(payload);
  }

  // Live FastAPI Backend request
  try {
    const response = await fetch(`${API_BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = `Feedback submission failed (${response.status})`;
      try {
        const errorData = await response.json();
        if (errorData.detail) errorMessage = errorData.detail;
      } catch {
        // Fallback
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error(
        `Unable to reach backend API at ${API_BASE_URL}. Feedback could not be saved.`
      );
    }
    throw err;
  }
}
