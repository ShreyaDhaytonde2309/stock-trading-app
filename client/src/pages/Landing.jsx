import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Background Animations */}
            <div className="bg-blobs">
                <div className="blob" style={{ top: '-10%', left: '-10%' }}></div>
                <div className="blob blob-2" style={{ bottom: '10%', right: '-5%', animationDelay: '-2s' }}></div>
                <div className="blob blob-3" style={{ top: '30%', left: '30%', animationDelay: '-5s', width: '500px', height: '500px' }}></div>
                <div className="blob blob-2" style={{ bottom: '-10%', left: '20%', animationDelay: '-8s' }}></div>
            </div>

            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '120px 20px', minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
                <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', marginBottom: '24px', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: '1.1', color: '#1e293b' }}>
                    Trade Without <span className="text-gradient">Limits.</span>
                </h1>
                <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 48px', lineHeight: '1.6', fontWeight: '500' }}>
                    The world's most advanced paper trading simulator. Practice with virtual funds and real-market data in a risk-free environment.
                </p>
                <div style={{ display: 'flex', gap: '25px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/register" className="btn btn-primary" style={{ padding: '18px 48px', fontSize: '1.1rem', borderRadius: '14px' }}>Get Started Free</Link>
                    <Link to="/login" className="btn btn-outline" style={{ padding: '18px 48px', fontSize: '1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: '1.5px solid #cbd5e1' }}>Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
