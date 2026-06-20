import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import { Wallet, Layers, Sparkles } from 'lucide-react';

export default function Library({ userId }) {
    const [library, setLibrary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const stats = useMemo(() => {
        let totalMoney = 0;
        let totalCards = 0;
        const rarityCounts = {};

        library.forEach(item => {
            totalCards += item.quantity;
            totalMoney += (item.price || 0) * item.quantity;
            const rarity = item.rarity || 'Unknown';
            rarityCounts[rarity] = (rarityCounts[rarity] || 0) + item.quantity;
        });

        return { totalMoney, totalCards, rarityCounts };
    }, [library]);

    if (isLoading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading your collection...</div>;

    return (
        <div className="library-container">
            {/* Dashboard Statistics */}
            <div className="dashboard-stats">
                <div className="stat-card">
                    <Wallet size={28} color="#10b981" />
                    <h3>Total Value</h3>
                    <h2>${stats.totalMoney.toFixed(2)}</h2>
                </div>

                <div className="stat-card">
                    <Layers size={28} color="#3b82f6" />
                    <h3>Total Cards</h3>
                    <h2>{stats.totalCards}</h2>
                </div>

                <div className="stat-card" style={{ flex: 2 }}>
                    <Sparkles size={28} color="#8b5cf6" />
                    <h3>Rarity Breakdown</h3>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                        {Object.entries(stats.rarityCounts).map(([rarity, count]) => (
                            <span key={rarity} style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px' }}>
                                {rarity}: <b style={{color: 'white'}}>{count}</b>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Card Grid */}
            <h2 style={{ marginBottom: '20px' }}>My Cards ({library.length} Unique)</h2>
            <div className="library-grid">
                {library.map((item) => (
                    <div key={item.cardId} className="pokemon-card-wrapper">
                        <span className="qty-badge">x{item.quantity}</span>
                        <img src={item.imageUrl} alt={item.name} loading="lazy" />
                        <h4 className="card-title">{item.name}</h4>
                        <p className="card-rarity">{item.rarity}</p>
                        <p className="card-price">${item.price?.toFixed(2) || '0.00'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}