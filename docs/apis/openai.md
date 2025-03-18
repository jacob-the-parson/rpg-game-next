# OpenAI API Integration Guide

## Overview

This document outlines the integration patterns and best practices for using OpenAI's API services in our game project, including GPT-4, GPT-3.5-turbo, and DALL-E 3.

## API Configuration

```typescript
// utils/openai.ts
import OpenAI from 'openai';

interface OpenAIConfig {
  apiKey: string;
  organization?: string;
  maxRetries?: number;
}

export class OpenAIService {
  private client: OpenAI;

  constructor(config: OpenAIConfig) {
    this.client = new OpenAI({
      apiKey: config.apiKey,
      organization: config.organization,
      maxRetries: config.maxRetries || 3
    });
  }
}
```

## Available Models

### GPT-4 Models
- `gpt-4-turbo-preview`: Latest GPT-4 model with improved capabilities
- `gpt-4`: Base GPT-4 model
- `gpt-4-vision-preview`: GPT-4 with vision capabilities

### GPT-3.5 Models
- `gpt-3.5-turbo`: Fast and cost-effective model
- `gpt-3.5-turbo-16k`: Extended context version

### Image Models
- `dall-e-3`: Latest DALL-E model for image generation
- `dall-e-2`: Previous generation image model

## Implementation Examples

### Chat Completion

```typescript
// services/ai/chat.ts
async function generateResponse(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  options: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  } = {}
) {
  const completion = await openai.chat.completions.create({
    messages,
    model: options.model || 'gpt-4-turbo-preview',
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens,
    stream: false
  });

  return completion.choices[0].message;
}
```

### Streaming Response

```typescript
// services/ai/streaming.ts
async function* streamResponse(prompt: string) {
  const stream = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4-turbo-preview',
    stream: true
  });

  for await (const chunk of stream) {
    yield chunk.choices[0]?.delta?.content || '';
  }
}
```

### Image Generation

```typescript
// services/ai/image.ts
async function generateImage(
  prompt: string,
  options: {
    size?: '1024x1024' | '1792x1024' | '1024x1792';
    quality?: 'standard' | 'hd';
    style?: 'vivid' | 'natural';
  } = {}
) {
  const response = await openai.images.generate({
    prompt,
    model: 'dall-e-3',
    n: 1,
    size: options.size || '1024x1024',
    quality: options.quality || 'standard',
    style: options.style || 'vivid'
  });

  return response.data[0].url;
}
```

## Error Handling

```typescript
// utils/openai-error.ts
class OpenAIErrorHandler {
  static handle(error: any) {
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 429:
          return this.handleRateLimitError(error);
        case 401:
          return this.handleAuthenticationError(error);
        case 400:
          return this.handleValidationError(error);
        default:
          return this.handleGenericError(error);
      }
    }
    throw error;
  }

  private static handleRateLimitError(error: OpenAI.APIError) {
    // Implement rate limit handling strategy
    // e.g., exponential backoff
  }
}
```

## Rate Limiting

```typescript
// utils/rate-limiter.ts
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly refillRate: number;
  private readonly bucketSize: number;

  constructor(tokensPerSecond: number, bucketSize: number) {
    this.tokens = bucketSize;
    this.lastRefill = Date.now();
    this.refillRate = tokensPerSecond;
    this.bucketSize = bucketSize;
  }

  async waitForToken(): Promise<void> {
    this.refillTokens();
    if (this.tokens < 1) {
      const waitTime = (1 / this.refillRate) * 1000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForToken();
    }
    this.tokens--;
  }

  private refillTokens(): void {
    const now = Date.now();
    const timePassed = now - this.lastRefill;
    const newTokens = (timePassed / 1000) * this.refillRate;
    this.tokens = Math.min(this.bucketSize, this.tokens + newTokens);
    this.lastRefill = now;
  }
}
```

## Best Practices

1. **API Key Management**
   - Use environment variables
   - Implement key rotation
   - Never expose keys in client-side code

2. **Error Handling**
   - Implement retry logic
   - Handle rate limits gracefully
   - Log errors appropriately

3. **Cost Optimization**
   - Use appropriate models for tasks
   - Implement caching where possible
   - Monitor usage and set limits

4. **Performance**
   - Use streaming for long responses
   - Implement request batching
   - Cache frequently used responses

## Cost Considerations

| Model | Price per 1K tokens (input) | Price per 1K tokens (output) |
|-------|----------------------------|----------------------------|
| GPT-4 Turbo | $0.01 | $0.03 |
| GPT-3.5 Turbo | $0.0010 | $0.0020 |
| DALL-E 3 | $0.040 per image (1024x1024) | - |

## Security Considerations

1. **Input Validation**
   - Sanitize user inputs
   - Implement content filtering
   - Set maximum token limits

2. **Output Handling**
   - Validate responses
   - Implement content moderation
   - Handle sensitive information

## Monitoring and Analytics

```typescript
// utils/openai-metrics.ts
class OpenAIMetrics {
  private static instance: OpenAIMetrics;
  private metrics: {
    requests: number;
    tokens: number;
    errors: number;
    latency: number[];
  };

  private constructor() {
    this.metrics = {
      requests: 0,
      tokens: 0,
      errors: 0,
      latency: []
    };
  }

  static getInstance(): OpenAIMetrics {
    if (!OpenAIMetrics.instance) {
      OpenAIMetrics.instance = new OpenAIMetrics();
    }
    return OpenAIMetrics.instance;
  }

  trackRequest(tokens: number, latency: number) {
    this.metrics.requests++;
    this.metrics.tokens += tokens;
    this.metrics.latency.push(latency);
  }
}
```

## Resources

- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)
- [OpenAI Node.js SDK](https://github.com/openai/openai-node)
- [Best Practices Guide](https://platform.openai.com/docs/guides/best-practices) 