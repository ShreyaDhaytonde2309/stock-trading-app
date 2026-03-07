import React, { useContext, useState, useEffect } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import { Plus, Minus, History, CreditCard } from 'lucide-react';
import axiosInstance from '../components/axiosInstance';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, fetchUser } = useContext(GeneralContext);
    const [transactions, setTransactions] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchTxs = async () => {
            try {
                const res = await axiosInstance.get('/transaction/my');
                setTransactions(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTxs();
    }, []);

    const handleAddFunds = async () => {
        const amount = prompt('Enter amount to add:');
        if (!amount || isNaN(amount)) return;
        try {
            await axiosInstance.post('/transaction', { type: 'DEPOSIT', amount: Number(amount) });
            toast.success('Funds added!');
            fetchUser();
        } catch (err) {
            toast.error('Deposit failed');
        }
    };

    return (
        <div style={{ padding: isMobile ? '20px 15px' : '40px', minHeight: '90vh', background: '#f4f7fa' }}>
            <h1 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '600', color: '#1e293b', marginBottom: '30px' }}>My Account</h1>
            
            <div style={accountCard}>
                <div style={{ color: '#64748b', fontSize: '1rem', marginBottom: '20px' }}>{user?.username}'s Account</div>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'stretch' : 'center', gap: '25px' }}>
                    <div style={{ border: '1px solid #f1f5f9', background: 'white', padding: isMobile ? '20px' : '25px 40px', borderRadius: '12px', minWidth: isMobile ? 'auto' : '250px' }}>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Trading balance</div>
                        <div style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '700', color: '#1e293b' }}>${user?.balance?.toLocaleString()}</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: isMobile ? '100%' : '240px' }}>
                        <button onClick={handleAddFunds} style={primaryBtn}><Plus size={18} /> Add Funds</button>
                        <button onClick={() => toast.info('Withdrawal feature coming soon!')} style={outlineBtn}><Minus size={18} /> Withdraw</button>
                    </div>
                </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b', marginTop: '40px', marginBottom: '20px' }}>Recent Transactions</h2>
            <div style={tableContainer}>
                {!isMobile && (
                    <div style={tableHeader}>
                        <div style={{ flex: 1.5 }}>Amount</div>
                        <div style={{ flex: 1.5 }}>Action</div>
                        <div style={{ flex: 1.5 }}>Payment mode</div>
                        <div style={{ flex: 2.5 }}>Time</div>
                    </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {transactions.map(tx => (
                        <div key={tx._id} style={{ ...tableRow, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '10px' : '0' }}>
                            <div style={{ flex: 1.5, fontWeight: '700', color: tx.type === 'DEPOSIT' || tx.type === 'SELL' ? '#22c55e' : '#ef4444' }}>
                                {tx.type === 'BUY' ? '-' : '+'}${tx.amount?.toFixed(2) || (tx.quantity * tx.price).toFixed(2)}
                            </div>
                            <div style={{ flex: 1.5, fontWeight: '500' }}>{tx.type === 'BUY' ? 'Buy Stock' : tx.type === 'SELL' ? 'Sell Stock' : 'Deposit'}</div>
                            {!isMobile && <div style={{ flex: 1.5, color: '#64748b' }}>Bank/Card</div>}
                            <div style={{ flex: 2.5, color: '#94a3b8', fontSize: '0.85rem' }}>{new Date(tx.createdAt).toLocaleString()}</div>
                        </div>
                    ))}
                </div>
                {transactions.length === 0 && <p style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>No transactions recorded yet.</p>}
            </div>
        </div>
    );
};

const accountCard = { background: '#f8fafc', padding: '30px', borderRadius: '20px', border: '1px solid #f1f5f9' };
const outlineBtn = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#64748b', background: 'white', fontWeight: '600', cursor: 'pointer' };
const primaryBtn = { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '10px', border: 'none', color: 'white', background: '#3b49df', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

const tableContainer = { background: 'white', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', overflow: 'hidden' };
const tableHeader = { display: 'flex', padding: '15px 30px', background: '#fcfdfe', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase' };
const tableRow = { display: 'flex', padding: '15px 30px', borderBottom: '1px solid #f8fafc', color: '#1e293b', fontSize: '0.9rem' };

export default Profile;
