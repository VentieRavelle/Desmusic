// src/components/PlayerControls.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function PlayerControls({
  track,
  isPlaying,
  onPlay,
  onPause,
  volume,
  onVolumeChange
}) {
  // Локальный стейт для восстановления громкости при un-mute
  const prevVolume = useRef(volume);
  const [isMuted, setIsMuted] = useState(volume === 0);

  // Синхронизируем состояние muted при внешнем изменении volume
  useEffect(() => {
    setIsMuted(volume === 0);
    if (volume > 0) prevVolume.current = volume;
  }, [volume]);

  // Play / Pause
  const handleTogglePlay = () => {
    if (!track) return;                   // ничего не делать, если нет трека
    isPlaying ? onPause() : onPlay(track);
  };

  // Mute / Unmute
  const handleToggleMute = () => {
    if (isMuted) {
      onVolumeChange({ target: { value: prevVolume.current } });
    } else {
      onVolumeChange({ target: { value: 0 } });
    }
  };

  return (
    <div className="player-controls bg-[#1f1f2e] rounded-2xl p-6 shadow-xl flex flex-col gap-4 text-white">

      {/* Верхняя часть: обложка + инфо + кнопка Play/Pause */}
      <div className="flex items-center justify-between gap-4">
        {track?.cover && (
          <img
            src={track.cover}
            alt={track.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-1">Now Playing</p>
          <h3 className="text-lg font-semibold">
            {track?.title || 'No track selected'}
          </h3>
          <p className="text-sm text-gray-500">{track?.artist || '-'}</p>
        </div>
        <button
          onClick={handleTogglePlay}
          disabled={!track}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 p-3 rounded-full transition"
        >
          {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
        </button>
      </div>

      {/* Нижняя часть: регуляторы громкости */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggleMute}
          className="text-gray-400 hover:text-white transition"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={onVolumeChange}
          className="w-full h-1 rounded-lg bg-gray-700 accent-purple-500"
        />

        <span className="text-xs text-gray-400">{Math.round(volume * 100)}%</span>
      </div>
    </div>
  );
}