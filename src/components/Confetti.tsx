import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  top: number;
  color: string;
  animationDuration: number;
  animationDelay: number;
  rotation: number;
  size: number;
  type: 'confetti' | 'sparkle' | 'streamer';
  swayDirection: number;
}

const goldColors = [
  "hsl(45, 100%, 50%)", // bright gold
  "hsl(45, 100%, 60%)", // gold
  "hsl(40, 100%, 55%)", // warm gold
  "hsl(50, 100%, 65%)", // light gold
  "hsl(35, 100%, 50%)", // deep gold
  "hsl(48, 100%, 70%)", // pale gold
];

const accentColors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(0, 0%, 100%)", // white
  "hsl(280, 80%, 60%)", // purple
  "hsl(0, 85%, 55%)", // red
  "hsl(120, 70%, 50%)", // green
];

interface ConfettiProps {
  isActive: boolean;
}

const Confetti = ({ isActive }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const newPieces: ConfettiPiece[] = [];
      
      // Golden confetti from all sides
      for (let i = 0; i < 80; i++) {
        const isFromSide = Math.random() > 0.5;
        newPieces.push({
          id: i,
          left: isFromSide ? (Math.random() > 0.5 ? -5 : 105) : Math.random() * 100,
          top: isFromSide ? Math.random() * 100 : -10,
          color: goldColors[Math.floor(Math.random() * goldColors.length)],
          animationDuration: 3 + Math.random() * 2,
          animationDelay: Math.random() * 0.8,
          rotation: Math.random() * 360,
          size: 8 + Math.random() * 8,
          type: 'confetti',
          swayDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }

      // Sparkles (small shiny dots)
      for (let i = 80; i < 140; i++) {
        newPieces.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          color: goldColors[Math.floor(Math.random() * 3)],
          animationDuration: 1 + Math.random() * 1.5,
          animationDelay: Math.random() * 1.5,
          rotation: 0,
          size: 4 + Math.random() * 6,
          type: 'sparkle',
          swayDirection: 1,
        });
      }

      // Long streamers/spirals
      for (let i = 140; i < 170; i++) {
        const isFromSide = Math.random() > 0.3;
        newPieces.push({
          id: i,
          left: isFromSide ? (Math.random() > 0.5 ? -5 : 105) : Math.random() * 100,
          top: isFromSide ? Math.random() * 60 : -20,
          color: [...goldColors, ...accentColors][Math.floor(Math.random() * (goldColors.length + accentColors.length))],
          animationDuration: 4 + Math.random() * 3,
          animationDelay: Math.random() * 0.5,
          rotation: Math.random() * 180,
          size: 80 + Math.random() * 60,
          type: 'streamer',
          swayDirection: Math.random() > 0.5 ? 1 : -1,
        });
      }

      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => {
        if (piece.type === 'confetti') {
          return (
            <div
              key={piece.id}
              className="absolute animate-confetti-burst"
              style={{
                left: `${piece.left}%`,
                top: `${piece.top}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                backgroundColor: piece.color,
                transform: `rotate(${piece.rotation}deg)`,
                animationDuration: `${piece.animationDuration}s`,
                animationDelay: `${piece.animationDelay}s`,
                borderRadius: Math.random() > 0.5 ? "50%" : Math.random() > 0.5 ? "2px" : "0",
                boxShadow: `0 0 ${piece.size / 2}px ${piece.color}`,
                ['--sway-direction' as string]: piece.swayDirection,
              }}
            />
          );
        }
        
        if (piece.type === 'sparkle') {
          return (
            <div
              key={piece.id}
              className="absolute animate-sparkle"
              style={{
                left: `${piece.left}%`,
                top: `${piece.top}%`,
                width: `${piece.size}px`,
                height: `${piece.size}px`,
                animationDuration: `${piece.animationDuration}s`,
                animationDelay: `${piece.animationDelay}s`,
              }}
            >
              <svg viewBox="0 0 24 24" fill={piece.color} className="w-full h-full">
                <path d="M12 0L13.5 9L22 12L13.5 15L12 24L10.5 15L2 12L10.5 9L12 0Z" />
              </svg>
            </div>
          );
        }

        // Streamer/spiral
        return (
          <div
            key={piece.id}
            className="absolute animate-streamer"
            style={{
              left: `${piece.left}%`,
              top: `${piece.top}%`,
              width: '8px',
              height: `${piece.size}px`,
              animationDuration: `${piece.animationDuration}s`,
              animationDelay: `${piece.animationDelay}s`,
              ['--sway-direction' as string]: piece.swayDirection,
            }}
          >
            <svg 
              viewBox="0 0 20 100" 
              className="w-full h-full"
              style={{ transform: `rotate(${piece.rotation}deg)` }}
            >
              <path
                d="M10 0 Q0 10 10 20 Q20 30 10 40 Q0 50 10 60 Q20 70 10 80 Q0 90 10 100"
                fill="none"
                stroke={piece.color}
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default Confetti;