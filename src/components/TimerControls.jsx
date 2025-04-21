import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importTimers, setIsSaving } from '../features/timers/TimerSlice';
import { exportTimers, importTimers as importTimersUtil } from '../utils/localStorage';

const TimerControls = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { lastSaved, isSaving } = useSelector((state) => state.timers);

  const handleExport = () => {
    const state = useSelector((state) => state.timers);
    exportTimers(state);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      dispatch(setIsSaving(true));
      const importedData = await importTimersUtil(file);
      dispatch(importTimers(importedData.timers));
      dispatch(setLastSaved(new Date().toISOString()));
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import timers. Please check the file format.');
    } finally {
      dispatch(setIsSaving(false));
    }
  };

  return (
    <div className="timer-controls-container">
      <div className="save-status">
        {isSaving ? (
          <span className="saving-indicator">Saving...</span>
        ) : lastSaved ? (
          <span className="last-saved">
            Last saved: {new Date(lastSaved).toLocaleTimeString()}
          </span>
        ) : null}
      </div>
      
      <div className="import-export-controls">
        <button 
          className="control-btn export-btn"
          onClick={handleExport}
          disabled={isSaving}
        >
          Export Timers
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImport}
          accept=".json"
          style={{ display: 'none' }}
        />
        
        <button
          className="control-btn import-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSaving}
        >
          Import Timers
        </button>
      </div>
    </div>
  );
};

export default TimerControls; 