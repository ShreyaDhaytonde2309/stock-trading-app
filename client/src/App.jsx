import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GeneralContextProvider, GeneralContext } from './context/GeneralContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components & Pages
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Portfolio from './pages/PortfolioPage';
import History from './pages/OrdersPage';
import Profile from './pages/Profile';
import StockDetail from './pages/StockDetail';
import Admin from './pages/Admin';
import AdminUsers from './pages/AdminUsers';
import AdminOrders from './pages/AdminOrders';
import AdminTransactions from './pages/AdminTransactions';
import AdminStockDetail from './pages/AdminStockDetail';

const PrivateRoute = ({ children }) => {
    const { token, loading } = useContext(GeneralContext);
    if (loading) return <div className="loading">Checking session...</div>;
    return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(GeneralContext);
    if (loading) return <div className="loading">Checking authority...</div>;
    return user?.role === 'admin' ? children : <Navigate to="/home" />;
};

function App() {
    return (
        <GeneralContextProvider>
            <Router>
                <div className="app-container" style={{ flexDirection: 'column' }}>
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                            <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
                            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
                            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                            <Route path="/stock/:symbol" element={<PrivateRoute><StockDetail /></PrivateRoute>} />
                            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
                            <Route path="/admin-users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
                            <Route path="/admin-orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                            <Route path="/admin-transactions" element={<AdminRoute><AdminTransactions /></AdminRoute>} />
                            <Route path="/admin-stock/:symbol" element={<AdminRoute><AdminStockDetail /></AdminRoute>} />
                        </Routes>
                    </main>
                    <ToastContainer theme="dark" position="bottom-right" />
                </div>
            </Router>
        </GeneralContextProvider>
    );
}

export default App;
