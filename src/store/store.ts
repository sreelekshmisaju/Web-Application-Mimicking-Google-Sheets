import { configureStore } from '@reduxjs/toolkit';
import spreadsheetReducer from './spreadsheetSlice';

export const store = configureStore({
  reducer: {
    spreadsheet: spreadsheetReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;