import { useState, useEffect } from 'react';

const DISCLAIMER_ACCEPTED_KEY = 'smashcut-disclaimer-accepted';

export function Disclaimer() {
  const [isAccepted, setIsAccepted] = useState(() => {
    return localStorage.getItem(DISCLAIMER_ACCEPTED_KEY) === 'true';
  });
  const [isVisible, setIsVisible] = useState(!isAccepted);

  useEffect(() => {
    if (isAccepted) {
      localStorage.setItem(DISCLAIMER_ACCEPTED_KEY, 'true');
    }
  }, [isAccepted]);

  const handleAccept = () => {
    setIsAccepted(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="max-w-lg w-full rounded-2xl border border-yellow-500/50 bg-gray-900 p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-yellow-500/20">
            <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-yellow-400">⚠️ Important Disclaimer</h2>
        </div>

        <div className="space-y-4 text-gray-300">
          <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <p className="font-semibold text-yellow-300 mb-2">🔧 Hobbyist Project</p>
            <p className="text-sm">
              This application was <strong>purpose-built for hobbyist use</strong>. It is an MVP (Minimum Viable Product) 
              designed for personal experimentation and learning.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="font-semibold text-red-300 mb-2">🔓 Security Notice</p>
            <p className="text-sm">
              <strong>API keys are stored in your browser's localStorage.</strong> This is not a secure 
              storage method for production use. Your keys could be accessed by:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-gray-400 space-y-1">
              <li>Browser extensions</li>
              <li>XSS attacks (if any exist)</li>
              <li>Anyone with access to your browser</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <p className="font-semibold text-blue-300 mb-2">💡 Recommendations</p>
            <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
              <li>Use API keys with limited permissions</li>
              <li>Set spending limits on your API accounts</li>
              <li>Regularly rotate your API keys</li>
              <li>Don't use this on public or shared computers</li>
            </ul>
          </div>

          <p className="text-center text-sm text-gray-500 italic">
            "Only use this application if you understand the risks and know what you're doing."
          </p>
        </div>

        <button
          type="button"
          className="w-full mt-6 flex items-center justify-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 text-lg font-semibold text-white hover:bg-yellow-700 transition-colors"
          onClick={handleAccept}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          I Understand, Continue
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          By continuing, you acknowledge you've read and understood this disclaimer.
        </p>
      </div>
    </div>
  );
}

// Small banner to show in the app footer as a reminder
export function DisclaimerBanner() {
  return (
    <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 mb-4">
      <div className="flex items-start gap-2">
        <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-xs text-yellow-300">
          <strong>Hobbyist MVP:</strong> API keys are stored in localStorage. Not for production use. 
          Use only if you know what you're doing.{' '}
          <button 
            className="underline hover:text-yellow-200"
            onClick={() => {
              localStorage.removeItem('smashcut-disclaimer-accepted');
              window.location.reload();
            }}
          >
            View full disclaimer
          </button>
        </p>
      </div>
    </div>
  );
}
