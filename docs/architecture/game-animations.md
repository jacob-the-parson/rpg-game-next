# Game Animation Patterns

## Overview

This document focuses on specific animation patterns and implementations for game elements using Framer Motion and GSAP. It provides practical examples and best practices for common game animation scenarios.

## Character Animations

### Basic Movement

```typescript
// components/Character.tsx
import { motion } from 'framer-motion';

interface CharacterProps {
  position: { x: number; y: number };
  isMoving: boolean;
}

const Character: React.FC<CharacterProps> = ({ position, isMoving }) => {
  return (
    <motion.div
      animate={{
        x: position.x,
        y: position.y,
        scale: isMoving ? 1.1 : 1,
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
      className="character-sprite"
    />
  );
};
```

### Complex Character Animation (GSAP)

```typescript
// utils/characterAnimations.ts
import gsap from 'gsap';

export const characterAttackAnimation = (
  characterRef: HTMLElement,
  onComplete?: () => void
) => {
  const tl = gsap.timeline({
    onComplete,
    defaults: { ease: "power2.out" }
  });

  tl.to(characterRef, {
    x: "+=50",
    duration: 0.2,
    ease: "power1.in"
  })
  .to(characterRef, {
    rotation: 45,
    duration: 0.1
  })
  .to(characterRef, {
    x: "-=50",
    rotation: 0,
    duration: 0.3,
    ease: "elastic.out(1, 0.3)"
  });

  return tl;
};
```

## UI Effects

### Floating Menu Items

```typescript
// components/MenuItems.tsx
import { motion } from 'framer-motion';

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const MenuItem = ({ children }) => (
  <motion.div
    variants={floatingAnimation}
    initial="initial"
    animate="animate"
    whileHover={{ scale: 1.1 }}
    className="menu-item"
  >
    {children}
  </motion.div>
);
```

### Power-Up Effects

```typescript
// components/PowerUp.tsx
const powerUpAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1.5,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    onComplete: () => {
      gsap.set(element, { scale: 1, opacity: 1 });
    }
  });
};
```

## Particle Systems

### Basic Particle Effect

```typescript
// components/ParticleSystem.tsx
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
}

const ParticleEffect: React.FC<{ count: number }> = ({ count }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100
  }));

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [1, 0],
            x: particle.x,
            y: particle.y,
          }}
          transition={{
            duration: 1,
            ease: "easeOut"
          }}
          className="particle"
        />
      ))}
    </div>
  );
};
```

### Complex Particle System (GSAP)

```typescript
// utils/particleSystem.ts
import gsap from 'gsap';

interface ParticleOptions {
  count: number;
  duration: number;
  spread: number;
  container: HTMLElement;
}

export class ParticleSystem {
  private particles: HTMLElement[] = [];

  constructor(private options: ParticleOptions) {
    this.init();
  }

  private init() {
    for (let i = 0; i < this.options.count; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      this.options.container.appendChild(particle);
      this.particles.push(particle);
    }
  }

  animate() {
    this.particles.forEach((particle) => {
      gsap.to(particle, {
        x: (Math.random() - 0.5) * this.options.spread,
        y: (Math.random() - 0.5) * this.options.spread,
        opacity: 0,
        duration: this.options.duration,
        ease: "power2.out",
        onComplete: () => {
          gsap.set(particle, {
            x: 0,
            y: 0,
            opacity: 1
          });
        }
      });
    });
  }
}
```

## Game State Transitions

### Level Transition

```typescript
// components/LevelTransition.tsx
import { motion, AnimatePresence } from 'framer-motion';

const LevelTransition: React.FC<{ isChanging: boolean }> = ({ isChanging }) => {
  return (
    <AnimatePresence>
      {isChanging && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.43, 0.13, 0.23, 0.96]
          }}
          className="level-transition-overlay"
        />
      )}
    </AnimatePresence>
  );
};
```

## Performance Optimization

### Animation Pooling

```typescript
// utils/animationPool.ts
class AnimationPool {
  private pool: gsap.core.Timeline[] = [];
  private active: gsap.core.Timeline[] = [];

  constructor(private poolSize: number) {
    this.initPool();
  }

  private initPool() {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push(gsap.timeline({ paused: true }));
    }
  }

  acquire(): gsap.core.Timeline | null {
    const timeline = this.pool.pop();
    if (timeline) {
      this.active.push(timeline);
      return timeline;
    }
    return null;
  }

  release(timeline: gsap.core.Timeline) {
    const index = this.active.indexOf(timeline);
    if (index !== -1) {
      this.active.splice(index, 1);
      timeline.clear();
      this.pool.push(timeline);
    }
  }
}
```

## Best Practices

1. **Animation Prioritization**
   - Use Framer Motion for UI elements
   - Use GSAP for complex game animations
   - Combine both libraries when appropriate

2. **Performance Monitoring**
   - Track FPS during animations
   - Monitor memory usage
   - Implement animation pooling for frequent effects

3. **Animation Cleanup**
   - Always clean up GSAP animations
   - Use `useEffect` cleanup functions
   - Implement proper disposal methods

4. **State Management**
   - Coordinate animations with game state
   - Use animation completion callbacks
   - Handle interrupted animations

## Next Steps

1. Implement animation pooling system
2. Create reusable animation hooks
3. Develop particle system manager
4. Add animation stress testing tools
5. Create animation debugging utilities

## Resources

- [Game Animation Patterns](https://gameprogrammingpatterns.com/update-method.html)
- [Framer Motion Examples](https://www.framer.com/motion/examples/)
- [GSAP Game Development](https://greensock.com/games/) 