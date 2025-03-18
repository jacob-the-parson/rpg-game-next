# AI Integration for Game NPCs

This document outlines how AI APIs are integrated into our RPG game to create intelligent NPCs and dynamic gameplay.

## Overview

Our game uses modern AI technologies to enhance gameplay through:

- Dynamic NPC conversations and behaviors
- Procedural quest generation
- Adaptive storylines based on player choices
- Custom character abilities and traits

## AI Technologies

The game integrates with multiple AI providers to ensure availability and fallback options:

1. **Primary AI Providers**
   - OpenAI's GPT-4 and GPT-3.5 Turbo
   - Anthropic's Claude
   - Local Ollama models for offline play

2. **AI Integration Pattern**
   - Hybrid approach with both cloud-based and local inference
   - Fallback chain for reliability
   - Context caching to reduce API calls

## Architecture

```
src/
├── lib/
│   ├── ai/
│   │   ├── index.ts            # Main AI service interface
│   │   ├── providers/          # AI provider implementations
│   │   │   ├── openai.ts       # OpenAI integration
│   │   │   ├── claude.ts       # Claude integration
│   │   │   └── ollama.ts       # Local Ollama integration
│   │   ├── prompts/            # Structured prompts
│   │   │   ├── npc.ts          # NPC conversation prompts
│   │   │   ├── quests.ts       # Quest generation prompts
│   │   │   └── narrative.ts    # Story/narrative prompts
│   │   └── cache.ts            # Caching mechanism
│   └── game/
│       └── npcs/               # NPC behavior definitions
└── components/
    └── Game/
        └── entities/
            └── NPC.ts          # NPC entity implementation
```

## AI Service Implementation

The core AI service provides a unified interface for different AI providers:

```typescript
// src/lib/ai/index.ts
import OpenAIProvider from './providers/openai';
import ClaudeProvider from './providers/claude';
import OllamaProvider from './providers/ollama';
import { AICache } from './cache';

export interface AIProviderOptions {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIRequest {
  prompt: string;
  context?: string;
  persona?: string;
  temperature?: number;
  maxTokens?: number;
  cacheKey?: string;
}

export interface AIResponse {
  text: string;
  tokens: number;
  provider: string;
  cached: boolean;
}

export class AIService {
  private providers: any[] = [];
  private cache: AICache;
  
  constructor(options: AIProviderOptions = {}) {
    // Initialize providers in priority order
    if (options.apiKey) {
      // Cloud providers need API keys
      if (process.env.OPENAI_API_KEY) {
        this.providers.push(new OpenAIProvider({ 
          apiKey: process.env.OPENAI_API_KEY,
          model: options.model || 'gpt-3.5-turbo'
        }));
      }
      
      if (process.env.CLAUDE_API_KEY) {
        this.providers.push(new ClaudeProvider({ 
          apiKey: process.env.CLAUDE_API_KEY,
          model: options.model || 'claude-instant-1'
        }));
      }
    }
    
    // Always add Ollama as fallback for offline play
    this.providers.push(new OllamaProvider({ 
      baseUrl: options.baseUrl || 'http://localhost:11434',
      model: 'llama2'
    }));
    
    // Initialize cache
    this.cache = new AICache();
  }
  
  async generateResponse(request: AIRequest): Promise<AIResponse> {
    // Try to get from cache first
    if (request.cacheKey) {
      const cached = this.cache.get(request.cacheKey);
      if (cached) {
        return {
          text: cached,
          tokens: 0, // We don't track tokens for cached responses
          provider: 'cache',
          cached: true
        };
      }
    }
    
    // Try each provider in sequence until one works
    for (const provider of this.providers) {
      try {
        const response = await provider.generateResponse(request);
        
        // Cache the successful response
        if (request.cacheKey) {
          this.cache.set(request.cacheKey, response.text);
        }
        
        return {
          ...response,
          cached: false
        };
      } catch (error) {
        console.error(`Provider ${provider.name} failed:`, error);
        // Continue to the next provider
      }
    }
    
    // If all providers fail, return a fallback response
    return {
      text: "I'm sorry, I can't respond right now.",
      tokens: 0,
      provider: 'fallback',
      cached: false
    };
  }
}
```

## NPC Implementation

NPCs use the AI service to generate dynamic conversations and behaviors:

