# Animation Libraries Integration Guide

## Overview

This document outlines the integration and usage patterns for Framer Motion and GSAP (GreenSock Animation Platform) in our game project, comparing their strengths and optimal use cases.

## Library Comparison

### Framer Motion
- **Bundle Size**: ~17kb (core)
- **License**: MIT
- **Key Strengths**:
  - Native React integration
  - Hardware-accelerated animations
  - Built-in gesture support
  - Simple declarative API
  - Excellent TypeScript support

### GSAP
- **Bundle Size**: ~23.5kb (core)
- **License**: Commercial (with free tier)
- **Key Strengths**:
  - Superior performance for complex animations
  - Advanced timeline control
  - Cross-browser consistency
  - Rich plugin ecosystem
  - Complex transform interpolation

## Performance Considerations

### Hardware Acceleration
- Framer Motion leverages Web Animations API (WAAPI) for better performance
- GSAP uses requestAnimationFrame (rAF) for precise control
- Both perform best with transform/opacity animations

### CPU Load Impact
- Framer Motion:
  - Better performance under light CPU load
  - Hardware-accelerated animations remain smooth during main thread blocking
- GSAP:
  - More consistent performance under heavy CPU load
  - Better handling of complex animation sequences

## Implementation Patterns

### Game UI Animations (Framer Motion)

```typescript
// Example of a menu animation component
const MenuPanel = () => {
  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Menu content */}
    </motion.div>
  );
};
```

### Complex Game Animations (GSAP)

```typescript
// Example of complex character animation
import gsap from 'gsap';

const animateCharacter = (element: HTMLElement) => {
  const timeline = gsap.timeline();
  
  timeline
    .to(element, {
      x: 100,
      y: 50,
      rotation: 360,
      duration: 1,
      ease: "power2.inOut"
    })
    .to(element, {
      scale: 1.5,
      duration: 0.5
    });
};
```

## Use Case Recommendations

### Use Framer Motion for:
1. UI Components
   - Menus
   - Modals
   - Tooltips
   - Loading states
2. Gesture-based interactions
3. Simple transitions
4. React-specific animations

### Use GSAP for:
1. Complex animation sequences
2. Game character animations
3. Particle effects
4. Timeline-based animations
5. Cross-browser critical animations

## Integration with Next.js

### Framer Motion Setup

```typescript
// pages/_app.tsx
import { AnimatePresence } from 'framer-motion';

function MyApp({ Component, pageProps, router }) {
  return (
    <AnimatePresence mode="wait">
      <Component {...pageProps} key={router.route} />
    </AnimatePresence>
  );
}
```

### GSAP Setup

```typescript
// utils/animation.ts
import gsap from 'gsap';

// Register any required plugins
// import ScrollTrigger from 'gsap/dist/ScrollTrigger';
// gsap.registerPlugin(ScrollTrigger);

export const initGSAP = () => {
  // Global GSAP configuration
  gsap.config({
    nullTargetWarn: false,
  });
};
```

## Performance Optimization Tips

1. **Use Transform Properties**
   - Prefer `transform` over position properties
   - Utilize `will-change` for better performance

2. **Batch Animations**
   - Group related animations
   - Use timeline features effectively

3. **Memory Management**
   - Clean up animations on component unmount
   - Use `useLayoutEffect` for GSAP animations

4. **Reduce Bundle Size**
   - Import only needed features
   - Use tree-shaking friendly imports

## Common Issues and Solutions

### Framer Motion
1. **SSR Compatibility**
   - Use `LazyMotion` for dynamic imports
   - Handle hydration mismatches

2. **Performance**
   - Use `layoutId` for shared element transitions
   - Implement exit animations correctly

### GSAP
1. **React Integration**
   - Use refs for targeting elements
   - Clean up animations in useEffect

2. **Bundle Size**
   - Import specific modules
   - Use tree-shakeable imports

## Next Steps

1. Implement basic animation system
2. Create reusable animation hooks
3. Set up performance monitoring
4. Document specific animation patterns
5. Create animation style guide

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Next.js Animation Guide](https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#example-with-framer-motion) 