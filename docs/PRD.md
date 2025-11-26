# Product Requirements Document (PRD)

## YouTube-Movie-SmashCut

**Document Version:** 1.0  
**Last Updated:** November 2025  
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Product Vision](#product-vision)
3. [Goals and Objectives](#goals-and-objectives)
4. [Target Users](#target-users)
5. [User Stories](#user-stories)
6. [Core Features](#core-features)
7. [Browser Extension](#browser-extension)
8. [OpenRouter.AI Integration](#openrouterai-integration)
9. [Technical Requirements](#technical-requirements)
10. [System Architecture](#system-architecture)
11. [Non-Functional Requirements](#non-functional-requirements)
12. [Success Metrics](#success-metrics)
13. [Risks and Mitigations](#risks-and-mitigations)
14. [Future Enhancements](#future-enhancements)

---

## Executive Summary

YouTube-Movie-SmashCut is an AI-powered video editing tool designed to intelligently condense long-form video content (up to 2 hours) into short, engaging summaries (approximately 10 minutes). The product leverages artificial intelligence through OpenRouter.AI integration to analyze video content, identify key scenes, and automatically generate concise "smash cuts" that preserve the essential narrative and emotional beats of the original content.

The solution consists of two primary components:
1. **Core Video Processing Engine** - A backend service that handles video analysis, segmentation, and compilation
2. **Browser Extension** - A user-friendly interface for initiating and managing video condensation directly from web browsers

---

## Product Vision

**Vision Statement:** Empower content creators, educators, and viewers to transform lengthy video content into digestible, impactful summaries without losing the essence of the original material.

**Mission:** To democratize video editing by providing an AI-powered solution that makes professional-quality video condensation accessible to everyone.

---

## Goals and Objectives

### Primary Goals

1. **Reduce viewing time** - Enable users to consume 2-hour content in 10 minutes
2. **Preserve quality** - Maintain narrative coherence and key moments in shortened videos
3. **Simplify workflow** - Provide one-click video condensation through browser extension
4. **Leverage AI** - Utilize OpenRouter.AI for intelligent content analysis and scene selection

### Success Criteria

- Successfully process and condense videos up to 2 hours in length
- Achieve 12:1 compression ratio (120 minutes → 10 minutes)
- Maintain >80% user satisfaction with content preservation
- Process videos within reasonable timeframes (<30 minutes for a 2-hour video)

---

## Target Users

### Primary Users

1. **Content Creators**
   - YouTubers looking to create highlight reels
   - Video marketers needing promotional clips
   - Podcasters repurposing video content

2. **Educators**
   - Teachers creating lesson summaries
   - Students reviewing recorded lectures
   - Training professionals condensing educational content

3. **General Viewers**
   - Movie enthusiasts wanting quick recaps
   - Busy professionals catching up on content
   - Researchers reviewing video materials

### User Personas

**Persona 1: The Content Creator**
- Name: Alex
- Role: YouTube content creator with 50K subscribers
- Need: Quickly create engaging highlight videos from longer streams
- Pain Point: Manual editing takes hours; wants to post more frequently

**Persona 2: The Educator**
- Name: Dr. Sarah
- Role: University professor
- Need: Provide condensed versions of recorded lectures for student review
- Pain Point: Students struggle with long lecture videos; dropout rates are high

**Persona 3: The Busy Professional**
- Name: Michael
- Role: Marketing manager
- Need: Stay updated on industry webinars without investing hours
- Pain Point: Limited time to watch full-length content

---

## User Stories

### Video Processing

| ID | User Story | Priority |
|----|------------|----------|
| US-001 | As a user, I want to upload a video file up to 2 hours long so that I can have it condensed | Must Have |
| US-002 | As a user, I want to specify my desired output length (e.g., 10 minutes) so that I can control the final video duration | Must Have |
| US-003 | As a user, I want the AI to automatically identify key scenes so that I don't have to manually select them | Must Have |
| US-004 | As a user, I want to preview the condensed video before downloading so that I can approve the result | Should Have |
| US-005 | As a user, I want to adjust which scenes are included so that I can fine-tune the final output | Should Have |
| US-006 | As a user, I want to see a progress indicator so that I know how long processing will take | Must Have |

### Browser Extension

| ID | User Story | Priority |
|----|------------|----------|
| US-007 | As a user, I want to install a browser extension so that I can process videos directly from websites | Must Have |
| US-008 | As a user, I want to right-click on a video and select "SmashCut" so that I can quickly initiate processing | Must Have |
| US-009 | As a user, I want to configure my OpenRouter API key in the extension settings so that I can use the AI features | Must Have |
| US-010 | As a user, I want to see my processing history so that I can access previously condensed videos | Should Have |
| US-011 | As a user, I want to receive notifications when processing is complete so that I don't have to monitor progress | Should Have |

### AI Integration

| ID | User Story | Priority |
|----|------------|----------|
| US-012 | As a user, I want the AI to analyze dialogue and audio so that important conversations are preserved | Must Have |
| US-013 | As a user, I want the AI to detect scene transitions so that cuts happen at natural break points | Must Have |
| US-014 | As a user, I want to select the AI model to use so that I can balance quality and cost | Could Have |
| US-015 | As a user, I want the AI to generate timestamps for key moments so that I can navigate the condensed video | Should Have |

---

## Core Features

### 1. Video Input & Processing

**1.1 Video Upload**
- Support for common video formats: MP4, AVI, MOV, MKV, WebM
- Maximum input duration: 2 hours
- Maximum file size: 10 GB (up to 20 GB for 4K content)
- Drag-and-drop upload interface
- URL input for direct video processing

**1.2 Video Analysis**
- Frame-by-frame scene detection
- Audio waveform analysis for speech detection
- Motion detection for action sequences
- Face detection for dialogue scenes
- Subtitle/caption extraction and analysis
- Integration with Movie Script Database for transcript enhancement

**1.3 Movie Script Database Integration**
- Leverage [Movie-Script-Database](https://github.com/Aveek-Saha/Movie-Script-Database) for accurate transcripts
- Access to thousands of movie scripts for enhanced analysis
- Automatic script matching for popular movies
- Fallback to audio transcription for unmatched content

**1.4 AI-Powered Scene Selection**
- Identify narrative-critical scenes
- Detect emotional peaks (climactic moments)
- Recognize transitional scenes
- Weight scenes based on dialogue importance
- Consider visual diversity for engaging output

### 2. Video Segmentation

**2.1 Automatic Segmentation**
- Divide source video into logical segments
- Assign importance scores to each segment
- Create segment thumbnails and previews
- Generate segment metadata (duration, start/end times)

**2.2 Segment Management**
- View all identified segments
- Include/exclude segments manually
- Adjust segment boundaries
- Reorder segments if needed
- Split or merge segments

### 3. Video Compilation

**3.1 SmashCut Generation**
- Compile selected segments into target duration
- Apply smooth transitions between clips
- Normalize audio levels
- Maintain aspect ratio and resolution
- Optimize output for various platforms

**3.2 Output Options**
- Target duration slider (5-30 minutes)
- Quality presets (Draft, Standard, High)
- Output format selection (MP4, WebM)
- Resolution options (720p, 1080p, 4K)
- Compression level adjustment

### 4. Preview & Export

**4.1 Preview**
- In-browser video player
- Side-by-side comparison with original
- Timeline with segment visualization
- Playback controls (speed, seeking)

**4.2 Export**
- Download to local device
- Cloud storage integration (Google Drive, Dropbox)
- Direct upload to YouTube
- Share via link
- Export metadata and timestamps

---

## Browser Extension

### Overview

The SmashCut Browser Extension provides a seamless interface for users to initiate video condensation directly from supported video platforms without navigating to a separate application.

### Supported Browsers

- Google Chrome (v88+)
- Mozilla Firefox (v85+)
- Microsoft Edge (v88+)
- Safari (v14+)

### Extension Features

**1. Context Menu Integration**
- Right-click on any video element to access SmashCut options
- Quick actions: "SmashCut to 10 min", "SmashCut Custom"

**2. Popup Interface**
- Current page video detection
- Quick settings access
- Processing queue status
- Recent SmashCuts list

**3. Options Page**
- OpenRouter API key configuration
- Default output preferences
- Notification settings
- Account management
- Usage statistics

**4. Background Processing**
- Queue management for multiple videos
- Progress tracking and notifications
- Automatic retry on failure
- Offline queue synchronization

### Platform Compatibility

| Platform | Support Level | Notes |
|----------|--------------|-------|
| YouTube | Full | Direct URL processing |
| Vimeo | Full | Direct URL processing |
| Dailymotion | Partial | May require download first |
| Local Files | Full | Via file picker |
| Other Sites | Partial | Generic video detection |

### Extension Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Extension                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Popup     │  │   Content   │  │     Background      │  │
│  │    UI       │  │   Scripts   │  │      Service        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         └────────────────┼────────────────────┘              │
│                          │                                   │
│                    ┌─────▼─────┐                            │
│                    │  Storage  │                            │
│                    │   API     │                            │
│                    └───────────┘                            │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │   SmashCut Backend     │
              │        API             │
              └────────────────────────┘
```

---

## OpenRouter.AI Integration

### Overview

OpenRouter.AI serves as the AI backbone for YouTube-Movie-SmashCut, providing access to various large language models and vision models for intelligent content analysis.

### API Integration

**Base URL:** `https://openrouter.ai/api/v1`

**Authentication:**
- API key-based authentication
- User-provided keys stored securely
- Rate limiting awareness and handling

### AI Capabilities Used

**1. Video Understanding**
- Frame analysis using vision models (e.g., GPT-4 Vision, Claude Vision)
- Scene description and classification
- Object and face detection
- Action recognition

**2. Audio/Text Analysis**
- Transcript analysis for key dialogue
- Sentiment analysis
- Topic extraction
- Summary generation

**3. Content Ranking**
- Importance scoring for segments
- Coherence evaluation
- Pacing analysis
- Emotional arc mapping

### Supported Models

| Model | Use Case | Cost Tier |
|-------|----------|-----------|
| GPT-4 Vision | High-quality frame analysis | Premium |
| Claude 3 Opus | Complex narrative understanding | Premium |
| Claude 3 Sonnet | Balanced analysis | Standard |
| GPT-3.5 Turbo | Basic text analysis | Economy |
| Llama 3 | Cost-effective processing | Economy |

### API Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    SmashCut Processing                       │
└─────────────────────────────────────────────────────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │   Extract   │   │   Extract   │   │   Extract   │
   │   Frames    │   │   Audio     │   │  Subtitles  │
   └─────────────┘   └─────────────┘   └─────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
   ┌─────────────────────────────────────────────────┐
   │              OpenRouter.AI API                   │
   │  ┌─────────────────────────────────────────┐    │
   │  │  Vision Model: Analyze key frames       │    │
   │  └─────────────────────────────────────────┘    │
   │  ┌─────────────────────────────────────────┐    │
   │  │  LLM: Analyze transcripts & dialogue    │    │
   │  └─────────────────────────────────────────┘    │
   │  ┌─────────────────────────────────────────┐    │
   │  │  LLM: Generate importance scores        │    │
   │  └─────────────────────────────────────────┘    │
   └─────────────────────────────────────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────┐
          │     Segment Selection Algorithm     │
          │   (Combine AI scores + heuristics)  │
          └─────────────────────────────────────┘
                            │
                            ▼
          ┌─────────────────────────────────────┐
          │        Video Compilation            │
          └─────────────────────────────────────┘
```

### Sample API Requests

**Frame Analysis Request:**
```json
{
  "model": "openai/gpt-4-vision-preview",
  "messages": [
    {
      "role": "user",
      "content": [
        {
          "type": "image_url",
          "image_url": {
            "url": "data:image/jpeg;base64,{frame_data}"
          }
        },
        {
          "type": "text",
          "text": "Analyze this movie frame. Describe: 1) Scene type (action, dialogue, transition), 2) Emotional tone, 3) Narrative importance (1-10), 4) Key elements visible."
        }
      ]
    }
  ]
}
```

**Transcript Analysis Request:**
```json
{
  "model": "anthropic/claude-3-sonnet",
  "messages": [
    {
      "role": "user",
      "content": "Analyze this transcript segment and rate its importance for a movie summary. Consider dialogue significance, plot advancement, and emotional weight.\n\nTranscript:\n{transcript_text}\n\nProvide: importance_score (1-10), key_topics, summary."
    }
  ]
}
```

### Cost Management

- Display estimated API cost before processing
- Cost tracking per video
- Budget alerts and limits
- Model tier selection for cost control
- Caching to reduce duplicate API calls

---

## Technical Requirements

### Backend Requirements

**Programming Languages:**
- Python 3.10+ (Primary backend)
- Node.js 18+ (API layer)

**Frameworks:**
- FastAPI (REST API)
- FFmpeg (Video processing)
- OpenCV (Frame extraction)
- Whisper/Deepgram (Audio transcription)

**Database:**
- PostgreSQL (Primary data store)
- Redis (Caching and queues)
- S3-compatible storage (Video files)

**Infrastructure:**
- Docker containerization
- Kubernetes orchestration
- GPU support for video processing
- CDN for video delivery

### Frontend Requirements

**Web Application:**
- React 18+ with TypeScript
- TailwindCSS for styling
- Video.js for playback
- React Query for data fetching

**Browser Extension:**
- Manifest V3 compliance
- TypeScript
- React for popup UI
- Chrome Storage API

### API Requirements

**RESTful Endpoints:**
- `POST /api/v1/videos` - Upload video
- `GET /api/v1/videos/{id}` - Get video status
- `POST /api/v1/videos/{id}/process` - Start processing
- `GET /api/v1/videos/{id}/segments` - Get segments
- `POST /api/v1/videos/{id}/compile` - Generate output
- `GET /api/v1/videos/{id}/download` - Download result

**WebSocket:**
- Real-time processing updates
- Progress notifications
- Queue position updates

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENTS                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────┐  │
│  │   Web App       │  │    Browser      │  │       Mobile App        │  │
│  │   (React)       │  │   Extension     │  │       (Future)          │  │
│  └────────┬────────┘  └────────┬────────┘  └────────────┬────────────┘  │
└───────────┼─────────────────────┼───────────────────────┼───────────────┘
            │                     │                       │
            └─────────────────────┼───────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           API GATEWAY                                    │
│                    (Load Balancer + Auth)                               │
└─────────────────────────────────────────────────────────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│   Video Service     │ │    AI Service       │ │    User Service     │
│                     │ │                     │ │                     │
│ • Upload handling   │ │ • Frame analysis    │ │ • Authentication    │
│ • Processing queue  │ │ • Text analysis     │ │ • Preferences       │
│ • Compilation       │ │ • Scoring           │ │ • History           │
└──────────┬──────────┘ └──────────┬──────────┘ └──────────┬──────────┘
           │                       │                       │
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│   PostgreSQL        │ │   OpenRouter.AI     │ │   Redis             │
│   (Video metadata)  │ │   (AI Processing)   │ │   (Cache/Queue)     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         OBJECT STORAGE (S3)                             │
│        (Source videos, processed segments, final outputs)               │
└─────────────────────────────────────────────────────────────────────────┘
```

### Processing Pipeline

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Upload  │───▶│ Extract │───▶│ Analyze │───▶│ Select  │───▶│ Compile │
│         │    │         │    │         │    │         │    │         │
│ Video   │    │ Frames  │    │ Content │    │ Scenes  │    │ Output  │
│ File    │    │ Audio   │    │ (AI)    │    │         │    │ Video   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
```

---

## Non-Functional Requirements

### Performance

| Requirement | Target | Notes |
|-------------|--------|-------|
| Video upload speed | Limited by user bandwidth | Support resumable uploads |
| Processing time (2hr video) | < 30 minutes | With GPU acceleration |
| API response time | < 200ms (p95) | Excluding video operations |
| Extension popup load | < 500ms | Initial render |
| Concurrent users | 1000+ | Per region |

### Scalability

- Horizontal scaling for processing workers
- Auto-scaling based on queue depth
- Multi-region deployment capability
- CDN distribution for output videos

### Reliability

- 99.9% uptime SLA
- Automatic retry for failed processing
- Graceful degradation on AI API failures
- Data backup and recovery procedures

### Security

- End-to-end encryption for video transfer
- Secure API key storage (encrypted at rest)
- Rate limiting and abuse prevention
- GDPR and CCPA compliance
- Automatic video deletion after configurable period

### Usability

- Intuitive drag-and-drop interface
- Mobile-responsive web design
- Accessibility compliance (WCAG 2.1 AA)
- Internationalization support
- Comprehensive help documentation

---

## Success Metrics

### Key Performance Indicators (KPIs)

**User Engagement:**
- Daily Active Users (DAU)
- Videos processed per user per month
- Browser extension installations
- User retention rate (30-day)

**Quality Metrics:**
- User satisfaction score (post-processing survey)
- Content preservation rating
- Processing success rate
- Average output quality score

**Technical Metrics:**
- Average processing time
- API uptime percentage
- Error rate per 1000 requests
- OpenRouter API cost per video

**Business Metrics:**
- Conversion rate (free to paid)
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Net Promoter Score (NPS)

### Target Metrics (6 months post-launch)

| Metric | Target |
|--------|--------|
| Monthly Active Users | 10,000 |
| Videos Processed | 50,000/month |
| Extension Installs | 25,000 |
| User Satisfaction | > 4.0/5.0 |
| Processing Success Rate | > 98% |
| Average Processing Time | < 30 min (target < 20 min with optimization) |

---

## Risks and Mitigations

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| OpenRouter API downtime | High | Low | Implement fallback models, queue retry |
| Video processing failures | High | Medium | Robust error handling, manual fallback |
| Storage costs escalation | Medium | Medium | Implement automatic cleanup, compression |
| Browser extension policy changes | High | Low | Maintain compliance, backup distribution |

### Business Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Copyright infringement claims | High | Medium | Clear terms of service, DMCA compliance |
| Competition from established players | Medium | High | Focus on unique AI capabilities |
| API cost exceeds budget | Medium | Medium | Cost controls, model tier options |
| Low user adoption | High | Medium | Marketing, user feedback integration |

### Legal Considerations

- Terms of Service clearly defining acceptable use
- Privacy policy for data handling
- DMCA takedown procedure
- Age verification for mature content

---

## Future Enhancements

### Phase 2 Features

1. **Multi-language support**
   - Automatic translation of subtitles
   - Multi-language audio track support

2. **Collaborative editing**
   - Share SmashCuts with team members
   - Collaborative scene selection

3. **Templates and presets**
   - Genre-specific condensation algorithms
   - Custom branding options

4. **Analytics dashboard**
   - View engagement with condensed content
   - A/B testing for different cut versions

### Phase 3 Features

1. **Mobile applications**
   - iOS and Android native apps
   - On-device processing for privacy

2. **API for developers**
   - Public API for third-party integration
   - SDK for common platforms

3. **Advanced AI features**
   - Custom model fine-tuning
   - Style transfer for transitions
   - Automatic music matching

4. **Enterprise features**
   - SSO integration
   - Custom deployment options
   - Advanced usage analytics

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| SmashCut | A condensed video created by intelligently selecting and compiling key scenes |
| Segment | A portion of the original video identified as a discrete scene |
| OpenRouter | A unified API gateway for accessing multiple AI models |
| Frame Analysis | AI examination of individual video frames for content understanding |
| Scene Detection | Automated identification of distinct scenes within a video |

### References

- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/)
- [WebRTC for Video Processing](https://webrtc.org/)

---

**Document Approval:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | | | |
| Engineering Lead | | | |
| Design Lead | | | |
| Stakeholder | | | |
