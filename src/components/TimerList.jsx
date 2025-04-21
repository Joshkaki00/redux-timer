import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TimerCard from './TimerCard';
import { pauseAll, resumeAll, resetAll } from '../features/timers/TimerSlice';
import './TimerList.css';

const TimerList = () => {
  const dispatch = useDispatch();
  const timers = useSelector((state) => state.timers.timers);
  const categories = useSelector((state) => state.timers.categories);

  const handlePauseAll = () => {
    dispatch(pauseAll());
  };

  const handleResumeAll = () => {
    dispatch(resumeAll());
  };

  const handleResetAll = () => {
    if (window.confirm('Are you sure you want to reset all timers?')) {
      dispatch(resetAll());
    }
  };

  return (
    <div className="timer-list">
      <div className="global-controls">
        <button className="global-btn pause-all-btn" onClick={handlePauseAll}>
          ⏸️ Pause All
        </button>
        <button className="global-btn resume-all-btn" onClick={handleResumeAll}>
          ▶️ Resume All
        </button>
        <button className="global-btn reset-all-btn" onClick={handleResetAll}>
          🔄 Reset All
        </button>
      </div>

      <div className="timers-grid">
        {timers.map((timer) => (
          <TimerCard key={timer.id} timer={timer} />
        ))}
      </div>

      {timers.length === 0 && (
        <div className="empty-state">
          <p>No timers yet. Add a new timer to get started!</p>
        </div>
      )}
    </div>
  );
};

export default TimerList; 