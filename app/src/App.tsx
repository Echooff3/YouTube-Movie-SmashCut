import { useState } from 'react'
import { Settings } from './components/Settings'
import { YouTubeAuth } from './components/YouTubeAuth'
import { YouTubeUrlInput } from './components/YouTubeUrlInput'
import { SrtUpload } from './components/SrtUpload'
import { AnalysisConfig } from './components/AnalysisConfig'
import { AnalysisResults } from './components/AnalysisResults'
// import { FalVideoGenerator } from './components/FalVideoGenerator'
import { Disclaimer, DisclaimerBanner } from './components/Disclaimer'
import { useYouTubeAuth } from './hooks/useYouTubeAuth'
import { useYouTubeVideo } from './hooks/useYouTubeVideo'
import { useSettings } from './hooks/useSettings'
import { useSrtParser } from './hooks/useSrtParser'
import { useOpenRouterChat } from './hooks/useOpenRouterChat'
import { DEFAULT_SYSTEM_PROMPT, ANALYSIS_USER_PROMPT_TEMPLATE } from './config/prompts'

function App() {
  const {
    authState,
    clientId,
    updateClientId,
    signIn,
    signOut,
    isReady,
  } = useYouTubeAuth();

  const {
    video,
    loading: videoLoading,
    error: videoError,
    fetchVideo,
    clearVideo,
  } = useYouTubeVideo(authState.accessToken);

  const {
    settings,
    updateWebSearchEnabled,
    updateStructuredOutputsEnabled,
  } = useSettings();

  const {
    parsedSrt,
    loading: srtLoading,
    error: srtError,
    parseFile,
    clearSrt,
    getTranscriptText,
  } = useSrtParser();

  const {
    sendMessage,
    loading: analysisLoading,
    error: analysisError,
    result: analysisResult,
  } = useOpenRouterChat(settings);

  // Local state for analysis configuration
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [targetDuration, setTargetDuration] = useState(10);

  // Check if we can run analysis
  const canAnalyze = !!(
    settings.apiKey &&
    settings.selectedModel &&
    parsedSrt
  );

  // Format duration for display
  const formatVideoDuration = (): string => {
    if (parsedSrt) {
      const hours = Math.floor(parsedSrt.totalDuration / 3600);
      const minutes = Math.floor((parsedSrt.totalDuration % 3600) / 60);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m`;
    }
    if (video) {
      return video.duration;
    }
    return 'Unknown';
  };

  // Run the analysis
  const handleAnalyze = async () => {
    if (!canAnalyze) return;

    const transcript = getTranscriptText();
    
    // Build the user prompt from template
    const userPrompt = ANALYSIS_USER_PROMPT_TEMPLATE
      .replace('{{videoTitle}}', video?.title || parsedSrt?.fileName || 'Unknown Video')
      .replace('{{videoDuration}}', formatVideoDuration())
      .replace('{{targetDuration}}', `${targetDuration} minutes`)
      .replace('{{transcript}}', transcript);

    await sendMessage(systemPrompt, userPrompt);
  };

  // Get analysis data for fal.ai video generator
  // const analysisData = analysisResult?.parsedContent as {
  //   summary?: string;
  //   themes?: string[];
  // } | null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Disclaimer Modal */}
      <Disclaimer />

      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SmashCut</h1>
              <p className="text-xs text-gray-400">AI-Powered Video Cliff Notes</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get the{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Cliff Notes
            </span>
            {' '}of Any Video
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Upload a subtitle file (SRT) and let AI identify the essential moments. 
            Transform a 2-hour movie into a {targetDuration}-minute summary with the key scenes, 
            important dialogue, and pivotal moments preserved.
          </p>
        </div>

        {/* SRT Upload - Primary Input */}
        <div className="mb-8">
          <SrtUpload
            parsedSrt={parsedSrt}
            loading={srtLoading}
            error={srtError}
            onFileSelect={parseFile}
            onClear={clearSrt}
          />
        </div>

        {/* YouTube Section (Optional) */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="text-sm">Optional: Link to YouTube video</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>
          
          <YouTubeAuth
            clientId={clientId}
            onClientIdChange={updateClientId}
            isAuthenticated={authState.isAuthenticated}
            user={authState.user}
            loading={authState.loading}
            error={authState.error}
            isReady={isReady}
            onSignIn={signIn}
            onSignOut={signOut}
          />

          {authState.isAuthenticated && (
            <YouTubeUrlInput
              isAuthenticated={authState.isAuthenticated}
              video={video}
              loading={videoLoading}
              error={videoError}
              onFetchVideo={fetchVideo}
              onClearVideo={clearVideo}
            />
          )}
        </div>

        {/* Settings Section */}
        <div className="mb-8">
          <Settings />
        </div>

        {/* Analysis Configuration */}
        <div className="mb-8">
          <AnalysisConfig
            systemPrompt={systemPrompt}
            onSystemPromptChange={setSystemPrompt}
            targetDuration={targetDuration}
            onTargetDurationChange={setTargetDuration}
            enableWebSearch={settings.enableWebSearch}
            onWebSearchChange={updateWebSearchEnabled}
            enableStructuredOutputs={settings.enableStructuredOutputs}
            onStructuredOutputsChange={updateStructuredOutputsEnabled}
            onAnalyze={handleAnalyze}
            isAnalyzing={analysisLoading}
            canAnalyze={canAnalyze}
          />
        </div>

        {/* Analysis Error */}
        {analysisError && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            <p className="text-red-400">{analysisError}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mb-8">
            <AnalysisResults
              result={analysisResult}
              targetDuration={targetDuration}
              onRerun={handleAnalyze}
              video={video}
            />
          </div>
        )}

        {/* Fal.ai Video Generator - Bonus Feature */}
        {/* <div className="mb-8">
          <FalVideoGenerator analysisData={analysisData} />
        </div> */}

        {/* Movie Script Database Info */}
        <div className="mt-8 rounded-xl border border-gray-700 bg-gray-800/50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-green-500/20">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Movie Script Database</h2>
              <p className="text-sm text-gray-400">Access thousands of movie transcripts for analysis</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            SmashCut integrates with the open-source Movie Script Database to provide accurate 
            transcripts for popular movies, enhancing the AI's ability to identify key scenes 
            and important dialogue.
          </p>

          <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
              </svg>
              <a
                href="https://github.com/Aveek-Saha/Movie-Script-Database"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Aveek-Saha/Movie-Script-Database
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-8">
          <DisclaimerBanner />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
          <p>YouTube-Movie-SmashCut • AI-powered video cliff notes</p>
          <p className="mt-1 text-xs text-gray-600">
            🔧 Hobbyist MVP - Not for production use
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
