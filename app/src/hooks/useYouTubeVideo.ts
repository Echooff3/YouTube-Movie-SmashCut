import { useState, useCallback } from 'react';
import type { YouTubeVideo } from '../types/youtube';

// Extract video ID from various YouTube URL formats
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Format ISO 8601 duration to human-readable
// Handles formats like PT1H2M3S, PT2M30S, PT45S, etc.
function formatDuration(isoDuration: string): string {
  if (!isoDuration || typeof isoDuration !== 'string') {
    return 'Unknown';
  }
  
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match || (!match[1] && !match[2] && !match[3])) {
    // Return original if format doesn't match or all groups are empty
    return isoDuration;
  }

  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function useYouTubeVideo(accessToken: string | null) {
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVideo = useCallback(async (url: string) => {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.');
      setVideo(null);
      return;
    }

    if (!accessToken) {
      setError('Please sign in with YouTube first to fetch video details.');
      setVideo(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use the YouTube Data API v3
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired. Please sign in again.');
        }
        if (response.status === 403) {
          throw new Error('Access denied. Please check your YouTube API permissions.');
        }
        throw new Error(`Failed to fetch video: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error('Video not found. Please check the URL and try again.');
      }

      const item = data.items[0];
      const thumbnails = item.snippet.thumbnails;

      setVideo({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: thumbnails.maxres?.url || thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url || '',
        duration: formatDuration(item.contentDetails.duration),
        channelTitle: item.snippet.channelTitle,
        publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch video details');
      setVideo(null);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const clearVideo = useCallback(() => {
    setVideo(null);
    setError(null);
  }, []);

  return {
    video,
    loading,
    error,
    fetchVideo,
    clearVideo,
  };
}
