import { useState } from 'react';
import { ModelSelector } from './ModelSelector';
import { useSettings } from '../hooks/useSettings';
import { useOpenRouterModels } from '../hooks/useOpenRouterModels';

export function Settings() {
  const { settings, updateApiKey, updateSelectedModel } = useSettings();
  const { models, loading, error, refetch } = useOpenRouterModels(settings.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(settings.apiKey);

  const handleApiKeySave = () => {
    updateApiKey(tempApiKey);
  };

  const maskedApiKey = settings.apiKey
    ? settings.apiKey.length > 12
      ? `${settings.apiKey.slice(0, 8)}${'•'.repeat(12)}${settings.apiKey.slice(-4)}`
      : '•'.repeat(settings.apiKey.length)
    : '';

  return (
    <div className="space-y-8">
      {/* API Key Section */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">OpenRouter API Key</h2>
            <p className="text-sm text-gray-400">Enter your API key to access AI models</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pr-24 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="sk-or-v1-..."
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-400 hover:text-white"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleApiKeySave}
              disabled={tempApiKey === settings.apiKey}
            >
              Save API Key
            </button>
            
            {settings.apiKey && (
              <button
                type="button"
                className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={refetch}
              >
                Refresh Models
              </button>
            )}
          </div>

          {settings.apiKey && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">API key configured</span>
              <span className="text-gray-500">({maskedApiKey})</span>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700">
          <p className="text-xs text-gray-400">
            Get your API key from{' '}
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              openrouter.ai/keys
            </a>
          </p>
        </div>
      </div>

      {/* Model Selection Section */}
      <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Model Selection</h2>
            <p className="text-sm text-gray-400">Choose the model for video analysis</p>
          </div>
        </div>

        <ModelSelector
          models={models}
          selectedModel={settings.selectedModel}
          onModelSelect={updateSelectedModel}
          loading={loading}
          error={error}
        />

        {models.length > 0 && (
          <div className="mt-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-xs text-gray-400">
              <strong className="text-gray-300">{models.length}</strong> models available. Use fuzzy search to find the model you need.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
