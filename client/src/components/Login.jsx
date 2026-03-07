import React, { useState, useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(GeneralContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            toast.success('Signed in successfully');
            navigate('/home');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Invalid credentials';
            toast.error(errorMsg);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass" style={{ width: '400px', padding: '40px' }}>
                <h2 style={{ marginBottom: '10px' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Sign in to continue trading.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                        Sign In <ArrowRight size={20} />
                    </button>
                    <p style={{ textAlign: 'center', marginTop: '15px' }}>
                        New here? <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '600' }}>Create account</Link>
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

export default Login;
