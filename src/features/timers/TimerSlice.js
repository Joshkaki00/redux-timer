import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  timers: [],
  lastSaved: null,
  isSaving: false,
  categories: ['Work', 'Break', 'Study', 'Exercise', 'Other']
}

const timersSlice = createSlice({
  name: 'timers',
  initialState,
  reducers: {
    addTimer: (state, action) => {
      const { label, category = 'Other', countdownFrom = 0 } = action.payload
      state.timers.push({
        id: Date.now(),
        label,
        category,
        startTime: Date.now(),
        elapsed: 0,
        countdownFrom,
        isRunning: true,
        isLocked: false,
        laps: []
      })
    },
    pauseTimer: (state, action) => {
      const timer = state.timers.find((t) => t.id === action.payload)
      if (timer && timer.isRunning && !timer.isLocked) {
        timer.elapsed += Date.now() - timer.startTime
        timer.isRunning = false
      }
    },
    resumeTimer: (state, action) => {
      const timer = state.timers.find((t) => t.id === action.payload)
      if (timer && !timer.isRunning && !timer.isLocked) {
        timer.startTime = Date.now()
        timer.isRunning = true
      }
    },
    resetTimer: (state, action) => {
      const timer = state.timers.find((t) => t.id === action.payload)
      if (timer && !timer.isLocked) {
        timer.startTime = Date.now()
        timer.elapsed = 0
        timer.laps = []
      }
    },
    removeTimer: (state, action) => {
      const timer = state.timers.find((t) => t.id === action.payload)
      if (!timer?.isLocked) {
        state.timers = state.timers.filter((t) => t.id !== action.payload)
      }
    },
    setLastSaved: (state, action) => {
      state.lastSaved = action.payload
    },
    setIsSaving: (state, action) => {
      state.isSaving = action.payload
    },
    importTimers: (state, action) => {
      state.timers = action.payload
    },
    updateTimer: (state, action) => {
      const { id, label, category } = action.payload
      const timer = state.timers.find(t => t.id === id)
      if (timer && !timer.isLocked) {
        if (label) timer.label = label
        if (category) timer.category = category
      }
    },
    toggleLock: (state, action) => {
      const timer = state.timers.find(t => t.id === action.payload)
      if (timer) {
        timer.isLocked = !timer.isLocked
      }
    },
    addLap: (state, action) => {
      const timer = state.timers.find(t => t.id === action.payload)
      if (timer) {
        timer.laps.push({
          time: timer.elapsed + (timer.isRunning ? Date.now() - timer.startTime : 0),
          timestamp: Date.now()
        })
      }
    },
    clearLaps: (state, action) => {
      const timer = state.timers.find(t => t.id === action.payload)
      if (timer) {
        timer.laps = []
      }
    },
    setCountdown: (state, action) => {
      const { id, duration } = action.payload
      const timer = state.timers.find(t => t.id === id)
      if (timer && !timer.isLocked) {
        timer.countdownFrom = duration
        timer.elapsed = 0
        timer.startTime = Date.now()
      }
    },
    // Global controls
    pauseAll: (state) => {
      state.timers.forEach(timer => {
        if (timer.isRunning && !timer.isLocked) {
          timer.elapsed += Date.now() - timer.startTime
          timer.isRunning = false
        }
      })
    },
    resumeAll: (state) => {
      const now = Date.now()
      state.timers.forEach(timer => {
        if (!timer.isRunning && !timer.isLocked) {
          timer.startTime = now
          timer.isRunning = true
        }
      })
    },
    resetAll: (state) => {
      const now = Date.now()
      state.timers.forEach(timer => {
        if (!timer.isLocked) {
          timer.startTime = now
          timer.elapsed = 0
          timer.laps = []
        }
      })
    }
  }
})

export const {
  addTimer,
  pauseTimer,
  resumeTimer,
  resetTimer,
  removeTimer,
  setLastSaved,
  setIsSaving,
  importTimers,
  updateTimer,
  toggleLock,
  addLap,
  clearLaps,
  setCountdown,
  pauseAll,
  resumeAll,
  resetAll
} = timersSlice.actions

export default timersSlice.reducer 