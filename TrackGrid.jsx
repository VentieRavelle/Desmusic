// src/components/TrackGrid.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import TrackCard from './TrackCard';
import { FaSpinner } from 'react-icons/fa';

/**
 * TrackGrid
 * Отображает фильтрованную, группированную
 * и лениво загружаемую сетку TrackCard.
 */
function TrackGrid({
  allTracks,
  onPlayTrack,
  onPauseTrack,
  playingTrackId,
  onToggleFavorite,
  onAddToPlaylist,
}) {
  const [filtered, setFiltered] = useState(allTracks);
  const [filter, setFilter] = useState('');
  const [groupBy, setGroupBy] = useState('album');
  const [displayed, setDisplayed] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef(null);

  const PAGE_SIZE = 12;

  // Фильтрация при изменении filter
  useEffect(() => {
    const low = filter.toLowerCase();
    const f = allTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(low) ||
        t.artist.toLowerCase().includes(low)
    );
    setFiltered(f);
    setPage(1);
    setDisplayed(f.slice(0, PAGE_SIZE));
  }, [filter, allTracks]);

  // Загрузка "страниц" при прокрутке
  const loadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const next = filtered.slice(0, (page + 1) * PAGE_SIZE);
      setDisplayed(next);
      setPage((p) => p + 1);
      setLoadingMore(false);
    }, 800);
  }, [filtered, page, loadingMore]);

  // IntersectionObserver для автоматической загрузки
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && displayed.length < filtered.length) {
          loadMore();
        }
      },
      { rootMargin: '100px' }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [displayed, filtered, loadMore]);

  // Группировка по album / artist / year
  const grouped = displayed.reduce((acc, track) => {
    const key = track[groupBy] || 'Unknown';
    if (!acc[key]) acc[key] = [];
    acc[key].push(track);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          placeholder="Filter tracks..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 bg-[#2a2a3f] text-white rounded px-4 py-2 focus:outline-none"
        />
        <select
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          className="bg-[#2a2a3f] text-white rounded px-4 py-2"
        >
          <option value="album">Album</option>
          <option value="artist">Artist</option>
          <option value="year">Year</option>
        </select>
      </div>

      {/* Группы */}
      {Object.entries(grouped).map(([group, tracks]) => (
        <section key={group}>
          <h3 className="text-lg font-semibold text-accent mb-4">{group}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {tracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isPlaying={playingTrackId === track.id}
                onPlay={onPlayTrack}
                onPause={onPauseTrack}
                onToggleFavorite={onToggleFavorite}
                onAddToPlaylist={onAddToPlaylist}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Лоадер в конце списка */}
      <div ref={loaderRef} className="flex justify-center py-6">
        {loadingMore && (
          <FaSpinner className="text-2xl text-gray-500 animate-spin" />
        )}
      </div>

      {/* Нет треков */}
      {filtered.length === 0 && (
        <p className="text-center text-gray-400">No tracks found.</p>
      )}
    </div>
  );
}

export default TrackGrid;

// =====================================================================
// Подсказки по стилям в App.css:
//
// .scale-102 { transform: scale(1.02); }
// .animate-spin { animation: spin 1s linear infinite; }
// @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
// =====================================================================