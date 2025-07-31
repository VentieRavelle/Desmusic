// src/components/TrackCard.jsx

import React, { useState, useRef, useEffect } from 'react';
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaEllipsisV,
  FaPlus,
  FaShareAlt,
  FaTrashAlt,
} from 'react-icons/fa';
import PropTypes from 'prop-types';

/**
 * TrackCard
 * Карточка трека с обложкой, кнопками управления,
 * состоянием загрузки обложки, skeleton-эффектом,
 * всплывающим контекстным меню, оценками и анимацией.
 */
function TrackCard({
  track,
  isPlaying,
  onPlay,
  onPause,
  onToggleFavorite,
  onAddToPlaylist,
  className = '',
}) {
  const [hover, setHover] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const cardRef = useRef(null);

  // Закрываем меню при клике вне его
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Поп-эффект при появлении карточки
  useEffect(() => {
    const el = cardRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.classList.add('animate-popIn');
      });
    }
  }, []);

  const handlePlayClick = () => {
    if (isPlaying) {
      onPause(track.id);
    } else {
      onPlay(track);
    }
  };

  const handleImgLoad = () => {
    setImgLoaded(true);
  };

  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setShowMenu(false);
      }}
      className={`relative bg-[#1e1e2f] rounded-xl overflow-hidden shadow-lg transition-transform transform hover:-translate-y-1 hover:scale-102 ${className}`}
    >
      {/* Skeleton-заглушка пока не загрузилась обложка */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-[#2a2a3f] animate-shimmer" />
      )}

      {/* Обложка трека */}
      <img
        src={track.cover}
        alt={track.title}
        onLoad={handleImgLoad}
        className={`w-full h-48 object-cover transition-opacity duration-500 ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Иконки управления поверх обложки */}
      {hover && imgLoaded && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-4">
          <button
            onClick={handlePlayClick}
            className="p-3 bg-accent text-white rounded-full hover:scale-110 transition-transform"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          <button
            onClick={() => onToggleFavorite(track.id)}
            className={`p-2 rounded-full transition-colors ${
              track.favorite ? 'bg-red-500 text-white' : 'bg-white/30 text-white'
            } hover:bg-red-500`}
          >
            <FaHeart />
          </button>
          <button
            onClick={toggleMenu}
            className="p-2 bg-white/30 text-white rounded-full hover:bg-white/50 transition"
          >
            <FaEllipsisV />
          </button>
        </div>
      )}

      {/* Контекстное меню */}
      {showMenu && (
        <div
          ref={menuRef}
          className="absolute top-2 right-2 bg-[#292940] rounded-lg shadow-xl text-white w-40 z-10 animate-dropdown"
        >
          <button
            onClick={() => {
              onAddToPlaylist(track.id);
              setShowMenu(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-[#3a3a4f] flex items-center gap-2"
          >
            <FaPlus /> Add to Playlist
          </button>
          <button
            onClick={() => {
              // демонстрация: copy share link
              navigator.clipboard.writeText(track.shareLink || window.location.href);
            }}
            className="w-full text-left px-4 py-2 hover:bg-[#3a3a4f] flex items-center gap-2"
          >
            <FaShareAlt /> Share
          </button>
          <button
            onClick={() => {
              // тут могла бы быть логика удаления
              console.log('Remove track', track.id);
            }}
            className="w-full text-left px-4 py-2 hover:bg-red-600 flex items-center gap-2 text-red-400"
          >
            <FaTrashAlt /> Remove
          </button>
        </div>
      )}

      {/* Инфо о треке */}
      <div className="p-4 space-y-1">
        <h4 className="text-white font-semibold truncate">{track.title}</h4>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>

        {/* Прогресс воспроизведения мини */}
        <div className="w-full h-1 bg-[#2a2a3f] rounded-full overflow-hidden mt-2">
          <div
            className="h-1 bg-accent transition-all"
            style={{ width: `${track.progress * 100}%` }}
          />
        </div>

        {/* Звёздный рейтинг */}
        <div className="flex items-center gap-1 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => console.log('Rate', track.id, star)}
              className={`cursor-pointer text-sm ${
                star <= track.rating ? 'text-accent' : 'text-gray-600'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

TrackCard.propTypes = {
  track: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cover: PropTypes.string,
    title: PropTypes.string,
    artist: PropTypes.string,
    shareLink: PropTypes.string,
    favorite: PropTypes.bool,
    progress: PropTypes.number,
    rating: PropTypes.number,
  }).isRequired,
  isPlaying: PropTypes.bool,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  onAddToPlaylist: PropTypes.func,
  className: PropTypes.string,
};

export default TrackCard;

// =====================================================================
// Примечание: для skeleton-эффекта добавьте в App.css:
//
// @keyframes shimmer {
//   0% { background-position: -200% 0; }
//   100% { background-position: 200% 0; }
// }
// .animate-shimmer {
//   background: linear-gradient(
//     90deg,
//     rgba(46,46,63,1) 0%,
//     rgba(64,64,89,1) 50%,
//     rgba(46,46,63,1) 100%
//   );
//   background-size: 200% 100%;
//   animation: shimmer 1.8s infinite;
// }
//
// @keyframes dropdown {
//   from { opacity: 0; transform: translateY(-10px); }
//   to   { opacity: 1; transform: translateY(0); }
// }
// .animate-dropdown {
//   animation: dropdown 0.3s ease-out forwards;
// }
//
// @keyframes popIn {
//   from { opacity: 0; transform: scale(0.95); }
//   to   { opacity: 1; transform: scale(1); }
// }
// .animate-popIn {
//   animation: popIn 0.5s ease-out forwards;
// }
// =====================================================================