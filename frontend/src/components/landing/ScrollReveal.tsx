import React, { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'fade' | 'scale';
  threshold?: number;
}

const directionStyles: Record<string, React.CSSProperties> = {
  up:    { transform: 'translateY(40px)' },
  left:  { transform: 'translateX(-40px)' },
  right: { transform: 'translateX(40px)' },
  fade:  { transform: 'none' },
  scale: { transform: 'scale(0.92)' },
};

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.15,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial invisible state via JS (avoids needing a global CSS class)
    el.style.opacity = '0';
    const initial = directionStyles[direction];
    if (initial?.transform) el.style.transform = initial.transform;
    el.style.transition = `opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1)`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.style.opacity = '1';
          el.style.transform = 'translateY(0) translateX(0) scale(1)';
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, direction, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

export default ScrollReveal;
