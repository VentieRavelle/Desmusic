// src/App.jsx
import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  useReducer,
} from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  NavLink,
} from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';

import Sidebar from './components/Sidebar';
import ImportPanel from './components/ImportPanel';
import TrackGrid from './components/TrackGrid';
import Search from './components/Search';
import Playlist from './components/Playlist';
import Profile from './components/Profile';
import Settings from './components/Settings';
import SongView from './components/SongView';
import PlayerControls from './components/PlayerControls';
import PlayerVisualizer from './components/PlayerVisualizer';
import ProgressBar from './components/ProgressBar';

import './styles/App.css';

//
// 1) PageWrapper — анимация переходов между страницами
//
function PageWrapper({ children }) {
  const { pathname } = useLocation();
  const variants = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.35 } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

//
// 2) ProfileSummary — правый сайдбар
//
function ProfileSummary({ userData }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/profile')}
      className="cursor-pointer p-4 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
    >
      <img
        src={userData.avatar}
        alt="Avatar"
        className="w-12 h-12 rounded-full border-2 border-blue-400"
      />
      <div>
        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
          {userData.name}
        </h4>
        <small className="text-sm text-gray-500 dark:text-gray-400">
          Редактировать профиль
        </small>
      </div>
    </div>
  );
}

//
// 3) Audio Context — выносим плеерную логику в Context
//
const AudioContext = createContext();

function audioReducer(state, action) {
  switch (action.type) {
    case 'LOAD_TRACK':
      return {
        ...state,
        currentTrack: action.track,
        isPlaying: true,
        progress: 0,
      };
    case 'PLAY':
      return { ...state, isPlaying: true };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'SET_PROGRESS':
      return { ...state, progress: action.progress };
    case 'SET_VOLUME':
      return { ...state, volume: action.volume };
    case 'SET_TRACKS':
      return { ...state, tracks: action.tracks };
    default:
      return state;
  }
}

