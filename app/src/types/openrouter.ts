export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing?: {
    prompt: string;
    completion: string;
  };
  context_length?: number;
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string;
  };
  top_provider?: {
    max_completion_tokens?: number;
    is_moderated?: boolean;
  };
  supported_parameters?: string[];
}

export interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

export interface Settings {
  apiKey: string;
  selectedModel: string | null;
  enableWebSearch: boolean;
  webSearchEngine: 'native' | 'exa' | 'auto';
  webSearchMaxResults: number;
  enableStructuredOutputs: boolean;
}

// Web search plugin configuration
export interface WebSearchPlugin {
  id: 'web';
  engine?: 'native' | 'exa';
  max_results?: number;
  search_prompt?: string;
}

// Structured output JSON schema
export interface JsonSchema {
  name: string;
  strict: boolean;
  schema: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description?: string;
      items?: { type: string };
      enum?: string[];
    }>;
    required: string[];
    additionalProperties: boolean;
  };
}

export interface ResponseFormat {
  type: 'json_schema';
  json_schema: JsonSchema;
}

// Video analysis structured output schema
export const videoAnalysisSchema: JsonSchema = {
  name: 'video_analysis',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      summary: {
        type: 'string',
        description: 'A brief summary of the video content',
      },
      key_scenes: {
        type: 'array',
        description: 'List of key scenes with timestamps',
        items: { type: 'object' },
      },
      themes: {
        type: 'array',
        description: 'Main themes or topics covered in the video',
        items: { type: 'string' },
      },
      sentiment: {
        type: 'string',
        description: 'Overall emotional tone of the content',
        enum: ['positive', 'negative', 'neutral', 'mixed'],
      },
      importance_score: {
        type: 'number',
        description: 'Overall importance score from 1-10',
      },
      recommended_clips: {
        type: 'array',
        description: 'Suggested clips to include in the condensed version',
        items: { type: 'object' },
      },
    },
    required: ['summary', 'key_scenes', 'themes', 'sentiment', 'importance_score', 'recommended_clips'],
    additionalProperties: false,
  },
};

// OpenRouter chat completion request
export interface OpenRouterChatRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
  }>;
  plugins?: WebSearchPlugin[];
  response_format?: ResponseFormat;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

// OpenRouter chat completion response
export interface OpenRouterChatResponse {
  id: string;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
      annotations?: Array<{
        type: 'url_citation';
        url_citation: {
          url: string;
          title: string;
          content?: string;
          start_index: number;
          end_index: number;
        };
      }>;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}
