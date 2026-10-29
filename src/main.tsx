import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
// Font tự chứa (không phụ thuộc Google Fonts): Playfair Display cho tiêu đề, Be Vietnam Pro cho chữ thường
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700-italic.css';
import '@fontsource/be-vietnam-pro/300.css';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/600.css';
import '@fontsource/be-vietnam-pro/700.css';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
