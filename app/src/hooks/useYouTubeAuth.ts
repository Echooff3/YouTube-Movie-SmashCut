import { useState, useEffect, useCallback } from 'react';
import type { YouTubeAuthState, YouTubeUser } from '../types/youtube';

// YouTube Data API and OAuth configuration
// Users need to set up their own Google Cloud project and OAuth credentials
const YOUTUBE_CLIENT_ID_KEY = 'smashcut-youtube-client-id';
const YOUTUBE_AUTH_KEY = 'smashcut-youtube-auth';
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const defaultAuthState: YouTubeAuthState = {
  isAuthenticated: false,
  accessToken: null,
  user: null,
  loading: false,
  error: null,
};

export function useYouTubeAuth() {
  const [authState, setAuthState] = useState<YouTubeAuthState>(() => {
    const stored = localStorage.getItem(YOUTUBE_AUTH_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return { ...defaultAuthState, ...parsed, loading: false };
      } catch {
        return defaultAuthState;
      }
    }
    return defaultAuthState;
  });

  const [clientId, setClientId] = useState<string>(() => {
    return localStorage.getItem(YOUTUBE_CLIENT_ID_KEY) || '';
  });

  const [isGsiLoaded, setIsGsiLoaded] = useState(false);
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    if (document.getElementById('google-gsi-script')) {
      setIsGsiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsGsiLoaded(true);
    script.onerror = () => {
      setAuthState(prev => ({ ...prev, error: 'Failed to load Google Sign-In' }));
    };
    document.head.appendChild(script);
  }, []);

  // Load Google API client library
  useEffect(() => {
    if (document.getElementById('google-gapi-script')) {
      setIsGapiLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gapi-script';
    script.src = 'https://apis.google.com/js/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.gapi?.load('client', () => {
        window.gapi?.client.init({
          discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'],
        }).then(() => {
          setIsGapiLoaded(true);
        }).catch((err: Error) => {
          console.error('Failed to initialize GAPI client:', err);
        });
      });
    };
    document.head.appendChild(script);
  }, []);

  // Persist auth state
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(YOUTUBE_AUTH_KEY, JSON.stringify({
        isAuthenticated: authState.isAuthenticated,
        accessToken: authState.accessToken,
        user: authState.user,
      }));
    } else {
      localStorage.removeItem(YOUTUBE_AUTH_KEY);
    }
  }, [authState.isAuthenticated, authState.accessToken, authState.user]);

  // Persist client ID
  useEffect(() => {
    if (clientId) {
      localStorage.setItem(YOUTUBE_CLIENT_ID_KEY, clientId);
    } else {
      localStorage.removeItem(YOUTUBE_CLIENT_ID_KEY);
    }
  }, [clientId]);

  const signIn = useCallback(() => {
    if (!isGsiLoaded || !clientId) {
      setAuthState(prev => ({ 
        ...prev, 
        error: clientId ? 'Google Sign-In not loaded yet' : 'Please enter your Google Client ID first' 
      }));
      return;
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const tokenClient = window.google?.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: async (response) => {
          if (response.error) {
            setAuthState(prev => ({ 
              ...prev, 
              loading: false, 
              error: `Authentication failed: ${response.error}` 
            }));
            return;
          }

          // Set the token for GAPI client
          if (isGapiLoaded && window.gapi?.client) {
            window.gapi.client.setToken({ access_token: response.access_token });
          }

          // Fetch user info
          try {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` },
            });
            const userInfo = await userInfoResponse.json();

            const user: YouTubeUser = {
              id: userInfo.id,
              name: userInfo.name,
              email: userInfo.email,
              picture: userInfo.picture,
            };

            setAuthState({
              isAuthenticated: true,
              accessToken: response.access_token,
              user,
              loading: false,
              error: null,
            });
          } catch {
            // User info fetch is optional - the OAuth token is the critical part.
            // This can fail due to network issues or if the userinfo scope wasn't granted.
            // We still consider auth successful since we have a valid access token.
            setAuthState({
              isAuthenticated: true,
              accessToken: response.access_token,
              user: null,
              loading: false,
              error: null,
            });
          }
        },
        error_callback: (error) => {
          setAuthState(prev => ({ 
            ...prev, 
            loading: false, 
            error: `Authentication error: ${error.message}` 
          }));
        },
      });

      tokenClient?.requestAccessToken();
    } catch (err) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err instanceof Error ? err.message : 'Failed to initialize authentication' 
      }));
    }
  }, [isGsiLoaded, isGapiLoaded, clientId]);

  const signOut = useCallback(() => {
    setAuthState(defaultAuthState);
    if (window.gapi?.client) {
      window.gapi.client.setToken({ access_token: '' });
    }
  }, []);

  const updateClientId = useCallback((id: string) => {
    setClientId(id);
    // Reset auth when client ID changes
    if (authState.isAuthenticated) {
      setAuthState(defaultAuthState);
    }
  }, [authState.isAuthenticated]);

  return {
    authState,
    clientId,
    updateClientId,
    signIn,
    signOut,
    isReady: isGsiLoaded && isGapiLoaded,
  };
}
