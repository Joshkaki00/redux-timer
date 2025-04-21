import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTimer } from "../features/timers/TimerSlice";
import TimerCard from "./TimerCard";
import './TimerBoard.css'

function TimerBoard() {
  const timers = useSelector((state) => state.timers);
  const runningTimers = useSelector((state) => 
    state.timers.filter(timer => timer.isRunning).length
  );
  const dispatch = useDispatch();

  const handleAddTimer = () => {
    const label = prompt("Enter a timer label:") || "New Timer";
    dispatch(addTimer(label));
  };

  return (
    <div className="timer-board">
      <div className="timer-board-header">
        <div className="timer-stats">
          <h2>All Timers ({timers.length})</h2>
          <p className="running-timers">Running: {runningTimers}</p>
        </div>
        <button className="add-timer-btn" onClick={handleAddTimer}>Add Timer</button>
      </div>
      <div className="timer-list">
        {timers.map((timer) => (
          <TimerCard key={timer.id} timer={timer} />
        ))}
      </div>
    </div>
  );
}

export default TimerBoard; 