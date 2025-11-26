// System prompts for video analysis
// These can be iterated on to improve output quality

export const DEFAULT_SYSTEM_PROMPT = `You are an expert video editor and content analyst specializing in condensing long-form video content into engaging short summaries.

Your task is to analyze video transcripts/subtitles and identify the most important segments that should be included in a condensed version of the video.

When analyzing content, consider:
1. **Narrative Importance**: Key plot points, major revelations, or essential information
2. **Emotional Peaks**: Moments of high emotional impact (humor, drama, tension)
3. **Visual Significance**: Scenes likely to have strong visual appeal
4. **Dialogue Quality**: Memorable quotes, important conversations
5. **Pacing**: Ensure good flow and variety in the condensed version
6. **Context**: Include enough context so the condensed version makes sense

For a 2-hour movie condensed to 10 minutes, you should identify approximately 10-15 key segments.

Output your analysis in the specified structured format.`;

export const ANALYSIS_USER_PROMPT_TEMPLATE = `Analyze the following video transcript and identify the key segments for a condensed version.

**Video Information:**
- Title: {{videoTitle}}
- Duration: {{videoDuration}}
- Target condensed length: {{targetDuration}}

**Transcript:**
{{transcript}}

Please identify the most important segments to include in the condensed version, considering narrative flow, emotional impact, and viewer engagement.`;

// Structured output schema for video analysis
export const VIDEO_ANALYSIS_SCHEMA = {
  name: 'video_analysis',
  strict: true,
  schema: {
    type: 'object' as const,
    properties: {
      summary: {
        type: 'string',
        description: 'A 2-3 sentence summary of the overall video content',
      },
      total_segments_analyzed: {
        type: 'number',
        description: 'Total number of transcript segments analyzed',
      },
      recommended_segments: {
        type: 'array',
        description: 'List of recommended segments to include in the condensed version',
        items: {
          type: 'object',
          properties: {
            start_time: {
              type: 'string',
              description: 'Start timestamp in HH:MM:SS format',
            },
            end_time: {
              type: 'string',
              description: 'End timestamp in HH:MM:SS format',
            },
            importance_score: {
              type: 'number',
              description: 'Importance score from 1-10',
            },
            category: {
              type: 'string',
              description: 'Category of the segment',
              enum: ['narrative', 'emotional', 'action', 'dialogue', 'visual', 'humor', 'climax', 'introduction', 'conclusion'],
            },
            reason: {
              type: 'string',
              description: 'Brief explanation of why this segment is important',
            },
            transcript_excerpt: {
              type: 'string',
              description: 'Key dialogue or description from this segment',
            },
          },
          required: ['start_time', 'end_time', 'importance_score', 'category', 'reason'],
        },
      },
      themes: {
        type: 'array',
        description: 'Main themes identified in the video',
        items: { type: 'string' },
      },
      estimated_condensed_duration: {
        type: 'string',
        description: 'Estimated duration of the condensed version',
      },
      editing_notes: {
        type: 'string',
        description: 'Additional notes for the editor about transitions, pacing, or special considerations',
      },
    },
    required: ['summary', 'recommended_segments', 'themes', 'estimated_condensed_duration'],
    additionalProperties: false,
  },
};

// Alternative simpler schema for initial testing
export const SIMPLE_ANALYSIS_SCHEMA = {
  name: 'simple_video_analysis',
  strict: true,
  schema: {
    type: 'object' as const,
    properties: {
      summary: {
        type: 'string',
        description: 'Brief summary of the video',
      },
      key_moments: {
        type: 'array',
        description: 'List of key moments with timestamps',
        items: {
          type: 'object',
          properties: {
            timestamp: { type: 'string' },
            description: { type: 'string' },
            importance: { type: 'number' },
          },
        },
      },
      recommendation: {
        type: 'string',
        description: 'Overall recommendation for condensing the video',
      },
    },
    required: ['summary', 'key_moments', 'recommendation'],
    additionalProperties: false,
  },
};
