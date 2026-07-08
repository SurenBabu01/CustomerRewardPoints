import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';

/**
 * Application entry point.
 * Renders the App component into the root DOM element.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
