import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  color: string;
  animationDuration: number;
  animationDelay: number;
  rotation: number;
}

const colors = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(45, 100%, 60%)", // gold
  "hsl(0, 0%, 100%)", // white
  "hsl(280, 80%, 60%)", // purple
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
      for (let i = 0; i < 100; i++) {
        newPieces.push({
          id: i,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          animationDuration: 2 + Math.random() * 2,
          animationDelay: Math.random() * 0.5,
          rotation: Math.random() * 360,
        });
      }
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDuration: `${piece.animationDuration}s`,
            animationDelay: `${piece.animationDelay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
