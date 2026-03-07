import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
};

export const loadUser = createAsyncThunk('auth/loadUser', async (_, { getState }) => {
    const token = getState().auth.token;
    if (!token) throw new Error('No token');

    const res = await axios.get('/api/user/profile', {
        headers: { 'x-auth-token': token }
    });
    return res.data;
});

export const login = createAsyncThunk('auth/login', async (formData) => {
    const res = await axios.post('/api/user/login', formData);
    return res.data;
});

export const register = createAsyncThunk('auth/register', async (formData) => {
    const res = await axios.post('/api/user/register', formData);
    return res.data;
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
            })
            .addCase(login.fulfilled, (state, action) => {
                localStorage.setItem('token', action.payload.token);
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(register.fulfilled, (state, action) => {
                localStorage.setItem('token', action.payload.token);
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase('stocks/tradeStock/fulfilled', (state, action) => {
                if (state.user && action.payload.user) {
                    state.user.balance = action.payload.user.balance;
                }
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
