import React, { useState, useEffect } from 'react';
import axiosInstance from '../components/axiosInstance';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axiosInstance.get('/user/all');
                setUsers(res.data);
            } catch (err) {
                toast.error('Failed to fetch users');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '40px', minHeight: '90vh', background: '#f4f7fa', color: '#333' }}>
            <h1 style={{ marginBottom: '30px', fontWeight: '500', color: '#1e293b' }}>All users</h1>
            
            {loading ? (
                <p>Loading users...</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {users.map(user => (
                        <div key={user._id} className="admin-card" style={cardStyle}>
                            <div style={fieldStyle}><span style={labelStyle}>User id</span> {user._id}</div>
                            <div style={fieldStyle}><span style={labelStyle}>Username</span> {user.username || user.name}</div>
                            <div style={fieldStyle}><span style={labelStyle}>Email</span> {user.email}</div>
                            <div style={fieldStyle}><span style={labelStyle}>Balance</span> {user.balance.toFixed(0)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const cardStyle = {
    background: 'white',
    padding: '20px 30px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '40px',
    flexWrap: 'wrap'
};

const fieldStyle = {
    display: 'flex',
    gap: '10px',
    fontSize: '0.95rem',
    color: '#07589e',
    fontWeight: '500'
};

const labelStyle = {
    color: '#64748b',
    fontWeight: '400'
};

export default AdminUsers;
