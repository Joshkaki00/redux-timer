export const selectAllTimers = (state) => state.timers;

export const selectSortedTimers = (state) => {
  return [...state.timers].sort((a, b) => b.startTime - a.startTime);
};

export const selectRunningTimers = (state) => {
  return state.timers.filter(timer => timer.isRunning);
};

export const selectPausedTimers = (state) => {
  return state.timers.filter(timer => !timer.isRunning);
}; 