import React from 'react';
import './App.css';
import { AppProvider } from './context/AppContext';
import { TelegramProvider } from './context/TelegramContext';
import AppComponent from './AppComponent';

function App() {
  return (
    <TelegramProvider>
      <AppProvider>
        <AppComponent />
      </AppProvider>
    </TelegramProvider>
  );
}

export default App;
