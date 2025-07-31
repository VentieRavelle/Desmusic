// src/components/SongView.jsx
import React, { useState } from 'react';
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaShareAlt,
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaPlusCircle,
} from 'react-icons/fa';

function SongView({ track, onPlay, onPause }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [comments, setComments] = useState([
    { id: 1, user: 'Alice', text: 'Love this track!', time: '2h ago' },
    { id: 2, user: 'Bob', text: 'The beat drop 🤯', time: '1h ago' },
    { id: 3, user: 'Charlie', text: 'On repeat!', time: '30m ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  const togglePlay = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay(track);
    }
    setIsPlaying(!isPlaying);
  };

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: Date.now(), user: 'You', text: newComment, time: 'just now' },
    ]);
    setNewComment('');
  };

  return (
    <div className="p-8 bg-[#1a1a2b] rounded-xl shadow-xl animate-fadeIn space-y-8">
      {/* Header: Navigation */}
      <div className="flex items-center justify-between">
        <button className="p-2 rounded-full bg-[#292940] hover:bg-[#3a3a4f] transition">
          <FaChevronLeft />
        </button>
        <h2 className="text-xl font-bold text-white">{track.title}</h2>
        <button className="p-2 rounded-full bg-[#292940] hover:bg-[#3a3a4f] transition">
          <FaChevronRight />
        </button>
      </div>

      {/* Artwork & Info */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <img
          src={track.cover}
          alt={track.title}
          className="w-64 h-64 object-cover rounded-xl shadow-lg"
        />
        <div className="flex-1 space-y-4">
          <h3 className="text-3xl font-bold text-accent">{track.title}</h3>
          <p className="text-lg text-gray-300">{track.artist}</p>
          <p className="text-sm text-gray-500">{track.album} • {track.year}</p>

          {/* Play / Favorite / Share */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="flex items-center gap-2 bg-accent hover:bg-[#ff6e98] text-white px-5 py-3 rounded-full transition"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button className="p-3 rounded-full bg-[#292940] hover:bg-[#3a3a4f] transition">
              <FaHeart className="text-red-400" />
            </button>
            <button className="p-3 rounded-full bg-[#292940] hover:bg-[#3a3a4f] transition">
              <FaShareAlt className="text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Lyrics Section */}
      <div className="bg-[#292940] p-6 rounded-xl space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-white">Lyrics</h4>
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className="text-accent hover:text-[#ff6e98] transition"
          >
            {showLyrics ? 'Hide' : 'Show'}
          </button>
        </div>
        {showLyrics && (
          <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed max-h-64 overflow-y-auto">
{`[Verse 1]
Here comes the sun, creeping through the blinds
Bass drops heavy, shaking up my mind
We ride the waves of sound, unstoppable flow
`}
          </pre>
        )}
      </div>

      {/* Comments Section */}
      <div className="bg-[#292940] p-6 rounded-xl space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaComment /> Comments
        </h4>
        <ul className="space-y-3 max-h-48 overflow-y-auto">
          {comments.map((c) => (
            <li key={c.id} className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-accent">{c.user}</p>
                <p className="text-gray-300">{c.text}</p>
              </div>
              <span className="text-xs text-gray-500">{c.time}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2 mt-4">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-[#1e1e2f] text-white rounded px-4 py-2 focus:outline-none"
          />
          <button
            onClick={handleCommentSubmit}
            className="p-2 bg-accent hover:bg-[#ff6e98] text-white rounded transition"
          >
            Post
          </button>
        </div>
      </div>

      {/* Add to Playlist */}
      <div className="bg-[#292940] p-6 rounded-xl space-y-4">
        <h4 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaPlusCircle /> Add to Playlist
        </h4>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Chill Vibes', 'Top Hits', 'Road Trip', 'Study Beats'].map((pl, i) => (
            <li
              key={i}
              className="bg-[#1e1e2f] p-3 rounded-lg flex items-center justify-between hover:ring-accent hover:ring-2 transition cursor-pointer"
            >
              <span className="text-gray-300 truncate">{pl}</span>
              <FaPlusCircle className="text-accent" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SongView;