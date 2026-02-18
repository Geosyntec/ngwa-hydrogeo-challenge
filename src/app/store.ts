import { configureStore } from '@reduxjs/toolkit'
import scenarioReducer from '../features/scenario/ScenarioSlice'
import flowDirectionReducer from '../features/scenario/flowDirection/flowSlice'
import gradientReducer from '../features/scenario/gradient/gradientSlice'
import velocityReducer from '../features/scenario/velocity/velocitySlice'
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    scenario: scenarioReducer,
    flowDirection: flowDirectionReducer,
    gradient: gradientReducer,
    velocity: velocityReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