function AudioProvider({ children }) {
  const [state, dispatch] = useReducer(audioReducer, {
    tracks: [],
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    progress: 0,
  });
  const audioRef = useRef(null);

  // Mock-загрузка треков
  useEffect(() => {
    setTimeout(() => {
      const mock = Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        cover: `https://picsum.photos/seed/track${i + 1}/200/200`,
        title: `Track ${i + 1}`,
        artist: `Artist ${((i % 5) + 1)}`,
        shareLink: `${window.location.href}?t=${i + 1}`,
      }));
      dispatch({ type: 'SET_TRACKS', tracks: mock });
    }, 800);
  }, []);

  // Слежение за прогрессом аудио
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = state.volume;
    const onTime = () =>
      dispatch({
        type: 'SET_PROGRESS',
        progress: audio.currentTime / (audio.duration || 1),
      });
    const onEnd = () => dispatch({ type: 'PAUSE' });

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, [state.volume]);

  const playTrack = (track) => {
    if (track.id !== state.currentTrack?.id) {
      dispatch({ type: 'LOAD_TRACK', track });
      audioRef.current.src = track.shareLink;
    }
    audioRef.current.play();
  };
  const pauseTrack = () => audioRef.current.pause();
  const setVolume = (v) => dispatch({ type: 'SET_VOLUME', volume: v });
  const seek = (p) => {
    if (!audioRef.current.duration) return;
    audioRef.current.currentTime = p * audioRef.current.duration;
  };

  return (
    <AudioContext.Provider
      value={{
        ...state,
        audioRef,
        playTrack,
        pauseTrack,
        setVolume,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

const useAudio = () => useContext(AudioContext);

//
// 4) Panel Context — управление видимостью central panel
//
const PanelContext = createContext();

function PanelProvider({ children }) {
  const [isMainVisible, setMainVisible] = useState(true);
  const toggleMain = () => setMainVisible((v) => !v);

  return (
    <PanelContext.Provider value={{ isMainVisible, toggleMain }}>
      {children}
    </PanelContext.Provider>
  );
}

const usePanels = () => useContext(PanelContext);

//
// 5) Основной контент приложения
//
function AppContent() {
  const {
    tracks,
    currentTrack,
    isPlaying,
    volume,
    progress,
    audioRef,
    playTrack,
    pauseTrack,
    setVolume,
    seek,
  } = useAudio();
  const { isMainVisible, toggleMain } = usePanels();

  // Плейлисты
  const [playlists, setPlaylists] = useState({ 'Мои треки': [] });
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const addToPlaylist = (id) => {
    const t = tracks.find((x) => x.id === id);
    if (t && !playlistTracks.find((x) => x.id === id)) {
      setPlaylistTracks((p) => [...p, t]);
    }
  };
  const removeFromPlaylist = (id) =>
    setPlaylistTracks((p) => p.filter((x) => x.id !== id));
  const createPlaylist = () => {
    const name = newPlaylistName.trim();
    if (!name) return;
    setPlaylists((p) => ({ ...p, [name]: [] }));
    setNewPlaylistName('');
  };
  const deletePlaylist = (name) =>
    setPlaylists((p) => {
      const c = { ...p };
      delete c[name];
      return c;
    });

  // User
  const [userData, setUserData] = useState({
    name: 'User',
    avatar: '/default-avatar.png',
    stats: { tracks: 0, followers: 0, likes: 0 },
  });
  const handleUpdate = (d) => setUserData(d);

  return (
    <div className="app grid grid-cols-[auto_1fr_auto] h-screen bg-gray-50 dark:bg-gray-900">
      {/* левый Sidebar */}
      <Sidebar />

      {/* центральная панель */}
      <motion.div
        layout
        className="flex flex-col border-x border-gray-200 dark:border-gray-700"
      >
        <motion.header
          layout
          className="p-3 bg-white dark:bg-gray-800 flex justify-end"
        >
          <button
            onClick={toggleMain}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isMainVisible ? 'Скрыть панель' : 'Показать панель'}
          </button>
        </motion.header>

        <AnimatePresence mode="wait">
          {isMainVisible && (
            <motion.main
              key="main"
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-auto p-4"
            >
              <Routes>
                <Route
                  path="/"
                  element={
                    <PageWrapper>
                      <ImportPanel />
                      <TrackGrid
                        allTracks={tracks}
                        onPlayTrack={playTrack}
                        onPauseTrack={pauseTrack}
                        playingTrackId={currentTrack?.id}
                        onAddToPlaylist={addToPlaylist}
                      />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <PageWrapper>
                      <Search tracks={tracks} onSelect={playTrack} />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/playlist"
                  element={
                    <PageWrapper>
                      <Playlist
                        tracks={playlistTracks}
                        onPlayTrack={playTrack}
                        onRemoveTrack={removeFromPlaylist}
                      />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PageWrapper>
                      <Profile userData={userData} onUpdate={handleUpdate} />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PageWrapper>
                      <Settings />
                    </PageWrapper>
                  }
                />
                <Route
                  path="/track/:id"
                  element={
                    <PageWrapper>
                      <SongView
                        track={currentTrack || {}}
                        onPlay={playTrack}
                        onPause={pauseTrack}
                      />
                    </PageWrapper>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              {/* нижняя панель плеера */}
              <motion.div
                layout
                className="player-bar border-t border-gray-200 dark:border-gray-700 p-2 bg-white dark:bg-gray-800 flex items-center gap-4"
              >
                <PlayerVisualizer audioRef={audioRef} isPlaying={isPlaying} />
                <PlayerControls
                  track={currentTrack}
                  isPlaying={isPlaying}
                  onPlay={() => playTrack(currentTrack)}
                  onPause={pauseTrack}
                  volume={volume}
                  onVolumeChange={(e) => setVolume(+e.target.value)}
                />
                <ProgressBar progress={progress} onSeek={seek} />
              </motion.div>
            </motion.main>
          )}
        </AnimatePresence>
      </motion.div>

      {/* правый сайдбар */}
      <aside className="w-64 lg:w-72 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-auto">
        <ProfileSummary userData={userData} />

        <div className="playlist-manager p-4">
          <h3 className="text-lg mb-2 text-gray-700 dark:text-gray-200">
            Мои плейлисты
          </h3>
          <ul className="space-y-1">
            {Object.keys(playlists).map((name) => (
              <li key={name} className="flex justify-between items-center">
                <NavLink to="/playlist" className="text-blue-600 hover:underline">
                  {name}
                </NavLink>
                <button
                  onClick={() => deletePlaylist(name)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Новый плейлист"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createPlaylist()}
              className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <button
              onClick={createPlaylist}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              +
            </button>
          </div>
        </div>
      </aside>

      <audio ref={useAudio().audioRef} className="hidden" />
    </div>
  );
}

//
// единственный default-export в файле
//
export default function App() {
  return (
    <BrowserRouter>
      <AudioProvider>
        <PanelProvider>
          <AppContent />
        </PanelProvider>
      </AudioProvider>
    </BrowserRouter>
  );
}