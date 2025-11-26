import { useState, useRef, useEffect } from 'react';
import { useFalVideoGenerator } from '../hooks/useFalVideoGenerator';

interface FalVideoGeneratorProps {
  analysisData?: {
    summary?: string;
    themes?: string[];
  } | null;
}

export function FalVideoGenerator({ analysisData }: FalVideoGeneratorProps) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('fal-api-key') || '');
  const [showApiKey, setShowApiKey] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [customPrompt, setCustomPrompt] = useState('');
  const [duration, setDuration] = useState<'5' | '10'>('5');
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    generateVideo,
    loading,
    error,
    progress,
    videoUrl,
    reset,
  } = useFalVideoGenerator();

  // Save API key to localStorage
  const handleSaveApiKey = () => {
    setApiKey(tempApiKey);
    localStorage.setItem('fal-api-key', tempApiKey);
  };

  // Generate prompt from analysis
  const generatePromptFromAnalysis = (): string => {
    if (!analysisData) {
      return customPrompt || 'A cinematic scene from an epic movie, dramatic lighting, high quality cinematography';
    }

    const themes = analysisData.themes?.slice(0, 3).join(', ') || 'drama';
    const summary = analysisData.summary?.slice(0, 200) || '';
    
    return `A dramatic cinematic scene: ${summary}. Themes: ${themes}. High quality, professional cinematography, movie-like visuals, dramatic lighting.`;
  };

  // Handle video generation
  const handleGenerate = async () => {
    const prompt = customPrompt || generatePromptFromAnalysis();
    await generateVideo(apiKey, prompt, { duration });
  };

  // Download video
  const handleDownload = async () => {
    if (!videoUrl) return;

    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `smashcut-preview-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(videoUrl, '_blank');
    }
  };

  // Auto-scroll progress log
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.scrollTop = progressRef.current.scrollHeight;
    }
  }, [progress]);

  return (
    <div className="rounded-xl border border-gray-700 bg-gradient-to-br from-pink-900/20 to-purple-900/20 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500/30 to-purple-500/30">
          <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            AI Video Preview
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white">
              ✨ Bonus Feature
            </span>
          </h2>
          <p className="text-sm text-gray-400">Generate a 5-second AI video preview using fal.ai</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* API Key Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            fal.ai API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              className="w-full rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 pr-24 text-white placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              placeholder="Your fal.ai API key"
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
          <div className="mt-2 flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors disabled:opacity-50"
              onClick={handleSaveApiKey}
              disabled={tempApiKey === apiKey}
            >
              Save Key
            </button>
            {apiKey && (
              <span className="text-green-400 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Key saved
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Get your API key from{' '}
            <a href="https://fal.ai/dashboard/keys" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">
              fal.ai/dashboard/keys
            </a>
          </p>
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video Duration
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                duration === '5'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setDuration('5')}
            >
              5 seconds
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                duration === '10'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setDuration('10')}
            >
              10 seconds
              <span className="ml-1 text-xs text-yellow-400">(2x cost)</span>
            </button>
          </div>
        </div>

        {/* Custom Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Video Prompt
            {analysisData && (
              <span className="text-gray-500 font-normal ml-2">
                (leave empty to auto-generate from analysis)
              </span>
            )}
          </label>
          <textarea
            className="w-full h-24 rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-3 text-white text-sm placeholder-gray-400 focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
            placeholder={analysisData 
              ? "Auto-generated from your video analysis..." 
              : "Describe the video scene you want to generate..."
            }
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
          {analysisData && !customPrompt && (
            <p className="text-xs text-gray-500 mt-1">
              Preview: {generatePromptFromAnalysis().slice(0, 100)}...
            </p>
          )}
        </div>

        {/* Generate Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-4 text-lg font-semibold text-white hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleGenerate}
          disabled={!apiKey || loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Generating Video...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Generate {duration}s Video Preview</span>
            </>
          )}
        </button>

        {!apiKey && (
          <p className="text-yellow-400 text-sm text-center">
            Please save your fal.ai API key to generate videos
          </p>
        )}

        {/* Progress Log */}
        {loading && progress.length > 0 && (
          <div 
            ref={progressRef}
            className="p-3 rounded-lg bg-gray-900/50 border border-gray-700 max-h-32 overflow-y-auto"
          >
            {progress.map((log, index) => (
              <p key={index} className="text-gray-400 text-xs font-mono">
                {log}
              </p>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 text-sm">{error}</p>
            <button
              type="button"
              className="text-red-300 text-xs underline mt-1"
              onClick={reset}
            >
              Try again
            </button>
          </div>
        )}

        {/* Video Result */}
        {videoUrl && (
          <div className="space-y-4">
            <div className="rounded-lg overflow-hidden border border-gray-600">
              <video
                ref={videoRef}
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                onClick={handleDownload}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Video
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-600 px-4 py-3 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                onClick={reset}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Generate New
              </button>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
          <p className="text-xs text-gray-400">
            <strong className="text-gray-300">💡 Tip:</strong> This generates an AI video based on your video's themes and summary. 
            It's a fun way to create a teaser or visual representation of your content!
          </p>
        </div>
      </div>
    </div>
  );
}
