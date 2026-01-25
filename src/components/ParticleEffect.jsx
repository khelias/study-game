import React, { useEffect, useState } from 'react';

export const ParticleEffect = ({ type = 'success', active = false }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!active) {
      setParticles([]);
      return;
    }

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1 + Math.random() * 0.5,
      size: 8 + Math.random() * 12,
    }));

    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 2000);

    return () => clearTimeout(timer);
  }, [active]);

  if (!active || particles.length === 0) return null;

  const emoji = type === 'success' ? '✨' : type === 'star' ? '⭐' : '🎉';

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute text-2xl animate-particle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            fontSize: `${particle.size}px`,
          }}
        >
          {emoji}
        </div>
      ))}
      <style>{`
        @keyframes particle {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(
              ${Math.random() > 0.5 ? '-' : '+'}${100 + Math.random() * 50}px,
              ${100 + Math.random() * 50}px
            ) scale(0) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-particle {
          animation: particle linear forwards;
        }
      `}</style>
    </div>
  );
};
