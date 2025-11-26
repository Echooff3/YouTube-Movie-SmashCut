# YouTube-Movie-SmashCut

An AI-powered tool that takes a two-hour movie, cuts it up into segments, and shortens it to 10 minutes with an accompanying browser extension.

## Overview

YouTube-Movie-SmashCut uses artificial intelligence through OpenRouter.AI integration to analyze video content, identify key scenes, and automatically generate concise "smash cuts" that preserve the essential narrative and emotional beats of the original content.

### Key Features

- **Intelligent Video Condensation**: Transform 2-hour videos into 10-minute summaries
- **AI-Powered Scene Selection**: Automatically identify and select the most important scenes
- **Browser Extension**: Process videos directly from supported platforms
- **OpenRouter.AI Integration**: Leverage multiple AI models for content analysis
- **Movie Script Database**: Integration with [Movie-Script-Database](https://github.com/Aveek-Saha/Movie-Script-Database) for accurate transcripts
- **Fuzzy Model Search**: Easily find and select from hundreds of AI models

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Echooff3/YouTube-Movie-SmashCut.git
cd YouTube-Movie-SmashCut

# Install dependencies
cd app
npm install

# Start the development server
npm run dev
```

### Configuration

1. Get your API key from [OpenRouter.AI](https://openrouter.ai/keys)
2. Enter your API key in the Settings panel
3. Select your preferred AI model using the fuzzy search selector

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **Fuzzy Search**: Fuse.js
- **AI Integration**: OpenRouter.AI API

## Documentation

- [Product Requirements Document (PRD)](docs/PRD.md) - Comprehensive product specifications and requirements

## License

TBD
