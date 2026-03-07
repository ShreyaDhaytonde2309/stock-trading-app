import React, { useContext, useState, useEffect } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../components/axiosInstance';

const PortfolioPage = () => {
    const { stocks } = useContext(GeneralContext);
    const [portfolio, setPortfolio] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 800);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 800);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const res = await axiosInstance.get('/transaction/portfolio');
                setPortfolio(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchPortfolio();
    }, []);

    const filteredPortfolio = portfolio.filter(item => 
        item.stock?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ padding: isMobile ? '20px 15px' : '40px', minHeight: '90vh', background: '#f4f7fa' }}>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '30px', gap: '20px' }}>
                <h1 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '600', color: '#1e293b' }}>My Portfolio</h1>
                <div style={{ position: 'relative', width: isMobile ? '100%' : 'auto' }}>
                    <input 
                        type="text" 
                        placeholder="Enter Stock Symbol...." 
                        style={{ ...searchStyle, width: isMobile ? '100%' : '400px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={20} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {filteredPortfolio.map(item => {
                    const symbol = item.stock?.symbol || 'Unknown';
                    const name = item.stock?.name || symbol;
                    const liveStock = stocks.find(s => s.symbol === symbol) || { price: item.avgPrice };
                    const currentPrice = liveStock.price || item.avgPrice;
                    
                    return (
                        <div key={item._id} style={{ ...portfolioCardStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center' }}>
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                <div style={badgeStyle}>NASDAQ</div>
                                {isMobile && (
                                    <button onClick={() => navigate(`/stock/${symbol}`)} style={{ ...viewChartBtn, padding: '8px 15px', fontSize: '0.8rem' }}>View Chart</button>
                                )}
                            </div>
                            <div style={{ flex: 2 }}>
                                <div style={labelSmall}>Stock name</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{name}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>Symbol</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{symbol}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>Stocks</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{item.quantity}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>Avg price</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>${item.avgPrice?.toFixed(2)}</div>
                            </div>
                            <div style={{ flex: 1.5 }}>
                                <div style={labelSmall}>Total value</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>${(item.quantity * currentPrice).toFixed(2)}</div>
                            </div>
                            {!isMobile && (
                                <button 
                                    onClick={() => navigate(`/stock/${symbol}`)}
                                    style={viewChartBtn}
                                >
                                    View Chart
                                </button>
                            )}
                        </div>
                    );
                })}
                {portfolio.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '50px' }}>No holdings found in your portfolio.</p>}
            </div>
        </div>
    );
};

const portfolioCardStyle = { background: 'white', padding: '20px 30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', display: 'flex', gap: '25px', border: '1px solid #f8fafc' };
const badgeStyle = { background: '#f1f5f9', color: '#07589e', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' };
const labelSmall = { fontSize: '0.7rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase' };
const searchStyle = { padding: '12px 50px 12px 20px', borderRadius: '25px', border: '1px solid #e2e8f0', outline: 'none', background: 'white' };
const viewChartBtn = { background: '#3b82f6', color: 'white', padding: '10px 25px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' };

export default PortfolioPage;
