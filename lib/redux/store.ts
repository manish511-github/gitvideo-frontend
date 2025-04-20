import { configureStore } from "@reduxjs/toolkit"
import repositoriesReducer from "./repositoriesSlice"
import commitMetadataReducer from './commitMetadataSlice';


export const store = configureStore({
  reducer: {
    repositories: repositoriesReducer,
    commitMetadata: commitMetadataReducer

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

