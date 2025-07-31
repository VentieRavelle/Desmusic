import React, { useState } from 'react';
import { FaLanguage, FaSun, FaMoon, FaMusic, FaBell, FaUserShield, FaTrashAlt } from 'react-icons/fa';

// You should import useSettings from your context file, e.g.:
// import { useSettings } from '../context/SettingsContext';

const Settings = () => {
  // Replace this with: const { settings, setSettings } = useSettings();
  // For demo, using local state:
  const [settings, setSettings] = useState({
    general: {
      language: 'en',
      theme: 'light',
      timezone: 'UTC',
    },
    playback: {
      quality: 'high',
      crossfade: 5,
      autoplay: true,
      gapless: false,
    },
    appearance: {
      accentColor: '#ff6e98',
      fontSize: 16,
      layout: 'grid',
    },
    notifications: {
      newReleases: true,
      updates: true,
      social: false,
      marketingEmails: false,
    },
    account: {
      email: 'user@example.com',
      password: '',
    },
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleGeneralChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      general: {
        ...prev.general,
        [key]: value,
      },
    }));
  };

  const handlePlaybackChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      playback: {
        ...prev.playback,
        [key]: value,
      },
    }));
  };

  const handleAppearanceChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [key]: value,
      },
    }));
  };

  const handleNotificationsChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleAccountChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      account: {
        ...prev.account,
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // Save logic here (e.g., call API or update context)
    alert('Settings saved!');
  };

  const handleDeleteAccount = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    } else {
      // Delete account logic here
      alert('Account deleted!');
    }
  };

  return (
    <div className="p-8 bg-[#1a1a2b] rounded-xl shadow-2xl animate-fadeIn space-y-8">
      <h2 className="text-2xl font-bold text-accent mb-4">Settings</h2>

      {/* --- General Section */}
      <section className="bg-[#292940] p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaLanguage /> General
        </h3>
        {/* Language */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Language:</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleGeneralChange('language', e.target.value)}
            className="w-full sm:w-3/4 bg-[#2a2a3f] text-white rounded px-3 py-2"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Theme */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Theme:</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleGeneralChange('theme', 'light')}
              className={`p-3 rounded-full transition ${
                settings.general.theme === 'light'
                  ? 'bg-accent text-white'
                  : 'bg-[#2a2a3f] text-gray-400'
              }`}
            >
              <FaSun />
            </button>
            <button
              onClick={() => handleGeneralChange('theme', 'dark')}
              className={`p-3 rounded-full transition ${
                settings.general.theme === 'dark'
                  ? 'bg-accent text-white'
                  : 'bg-[#2a2a3f] text-gray-400'
              }`}
            >
              <FaMoon />
            </button>
          </div>
        </div>

        {/* Timezone */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Timezone:</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleGeneralChange('timezone', e.target.value)}
            className="w-full sm:w-3/4 bg-[#2a2a3f] text-white rounded px-3 py-2"
          >
            <option value="UTC">UTC</option>
            <option value="GMT">GMT</option>
            <option value="EST">EST</option>
            <option value="PST">PST</option>
            <option value="CET">CET</option>
          </select>
        </div>
      </section>

      {/* --- Playback Section */}
      <section className="bg-[#292940] p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaMusic /> Playback
        </h3>

        {/* Quality */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Audio Quality:</label>
          <select
            value={settings.playback.quality}
            onChange={(e) => handlePlaybackChange('quality', e.target.value)}
            className="w-full sm:w-3/4 bg-[#2a2a3f] text-white rounded px-3 py-2"
          >
            <option value="low">Low (96kbps)</option>
            <option value="medium">Medium (160kbps)</option>
            <option value="high">High (320kbps)</option>
            <option value="lossless">Lossless</option>
          </select>
        </div>

        {/* Crossfade */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Crossfade (sec):</label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={settings.playback.crossfade}
            onChange={(e) => handlePlaybackChange('crossfade', parseInt(e.target.value, 10))}
            className="w-full sm:w-3/4 accent-accent"
          />
          <span className="w-12 text-white text-center">
            {settings.playback.crossfade}s
          </span>
        </div>

        {/* Autoplay Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-gray-400">Autoplay next track:</label>
          <input
            type="checkbox"
            checked={settings.playback.autoplay}
            onChange={(e) => handlePlaybackChange('autoplay', e.target.checked)}
            className="toggle toggle-accent"
          />
        </div>

        {/* Gapless Toggle */}
        <div className="flex items-center justify-between">
          <label className="text-gray-400">Gapless playback:</label>
          <input
            type="checkbox"
            checked={settings.playback.gapless}
            onChange={(e) => handlePlaybackChange('gapless', e.target.checked)}
            className="toggle toggle-accent"
          />
        </div>
      </section>

      {/* --- Appearance Section */}
      <section className="bg-[#292940] p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          Appearance
        </h3>

        {/* Accent Color Picker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Accent Color:</label>
          <input
            type="color"
            value={settings.appearance.accentColor}
            onChange={(e) =>
              handleAppearanceChange('accentColor', e.target.value)
            }
            className="w-full sm:w-1/4 h-10 p-0 border-none cursor-pointer"
          />
        </div>

        {/* Font Size */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Font Size:</label>
          <input
            type="range"
            min="12"
            max="24"
            step="1"
            value={settings.appearance.fontSize}
            onChange={(e) =>
              handleAppearanceChange('fontSize', parseInt(e.target.value, 10))
            }
            className="w-full sm:w-3/4 accent-accent"
          />
          <span className="w-12 text-white text-center">
            {settings.appearance.fontSize}px
          </span>
        </div>

        {/* Layout */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Layout:</label>
          <select
            value={settings.appearance.layout}
            onChange={(e) =>
              handleAppearanceChange('layout', e.target.value)
            }
            className="w-full sm:w-3/4 bg-[#2a2a3f] text-white rounded px-3 py-2"
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </section>

      {/* --- Notifications Section */}
      <section className="bg-[#292940] p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaBell /> Notifications
        </h3>

        {/* New Releases */}
        <div className="flex items-center justify-between">
          <label className="text-gray-400">New Releases:</label>
          <input
            type="checkbox"
            checked={settings.notifications.newReleases}
            onChange={(e) =>
              handleNotificationsChange('newReleases', e.target.checked)
            }
            className="toggle toggle-accent"
          />
        </div>

        {/* Updates */}
        <div className="flex items-center justify-between">
          <label className="text-gray-400">App Updates:</label>
          <input
            type="checkbox"
            checked={settings.notifications.updates}
            onChange={(e) =>
              handleNotificationsChange('updates', e.target.checked)
            }
            className="toggle toggle-accent"
          />
        </div>

        {/* Social */}
        <div className="flex items-center justify-between">
          <label className="text-gray-400">Social Mentions:</label>
          <input
            type="checkbox"
            checked={settings.notifications.social}
            onChange={(e) =>
              handleNotificationsChange('social', e.target.checked)
            }
            className="toggle toggle-accent"
          />
        </div>

        {/* Marketing Emails */}
        <div className="flex items-center justify-between">
          <label className="text-gray-400">Marketing Emails:</label>
          <input
            type="checkbox"
            checked={settings.notifications.marketingEmails}
            onChange={(e) =>
              handleNotificationsChange('marketingEmails', e.target.checked)
            }
            className="toggle toggle-accent"
          />
        </div>
      </section>

      {/* --- Account Section */}
      <section className="bg-[#292940] p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaUserShield /> Account
        </h3>

        {/* Email */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Email:</label>
          <input
            type="email"
            value={settings.account.email}
            onChange={(e) =>
              handleAccountChange('email', e.target.value)
            }
            className="w-full sm:w-3/4 bg-[#2a2a3f] text-white rounded px-3 py-2"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="w-full sm:w-1/4 text-gray-400">Password:</label>
          <input
            type="password"
            placeholder="••••••••"
            value={settings.account.password}
            onChange={(e) =>
              handleAccountChange('password', e.target.value)
            }
            className="w-full sm:w-3/4 bg-[#2a2a3f] text-white rounded px-3 py-2"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-accent hover:bg-[#ff6e98] text-white px-6 py-2 rounded-full transition"
          >
            Save Changes
          </button>
        </div>
      </section>

      {/* --- Danger Zone */}
      <section className="bg-[#3e1f31] p-6 rounded-xl space-y-4">
        <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
          <FaTrashAlt /> Danger Zone
        </h3>
        <p className="text-gray-300">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button
          onClick={handleDeleteAccount}
          className={`w-full ${
            confirmDelete
              ? 'bg-red-700 hover:bg-red-800'
              : 'bg-red-500 hover:bg-red-600'
          } text-white px-4 py-2 rounded transition`}
        >
          {confirmDelete ? 'Confirm Delete Account' : 'Delete Account'}
        </button>
      </section>
    </div>
  );
};

export default Settings;