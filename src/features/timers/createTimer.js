export function createTimer(label = "Untitled Timer") {
  return {
    id: Date.now(),
    label,
    startTime: Date.now(),
    elapsed: 0,
    isRunning: true,
  };
} 