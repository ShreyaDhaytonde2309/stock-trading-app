import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';
import { toast } from 'react-toastify';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1100);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1100);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axiosInstance.get('/transaction/my');
                // Filter out deposits, only show stock orders
                setOrders(res.data.filter(t => t.type !== 'DEPOSIT'));
            } catch (err) {
                toast.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div style={{ padding: isMobile ? '20px 15px' : '40px', minHeight: '90vh', background: '#f4f7fa' }}>
            <h1 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '30px' }}>My Orders</h1>
            
            {loading ? (
                <p style={{ textAlign: 'center', padding: '50px' }}>Loading orders...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => (
                        <div key={order._id} style={{ ...orderCardStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '15px' : '30px' }}>
                            <div style={badgeStyle}>{order.type === 'BUY' ? 'Buy Order' : 'Sell Order'}</div>
                            <div style={{ flex: 2 }}>
                                <div style={labelSmall}>Stock name</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{order.stockName || order.stockSymbol}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>Symbol</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{order.stockSymbol}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>Stocks</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{order.quantity}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>order price</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>${order.price?.toFixed(3)}</div>
                            </div>
                            <div style={{ flex: 1.5 }}>
                                <div style={labelSmall}>total value</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>${(order.quantity * order.price).toFixed(2)}</div>
                            </div>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
                                <div style={labelSmall}>status</div>
                                <div style={{ fontWeight: '700', color: '#22c55e' }}>Completed</div>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '50px' }}>No stock orders found in your history.</p>}
                </div>
            )}
        </div>
    );
};

const orderCardStyle = { background: 'white', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', display: 'flex', border: '1px solid #f8fafc' };
const badgeStyle = { background: '#f1f5f9', color: '#07589e', padding: '8px 15px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '700', minWidth: '100px', textAlign: 'center' };
const labelSmall = { fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' };

export default OrdersPage;
