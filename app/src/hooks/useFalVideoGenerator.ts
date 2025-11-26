import { useState, useCallback } from 'react';

// fal.ai API types
interface FalVideoResult {
  video: {
    url: string;
    content_type: string;
    file_name: string;
    file_size: number;
  };
}

interface FalQueueStatus {
  status: 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  request_id: string;
  logs?: Array<{ message: string }>;
  response_url?: string;
}

const FAL_API_URL = 'https://queue.fal.run/fal-ai/kling-video/v2.5-turbo/pro/text-to-video';

export function useFalVideoGenerator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);

  const generateVideo = useCallback(async (
    apiKey: string,
    prompt: string,
    options?: {
      duration?: '5' | '10';
      aspectRatio?: '16:9' | '9:16' | '1:1';
    }
  ) => {
    if (!apiKey) {
      setError('Please provide a fal.ai API key');
      return null;
    }

    setLoading(true);
    setError(null);
    setProgress([]);
    setVideoUrl(null);
    setRequestId(null);

    try {
      // Submit the video generation request
      const submitResponse = await fetch(FAL_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration: options?.duration || '5', // Default to 5 seconds to reduce cost
          aspect_ratio: options?.aspectRatio || '16:9',
          negative_prompt: 'blur, distort, and low quality',
          cfg_scale: 0.5,
        }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        if (submitResponse.status === 401) {
          throw new Error('Invalid fal.ai API key');
        }
        throw new Error(errorData.detail || `Failed to submit video generation: ${submitResponse.statusText}`);
      }

      const submitData = await submitResponse.json();
      const reqId = submitData.request_id;
      setRequestId(reqId);
      setProgress(prev => [...prev, 'Video generation request submitted...']);

      // Poll for completion
      const statusUrl = `https://queue.fal.run/fal-ai/kling-video/v2.5-turbo/pro/text-to-video/requests/${reqId}/status`;
      const resultUrl = `https://queue.fal.run/fal-ai/kling-video/v2.5-turbo/pro/text-to-video/requests/${reqId}`;

      let attempts = 0;
      const maxAttempts = 120; // 10 minutes max (5 second intervals)

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds between polls

        const statusResponse = await fetch(statusUrl, {
          headers: {
            'Authorization': `Key ${apiKey}`,
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to check video generation status');
        }

        const statusData: FalQueueStatus = await statusResponse.json();

        // Log progress
        if (statusData.logs) {
          const newLogs = statusData.logs.map(log => log.message);
          setProgress(prev => {
            const existingLogs = new Set(prev);
            const uniqueNewLogs = newLogs.filter(log => !existingLogs.has(log));
            return [...prev, ...uniqueNewLogs];
          });
        }

        if (statusData.status === 'COMPLETED') {
          setProgress(prev => [...prev, 'Video generation complete!']);
          
          // Fetch the result
          const resultResponse = await fetch(resultUrl, {
            headers: {
              'Authorization': `Key ${apiKey}`,
            },
          });

          if (!resultResponse.ok) {
            throw new Error('Failed to fetch video result');
          }

          const resultData: FalVideoResult = await resultResponse.json();
          setVideoUrl(resultData.video.url);
          setLoading(false);
          return resultData.video.url;
        }

        if (statusData.status === 'FAILED') {
          throw new Error('Video generation failed');
        }

        setProgress(prev => [...prev, `Processing... (${statusData.status})`]);
        attempts++;
      }

      throw new Error('Video generation timed out');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate video';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setProgress([]);
    setVideoUrl(null);
    setRequestId(null);
  }, []);

  return {
    generateVideo,
    loading,
    error,
    progress,
    videoUrl,
    requestId,
    reset,
  };
}
