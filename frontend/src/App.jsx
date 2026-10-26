import React, { useState } from 'react';
import Header from './components/Header';
import DashboardStats from './components/DashboardStats';
import URLAnalyzer from './components/URLAnalyzer';
import ResultCard from './components/ResultCard';
import ExplanationSection from './components/ExplanationSection';
import FeatureExtractorTable from './components/FeatureExtractorTable';
import FeedbackSection from './components/FeedbackSection';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

import { analyzeURL, isMockMode, setMockMode } from './services/api';

export default function App() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [error, setError] = useState(null);
  const [mockActive, setMockActive] = useState(isMockMode());

  // Handle URL Analysis submission
  const handleAnalyze = async (urlToAnalyze) => {
    setCurrentUrl(urlToAnalyze);
    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeURL(urlToAnalyze);
      setResultData(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during URL analysis.');
      setResultData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset analysis state
  const handleReset = () => {
    setCurrentUrl('');
    setResultData(null);
    setError(null);
  };

  // Toggle Mock Mode vs Live API Mode
  const handleToggleMockMode = () => {
    const nextMode = !mockActive;
    setMockMode(nextMode);
    setMockActive(nextMode);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-bg text-slate-100 cyber-grid">
      {/* Top Header & Navigation */}
      <Header
        mockModeActive={mockActive}
        onToggleMockMode={handleToggleMockMode}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Value Metrics Section */}
        <DashboardStats />

        {/* URL Input & Analysis Form */}
        <URLAnalyzer
          onAnalyze={handleAnalyze}
          onReset={handleReset}
          isLoading={isLoading}
          error={error}
          currentUrl={currentUrl}
        />

        {/* Results Pipeline (Only rendered once analysis payload is received) */}
        {resultData && (
          <div className="space-y-2 animate-fadeIn">
            {/* 1. Classification & Probabilities */}
            <ResultCard resultData={resultData} />

            {/* 2. Explainable AI Reasons */}
            <ExplanationSection
              reasons={resultData.reasons}
              isPhishing={resultData.prediction === 0}
              isTrusted={resultData.trusted_domain}
            />

            {/* 3. Extracted 15 Features Collapsible Inspector */}
            <FeatureExtractorTable features={resultData.features} />

            {/* 4. Adaptive Learning Feedback Collection */}
            <FeedbackSection resultData={resultData} />
          </div>
        )}

        {/* 5-Step Visual Workflow */}
        <HowItWorks />

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
