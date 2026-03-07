import React, { useState, useEffect, useContext } from 'react';
import { GeneralContext } from '../context/GeneralContext';
import axiosInstance from '../components/axiosInstance';
import { Briefcase, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

const Portfolio = () => {
    const [myHoldings, setMyHoldings] = useState([]);
    const { user, stocks } = useContext(GeneralContext);

    useEffect(() => {
        const fetchHoldings = async () => {
            try {
                const res = await axiosInstance.get('/transaction/my');

                // Group transactions by symbol to calculate holdings
                const grouped = res.data.reduce((acc, tx) => {
                    if (!acc[tx.stockSymbol]) {
                        acc[tx.stockSymbol] = { quantity: 0, totalCost: 0 };
                    }
                    if (tx.type === 'BUY') {
                        acc[tx.stockSymbol].quantity += tx.quantity;
                        acc[tx.stockSymbol].totalCost += tx.amount;
                    } else {
                        acc[tx.stockSymbol].quantity -= tx.quantity;
                        acc[tx.stockSymbol].totalCost -= (tx.amount / tx.quantity) * tx.quantity; // Simplistic sell logic
                    }
                    return acc;
                }, {});

                const result = Object.keys(grouped)
                    .filter(symbol => grouped[symbol].quantity > 0)
                    .map(symbol => {
                        const stockData = stocks.find(s => s.symbol === symbol) || { price: 0 };
                        const avgPrice = grouped[symbol].totalCost / grouped[symbol].quantity;
                        return {
                            symbol,
                            quantity: grouped[symbol].quantity,
                            avgPrice,
                            currentPrice: stockData.price,
                            pl: (stockData.price - avgPrice) * grouped[symbol].quantity
                        };
                    });

                setMyHoldings(result);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHoldings();
    }, [stocks]);

    const totalPortfolioValue = myHoldings.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ marginBottom: '0.5rem' }}>My <span className="text-gradient">Portfolio</span></h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your assets and real-time performance.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '30px' }}>
                <div className="glass" style={{ padding: '25px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Briefcase size={20} color="var(--accent)" /> Your Holdings</h3>
                    <table className="stock-table">
                        <thead>
                            <tr>
                                <th>ASSET</th>
                                <th>QUANTITY</th>
                                <th>AVG PRICE</th>
                                <th>CURRENT</th>
                                <th>PROFIT/LOSS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myHoldings.map(item => (
                                <tr key={item.symbol}>
                                    <td style={{ fontWeight: '700' }}>{item.symbol}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.avgPrice.toFixed(2)}</td>
                                    <td>${item.currentPrice.toFixed(2)}</td>
                                    <td style={{ color: item.pl >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: '700' }}>
                                        {item.pl >= 0 ? '+' : ''}${item.pl.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-card" style={{ background: 'var(--accent)', color: 'white' }}>
                    <h3>Portfolio Value</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: '800', margin: '15px 0' }}>
                        ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.8)' }}>Allocated across {myHoldings.length} assets.</div>
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
