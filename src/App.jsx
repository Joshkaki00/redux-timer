import React from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import TimerList from './components/TimerList';
import TimerControls from './components/TimerControls';
import ThemeToggle from './components/ThemeToggle';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <ThemeToggle />
        <h1>Timer App</h1>
        <TimerControls />
        <TimerList />
      </div>
    </Provider>
  );
}

export default App;
