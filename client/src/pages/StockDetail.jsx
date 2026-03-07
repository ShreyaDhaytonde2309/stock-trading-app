import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    Filler
} from 'chart.js';
import { ArrowLeft, ZoomIn, ZoomOut, Search, Home, Layout } from 'lucide-react';
import { GeneralContext } from '../context/GeneralContext';
import axiosInstance from '../components/axiosInstance';
import { toast } from 'react-toastify';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend,
    Filler
);

const StockDetail = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const { stocks, user, fetchUser } = useContext(GeneralContext);
    const [quantity, setQuantity] = useState(0);
    const [orderType, setOrderType] = useState('Intraday');
    const [mode, setMode] = useState('BUY'); // BUY or SELL
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1000);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const stock = stocks.find(s => s.symbol === symbol) || { price: 0, name: symbol };

    const data = {
        labels: ['09:15', '09:30', '09:45', '10:00', '10:15', '10:30', '10:45', '11:00'],
        datasets: [{
            label: 'Price',
            data: [stock.price * 0.98, stock.price * 1.01, stock.price * 0.99, stock.price * 1.02, stock.price, stock.price * 1.01, stock.price * 0.97, stock.price],
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 0
        }]
    };

    const options = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
            x: { grid: { display: false }, ticks: { color: '#64748b' } }
        },
        maintainAspectRatio: false
    };

    const handleTrade = async () => {
        if (quantity <= 0) return toast.error('Enter valid quantity');
        try {
            await axiosInstance.post('/transaction', {
                type: mode,
                stockSymbol: symbol,
                quantity: Number(quantity),
                price: stock.price
            });
            toast.success(`${mode} order placed successfully!`);
            fetchUser();
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Transaction failed');
        }
    };

    return (
        <div style={{ padding: isMobile ? '20px 15px' : '20px 40px', background: 'white', minHeight: '90vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}><ArrowLeft size={20}/></button>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b' }}>{symbol} NASDAQ</h2>
                    <div style={{ display: 'flex', gap: '8px', color: '#64748b' }}>
                        <ZoomIn size={18} />
                        <ZoomOut size={18} />
                        <Search size={18} />
                        <Home size={18} />
                        <Layout size={18} />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', flexDirection: isMobile ? 'column' : 'row' }}>
                {/* Chart Area */}
                <div style={{ flex: 1, border: '1px solid #f1f5f9', borderRadius: '12px', padding: '20px', height: isMobile ? '350px' : '500px' }}>
                    <Line data={data} options={options} />
                </div>

                {/* Buy/Sell Form Area */}
                <div style={{ width: isMobile ? '100%' : '380px' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                        <button 
                            onClick={() => setMode('BUY')}
                            style={{ ...toggleBtn, background: mode === 'BUY' ? '#3b49df' : 'white', color: mode === 'BUY' ? 'white' : '#64748b', border: mode === 'BUY' ? 'none' : '1px solid #e2e8f0' }}
                        >
                            Buy @ ${stock.price?.toFixed(3)}
                        </button>
                        <button 
                            onClick={() => setMode('SELL')}
                            style={{ ...toggleBtn, background: mode === 'SELL' ? '#ef4444' : 'white', color: mode === 'SELL' ? 'white' : '#64748b', border: mode === 'SELL' ? 'none' : '1px solid #e2e8f0' }}
                        >
                            Sell @ ${stock.price?.toFixed(3)}
                        </button>
                    </div>

                    <div style={formCard}>
                        <div style={formGroup}>
                            <label style={labelStyle}>Product type</label>
                            <select 
                                style={selectStyle} 
                                value={orderType} 
                                onChange={(e) => setOrderType(e.target.value)}
                            >
                                <option>Intraday</option>
                                <option>Delivery</option>
                            </select>
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>Quantity</label>
                            <input 
                                type="number" 
                                style={inputStyle} 
                                value={quantity} 
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </div>

                        <div style={formGroup}>
                            <label style={labelStyle}>Total price</label>
                            <div style={inputStyle}>{(quantity * stock.price).toFixed(2)}</div>
                        </div>

                        <button 
                            onClick={handleTrade}
                            style={{ ...actionBtn, background: mode === 'BUY' ? '#22c55e' : '#ef4444' }}
                        >
                            {mode === 'BUY' ? 'Buy now' : 'Sell now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const toggleBtn = { flex: 1, padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '0.9rem', transition: '0.3s' };
const formCard = { background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #f1f5f9' };
const formGroup = { marginBottom: '20px' };
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' };
const selectStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', outline: 'none' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', outline: 'none', height: '45px', display: 'flex', alignItems: 'center' };
const actionBtn = { width: '100%', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: '600', border: 'none', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

export default StockDetail;
