// src/components/Playlist.jsx
import React, { useState } from 'react';
import { FaTrashAlt, FaPlay } from 'react-icons/fa';

function Playlist({ tracks, onPlayTrack, onRemoveTrack }) {
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedTracks = [...tracks].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.title.localeCompare(b.title)
      : b.title.localeCompare(a.title);
  });

  return (
    <div className="mt-6 p-6 bg-[#1b1b2b] rounded-xl shadow-md animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-accent">Playlist</h2>
        <button
          className="text-sm text-gray-300 underline hover:text-accent transition"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          Sort: {sortOrder.toUpperCase()}
        </button>
      </div>

      {sortedTracks.length === 0 ? (
        <p className="text-gray-500">No tracks yet</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {sortedTracks.map((track) => (
            <li
              key={track.id}
              className="bg-[#27273d] rounded-xl p-4 flex justify-between items-center group hover:ring-accent hover:ring-2 transition"
            >
              <div>
                <h3 className="text-white font-semibold">{track.title}</h3>
                <p className="text-[#ccc] text-sm">{track.artist}</p>
              </div>

              <div className="flex gap-2 items-center">
                <button
                  onClick={() => onPlayTrack(track)}
                  className="text-white bg-accent px-3 py-2 rounded-full shadow hover:bg-[#ff6e98] transition flex items-center gap-2"
                >
                  <FaPlay />
                  Play
                </button>
                <button
                  onClick={() => onRemoveTrack(track.id)}
                  className="text-red-400 hover:text-red-500 transition"
                  title="Remove"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Playlist;