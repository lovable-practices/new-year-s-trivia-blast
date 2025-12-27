import { useEffect, useState } from "react";

const SNOWFLAKE_CHARS = ["❄", "❅", "❆", "✻", "✼", "❋"];

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
  char: string;
  rotation: number;
}

const Snowfall = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 40; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 8 + Math.random() * 12,
        animationDelay: Math.random() * 8,
        size: 12 + Math.random() * 20,
        opacity: 0.4 + Math.random() * 0.6,
        char: SNOWFLAKE_CHARS[Math.floor(Math.random() * SNOWFLAKE_CHARS.length)],
        rotation: Math.random() * 360,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall text-white/80 select-none"
          style={{
            left: `${flake.left}%`,
            fontSize: `${flake.size}px`,
            opacity: flake.opacity,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            transform: `rotate(${flake.rotation}deg)`,
            textShadow: "0 0 8px rgba(255,255,255,0.5)",
          }}
        >
          {flake.char}
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
