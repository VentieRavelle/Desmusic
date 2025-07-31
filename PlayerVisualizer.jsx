// src/components/PlayerVisualizer.jsx
import React, { useEffect, useRef, useState } from 'react';

function PlayerVisualizer({ audioRef, isPlaying }) {
  const canvasRef = useRef(null);
  const [audioCtx, setAudioCtx] = useState(null);

  useEffect(() => {
    let animationFrameId;
    let analyser;
    let source;

    const initVisualizer = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      setAudioCtx(audioContext);

      analyser = audioContext.createAnalyser();
      source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      analyser.fftSize = 128;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        animationFrameId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        ctx.fillStyle = '#1e1e2f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.8;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = dataArray[i] * 1.2;
          ctx.fillStyle = `rgb(${barHeight + 100}, ${150 - i}, ${255 - barHeight})`;
          ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
          x += barWidth + 2;
        }
      };

      draw();
    };

    if (isPlaying && audioRef.current) {
      initVisualizer();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioCtx) audioCtx.close();
    };
  }, [isPlaying, audioRef]);

  return (
    <div className="w-full h-64 mt-6 border border-accent rounded-xl overflow-hidden shadow-xl animate-fadeIn">
      <canvas ref={canvasRef} width={900} height={240} />
    </div>
  );
}

export default PlayerVisualizer;