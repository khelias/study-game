// Täiustatud animatsioonid ja visuaalsed efektid
import React from 'react';

// Tähe kogumise animatsioon
export const StarCollectAnimation = ({ position, onComplete }) => {
  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      onAnimationEnd={onComplete}
    >
      <div className="text-4xl animate-star-collect">⭐</div>
      <style>{`
        @keyframes star-collect {
          0% { 
            transform: scale(0) rotate(0deg) translateY(0); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.5) rotate(180deg) translateY(-30px); 
            opacity: 1; 
          }
          100% { 
            transform: scale(1) rotate(360deg) translateY(-60px); 
            opacity: 0; 
          }
        }
        .animate-star-collect {
          animation: star-collect 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }
      `}</style>
    </div>
  );
};

// Pulseeriv efekt õige vastuse jaoks
export const PulseEffect = ({ active, children }) => {
  if (!active) return children;
  
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 animate-ping-slow pointer-events-none">
        <div className="w-full h-full rounded-full bg-green-400 opacity-20" />
      </div>
      <style>{`
        @keyframes ping-slow {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </div>
  );
};

// Shake animatsioon vale vastuse jaoks
export const ShakeEffect = ({ active, children }) => {
  if (!active) return children;
  
  return (
    <div className={active ? 'animate-shake' : ''}>
      {children}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  );
};

// Fade in animatsioon uute ülesannete jaoks
export const FadeIn = ({ children, delay = 0 }) => {
  return (
    <div 
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
      <style>{`
        @keyframes fade-in {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

// Bounce animatsioon nuppude jaoks
export const BounceOnClick = ({ children, onClick }) => {
  const [bouncing, setBouncing] = React.useState(false);
  
  const handleClick = (e) => {
    setBouncing(true);
    setTimeout(() => setBouncing(false), 300);
    if (onClick) onClick(e);
  };
  
  return (
    <div 
      className={bouncing ? 'animate-bounce-click' : ''}
      onClick={handleClick}
    >
      {children}
      <style>{`
        @keyframes bounce-click {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(0.95); }
        }
        .animate-bounce-click {
          animation: bounce-click 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

// Confetti efekt täiustatud versioon
export const EnhancedConfetti = ({ active, onComplete }) => {
  const [particles, setParticles] = React.useState([]);
  
  React.useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        emoji: ['🎉', '🎊', '⭐', '🌟', '✨', '🎈', '🎁'][Math.floor(Math.random() * 7)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);
  
  if (!active || particles.length === 0) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute text-3xl animate-confetti-enhanced"
          style={{
            left: `${particle.left}%`,
            top: '-10%',
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.emoji}
        </div>
      ))}
      <style>{`
        @keyframes confetti-enhanced {
          0% { 
            transform: translateY(0) rotate(0deg) scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: translateY(50vh) rotate(360deg) scale(1.2); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(110vh) rotate(720deg) scale(0.5); 
            opacity: 0; 
          }
        }
        .animate-confetti-enhanced {
          animation: confetti-enhanced 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
