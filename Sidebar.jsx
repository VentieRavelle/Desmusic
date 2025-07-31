// src/components/Sidebar.jsx
import React, { useState } from 'react';
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaMusic,
  FaUser,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaFileImport    // ← иконка для импорта
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import ImportPanel from './ImportPanel';   // ← сам импорт-панель

const navItems = [
  { id: 'home',      label: 'Home',      icon: <FaHome />,      path: '/' },
  { id: 'search',    label: 'Search',    icon: <FaSearch />,    path: '/search' },
  { id: 'library',   label: 'Library',   icon: <FaMusic />,     path: '/library' },
  { id: 'favorites', label: 'Favorites', icon: <FaHeart />,     path: '/favorites' },
];

const footerItems = [
  { id: 'profile',  label: 'Profile',  icon: <FaUser />,        path: '/profile' },
  { id: 'settings', label: 'Settings', icon: <FaCog />,         path: '/settings' },
  { id: 'logout',   label: 'Logout',   icon: <FaSignOutAlt />,  action: () => console.log('Logging out') },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const toggleCollapse = () => setCollapsed(prev => !prev);
  const toggleImport   = () => setShowImport(prev => !prev);

  return (
    <aside
      className={`bg-[#1a1a2b] text-gray-300 h-full flex flex-col justify-between
                  transition-width duration-300 ${collapsed ? 'w-16' : 'w-64'}`}
    >
      {/* HEADER */}
      <div className="py-4 px-3 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-accent">MyMusic</h1>}
        <button
          onClick={toggleCollapse}
          className="p-2 rounded-full hover:bg-[#292940] transition"
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-2 space-y-2 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg hover:bg-[#292940] transition
               ${isActive ? 'bg-accent text-white' : ''}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </NavLink>
        ))}

        {/* Import Toggle */}
        <div className="mt-4">
          <button
            onClick={toggleImport}
            className="flex items-center gap-3 w-full p-2 rounded-lg
                       hover:bg-[#292940] transition text-gray-300"
          >
            <FaFileImport className="text-lg" />
            {!collapsed && (
              <span className={`${showImport ? 'text-accent' : ''}`}>
                {showImport ? 'Hide Import' : 'Import'}
              </span>
            )}
          </button>
          {showImport && !collapsed && (
            <div className="mt-2 p-2 bg-[#25253b] rounded-lg">
              <ImportPanel />
            </div>
          )}
        </div>

        {/* Playlists Group */}
        <div className="mt-6">
          <h4 className={`px-2 text-xs uppercase text-gray-500 ${collapsed ? 'opacity-0' : ''}`}>
            Playlists
          </h4>
          <ul className="mt-2 space-y-1">
            {['Chill Vibes', 'Workout', 'Indie Hits', 'Favorites'].map((pl, idx) => (
              <li key={idx}>
                <NavLink
                  to={`/playlist/${idx}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-2 rounded-lg hover:bg-[#292940] transition
                     ${isActive ? 'bg-accent text-white' : ''}`
                  }
                >
                  <FaMusic />
                  {!collapsed && <span className="truncate">{pl}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="px-2 pb-4 space-y-2">
        {footerItems.map(item =>
          item.path ? (
            <NavLink
              key={item.id}
              to={item.path}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#292940] transition"
            >
              <span className="text-lg">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ) : (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#292940] transition"
            >
              <span className="text-lg">{item.icon}</span>
                      {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          )
        )}
      </div>
    </aside>
  );
}

export default Sidebar;