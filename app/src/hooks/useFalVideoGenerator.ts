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
      const modelId = 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video';
      
      // 1. Submit request to queue
      const submitResponse = await fetch(`https://queue.fal.run/${modelId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          duration: options?.duration || '5',
          aspect_ratio: options?.aspectRatio || '16:9',
          negative_prompt: 'blur, distort, and low quality',
          cfg_scale: 0.5,
        }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || `Submission failed: ${submitResponse.statusText}`);
      }

      const { request_id } = await submitResponse.json();
      setRequestId(request_id);
      setProgress(prev => [...prev, 'Request submitted to queue...']);

      // 2. Poll for status
      let isComplete = false;
      let resultUrl = null;

      while (!isComplete) {
        const statusResponse = await fetch(
          `https://queue.fal.run/${modelId}/requests/${request_id}/status?logs=1`,
          {
            headers: {
              'Authorization': `Key ${apiKey}`,
            },
          }
        );

        if (!statusResponse.ok) {
          throw new Error(`Status check failed: ${statusResponse.statusText}`);
        }

        const statusData = await statusResponse.json();
        
        // Update logs
        if (statusData.logs) {
          const newLogs = statusData.logs.map((l: any) => l.message);
          setProgress(prev => {
            const allMsgs = [...prev, ...newLogs];
            return [...new Set(allMsgs)];
          });
        }

        if (statusData.status === 'COMPLETED') {
          isComplete = true;
          // 3. Get result
          const resultResponse = await fetch(
            `https://queue.fal.run/${modelId}/requests/${request_id}`,
            {
              headers: {
                'Authorization': `Key ${apiKey}`,
              },
            }
          );
          
          if (!resultResponse.ok) {
            throw new Error('Failed to fetch result');
          }

          const resultJson = await resultResponse.json();
          const data = resultJson.response as FalVideoResult;
          
          if (data.video?.url) {
            resultUrl = data.video.url;
          }
        } else if (statusData.status === 'IN_QUEUE') {
          setProgress(prev => {
            const msg = `Queue position: ${statusData.queue_position}`;
            if (!prev.includes(msg)) return [...prev, msg];
            return prev;
          });
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else if (statusData.status === 'IN_PROGRESS') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // Handle other statuses like FAILED if they exist, or just break
          throw new Error(`Request failed with status: ${statusData.status}`);
        }
      }

      if (resultUrl) {
        setVideoUrl(resultUrl);
        setProgress(prev => [...prev, 'Video generation complete!']);
        return resultUrl;
      } else {
        throw new Error('No video URL in response');
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate video';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
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
