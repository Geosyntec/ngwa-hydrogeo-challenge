import { configureStore } from '@reduxjs/toolkit'
import scenarioReducer from '../features/scenario/ScenarioSlice'

export const store = configureStore({
  reducer: {
    scenario: scenarioReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
