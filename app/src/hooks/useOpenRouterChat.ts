import { useState, useCallback } from 'react';
import type { Settings, WebSearchPlugin, OpenRouterChatResponse } from '../types/openrouter';
import { VIDEO_ANALYSIS_SCHEMA } from '../config/prompts';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface AnalysisResult {
  response: OpenRouterChatResponse;
  parsedContent: Record<string, unknown> | null;
  rawContent: string;
  citations?: Array<{
    url: string;
    title: string;
    content?: string;
  }>;
}

export function useOpenRouterChat(settings: Settings) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const sendMessage = useCallback(async (
    systemPrompt: string,
    userMessage: string,
    options?: {
      useWebSearch?: boolean;
      useStructuredOutput?: boolean;
      customSchema?: typeof VIDEO_ANALYSIS_SCHEMA;
    }
  ): Promise<AnalysisResult | null> => {
    if (!settings.apiKey) {
      setError('Please configure your OpenRouter API key first');
      return null;
    }

    if (!settings.selectedModel) {
      setError('Please select an AI model first');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Build the model string - append :online for web search if using that method
      let modelString = settings.selectedModel;
      const useWebSearch = options?.useWebSearch ?? settings.enableWebSearch;
      
      // Build plugins array for web search
      const plugins: WebSearchPlugin[] = [];
      if (useWebSearch && settings.webSearchEngine !== 'auto') {
        plugins.push({
          id: 'web',
          engine: settings.webSearchEngine as 'native' | 'exa',
          max_results: settings.webSearchMaxResults,
        });
      } else if (useWebSearch) {
        // Use :online suffix for auto/native
        modelString = `${settings.selectedModel}:online`;
      }

      // Build request body
      const requestBody: Record<string, unknown> = {
        model: modelString,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      };

      // Add plugins if any
      if (plugins.length > 0) {
        requestBody.plugins = plugins;
      }

      // Add structured output if enabled
      const useStructuredOutput = options?.useStructuredOutput ?? settings.enableStructuredOutputs;
      if (useStructuredOutput) {
        const schema = options?.customSchema ?? VIDEO_ANALYSIS_SCHEMA;
        requestBody.response_format = {
          type: 'json_schema',
          json_schema: schema,
        };
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'SmashCut Video Analyzer',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key.');
        }
        if (response.status === 402) {
          throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
        }
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(errorData.error?.message || `API request failed: ${response.statusText}`);
      }

      const data: OpenRouterChatResponse = await response.json();
      
      const message = data.choices[0]?.message;
      const rawContent = message?.content || '';
      
      // Extract citations from annotations (web search results)
      const citations = message?.annotations
        ?.filter(a => a.type === 'url_citation')
        .map(a => ({
          url: a.url_citation.url,
          title: a.url_citation.title,
          content: a.url_citation.content,
        }));

      // Try to parse structured output
      let parsedContent: Record<string, unknown> | null = null;
      if (useStructuredOutput && rawContent) {
        try {
          parsedContent = JSON.parse(rawContent);
        } catch {
          console.warn('Failed to parse structured output as JSON');
        }
      }

      const analysisResult: AnalysisResult = {
        response: data,
        parsedContent,
        rawContent,
        citations,
      };

      setResult(analysisResult);
      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    sendMessage,
    loading,
    error,
    result,
    clearResult,
  };
}
