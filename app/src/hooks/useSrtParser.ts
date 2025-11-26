import { useState, useCallback } from 'react';

export interface SrtEntry {
  index: number;
  startTime: string;
  endTime: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export interface ParsedSrt {
  entries: SrtEntry[];
  totalDuration: number;
  wordCount: number;
  fileName: string;
}

// Parse SRT timestamp to seconds
function parseTimestamp(timestamp: string): number {
  const match = timestamp.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);
  if (!match) return 0;
  
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = parseInt(match[3], 10);
  const milliseconds = parseInt(match[4], 10);
  
  return hours * 3600 + minutes * 60 + seconds + milliseconds / 1000;
}

// Format seconds to timestamp string
export function formatTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
}

// Parse SRT file content
function parseSrtContent(content: string): SrtEntry[] {
  const entries: SrtEntry[] = [];
  
  // Normalize line endings and split into blocks
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const blocks = normalizedContent.split(/\n\n+/);
  
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 3) continue;
    
    // First line should be the index
    const index = parseInt(lines[0], 10);
    if (isNaN(index)) continue;
    
    // Second line should be the timestamp
    const timestampMatch = lines[1].match(/(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/);
    if (!timestampMatch) continue;
    
    const startTime = timestampMatch[1];
    const endTime = timestampMatch[2];
    const startSeconds = parseTimestamp(startTime);
    const endSeconds = parseTimestamp(endTime);
    
    // Remaining lines are the subtitle text
    const text = lines.slice(2).join('\n').trim();
    
    entries.push({
      index,
      startTime,
      endTime,
      startSeconds,
      endSeconds,
      text,
    });
  }
  
  return entries.sort((a, b) => a.startSeconds - b.startSeconds);
}

export function useSrtParser() {
  const [parsedSrt, setParsedSrt] = useState<ParsedSrt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.srt')) {
      setError('Please upload a valid SRT file');
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const entries = parseSrtContent(content);
        
        if (entries.length === 0) {
          throw new Error('No valid subtitle entries found in the file');
        }
        
        const totalDuration = entries[entries.length - 1].endSeconds;
        const wordCount = entries.reduce((count, entry) => {
          return count + entry.text.split(/\s+/).filter(word => word.length > 0).length;
        }, 0);
        
        setParsedSrt({
          entries,
          totalDuration,
          wordCount,
          fileName: file.name,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to parse SRT file');
        setParsedSrt(null);
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };
    
    reader.readAsText(file);
  }, []);

  const clearSrt = useCallback(() => {
    setParsedSrt(null);
    setError(null);
  }, []);

  // Get transcript as plain text for AI analysis
  const getTranscriptText = useCallback((): string => {
    if (!parsedSrt) return '';
    
    return parsedSrt.entries
      .map(entry => `[${entry.startTime} - ${entry.endTime}] ${entry.text}`)
      .join('\n');
  }, [parsedSrt]);

  // Get segments grouped by time intervals (e.g., every 5 minutes)
  const getSegments = useCallback((intervalMinutes: number = 5): Array<{
    startTime: number;
    endTime: number;
    text: string;
    entries: SrtEntry[];
  }> => {
    if (!parsedSrt) return [];
    
    const intervalSeconds = intervalMinutes * 60;
    const segments: Array<{
      startTime: number;
      endTime: number;
      text: string;
      entries: SrtEntry[];
    }> = [];
    
    let currentSegmentStart = 0;
    let currentEntries: SrtEntry[] = [];
    
    for (const entry of parsedSrt.entries) {
      const segmentIndex = Math.floor(entry.startSeconds / intervalSeconds);
      const segmentStart = segmentIndex * intervalSeconds;
      
      if (segmentStart !== currentSegmentStart && currentEntries.length > 0) {
        segments.push({
          startTime: currentSegmentStart,
          endTime: currentSegmentStart + intervalSeconds,
          text: currentEntries.map(e => e.text).join(' '),
          entries: currentEntries,
        });
        currentEntries = [];
      }
      
      currentSegmentStart = segmentStart;
      currentEntries.push(entry);
    }
    
    // Add final segment
    if (currentEntries.length > 0) {
      segments.push({
        startTime: currentSegmentStart,
        endTime: parsedSrt.totalDuration,
        text: currentEntries.map(e => e.text).join(' '),
        entries: currentEntries,
      });
    }
    
    return segments;
  }, [parsedSrt]);

  return {
    parsedSrt,
    loading,
    error,
    parseFile,
    clearSrt,
    getTranscriptText,
    getSegments,
  };
}
