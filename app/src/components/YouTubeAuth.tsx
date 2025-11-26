import { useState } from 'react';

interface YouTubeAuthProps {
  clientId: string;
  onClientIdChange: (clientId: string) => void;
  isAuthenticated: boolean;
  user: { name: string; picture?: string } | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function YouTubeAuth({
  clientId,
  onClientIdChange,
  isAuthenticated,
  user,
  loading,
  error,
  isReady,
  onSignIn,
  onSignOut,
}: YouTubeAuthProps) {
  const [showClientId, setShowClientId] = useState(false);
  const [tempClientId, setTempClientId] = useState(clientId);

  const handleSaveClientId = () => {
    onClientIdChange(tempClientId);
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-red-500/20">
          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">YouTube Authentication</h2>
          <p className="text-sm text-gray-400">Sign in to access YouTube videos</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Google Client ID Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Google OAuth Client ID
          </label>
          <div className="relative">
            <input
              type={showClientId ? 'text' : 'password'}
              className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pr-24 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
              placeholder="Your Google Cloud OAuth Client ID"
              value={tempClientId}
              onChange={(e) => setTempClientId(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-gray-400 hover:text-white"
              onClick={() => setShowClientId(!showClientId)}
            >
              {showClientId ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSaveClientId}
              disabled={tempClientId === clientId}
            >
              Save Client ID
            </button>
          </div>
        </div>

        {/* Auth Status & Sign In/Out */}
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-green-400 text-sm">Connected to YouTube</p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
              onClick={onSignOut}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onSignIn}
              disabled={loading || !isReady || !clientId}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </button>
            
            {!clientId && (
              <p className="text-yellow-400 text-sm text-center">
                Please enter your Google OAuth Client ID first
              </p>
            )}
            
            {!isReady && clientId && (
              <p className="text-gray-400 text-sm text-center">
                Loading Google Sign-In...
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Setup Instructions */}
        <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
          <p className="text-xs text-gray-400 mb-2">
            <strong className="text-gray-300">Setup Instructions:</strong>
          </p>
          <ol className="text-xs text-gray-400 list-decimal list-inside space-y-1">
            <li>Go to the <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google Cloud Console</a></li>
            <li>Create a new OAuth 2.0 Client ID (Web application)</li>
            <li>Add <code className="bg-gray-800 px-1 rounded">{window.location.origin}</code> to Authorized JavaScript origins</li>
            <li>Enable the YouTube Data API v3</li>
            <li>Copy the Client ID and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
