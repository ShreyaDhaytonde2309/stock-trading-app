import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, register } from '../slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';

const AuthPage = ({ type }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (type === 'login') {
                await dispatch(login(formData)).unwrap();
                toast.success('Welcome back!');
            } else {
                await dispatch(register(formData)).unwrap();
                toast.success('Account created successfully!');
            }
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Authentication failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '40px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
                    {type === 'login' ? 'Please enter your details to sign in.' : 'Join SB Stocks today and start trading.'}
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {type === 'register' && (
                        <div className="input-group">
                            <label style={labelStyle}>Full Name</label>
                            <div style={inputWrapperStyle}>
                                <User size={18} style={iconStyle} />
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    style={inputStyle}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-group">
                        <label style={labelStyle}>Email Address</label>
                        <div style={inputWrapperStyle}>
                            <Mail size={18} style={iconStyle} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                style={inputStyle}
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={labelStyle}>Password</label>
                        <div style={inputWrapperStyle}>
                            <Lock size={18} style={iconStyle} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={inputStyle}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '15px', justifyContent: 'center', marginTop: '10px' }}>
                        {type === 'login' ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '25px', color: 'var(--text-secondary)' }}>
                    {type === 'login' ? "Don't have an account?" : "Already have an account?"} {' '}
                    <Link to={type === 'login' ? '/register' : '/login'} style={{ color: 'var(--accent)', fontWeight: '600', textDecoration: 'none' }}>
                        {type === 'login' ? 'Create one' : 'Sign in'}
                    </Link>
                </p>
            </div>
        </div>
    );
};

const labelStyle = { fontSize: '0.875rem', fontWeight: '500', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' };
const inputWrapperStyle = { position: 'relative' };
const iconStyle = { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' };
const inputStyle = {
    width: '100%',
    padding: '12px 15px 12px 45px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--glass-border)',
    borderRadius: '10px',
    color: 'white',
    outline: 'none',
    transition: 'border-color 0.2s'
};

export default AuthPage;
