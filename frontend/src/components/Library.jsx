import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import { Wallet, Layers, Sparkles } from 'lucide-react';

export default function Library({ userId }) {
    const [library, setLibrary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch the data when the component loads
    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const response = await axiosClient.get(`/api/library/${userId}`);
                setLibrary(response.data);
            } catch (error) {
                console.error("Failed to load library", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLibrary();
    }, [userId]);

    // ==========================================
    // Math & Statistics (Calculated dynamically!)
    // ==========================================
    const stats = useMemo(() => {
        let totalMoney = 0;
        let totalCards = 0;
        const rarityCounts = {};

        library.forEach(item => {
            // Calculate totals
            totalCards += item.quantity;
            totalMoney += (item.price || 0) * item.quantity;

            // Group by rarity
            const rarity = item.rarity || 'Unknown';
            if (rarityCounts[rarity]) {
                rarityCounts[rarity] += item.quantity;
            } else {
                rarityCounts[rarity] = item.quantity;
            }
        });

        return { totalMoney, totalCards, rarityCounts };
    }, [library]); // Only recalculates if 'library' array changes

    if (isLoading) return <div>Loading your collection...</div>;

    return (
        <div className="library-container" style={{ padding: '20px' }}>

            {/* --- DASHBOARD STATISTICS --- */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                <div className="stat-card" style={statCardStyle}>
                    <Wallet size={24} color="#4ade80" />
                    <h3>Total Value</h3>
                    <h2>${stats.totalMoney.toFixed(2)}</h2>
                </div>

                <div className="stat-card" style={statCardStyle}>
                    <Layers size={24} color="#60a5fa" />
                    <h3>Total Cards</h3>
                    <h2>{stats.totalCards}</h2>
                </div>

                <div className="stat-card" style={{...statCardStyle, flex: 2}}>
                    <Sparkles size={24} color="#facc15" />
                    <h3>Rarity Breakdown</h3>
                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {Object.entries(stats.rarityCounts).map(([rarity, count]) => (
                            <span key={rarity} style={{ background: '#333', padding: '5px 10px', borderRadius: '10px', fontSize: '14px', color: 'white' }}>
                                {rarity}: <b>{count}</b>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- CARD GRID --- */}
            <h2>My Cards ({library.length} Unique)</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px'
            }}>
                {library.map((item) => (
                    <div key={item.cardId} style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ position: 'relative' }}>
                            <img src={item.imageUrl} alt={item.name} style={{ width: '100%', borderRadius: '5px' }} loading="lazy" />
                            {/* Quantity Badge */}
                            <span style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', padding: '5px 10px', fontWeight: 'bold' }}>
                                x{item.quantity}
                            </span>
                        </div>
                        <h4 style={{ margin: '10px 0 5px 0' }}>{item.name}</h4>
                        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{item.rarity}</p>
                        <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#16a34a' }}>${item.price?.toFixed(2) || '0.00'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Quick inline styles for the dashboard cards
const statCardStyle = {
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '20px',
    flex: 1,
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
};