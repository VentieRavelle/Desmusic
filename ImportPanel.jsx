// src/components/ImportPanel.jsx
import React, { useState, useRef } from 'react';

function ImportPanel() {
  const [tracks, setTracks] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    const newTracks = [...tracks];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio')) {
        newTracks.push({
          id: Date.now() + Math.random(),
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown',
          src: URL.createObjectURL(file),
        });
      }
    });
    setTracks(newTracks);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleBrowse = () => {
    inputRef.current.click();
  };

  return (
    <section
      onDrop={handleDrop}
      onDragEnter={handleDrag}
      onDragLeave={() => setDragActive(false)}
      onDragOver={handleDrag}
      className={`relative mt-6 border-2 border-dashed rounded-xl p-6 transition ${
        dragActive ? 'border-accent bg-accent/10' : 'border-gray-600'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="audio/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-col items-center justify-center gap-3 text-center">
        <h3 className="text-accent font-bold text-lg">Import Tracks</h3>
        <p className="text-sm text-[#aaa]">
          Drag & drop files here, or
          <button
            onClick={handleBrowse}
            className="ml-2 underline text-accent hover:text-[#ff7ea3] transition"
          >
            browse
          </button>
        </p>
        <span className="text-xs text-[#666]">Supported formats: MP3, WAV, FLAC</span>
      </div>

      {/* 👀 Previews */}
      {tracks.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-[#212137] rounded-xl p-4 shadow hover:ring-accent hover:ring-2 transition"
            >
              <h4 className="text-white text-base font-semibold">{track.title}</h4>
              <p className="text-sm text-[#ffc1cc]">{track.artist}</p>
              <audio src={track.src} controls className="mt-2 w-full" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ImportPanel;