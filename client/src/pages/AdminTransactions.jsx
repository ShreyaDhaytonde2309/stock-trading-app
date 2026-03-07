import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';
import { toast } from 'react-toastify';

const AdminTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axiosInstance.get('/transaction/all');
                setTransactions(res.data);
            } catch (err) {
                toast.error('Failed to fetch transactions');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    return (
        <div style={{ padding: '40px', minHeight: '90vh', background: '#f4f7fa', color: '#333' }}>
            <h1 style={{ marginBottom: '30px', fontWeight: '500', color: '#1e293b' }}>All Transactions</h1>
            
            {loading ? (
                <p>Loading transactions...</p>
            ) : (
                <div style={tableContainer}>
                    <div style={tableHeader}>
                        <div style={{ flex: 1.5 }}>Transaction Id</div>
                        <div style={{ flex: 1.5 }}>User Id</div>
                        <div style={{ flex: 1 }}>Amount</div>
                        <div style={{ flex: 1 }}>Action</div>
                        <div style={{ flex: 1 }}>Payment mode</div>
                        <div style={{ flex: 2 }}>Time</div>
                    </div>
                    {transactions.map(tx => (
                        <div key={tx._id} style={tableRow}>
                            <div style={{ flex: 1.5, fontSize: '0.8rem', color: '#07589e' }}>{tx._id}</div>
                            <div style={{ flex: 1.5, fontSize: '0.8rem' }}>{tx.user?._id || tx.user}</div>
                            <div style={{ flex: 1, fontWeight: '600' }}>${tx.amount?.toFixed(0)}</div>
                            <div style={{ flex: 1 }}>{tx.type === 'BUY' ? 'Buy Stock' : tx.type === 'SELL' ? 'Sell Stock' : 'Deposit'}</div>
                            <div style={{ flex: 1 }}>card</div>
                            <div style={{ flex: 2, color: '#64748b' }}>{new Date(tx.createdAt).toString().split(' GMT')[0]}</div>
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

export default AdminTransactions;
