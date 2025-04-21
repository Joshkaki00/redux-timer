import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTimer } from '../features/timers/TimerSlice';

const NewTimerForm = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.timers.categories);
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState('Other');
  const [countdownFrom, setCountdownFrom] = useState(0);
  const [isCountdown, setIsCountdown] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    dispatch(addTimer({
      label: label.trim(),
      category,
      countdownFrom: isCountdown ? countdownFrom * 60000 : 0 // Convert minutes to milliseconds
    }));

    setLabel('');
    setCategory('Other');
    setCountdownFrom(0);
    setIsCountdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className="new-timer-form">
      <div className="form-group">
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Timer label"
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={isCountdown}
            onChange={(e) => setIsCountdown(e.target.checked)}
          />
          Countdown Timer
        </label>
      </div>

      {isCountdown && (
        <div className="form-group">
          <input
            type="number"
            value={countdownFrom}
            onChange={(e) => setCountdownFrom(Math.max(0, parseInt(e.target.value) || 0))}
            placeholder="Duration (minutes)"
            className="form-input"
            min="1"
          />
        </div>
      )}

      <button type="submit" className="form-submit">
        Add Timer
      </button>
    </form>
  );
};

export default NewTimerForm; 