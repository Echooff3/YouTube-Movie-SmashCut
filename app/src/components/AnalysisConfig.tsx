import { useState } from 'react';
import { DEFAULT_SYSTEM_PROMPT } from '../config/prompts';

interface AnalysisConfigProps {
  systemPrompt: string;
  onSystemPromptChange: (prompt: string) => void;
  targetDuration: number; // in minutes
  onTargetDurationChange: (minutes: number) => void;
  enableWebSearch: boolean;
  onWebSearchChange: (enabled: boolean) => void;
  enableStructuredOutputs: boolean;
  onStructuredOutputsChange: (enabled: boolean) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

export function AnalysisConfig({
  systemPrompt,
  onSystemPromptChange,
  targetDuration,
  onTargetDurationChange,
  enableWebSearch,
  onWebSearchChange,
  enableStructuredOutputs,
  onStructuredOutputsChange,
  onAnalyze,
  isAnalyzing,
  canAnalyze,
}: AnalysisConfigProps) {
  const [showPromptEditor, setShowPromptEditor] = useState(false);

  const durationPresets = [
    { label: '5 min', value: 5 },
    { label: '10 min', value: 10 },
    { label: '15 min', value: 15 },
    { label: '20 min', value: 20 },
    { label: '30 min', value: 30 },
  ];

  const resetToDefault = () => {
    onSystemPromptChange(DEFAULT_SYSTEM_PROMPT);
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/20">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Analysis Configuration</h2>
          <p className="text-sm text-gray-400">Configure how the AI analyzes your video</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Target Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Target Compressed Duration
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {durationPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  targetDuration === preset.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => onTargetDurationChange(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="60"
              value={targetDuration}
              onChange={(e) => onTargetDurationChange(parseInt(e.target.value, 10))}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex items-center gap-2 bg-gray-700 rounded-lg px-3 py-2">
              <input
                type="number"
                min="1"
                max="120"
                value={targetDuration}
                onChange={(e) => onTargetDurationChange(Math.max(1, Math.min(120, parseInt(e.target.value, 10) || 1)))}
                className="w-12 bg-transparent text-white text-center focus:outline-none"
              />
              <span className="text-gray-400 text-sm">min</span>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Web Search Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <div>
                <p className="text-white text-sm font-medium">Web Search</p>
                <p className="text-gray-500 text-xs">Enhance with real-time data</p>
              </div>
            </div>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enableWebSearch ? 'bg-blue-600' : 'bg-gray-600'
              }`}
              onClick={() => onWebSearchChange(!enableWebSearch)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enableWebSearch ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Structured Outputs Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-900/50 border border-gray-700">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <div>
                <p className="text-white text-sm font-medium">Structured Output</p>
                <p className="text-gray-500 text-xs">JSON schema validation</p>
              </div>
            </div>
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enableStructuredOutputs ? 'bg-green-600' : 'bg-gray-600'
              }`}
              onClick={() => onStructuredOutputsChange(!enableStructuredOutputs)}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enableStructuredOutputs ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* System Prompt Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              System Prompt
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-xs text-gray-400 hover:text-white transition-colors"
                onClick={resetToDefault}
              >
                Reset to default
              </button>
              <button
                type="button"
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                onClick={() => setShowPromptEditor(!showPromptEditor)}
              >
                {showPromptEditor ? 'Hide' : 'Edit'}
              </button>
            </div>
          </div>
          
          {showPromptEditor ? (
            <textarea
              className="w-full h-64 rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white text-sm font-mono placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              value={systemPrompt}
              onChange={(e) => onSystemPromptChange(e.target.value)}
              placeholder="Enter your system prompt..."
            />
          ) : (
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
              <p className="text-gray-400 text-sm line-clamp-3">{systemPrompt}</p>
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Analyze Video</span>
            </>
          )}
        </button>

        {!canAnalyze && (
          <p className="text-yellow-400 text-sm text-center">
            Please configure API key, select a model, and upload an SRT file to analyze
          </p>
        )}
      </div>
    </div>
  );
}
