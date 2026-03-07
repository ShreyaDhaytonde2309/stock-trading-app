import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stockReducer from './slices/stockSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        stocks: stockReducer,
    },
});
