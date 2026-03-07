import React, { useContext, useState, useEffect } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const { stocks } = useContext(GeneralContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1000);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const trendingStocks = stocks.slice(0, 8);
    const filteredStocks = stocks.filter(s => 
        s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '90vh', background: '#f4f7fa' }}>
            {/* Trending Stocks Panel */}
            <div style={{ 
                width: isMobile ? '100%' : '380px', 
                background: 'white', 
                padding: isMobile ? '20px' : '30px', 
                borderRight: isMobile ? 'none' : '1px solid #e2e8f0',
                borderBottom: isMobile ? '1px solid #e2e8f0' : 'none'
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', fontWeight: '600', color: '#1e293b' }}>Trending stocks</h2>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '15px', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '10px' : '0' }}>
                    {trendingStocks.map(stock => (
                        <div key={stock.symbol} style={{ ...trendingCardStyle, minWidth: isMobile ? '280px' : 'auto' }}>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>Stock name</div>
                                <div style={stockNameStyle}>{stock.name}</div>
                            </div>
                            <div style={{ width: '60px', textAlign: 'center' }}>
                                <div style={labelSmall}>Symbol</div>
                                <div style={{ fontWeight: '600', color: '#64748b', fontSize: '0.85rem' }}>{stock.symbol}</div>
                            </div>
                            <div style={{ width: '90px', textAlign: 'right' }}>
                                <div style={labelSmall}>Price</div>
                                <div style={{ fontWeight: '700', color: stock.change >= 0 ? '#22c55e' : '#ef4444', fontSize: '0.85rem' }}>
                                    ${stock.price?.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Watchlist Main Panel */}
            <div style={{ flex: 1, padding: isMobile ? '20px' : '30px 40px' }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: '30px', gap: '20px' }}>
                    <h1 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: '600', color: '#1e293b' }}>Watchlist</h1>
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
                    {filteredStocks.map(stock => (
                        <div key={stock._id} style={{ ...watchlistCardStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? '15px' : '30px' }}>
                            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={badgeStyle}>NASDAQ</div>
                                {isMobile && (
                                    <button onClick={() => navigate(`/stock/${stock.symbol}`)} style={{ ...viewChartBtn, padding: '8px 15px', fontSize: '0.8rem' }}>View Chart</button>
                                )}
                            </div>
                            <div style={{ flex: 2 }}>
                                <div style={labelSmall}>Stock name</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{stock.name}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={labelSmall}>Symbol</div>
                                <div style={{ fontWeight: '600', color: '#64748b' }}>{stock.symbol}</div>
                            </div>
                            {!isMobile && (
                                <>
                                    <div style={{ flex: 1 }}>
                                        <div style={labelSmall}>Stock Type</div>
                                        <div style={{ fontWeight: '600', color: '#64748b' }}>Common Stock</div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/stock/${stock.symbol}`)}
                                        style={viewChartBtn}
                                    >
                                        View Chart
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                    {filteredStocks.length === 0 && <div style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>No stocks found matching your search.</div>}
                </div>
            </div>
        </div>
    );
};

const trendingCardStyle = { padding: '15px', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' };
const watchlistCardStyle = { background: 'white', padding: '20px 30px', borderRadius: '16px', display: 'flex', border: '1px solid #f8fafc', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' };
const badgeStyle = { background: '#f1f5f9', color: '#07589e', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700' };
const labelSmall = { fontSize: '0.65rem', color: '#94a3b8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const stockNameStyle = { fontSize: '0.85rem', color: '#64748b', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const searchStyle = { padding: '12px 50px 12px 20px', borderRadius: '25px', border: '1px solid #e2e8f0', outline: 'none', background: 'white', transition: '0.3s' };
const viewChartBtn = { background: '#3b82f6', color: 'white', padding: '10px 25px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', transition: '0.3s' };

export default Home;
