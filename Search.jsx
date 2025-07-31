// src/components/Search.jsx
import React, { useState, useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';

export default function Search({ tracks, onSelect }) {
  const [query, setQuery] = useState('');

  // фильтрация списка по запросу
  const filteredTracks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tracks;
    return tracks.filter(
      ({ title, artist }) =>
        title.toLowerCase().includes(q) ||
        artist.toLowerCase().includes(q)
    );
  }, [tracks, query]);

  // функция для подсветки совпавших фрагментов
  const highlight = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-pink-500 text-white px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="p-4">
      {/* Поле поиска */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск треков..."
        className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Сетка результатов */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track) => (
            <li
              key={track.id}
              onClick={() => onSelect(track)}
              className="
                bg-gradient-to-br from-purple-700 to-purple-900
                p-5 rounded-xl shadow-xl
                hover:shadow-2xl hover:scale-[1.03]
                transition-transform cursor-pointer
                relative overflow-hidden
              "
            >
              <div className="mb-3">
                <h4 className="text-lg text-white font-bold">
                  {highlight(track.title)}
                </h4>
                <p className="text-sm text-gray-300">
                  {highlight(track.artist)}
                </p>
              </div>

              {/* Иконка для «поиска в Google» */}
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${track.title} ${track.artist}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  absolute top-3 right-3
                  text-gray-400 hover:text-gray-200
                  transition-colors
                "
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt />
              </a>

              {/* Анимированная градиентная линия внизу */}
              <span
                className="
                  absolute bottom-0 left-0 w-full h-[2px]
                  bg-gradient-to-r from-transparent via-pink-500 to-transparent
                  animate-move-gradient
                "
              />
            </li>
          ))
        ) : (
          <li className="col-span-full text-center py-10 text-gray-500">
            Ничего не найдено
          </li>
        )}
      </ul>
    </div>
  );
}