import { configureStore } from "@reduxjs/toolkit"
import repositoriesReducer from "./repositoriesSlice"

export const store = configureStore({
  reducer: {
    repositories: repositoriesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

