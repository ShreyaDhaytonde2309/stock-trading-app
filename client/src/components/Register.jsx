import React, { useState, useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(GeneralContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            toast.success('Registration successful');
            navigate('/home');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Registration failed';
            toast.error(errorMsg);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass" style={{ width: '400px', padding: '40px' }}>
                <h2 style={{ marginBottom: '10px' }}>Join SB Stocks</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Start your trading journey today.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Full Name</label>
                        <div style={inputWrapper}>
                            <User size={18} style={iconStyle} />
                            <input type="text" style={inputStyle} value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                    </div>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Email Address</label>
                        <div style={inputWrapper}>
                            <Mail size={18} style={iconStyle} />
                            <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Password</label>
                        <div style={inputWrapper}>
                            <Lock size={18} style={iconStyle} />
                            <input type="password" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', justifyContent: 'center' }}>
                        Create Account <ArrowRight size={20} />
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '15px' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '600' }}>Log in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

const inputGroup = { display: 'flex', flexDirection: 'column', gap: '8px' };
const labelStyle = { fontSize: '0.8rem', color: '#64748b', fontWeight: '500' };
const inputWrapper = { position: 'relative' };
const iconStyle = { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' };
const inputStyle = { width: '100%', padding: '12px 15px 12px 45px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#1e293b', outline: 'none', fontSize: '1rem' };

export default Register;
