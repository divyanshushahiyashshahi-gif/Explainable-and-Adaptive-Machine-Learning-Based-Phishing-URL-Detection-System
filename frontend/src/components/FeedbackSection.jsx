import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, RefreshCw, Send, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { submitFeedback } from '../services/api';

export default function FeedbackSection({ resultData }) {
  const [feedbackStep, setFeedbackStep] = useState('initial'); // 'initial', 'correction', 'submitting', 'submitted', 'error'
  const [selectedCorrection, setSelectedCorrection] = useState(null); // 0 or 1
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!resultData) return null;

  const { url, prediction } = resultData;

  // Handle YES confirmation
  const handleConfirmCorrect = async () => {
    setFeedbackStep('submitting');
    setErrorMessage('');
    try {
      await submitFeedback({
        url,
        prediction,
        correct_label: prediction
      });
      setSubmissionMessage('Thank you! Prediction confirmed and logged for model validation.');
      setFeedbackStep('submitted');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit feedback.');
      setFeedbackStep('error');
    }
  };

  // Handle NO -> Open correction choice
  const handleInitiateCorrection = () => {
    setFeedbackStep('correction');
    setSelectedCorrection(null);
  };

  // Handle submission of corrected label
  const handleSubmitCorrection = async () => {
    if (selectedCorrection === null) return;
    setFeedbackStep('submitting');
    setErrorMessage('');
    try {
      await submitFeedback({
        url,
        prediction,
        correct_label: Number(selectedCorrection)
      });
      setSubmissionMessage(
        `Thank you! Correct classification (${selectedCorrection === 0 ? 'Phishing' : 'Legitimate'}) recorded for adaptive retraining.`
      );
      setFeedbackStep('submitted');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit corrected feedback.');
      setFeedbackStep('error');
    }
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 sm:p-7 shadow-lg mb-8 relative overflow-hidden">
      <div className="flex items-center space-x-2.5 mb-4 pb-3 border-b border-cyber-border">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
          <RefreshCw className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Adaptive Learning Feedback
            <span className="text-xs font-mono font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2 py-0.5 rounded-full">
              Active Loop
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Your verification helps refine future adaptive model iterations through supervised feedback logging.
          </p>
        </div>
      </div>

      {/* State: Initial Question */}
      {feedbackStep === 'initial' && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/60 border border-cyber-borderLight">
          <div className="text-sm font-medium text-slate-200 text-center sm:text-left">
            Was this prediction correct?
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-center">
            <button
              onClick={handleConfirmCorrect}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>YES</span>
            </button>
            <button
              onClick={handleInitiateCorrection}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <ThumbsDown className="w-4 h-4" />
              <span>NO</span>
            </button>
          </div>
        </div>
      )}

      {/* State: Correction Selection */}
      {feedbackStep === 'correction' && (
        <div className="p-4 rounded-xl bg-slate-950/60 border border-cyber-borderLight space-y-4 animate-fadeIn">
          <div className="text-sm font-semibold text-amber-300">
            What is the correct classification?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedCorrection(0)}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedCorrection === 0
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-danger-glow'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div>
                <div className="font-bold text-sm">Phishing URL (0)</div>
                <div className="text-xs text-slate-400">Malicious, deceptive, or credential-harvesting link</div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCorrection === 0 ? 'border-rose-400 bg-rose-500' : 'border-slate-500'}`}>
                {selectedCorrection === 0 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCorrection(1)}
              className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                selectedCorrection === 1
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-safe-glow'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div>
                <div className="font-bold text-sm">Legitimate URL (1)</div>
                <div className="text-xs text-slate-400">Benign, trusted, or standard web resource</div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedCorrection === 1 ? 'border-emerald-400 bg-emerald-500' : 'border-slate-500'}`}>
                {selectedCorrection === 1 && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
              </div>
            </button>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setFeedbackStep('initial')}
              className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={selectedCorrection === null}
              onClick={handleSubmitCorrection}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow-cyber-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Correction</span>
            </button>
          </div>
        </div>
      )}

      {/* State: Submitting */}
      {feedbackStep === 'submitting' && (
        <div className="p-5 rounded-xl bg-slate-950/60 border border-cyber-borderLight flex items-center justify-center space-x-3 text-cyan-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Recording feedback into adaptive dataset...</span>
        </div>
      )}

      {/* State: Submitted */}
      {feedbackStep === 'submitted' && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-600/40 flex items-center justify-between gap-3 text-emerald-300 animate-fadeIn">
          <div className="flex items-center space-x-2.5">
            <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">{submissionMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackStep('initial')}
            className="text-xs text-slate-400 hover:text-slate-200 underline flex-shrink-0"
          >
            Edit
          </button>
        </div>
      )}

      {/* State: Error */}
      {feedbackStep === 'error' && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/40 flex items-center justify-between gap-3 text-rose-300">
          <div className="flex items-center space-x-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{errorMessage}</span>
          </div>
          <button
            onClick={() => setFeedbackStep('initial')}
            className="text-xs text-slate-300 hover:text-white underline"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
