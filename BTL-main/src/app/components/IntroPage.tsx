import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useState } from "react";

export function IntroPage() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    // Delay navigation to show animation
    setTimeout(() => {
      navigate("/home");
    }, 800);
  };

  return (
    <div 
      className="size-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isAnimating ? 0.3 : 1, 
          opacity: 1,
          x: isAnimating ? window.innerWidth / 2 - 80 : 0,
          y: isAnimating ? -window.innerHeight / 2 + 40 : 0,
        }}
        transition={{ 
          duration: 0.8,
          ease: "easeInOut"
        }}
        className="flex flex-col items-center gap-4"
      >
        <div className="w-32 h-32 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
          <svg
            viewBox="0 0 100 100"
            className="w-20 h-20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="url(#gradient)" />
            <path
              d="M30 50 L45 65 L70 35"
              stroke="white"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {!isAnimating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-white mb-2">BRAND</h1>
            <p className="text-white/80 text-lg">Click anywhere to enter</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
