import { useRef } from 'react';
import type { ParsedSrt } from '../hooks/useSrtParser';
import { formatTimestamp } from '../hooks/useSrtParser';

interface SrtUploadProps {
  parsedSrt: ParsedSrt | null;
  loading: boolean;
  error: string | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

export function SrtUpload({
  parsedSrt,
  loading,
  error,
  onFileSelect,
  onClear,
}: SrtUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800/50 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-orange-500/20">
          <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">Subtitle File (SRT)</h2>
          <p className="text-sm text-gray-400">Upload an SRT file to analyze the video transcript</p>
        </div>
      </div>

      {!parsedSrt ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            loading ? 'border-orange-500 bg-orange-500/10' : 'border-gray-600 hover:border-gray-500'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".srt"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin h-8 w-8 text-orange-400" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="text-gray-400">Parsing SRT file...</span>
            </div>
          ) : (
            <>
              <svg className="w-12 h-12 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-300 mb-2">Drag and drop your SRT file here</p>
              <p className="text-gray-500 text-sm mb-4">or</p>
              <button
                type="button"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </button>
              <p className="text-gray-500 text-xs mt-4">Supports .srt subtitle files</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* File Info */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-white font-medium">{parsedSrt.fileName}</p>
                <p className="text-green-400 text-sm">Successfully parsed</p>
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              onClick={onClear}
              title="Remove file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Duration</p>
              <p className="text-white font-semibold mt-1">{formatDuration(parsedSrt.totalDuration)}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Subtitles</p>
              <p className="text-white font-semibold mt-1">{parsedSrt.entries.length.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
              <p className="text-gray-400 text-xs uppercase tracking-wide">Words</p>
              <p className="text-white font-semibold mt-1">{parsedSrt.wordCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-wide mb-2">Preview (first 5 entries)</p>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {parsedSrt.entries.slice(0, 5).map((entry) => (
                <div key={entry.index} className="text-sm">
                  <span className="text-orange-400 font-mono text-xs">
                    [{formatTimestamp(entry.startSeconds)}]
                  </span>
                  <span className="text-gray-300 ml-2">{entry.text}</span>
                </div>
              ))}
              {parsedSrt.entries.length > 5 && (
                <p className="text-gray-500 text-xs italic">
                  ... and {parsedSrt.entries.length - 5} more entries
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
