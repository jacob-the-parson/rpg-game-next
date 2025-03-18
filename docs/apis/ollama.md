# Ollama API Integration Guide

## Overview

This document outlines the integration patterns and best practices for using Ollama's API in our game project. Ollama allows for running various open-source language models locally, providing flexibility and privacy.

## API Configuration

```typescript
// utils/ollama.ts
interface OllamaConfig {
  baseUrl: string;
  timeout?: number;
}

export class OllamaService {
  private baseUrl: string;
  private timeout: number;

  constructor(config: OllamaConfig) {
    this.baseUrl = config.baseUrl || 'http://localhost:11434';
    this.timeout = config.timeout || 30000;
  }

  private async fetch(endpoint: string, options: RequestInit) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    return response;
  }
}
```

## Available Models

### Popular Models
- `llama2`: Meta's Llama 2 model
- `mistral`: Mistral AI's model
- `codellama`: Code-specialized Llama model
- `phi`: Microsoft's Phi model
- `neural-chat`: Intel's neural-chat model
- `starling-lm`: Starling AI's model

## Implementation Examples

### Basic Generation

```typescript
// services/ai/ollama-generation.ts
async function generateResponse(
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || 'llama2',
      prompt,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens,
    }),
  });

  return response.json();
}
```

### Streaming Response

```typescript
// services/ai/ollama-streaming.ts
async function* streamResponse(
  prompt: string,
  model: string = 'llama2'
) {
  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      prompt,
      stream: true,
    }),
  });

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No reader available');

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n').filter(Boolean);
    
    for (const line of lines) {
      const data = JSON.parse(line);
      yield data.response;
    }
  }
}
```

### Model Management

```typescript
// services/ai/ollama-models.ts
class OllamaModelManager {
  async listModels() {
    const response = await fetch('http://localhost:11434/api/tags');
    return response.json();
  }

  async pullModel(modelName: string) {
    const response = await fetch('http://localhost:11434/api/pull', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelName,
      }),
    });
    return response.json();
  }

  async deleteModel(modelName: string) {
    const response = await fetch('http://localhost:11434/api/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: modelName,
      }),
    });
    return response.json();
  }
}
```

## Error Handling

```typescript
// utils/ollama-error.ts
class OllamaErrorHandler {
  static async handle(error: any) {
    if (error.message.includes('ECONNREFUSED')) {
      return this.handleConnectionError();
    }
    if (error.message.includes('timeout')) {
      return this.handleTimeoutError();
    }
    throw error;
  }

  private static async handleConnectionError() {
    // Check if Ollama service is running
    try {
      await fetch('http://localhost:11434/api/health');
    } catch {
      throw new Error('Ollama service is not running');
    }
  }
}
```

## Performance Optimization

```typescript
// utils/ollama-optimization.ts
interface ModelConfig {
  numThreads: number;
  contextSize: number;
  batchSize: number;
}

class OllamaOptimizer {
  static getOptimalConfig(modelName: string): ModelConfig {
    // Model-specific optimizations
    const configs: Record<string, ModelConfig> = {
      llama2: {
        numThreads: 4,
        contextSize: 4096,
        batchSize: 512,
      },
      mistral: {
        numThreads: 6,
        contextSize: 8192,
        batchSize: 1024,
      },
    };

    return configs[modelName] || {
      numThreads: 4,
      contextSize: 2048,
      batchSize: 256,
    };
  }
}
```

## Best Practices

1. **Model Selection**
   - Choose models based on task requirements
   - Consider memory and CPU constraints
   - Test models locally before deployment

2. **Resource Management**
   - Monitor system resources
   - Implement request queuing
   - Handle concurrent requests appropriately

3. **Error Handling**
   - Check service availability
   - Implement timeout handling
   - Monitor model loading status

4. **Performance**
   - Use appropriate batch sizes
   - Optimize context windows
   - Implement response caching

## System Requirements

1. **Hardware Requirements**
   - Minimum 8GB RAM
   - Multi-core CPU
   - SSD storage recommended

2. **Software Requirements**
   - Docker (optional)
   - CUDA support (for GPU acceleration)
   - Stable internet for model downloads

## Monitoring

```typescript
// utils/ollama-monitor.ts
class OllamaMonitor {
  private static instance: OllamaMonitor;
  private metrics: {
    requests: number;
    errors: number;
    avgResponseTime: number;
    modelUsage: Record<string, number>;
  };

  private constructor() {
    this.metrics = {
      requests: 0,
      errors: 0,
      avgResponseTime: 0,
      modelUsage: {},
    };
  }

  static getInstance(): OllamaMonitor {
    if (!OllamaMonitor.instance) {
      OllamaMonitor.instance = new OllamaMonitor();
    }
    return OllamaMonitor.instance;
  }

  trackRequest(model: string, responseTime: number) {
    this.metrics.requests++;
    this.metrics.modelUsage[model] = 
      (this.metrics.modelUsage[model] || 0) + 1;
    this.metrics.avgResponseTime = 
      (this.metrics.avgResponseTime * (this.metrics.requests - 1) + responseTime) 
      / this.metrics.requests;
  }
}
```

## Integration Examples

### Game NPC Responses

```typescript
// services/ai/game-npc.ts
async function generateNPCResponse(
  character: string,
  context: string,
  playerInput: string
) {
  const prompt = `
Character: ${character}
Context: ${context}
Player: ${playerInput}
Response:`;

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistral',
      prompt,
      temperature: 0.8,
      max_tokens: 150,
    }),
  });

  const result = await response.json();
  return result.response;
}
```

## Resources

- [Ollama GitHub Repository](https://github.com/ollama/ollama)
- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Ollama Model Library](https://ollama.ai/library)
- [Ollama Discord Community](https://discord.gg/ollama) 