import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';

export const GeneralContext = createContext();

export const GeneralContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
        fetchStocks();
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await axiosInstance.get('/user/profile');
            setUser(res.data);
        } catch (err) {
            localStorage.removeItem('token');
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchStocks = async () => {
        try {
            const res = await axiosInstance.get('/stock');
            setStocks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const login = async (email, password) => {
        const res = await axiosInstance.post('/user/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (username, email, password) => {
        const res = await axiosInstance.post('/user/register', { username, email, password });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <GeneralContext.Provider value={{
            user, token, stocks, loading,
            login, register, logout, fetchUser, fetchStocks
        }}>
            {children}
        </GeneralContext.Provider>
    );
};
