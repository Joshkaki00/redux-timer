import { configureStore } from "@reduxjs/toolkit";
import timersReducer from "../features/timers/TimerSlice";
import { loadState, saveState, startAutoSave, stopAutoSave } from "../utils/localStorage";

const preloadedState = loadState();

const logger = (store) => (next) => (action) => {
  console.group(action.type);
  console.info('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

export const store = configureStore({
  reducer: {
    timers: timersReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(logger),
  preloadedState,
});

// Subscribe to store changes for persistence
store.subscribe(() => {
  const state = store.getState();
  saveState({ timers: state.timers });
});

// Start auto-save on store initialization
startAutoSave(store.getState());

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  stopAutoSave();
  saveState(store.getState());
}); 