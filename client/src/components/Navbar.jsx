import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GeneralContext } from '../context/GeneralContext';
import { TrendingUp, LogOut, Menu, X, Home, Briefcase, History, User, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(GeneralContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

    const isAdminPage = location.pathname.startsWith('/admin');

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 900);
            if (window.innerWidth >= 900) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = isAdminPage ? [
        { label: 'Dashboard', path: '/admin', icon: <Home size={18}/> },
        { label: 'Users', path: '/admin-users', icon: <User size={18}/> },
        { label: 'Orders', path: '/admin-orders', icon: <Briefcase size={18}/> },
        { label: 'Transactions', path: '/admin-transactions', icon: <History size={18}/> },
    ] : [
        { label: 'Home', path: '/home', icon: <Home size={18}/> },
        { label: 'Portfolio', path: '/portfolio', icon: <Briefcase size={18}/> },
        { label: 'History', path: '/history', icon: <History size={18}/> },
        { label: 'Profile', path: '/profile', icon: <User size={18}/> },
    ];

    if (!user) {
        return (
            <nav style={guestNavStyle}>
                <Link to="/" style={logoStyle}>
                    <div style={logoIconStyle}><TrendingUp color="white" size={20} /></div>
                    <span style={logoText}>SB STOCKS</span>
                </Link>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link to="/login" className="btn btn-outline" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Login</Link>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Join Now</Link>
                </div>
            </nav>
        );
    }

    return (
        <nav style={authNavStyle}>
            <Link to={isAdminPage ? '/admin' : '/home'} style={{ textDecoration: 'none', color: 'white' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                    {isAdminPage ? 'SB Stocks Admin' : 'SB Stocks'}
                </h2>
            </Link>

            {/* Desktop Links */}
            {!isMobile && (
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    {navLinks.map(link => (
                        <Link key={link.path} to={link.path} style={{ ...navItemStyle, opacity: location.pathname === link.path ? 1 : 0.7 }}>
                            {link.label}
                        </Link>
                    ))}
                    <div style={balanceCard}>
                        <div style={{ fontSize: '0.65rem', opacity: 0.8 }}>BALANCE</div>
                        <div style={{ fontWeight: '700' }}>${user.balance?.toLocaleString()}</div>
                    </div>
                    <button onClick={handleLogout} style={logoutBtn}><LogOut size={18} /></button>
                </div>
            )}

            {/* Mobile Toggle */}
            {isMobile && (
                <button onClick={toggleMenu} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                    {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            )}

            {/* Mobile Menu Overlay */}
            {isMobile && isMenuOpen && (
                <div style={mobileMenuOverlay}>
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ ...balanceCard, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', width: '100%', marginBottom: '10px' }}>
                            <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>TRADING BALANCE</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>${user.balance?.toLocaleString()}</div>
                        </div>
                        {navLinks.map(link => (
                            <Link 
                                key={link.path} 
                                to={link.path} 
                                onClick={() => setIsMenuOpen(false)}
                                style={{ ...mobileNavItem, background: location.pathname === link.path ? 'rgba(255,255,255,0.1)' : 'transparent' }}
                            >
                                {link.icon} {link.label}
                            </Link>
                        ))}
                        <button onClick={handleLogout} style={mobileLogoutBtn}>
                            <LogOut size={20} /> Logout Account
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

const guestNavStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 5%', background: 'white', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
const authNavStyle = { background: '#07589e', color: 'white', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 };
const logoStyle = { textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' };
const logoIconStyle = { background: '#3b82f6', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' };
const logoText = { fontWeight: '800', fontSize: '1.2rem', color: '#1e293b', letterSpacing: '-0.5px' };
const navItemStyle = { color: 'white', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500', transition: '0.2s' };
const balanceCard = { background: 'rgba(255,255,255,0.1)', padding: '8px 15px', borderRadius: '8px', textAlign: 'right' };
const logoutBtn = { background: 'none', border: 'none', color: 'white', cursor: 'pointer', opacity: 0.8, display: 'flex', alignItems: 'center' };
const mobileMenuOverlay = { position: 'fixed', top: '64px', left: 0, right: 0, bottom: 0, background: '#07589e', zIndex: 999, overflowY: 'auto' };
const mobileNavItem = { color: 'white', textDecoration: 'none', fontSize: '1.1rem', fontWeight: '500', padding: '15px 20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px' };
const mobileLogoutBtn = { marginTop: '20px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: '#fca5a5', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', fontWeight: '600' };

export default Navbar;
