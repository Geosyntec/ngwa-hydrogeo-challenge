import { configureStore } from '@reduxjs/toolkit'
import scenarioReducer from '../features/scenario/ScenarioSlice'
import flowDirectionReducer from '../features/scenario/flowDirection/flowSlice'
import gradientReducer from '../features/scenario/gradient/gradientSlice'
import velocityReducer from '../features/scenario/velocity/velocitySlice'


export const store = configureStore({
  reducer: {
    scenario: scenarioReducer,
    flowDirection: flowDirectionReducer,
    gradient: gradientReducer,
    velocity: velocityReducer,

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
