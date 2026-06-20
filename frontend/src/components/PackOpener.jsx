import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { PackageOpen, AlertCircle } from 'lucide-react';

export default function PackOpener({ userId }) {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenPack = async () => {
        setIsLoading(true);
        setError(null);
        setCards([]);

        try {
            const response = await axiosClient.post(`/api/packs/open?userId=${userId}`);
            setCards(response.data);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError("Failed to open pack. Server might be down.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pack-container">
            <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Ready to pull a Charizard?</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Packs restock every 4 hours.</p>

            <button onClick={handleOpenPack} disabled={isLoading} className="open-button">
                <PackageOpen size={24} />
                {isLoading ? 'Ripping Pack...' : 'Rip a Pack'}
            </button>

            {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '15px 30px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
                    <AlertCircle size={20} />
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{error}</p>
                </div>
            )}

            {/* We reuse the library grid classes here so the cards match perfectly */}
            <div className="library-grid" style={{ width: '100%', textAlign: 'left' }}>
                {cards.map((card, index) => (
                    <div key={index} className="pokemon-card-wrapper" style={{ animation: `fadeIn 0.5s ease forwards ${(index * 0.1)}s`, opacity: 0 }}>
                        <img src={card.imageUrl} alt={card.name} />
                        <h4 className="card-title">{card.name}</h4>
                        <p className="card-rarity">{card.rarity}</p>
                        <p className="card-price">${card.price?.toFixed(2) || '0.00'}</p>
                    </div>
                ))}
            </div>

            {/* Quick inline animation for the card reveals */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}