import React, { useState, useEffect } from 'react';
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
    Legend 
} from 'chart.js';
import { ArrowLeft } from 'lucide-react';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend
);

const AdminStockDetail = () => {
    const { symbol } = useParams();
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mock chart data
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [{
            label: 'Price',
            data: [150, 160, 155, 170, 165, 180, 175],
            borderColor: '#07589e',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#07589e',
            fill: false,
            tension: 0.3
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

    return (
        <div style={{ padding: isMobile ? '20px 15px' : '20px 40px', background: 'white', minHeight: '90vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                    <ArrowLeft size={24} />
                </button>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{symbol} NASDAQ</h2>
            </div>

            <div style={{ height: isMobile ? '300px' : '500px', width: '100%', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '20px' }}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default AdminStockDetail;
