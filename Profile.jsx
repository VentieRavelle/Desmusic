// src/components/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Profile({ userData, onUpdate }) {
  const [form, setForm] = useState(userData);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setForm(userData);
  }, [userData]);

  const handleTextChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm(f => ({ ...f, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onUpdate(form);
    navigate(-1);        // возвращаемся на предыдущую страницу
  };

  const handleCancel = () => {
    navigate(-1);        // просто уходим назад без изменений
  };

  return (
    <div className="profile-edit p-4 bg-white rounded shadow-md">
      <h2 className="text-xl mb-4">Редактировать профиль</h2>

      <div className="flex items-center mb-4">
        <img src={form.avatar} alt="avatar" className="w-20 h-20 rounded-full" />
        <label className="ml-4 cursor-pointer text-blue-600">
          Загрузить
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleAvatarSelect}
            className="hidden"
          />
        </label>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Никнейм</label>
        <input
          name="name"
          value={form.name}
          onChange={handleTextChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 bg-blue-600 text-white py-2 rounded"
        >
          Сохранить
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 bg-gray-300 py-2 rounded"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}