```typescript
// src/lib/game/npcs/index.ts
import { AIService, AIRequest } from '@/lib/ai';
import { NPCPrompts } from '@/lib/ai/prompts/npc';

export interface NPCOptions {
  id: string;
  name: string;
  role: string;
  personality: string;
  knowledge: string[];
  initialDialogue: string;
}

export class NPCBrain {
  private ai: AIService;
  private options: NPCOptions;
  private conversationHistory: { role: string, content: string }[] = [];
  
  constructor(ai: AIService, options: NPCOptions) {
    this.ai = ai;
    this.options = options;
    
    // Initialize conversation with system context
    this.conversationHistory.push({
      role: 'system',
      content: NPCPrompts.getSystemPrompt(options)
    });
    
    // Add initial NPC dialogue
    if (options.initialDialogue) {
      this.conversationHistory.push({
        role: 'assistant',
        content: options.initialDialogue
      });
    }
  }
  
  async respondToPlayer(playerMessage: string): Promise<string> {
    // Add player message to history
    this.conversationHistory.push({
      role: 'user',
      content: playerMessage
    });
    
    // Create NPC context string from conversation history
    const context = this.conversationHistory
      .map(msg => `${msg.role === 'system' ? 'Context' : msg.role === 'user' ? 'Player' : this.options.name}: ${msg.content}`)
      .join('\n\n');
    
    // Generate AI response
    const request: AIRequest = {
      prompt: playerMessage,
      context: context,
      persona: this.options.personality,
      temperature: 0.7,
      maxTokens: 150,
      cacheKey: `npc:${this.options.id}:${this.conversationHistory.length}`
    };
    
    const response = await this.ai.generateResponse(request);
    
    // Add response to history
    this.conversationHistory.push({
      role: 'assistant',
      content: response.text
    });
    
    // Keep conversation history at a reasonable size
    if (this.conversationHistory.length > 10) {
      // Remove oldest messages but keep system prompt
      this.conversationHistory = [
        this.conversationHistory[0],
        ...this.conversationHistory.slice(-9)
      ];
    }
    
    return response.text;
  }
  
  // Generate NPC action based on game state
  async decideAction(gameState: any): Promise<string> {
    const prompt = NPCPrompts.getActionPrompt(this.options, gameState);
    
    const request: AIRequest = {
      prompt,
      persona: this.options.personality,
      temperature: 0.4,
      maxTokens: 50,
      cacheKey: `npc:${this.options.id}:action:${JSON.stringify(gameState).slice(0, 100)}`
    };
    
    const response = await this.ai.generateResponse(request);
    return response.text;
  }
}
```

## NPC Entity in Game

The NPC class ties the AI-powered brain to the game entity:

```typescript
// src/components/Game/entities/NPC.ts
import { Actor, Engine, Vector, Input, Color, Label } from 'excalibur';
import { NPCBrain } from '@/lib/game/npcs';
import { AIService } from '@/lib/ai';

export class NPC extends Actor {
  private brain: NPCBrain;
  private nameLabel: Label;
  private dialogueLabel: Label | null = null;
  private interactionDistance = 50;
  private isInteracting = false;
  
  constructor(options: {
    id: string;
    name: string;
    role: string;
    x: number;
    y: number;
    aiService: AIService;
    personality: string;
    knowledge: string[];
    initialDialogue: string;
  }) {
    super({
      x: options.x,
      y: options.y,
      width: 32,
      height: 32,
      color: Color.Green
    });
    
    // Create NPC brain with AI service
    this.brain = new NPCBrain(options.aiService, {
      id: options.id,
      name: options.name,
      role: options.role,
      personality: options.personality,
      knowledge: options.knowledge,
      initialDialogue: options.initialDialogue
    });
    
    // Add name label
    this.nameLabel = new Label({
      text: options.name,
      pos: new Vector(0, -25),
      font: '12px Arial',
      color: Color.White
    });
    this.addChild(this.nameLabel);
  }
  
  onInitialize(engine: Engine) {
    // Set up interaction on key press when player is nearby
    engine.input.keyboard.on('press', async (evt) => {
      if (evt.key === Input.Keys.E) {
        // Get player from scene
        const player = engine.currentScene.actors.find(actor => actor.name === 'player');
        if (player) {
          // Check if player is close enough to interact
          const distance = this.pos.distance(player.pos);
          if (distance <= this.interactionDistance) {
            this.interact(engine);
          }
        }
      }
    });
  }
  
  // Handle player interaction
  async interact(engine: Engine) {
    if (this.isInteracting) return;
    this.isInteracting = true;
    
    // Show dialogue UI
    this.showDialogue('...thinking...');
    
    // Get game state
    const gameState = {
      playerPos: engine.currentScene.actors.find(actor => actor.name === 'player')?.pos,
      timeOfDay: engine.currentScene.getTimeOfDay?.() || 'day',
      playerQuests: engine.currentScene.getPlayerQuests?.() || []
    };
    
    // Get NPC response based on game state
    try {
      const response = await this.brain.decideAction(gameState);
      this.showDialogue(response);
      
      // Hide dialogue after a few seconds
      setTimeout(() => {
        this.hideDialogue();
        this.isInteracting = false;
      }, 5000);
    } catch (error) {
      console.error('NPC interaction failed:', error);
      this.showDialogue('Hello there!');
      this.isInteracting = false;
    }
  }
  
  // Display dialogue above NPC
  private showDialogue(text: string) {
    if (this.dialogueLabel) {
      this.dialogueLabel.text = text;
    } else {
      this.dialogueLabel = new Label({
        text,
        pos: new Vector(0, -50),
        font: '14px Arial',
        color: Color.White,
        backgroundColor: Color.Black
      });
      this.addChild(this.dialogueLabel);
    }
  }
  
  // Hide dialogue
  private hideDialogue() {
    if (this.dialogueLabel) {
      this.removeChild(this.dialogueLabel);
      this.dialogueLabel = null;
    }
  }
}
```

