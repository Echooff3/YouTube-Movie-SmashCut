export interface YouTubeAuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: YouTubeUser | null;
  loading: boolean;
  error: string | null;
}

export interface YouTubeUser {
  id: string;
  name: string;
  email?: string;
  picture?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  channelTitle: string;
  publishedAt: string;
}

export interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      maxres?: { url: string };
    };
    channelTitle: string;
    publishedAt: string;
  };
  contentDetails: {
    duration: string;
  };
}

// Google Identity Services types
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: TokenClientConfig) => TokenClient;
        };
      };
    };
    gapi?: {
      load: (api: string, callback: () => void) => void;
      client: {
        init: (config: GapiClientConfig) => Promise<void>;
        youtube: {
          videos: {
            list: (params: YouTubeListParams) => Promise<YouTubeListResponse>;
          };
        };
        setToken: (token: { access_token: string }) => void;
      };
    };
  }
}

interface TokenClientConfig {
  client_id: string;
  scope: string;
  callback: (response: TokenResponse) => void;
  error_callback?: (error: TokenError) => void;
}

interface TokenClient {
  requestAccessToken: () => void;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
  error?: string;
}

interface TokenError {
  type: string;
  message: string;
}

interface GapiClientConfig {
  apiKey?: string;
  discoveryDocs?: string[];
}

interface YouTubeListParams {
  part: string[];
  id: string;
}

interface YouTubeListResponse {
  result: {
    items: YouTubeVideoDetails[];
  };
}

export {};
