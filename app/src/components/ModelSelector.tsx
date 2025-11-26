import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import type { OpenRouterModel } from '../types/openrouter';

// Fuzzy search threshold: 0 = exact match, 1 = match anything
// 0.4 provides a good balance between finding partial matches and avoiding irrelevant results
const FUZZY_SEARCH_THRESHOLD = 0.4;

interface ModelSelectorProps {
  models: OpenRouterModel[];
  selectedModel: string | null;
  onModelSelect: (modelId: string | null) => void;
  loading: boolean;
  error: string | null;
}

export function ModelSelector({
  models,
  selectedModel,
  onModelSelect,
  loading,
  error,
}: ModelSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const fuse = useMemo(() => {
    return new Fuse(models, {
      keys: ['id', 'name', 'description'],
      threshold: FUZZY_SEARCH_THRESHOLD,
      includeScore: true,
    });
  }, [models]);

  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) {
      return models;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [fuse, searchQuery, models]);

  const selectedModelData = models.find((m) => m.id === selectedModel);

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Select AI Model
      </label>
      
      <div className="relative">
        <div
          className={`w-full rounded-lg border bg-gray-800/50 p-3 cursor-pointer transition-colors ${
            isOpen ? 'border-blue-500' : 'border-gray-600 hover:border-gray-500'
          }`}
          onClick={() => !loading && setIsOpen(!isOpen)}
        >
          {loading ? (
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Loading models...</span>
            </div>
          ) : selectedModelData ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">{selectedModelData.name || selectedModelData.id}</p>
                <p className="text-gray-400 text-xs truncate">{selectedModelData.id}</p>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">
                {models.length === 0 ? 'Enter API key to load models' : 'Select a model...'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        </div>

        {isOpen && models.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-600 bg-gray-800 shadow-xl">
            <div className="p-2 border-b border-gray-700">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-600 bg-gray-700 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  placeholder="Search models... (fuzzy search)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {filteredModels.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No models found for "{searchQuery}"
                </div>
              ) : (
                filteredModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-3 cursor-pointer transition-colors hover:bg-gray-700 ${
                      model.id === selectedModel ? 'bg-blue-600/20 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => {
                      onModelSelect(model.id);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                  >
                    <p className="text-white font-medium text-sm">{model.name || model.id}</p>
                    <p className="text-gray-400 text-xs">{model.id}</p>
                    {model.description && (
                      <p className="text-gray-500 text-xs mt-1 line-clamp-2">{model.description}</p>
                    )}
                    {model.pricing && (
                      <div className="flex gap-3 mt-1">
                        <span className="text-xs text-green-400">
                          Prompt: ${model.pricing.prompt}
                        </span>
                        <span className="text-xs text-green-400">
                          Completion: ${model.pricing.completion}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-2 border-t border-gray-700 text-center">
              <span className="text-xs text-gray-500">
                {filteredModels.length} of {models.length} models
              </span>
            </div>
          </div>
        )}
      </div>

      {selectedModel && (
        <button
          type="button"
          className="text-sm text-blue-400 hover:text-blue-300"
          onClick={() => onModelSelect(null)}
        >
          Clear selection
        </button>
      )}
    </div>
  );
}
