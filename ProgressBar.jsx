// src/components/ProgressBar.jsx
import React, { useRef, useEffect } from 'react';

function ProgressBar({ progress, onSeek }) {
  const barRef = useRef(null);

  const handleClick = (e) => {
    const rect = barRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    onSeek(percent);
  };

  useEffect(() => {
    if (progress < 0 || progress > 1) {
      console.warn('Invalid progress value');
    }
  }, [progress]);

  return (
    <div className="mt-4 w-full">
      <div
        ref={barRef}
        onClick={handleClick}
        className="w-full h-4 bg-[#2e2e3e] rounded-full cursor-pointer relative"
      >
        <div
          className="h-4 bg-accent rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
        <div
          className="absolute top-0 left-0 h-4 rounded-full w-full bg-gradient-to-r from-accent/50 via-transparent to-transparent pointer-events-none"
        />
      </div>
      <p className="text-xs text-gray-400 mt-2 text-right">{Math.round(progress * 100)}%</p>
    </div>
  );
}

export default ProgressBar;