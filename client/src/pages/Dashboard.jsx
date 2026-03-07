import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStocks, tradeStock, fetchPortfolio, fetchWatchlist, toggleWatchlist } from '../slices/stockSlice';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Search, ArrowRightLeft, Newspaper, Trophy, Star } from 'lucide-react';
import { toast } from 'react-toastify';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const dispatch = useDispatch();
    const { stocks, loading, portfolio, watchlist } = useSelector(state => state.stocks);
    const { user } = useSelector(state => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('all'); // 'all' or 'watchlist'

    useEffect(() => {
        dispatch(fetchStocks());
        dispatch(fetchPortfolio());
        dispatch(fetchWatchlist());
    }, [dispatch]);

    const handleTrade = async (type, symbol, qty, price) => {
        try {
            await dispatch(tradeStock({ type, symbol, quantity: qty, price })).unwrap();
            toast.success(`${type === 'BUY' ? 'Bought' : 'Sold'} ${qty} shares of ${symbol}`);
            dispatch(fetchPortfolio());
        } catch (err) {
            toast.error(err.response?.data?.msg || err.message || 'Trade failed');
        }
    };

    const handleToggleWatchlist = (stockId) => {
        dispatch(toggleWatchlist(stockId));
    };

    const filteredStocks = stocks.filter(s => {
        const matchesSearch = s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesView = view === 'all' || watchlist.includes(s._id);
        return matchesSearch && matchesView;
    });

    const portfolioValue = portfolio.reduce((acc, curr) => acc + (curr.quantity * curr.stock?.price || 0), 0);
    const totalAssets = (user?.balance || 0) + portfolioValue;

    const chartData = {
        labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
        datasets: [
            {
                label: 'Portfolio Value',
                data: [65000, 59000, 80000, 81000, 56000, 55000, portfolioValue || 40000],
                fill: false,
                borderColor: 'rgb(59, 130, 246)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
                ticks: {
                    color: 'var(--text-secondary)',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'var(--text-secondary)',
                }
            }
        }
    };

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Market <span className="text-gradient">Overview</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Live updates and virtual trading dashboard.</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Total Account Value</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent)' }}>${totalAssets.toLocaleString()}</div>
                </div>
            </header>

            {/* Stats Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--success)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Available Balance</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>${user?.balance.toLocaleString()}</div>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '12px', color: 'var(--accent)' }}>
                        <BarChart3 size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Portfolio Value</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                            ${portfolioValue.toLocaleString()}
                        </div>
                    </div>
                </div>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '12px', borderRadius: '12px', color: '#eab308' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Holdings</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{portfolio.length} Stocks</div>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="glass" style={{ padding: '25px', marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Portfolio Performance</h3>
                <div style={{ height: '300px' }}>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 1fr)', gap: '30px' }}>
                {/* Stock List */}
                <div className="glass" style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.25rem', marginRight: '10px' }}>Market Stocks</h3>
                            <button
                                style={{
                                    background: view === 'all' ? 'var(--accent)' : 'transparent',
                                    border: '1px solid var(--accent)',
                                    color: view === 'all' ? 'white' : 'var(--accent)',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }}
                                onClick={() => setView('all')}
                            >
                                All
                            </button>
                            <button
                                style={{
                                    background: view === 'watchlist' ? 'var(--accent)' : 'transparent',
                                    border: '1px solid var(--accent)',
                                    color: view === 'watchlist' ? 'white' : 'var(--accent)',
                                    padding: '5px 12px',
                                    borderRadius: '20px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px'
                                }}
                                onClick={() => setView('watchlist')}
                            >
                                <Star size={14} fill={view === 'watchlist' ? 'white' : 'none'} /> Watchlist
                            </button>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={18} />
                            <input
                                type="text"
                                placeholder="Search symbols..."
                                className="glass"
                                style={{ padding: '10px 15px 10px 40px', borderRadius: '10px', width: '250px', background: 'rgba(255,255,255,0.05)' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table className="stock-table">
                            <thead>
                                <tr>
                                    <th>SYMBOL</th>
                                    <th>NAME</th>
                                    <th>PRICE</th>
                                    <th>24H CHANGE</th>
                                    <th>OWNED</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStocks.map(stock => {
                                    const owned = portfolio.find(p => p.stock?.symbol === stock.symbol)?.quantity || 0;
                                    return (
                                        <tr key={stock.symbol}>
                                            <td style={{ fontWeight: '700' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Star
                                                        size={16}
                                                        style={{ cursor: 'pointer', fill: watchlist.some(id => id === stock._id) ? 'var(--accent)' : 'none', color: watchlist.some(id => id === stock._id) ? 'var(--accent)' : 'var(--text-secondary)' }}
                                                        onClick={() => handleToggleWatchlist(stock._id)}
                                                    />
                                                    {stock.symbol}
                                                </div>
                                            </td>
                                            <td style={{ color: 'var(--text-secondary)' }}>{stock.name}</td>
                                            <td style={{ fontWeight: '600' }}>${stock.price.toFixed(2)}</td>
                                            <td style={{ color: stock.change >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                    {stock.changePercent.toFixed(2)}%
                                                </div>
                                            </td>
                                            <td>{owned > 0 ? <span className="badge badge-success">{owned}</span> : '-'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        onClick={() => handleTrade('BUY', stock.symbol, 1, stock.price)}
                                                    >
                                                        Buy
                                                    </button>
                                                    {owned > 0 && (
                                                        <button
                                                            className="btn btn-outline"
                                                            style={{ padding: '6px 12px', fontSize: '0.8rem', borderColor: 'var(--danger)', color: 'var(--danger)' }}
                                                            onClick={() => handleTrade('SELL', stock.symbol, 1, stock.price)}
                                                        >
                                                            Sell
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="glass" style={{ padding: '20px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', fontSize: '1.1rem' }}>
                            <ArrowRightLeft size={18} color="var(--accent)" /> Balance Summary
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Cash Balance</span>
                                <span>${user?.balance.toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>Equity Value</span>
                                <span>${portfolioValue.toLocaleString()}</span>
                            </div>
                            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '5px 0' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700' }}>
                                <span>Total All</span>
                                <span style={{ color: 'var(--accent)' }}>${totalAssets.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '20px' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', fontSize: '1.1rem' }}>
                            <Newspaper size={18} color="var(--accent)" /> Market News
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <NewsItem title="Tech Stocks Rally on AI Growth" time="2h ago" type="Success" />
                            <NewsItem title="Fed Interest Rate Decisions Loom" time="5h ago" type="Neutral" />
                            <NewsItem title="Oil Prices Slip Amid Supply Cautiousness" time="8h ago" type="Danger" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsItem = ({ title, time, type }) => (
    <div style={{ paddingBottom: '10px', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>{time}</span>
            <span style={{ color: type === 'Success' ? 'var(--success)' : type === 'Danger' ? 'var(--danger)' : 'var(--accent)' }}>{type}</span>
        </div>
    </div>
);

export default Dashboard;
