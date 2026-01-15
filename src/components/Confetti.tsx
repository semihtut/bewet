import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
  count?: number;
}

const COLORS = ['#EC4899', '#F472B6', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA'];

interface Particle {
  id: number;
  left: string;
  color: string;
  delay: string;
  duration: string;
}

export function Confetti({ show, count = 24 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (show) {
      const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: COLORS[i % COLORS.length],
        delay: `${Math.random() * 0.3}s`,
        duration: `${0.8 + Math.random() * 0.6}s`,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [show, count]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute top-0 w-2 h-2 rounded-sm animate-confetti-fall"
          style={{
            left: particle.left,
            backgroundColor: particle.color,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}
