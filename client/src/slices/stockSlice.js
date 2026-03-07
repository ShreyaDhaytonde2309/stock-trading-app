import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    stocks: [],
    portfolio: [],
    history: [],
    watchlist: [],
    loading: false,
};

export const fetchStocks = createAsyncThunk('stocks/fetchStocks', async () => {
    const res = await axios.get('/api/stock');
    return res.data;
});

export const fetchPortfolio = createAsyncThunk('stocks/fetchPortfolio', async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get('/api/transaction/portfolio', {
        headers: { 'x-auth-token': token }
    });
    return res.data;
});

export const tradeStock = createAsyncThunk('stocks/tradeStock', async ({ type, symbol, quantity, price }, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post(`/api/transaction`,
        { type, stockSymbol: symbol, quantity, price },
        { headers: { 'x-auth-token': token } }
    );
    return res.data;
});

export const fetchHistory = createAsyncThunk('stocks/fetchHistory', async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get('/api/transaction/my', {
        headers: { 'x-auth-token': token }
    });
    return res.data;
});

export const fetchWatchlist = createAsyncThunk('stocks/fetchWatchlist', async (_, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.get('/api/watchlist', {
        headers: { 'x-auth-token': token }
    });
    return res.data;
});

export const toggleWatchlist = createAsyncThunk('stocks/toggleWatchlist', async (stockId, { getState }) => {
    const token = getState().auth.token;
    const res = await axios.post('/api/watchlist/toggle', { stockId }, {
        headers: { 'x-auth-token': token }
    });
    return res.data;
});

const stockSlice = createSlice({
    name: 'stocks',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStocks.pending, (state) => { state.loading = true; })
            .addCase(fetchStocks.fulfilled, (state, action) => {
                state.loading = false;
                state.stocks = action.payload;
            })
            .addCase(fetchPortfolio.fulfilled, (state, action) => {
                state.portfolio = action.payload;
            })
            .addCase(fetchHistory.fulfilled, (state, action) => {
                state.history = action.payload;
            })
            .addCase(fetchWatchlist.fulfilled, (state, action) => {
                state.watchlist = action.payload.stocks;
            })
            .addCase(toggleWatchlist.fulfilled, (state, action) => {
                state.watchlist = action.payload.stocks;
            });
    },
});

export default stockSlice.reducer;
