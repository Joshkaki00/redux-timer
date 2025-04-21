import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { pauseTimer, resumeTimer, resetTimer, removeTimer, toggleLock, addLap, clearLaps } from "../features/timers/TimerSlice";
import { formatTime, formatTimeWithUnits } from "../utils/formatTime";
import './TimerCard.css'

const TimerCard = ({ timer }) => {
  const dispatch = useDispatch();
  const [displayTime, setDisplayTime] = useState(timer.elapsed);
  const [updateInterval, setUpdateInterval] = useState(1000);
  const [showTooltip, setShowTooltip] = useState(false);
  const [locale, setLocale] = useState('en-US');
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(timer.label);

  useEffect(() => {
    let interval = null;

    if (timer.isRunning) {
      interval = setInterval(() => {
        const now = Date.now();
        const newElapsed = now - timer.startTime + timer.elapsed;
        setDisplayTime(newElapsed);
        
        // Check if countdown has reached zero
        if (timer.countdownFrom > 0 && newElapsed >= timer.countdownFrom) {
          dispatch(pauseTimer(timer.id));
          // Play notification sound
          new Audio('/notification.mp3').play().catch(() => {});
        }
      }, 100);
    } else {
      setDisplayTime(timer.elapsed);
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.startTime, timer.elapsed, timer.countdownFrom, dispatch, timer.id]);

  const handlePause = () => dispatch(pauseTimer(timer.id));
  const handleResume = () => dispatch(resumeTimer(timer.id));
  const handleReset = () => dispatch(resetTimer(timer.id));
  const handleRemove = () => {
    if (window.confirm('Are you sure you want to remove this timer?')) {
      dispatch(removeTimer(timer.id));
    }
  };

  const handleLabelSubmit = (e) => {
    e.preventDefault();
    if (editLabel.trim()) {
      dispatch(updateTimer({ id: timer.id, label: editLabel.trim() }));
    }
    setIsEditing(false);
  };

  const timeToDisplay = timer.countdownFrom > 0
    ? Math.max(0, timer.countdownFrom - displayTime)
    : displayTime;

  const isLongRunning = displayTime > 5 * 60 * 1000; // 5 minutes
  const isHourPlus = displayTime > 60 * 60 * 1000; // 1 hour

  return (
    <div className={`timer-card ${isLongRunning ? 'long-running' : ''} ${isHourPlus ? 'hour-plus' : ''} ${timer.isLocked ? 'locked' : ''}`}>
      <div className="timer-header">
        {isEditing ? (
          <form onSubmit={handleLabelSubmit} className="edit-form">
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              className="edit-input"
              autoFocus
              onBlur={handleLabelSubmit}
            />
          </form>
        ) : (
          <h3 
            className="timer-label"
            onDoubleClick={() => !timer.isLocked && setIsEditing(true)}
          >
            {timer.label}
          </h3>
        )}
        <div className="timer-header-controls">
          <span className={`timer-category ${timer.category.toLowerCase()}`}>
            {timer.category}
          </span>
          <button
            className={`lock-btn ${timer.isLocked ? 'locked' : ''}`}
            onClick={() => dispatch(toggleLock(timer.id))}
            title={timer.isLocked ? 'Unlock timer' : 'Lock timer'}
          >
            {timer.isLocked ? '🔒' : '🔓'}
          </button>
        </div>
      </div>
      <div 
        className="timer-display"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="timer-time">
          {formatTime(timeToDisplay)}
          {timer.countdownFrom > 0 && ' ⏱️'}
        </span>
        {showTooltip && (
          <div className="timer-tooltip">
            {formatTimeWithUnits(timeToDisplay)}
            <br />
            {timeToDisplay}ms
          </div>
        )}
      </div>
      <div className="timer-controls">
        <div className="timer-buttons">
          {timer.isRunning ? (
            <button 
              className="timer-btn pause-btn"
              onClick={handlePause}
              disabled={timer.isLocked}
            >
              ⏸️ Pause
            </button>
          ) : (
            <button 
              className="timer-btn resume-btn"
              onClick={handleResume}
              disabled={timer.isLocked}
            >
              ▶️ Resume
            </button>
          )}
          <button 
            className="timer-btn reset-btn"
            onClick={handleReset}
            disabled={timer.isLocked}
          >
            �� Reset
          </button>
          <button 
            className="timer-btn lap-btn"
            onClick={() => dispatch(addLap(timer.id))}
            disabled={!timer.isRunning || timer.isLocked}
          >
            ⏱️ Lap
          </button>
          <button 
            className="timer-btn remove-btn"
            onClick={handleRemove}
            disabled={timer.isLocked}
          >
            🗑️ Remove
          </button>
        </div>
        {timer.laps.length > 0 && (
          <div className="laps-container">
            <div className="laps-header">
              <h4>Laps</h4>
              <button 
                className="clear-laps-btn"
                onClick={() => dispatch(clearLaps(timer.id))}
                disabled={timer.isLocked}
              >
                Clear
              </button>
            </div>
            <ul className="laps-list">
              {timer.laps.map((lap, index) => (
                <li key={lap.timestamp} className="lap-item">
                  <span className="lap-number">#{timer.laps.length - index}</span>
                  <span className="lap-time">{formatTime(lap.time)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="timer-settings">
          <label>
            Update Speed:
            <select 
              value={updateInterval} 
              onChange={(e) => setUpdateInterval(Number(e.target.value))}
              className="interval-select"
            >
              <option value={1000}>1 second</option>
              <option value={500}>0.5 seconds</option>
              <option value={100}>0.1 seconds</option>
            </select>
          </label>
          <label>
            Format:
            <select 
              value={locale} 
              onChange={(e) => setLocale(e.target.value)}
              className="locale-select"
            >
              <option value="en-US">English (US)</option>
              <option value="de-DE">German</option>
              <option value="fr-FR">French</option>
              <option value="ja-JP">Japanese</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};

export default TimerCard; 