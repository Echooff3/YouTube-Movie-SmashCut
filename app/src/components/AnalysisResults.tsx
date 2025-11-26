import type { AnalysisResult } from '../hooks/useOpenRouterChat';

interface AnalysisResultsProps {
  result: AnalysisResult;
  targetDuration: number;
  onRerun: () => void;
}

interface RecommendedSegment {
  start_time: string;
  end_time: string;
  importance_score: number;
  category: string;
  reason: string;
  transcript_excerpt?: string;
}

interface VideoAnalysis {
  summary: string;
  total_segments_analyzed?: number;
  recommended_segments: RecommendedSegment[];
  themes: string[];
  estimated_condensed_duration: string;
  editing_notes?: string;
}

export function AnalysisResults({ result, targetDuration, onRerun }: AnalysisResultsProps) {
  const analysis = result.parsedContent as VideoAnalysis | null;
  
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      narrative: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      emotional: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      action: 'bg-red-500/20 text-red-400 border-red-500/30',
      dialogue: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      visual: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      humor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      climax: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      introduction: 'bg-green-500/20 text-green-400 border-green-500/30',
      conclusion: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getImportanceBar = (score: number): string => {
    const percentage = (score / 10) * 100;
    return `${percentage}%`;
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Cliff Notes Analysis</h2>
            <p className="text-sm text-gray-400">Key moments for your {targetDuration}-minute summary</p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-gray-600 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
          onClick={onRerun}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Re-analyze
        </button>
      </div>

      {analysis ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
            <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
              <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Summary
            </h3>
            <p className="text-gray-300">{analysis.summary}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-center">
              <p className="text-2xl font-bold text-white">{analysis.recommended_segments?.length || 0}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Key Segments</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-center">
              <p className="text-2xl font-bold text-white">{analysis.estimated_condensed_duration || `${targetDuration}m`}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Est. Duration</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-center">
              <p className="text-2xl font-bold text-white">{analysis.themes?.length || 0}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Themes</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700 text-center">
              <p className="text-2xl font-bold text-white">{analysis.total_segments_analyzed || '-'}</p>
              <p className="text-gray-400 text-xs uppercase tracking-wide">Analyzed</p>
            </div>
          </div>

          {/* Themes */}
          {analysis.themes && analysis.themes.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Main Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((theme, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm border border-purple-500/30"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Segments */}
          {analysis.recommended_segments && analysis.recommended_segments.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Segments to Include
              </h3>
              <div className="space-y-3">
                {analysis.recommended_segments.map((segment, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-orange-400 font-mono text-sm">
                            {segment.start_time} → {segment.end_time}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getCategoryColor(segment.category)}`}>
                            {segment.category}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm mb-2">{segment.reason}</p>
                        {segment.transcript_excerpt && (
                          <p className="text-gray-500 text-xs italic border-l-2 border-gray-600 pl-3">
                            "{segment.transcript_excerpt}"
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-white font-bold">{segment.importance_score}/10</span>
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                            style={{ width: getImportanceBar(segment.importance_score) }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Editing Notes */}
          {analysis.editing_notes && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <h3 className="text-yellow-400 font-semibold mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Editing Notes
              </h3>
              <p className="text-gray-300 text-sm">{analysis.editing_notes}</p>
            </div>
          )}

          {/* Web Search Citations */}
          {result.citations && result.citations.length > 0 && (
            <div>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Web Sources
              </h3>
              <div className="space-y-2">
                {result.citations.map((citation, index) => (
                  <a
                    key={index}
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-lg bg-gray-900/50 border border-gray-700 hover:border-blue-500/50 transition-colors"
                  >
                    <p className="text-blue-400 text-sm font-medium hover:underline">{citation.title}</p>
                    <p className="text-gray-500 text-xs truncate">{citation.url}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Raw Output Fallback */
        <div className="p-4 rounded-lg bg-gray-900/50 border border-gray-700">
          <h3 className="text-white font-semibold mb-2">Raw Analysis Output</h3>
          <pre className="text-gray-300 text-sm whitespace-pre-wrap font-mono overflow-x-auto">
            {result.rawContent}
          </pre>
        </div>
      )}

      {/* Token Usage */}
      {result.response.usage && (
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Model: {result.response.model}</span>
            <span>
              Tokens: {result.response.usage.prompt_tokens} prompt + {result.response.usage.completion_tokens} completion = {result.response.usage.total_tokens} total
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