## AI Prompt Templates

The prompts directory contains structured templates for different AI interactions:

```typescript
// src/lib/ai/prompts/npc.ts
export const NPCPrompts = {
  getSystemPrompt: (npc: any) => `
    You are ${npc.name}, a ${npc.role} in a fantasy RPG game.
    
    About you:
    - Personality: ${npc.personality}
    - Knowledge: ${npc.knowledge.join(', ')}
    
    Guidelines:
    - Stay in character at all times
    - Keep responses short (1-3 sentences)
    - Reference your knowledge and background when relevant
    - Never break the fourth wall or acknowledge you're an AI
    - Do not use modern language or references
  `,
  
  getActionPrompt: (npc: any, gameState: any) => `
    As ${npc.name}, the ${npc.role}, decide how to respond to the player approaching you.
    
    Current situation:
    - Time of day: ${gameState.timeOfDay}
    - Player quests: ${gameState.playerQuests.join(', ') || 'None'}
    - Player is nearby and wants to interact with you
    
    Respond in character as ${npc.name} with a short greeting or relevant comment.
  `,
  
  // Other prompt templates...
};
```

## Usage in Game Scene

Here's how NPCs are created in a game scene:

```typescript
// src/components/Game/scenes/TownScene.ts
import { Scene, Engine } from 'excalibur';
import { NPC } from '../entities/NPC';
import { AIService } from '@/lib/ai';

export class TownScene extends Scene {
  private aiService: AIService;
  
  constructor() {
    super();
    
    // Initialize AI service
    this.aiService = new AIService();
  }
  
  onInitialize(engine: Engine) {
    // Create NPCs with AI-powered brains
    const shopkeeper = new NPC({
      id: 'shopkeeper',
      name: 'Ella',
      role: 'Town Shopkeeper',
      x: 300,
      y: 200,
      aiService: this.aiService,
      personality: 'Friendly, business-minded, knowledgeable about items',
      knowledge: ['Town history', 'Local trade routes', 'Item prices'],
      initialDialogue: 'Welcome to my shop! Looking for anything special today?'
    });
    
    const blacksmith = new NPC({
      id: 'blacksmith',
      name: 'Gorum',
      role: 'Master Blacksmith',
      x: 500,
      y: 250,
      aiService: this.aiService,
      personality: 'Gruff, perfectionist, proud of craftsmanship',
      knowledge: ['Weapon forging', 'Armor crafting', 'Ore quality'],
      initialDialogue: 'Need something sturdy? You\'ve come to the right place.'
    });
    
    // Add NPCs to scene
    this.add(shopkeeper);
    this.add(blacksmith);
    
    // Other scene setup...
  }
}
```

## Offline Mode

For offline play or development, the game automatically falls back to local Ollama models:

```typescript
// src/lib/ai/providers/ollama.ts
export default class OllamaProvider {
  private baseUrl: string;
  private model: string;
  
  constructor(options: { baseUrl: string, model: string }) {
    this.baseUrl = options.baseUrl;
    this.model = options.model;
  }
  
  async generateResponse(request: any) {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: this.formatPrompt(request),
          max_tokens: request.maxTokens || 100,
          temperature: request.temperature || 0.7
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        text: data.response,
        tokens: data.eval_count,
        provider: `ollama-${this.model}`
      };
    } catch (error) {
      console.error('Ollama error:', error);
      throw error;
    }
  }
  
  private formatPrompt(request: any) {
    let prompt = '';
    
    if (request.context) {
      prompt += `Context:\n${request.context}\n\n`;
    }
    
    if (request.persona) {
      prompt += `Persona:\n${request.persona}\n\n`;
    }
    
    prompt += `Player: ${request.prompt}\n\n`;
    prompt += 'NPC: ';
    
    return prompt;
  }
}
```

## Performance Considerations

1. **API Usage Optimization**
   - Caching common responses
   - Batching multiple NPC decisions
   - Using smaller context windows when possible

2. **Fallback Mechanisms**
   - Template-based responses when AI is unavailable
   - Local models for core functionality
   - Graceful degradation of features

3. **Response Limitations**
   - Keeping responses short (1-3 sentences)
   - Setting appropriate token limits
   - Using low temperature settings for predictable responses

## Future Enhancements

1. **Fine-tuned models** specifically for game NPC interactions
2. **Voice integration** for spoken NPC dialogue
3. **Persistent NPC memory** across game sessions
4. **Emotion detection** from player input to customize responses
5. **Dynamic quest generation** based on player behavior 