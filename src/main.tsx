import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <div className="attribution">
      <span className="unsplash">
        Photo by{' '}
        <a href="https://unsplash.com/@mischievous_penguins?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Casey Horner
        </a>{' '}
        on{' '}
        <a href="https://unsplash.com/photos/wKjIeK4QSnk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Unsplash
        </a>
      </span>
      <span className="vecteezy">
        <a href="https://www.vecteezy.com/free-vector/weather-icon-set">Weather Icon Set Vectors by Vecteezy</a>
      </span>
    </div>
  </React.StrictMode>,
);
