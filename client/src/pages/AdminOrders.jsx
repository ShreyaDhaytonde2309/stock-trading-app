import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';
import { toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get('/order/all');
                setOrders(res.data);
            } catch (err) {
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: '40px', minHeight: '90vh', background: '#f4f7fa', color: '#333' }}>
            <h1 style={{ marginBottom: '30px', fontWeight: '500', color: '#1e293b' }}>Global Orders</h1>
            
            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <div style={tableContainer}>
                    <div style={tableHeader}>
                        <div style={{ flex: 2 }}>UserId</div>
                        <div style={{ flex: 1 }}>Order Type</div>
                        <div style={{ flex: 2 }}>Stock name</div>
                        <div style={{ flex: 1 }}>Symbol</div>
                        <div style={{ flex: 1 }}>Order type</div>
                        <div style={{ flex: 1 }}>Stocks</div>
                        <div style={{ flex: 1 }}>order price</div>
                        <div style={{ flex: 1.5 }}>order total value</div>
                        <div style={{ flex: 1 }}>order status</div>
                    </div>
                    {orders.map(order => (
                        <div key={order._id} style={tableRow}>
                            <div style={{ flex: 2, fontSize: '0.8rem' }}>{order.user?._id || order.user}</div>
                            <div style={{ flex: 1 }}>Intraday</div>
                            <div style={{ flex: 2 }}>{order.stockName || 'N/A'}</div>
                            <div style={{ flex: 1 }}>{order.stockSymbol}</div>
                            <div style={{ flex: 1 }}>{order.type}</div>
                            <div style={{ flex: 1 }}>{order.quantity}</div>
                            <div style={{ flex: 1 }}>${order.price?.toFixed(2)}</div>
                            <div style={{ flex: 1.5 }}>${(order.quantity * order.price)?.toFixed(2)}</div>
                            <div style={{ flex: 1, color: '#22c55e', fontWeight: '600' }}>Completed</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const tableContainer = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    overflow: 'hidden'
};

const tableHeader = {
    display: 'flex',
    padding: '20px 30px',
    background: '#fff',
    borderBottom: '1px solid #eee',
    fontSize: '0.85rem',
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center'
};

const tableRow = {
    display: 'flex',
    padding: '20px 30px',
    borderBottom: '1px solid #f8fafc',
    fontSize: '0.9rem',
    color: '#1e293b',
    alignItems: 'center',
    textAlign: 'center'
};

export default AdminOrders;
