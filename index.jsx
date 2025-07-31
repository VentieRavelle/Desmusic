// src/main.jsx (или index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

// После полной загрузки страницы «включаем» видимость
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});