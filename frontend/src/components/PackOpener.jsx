import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { PackageOpen, AlertCircle, RefreshCcw, ArrowRight } from 'lucide-react';

export default function PackOpener({ userId }) {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // View States: 'idle' -> 'opening' -> 'summary'
    const [viewState, setViewState] = useState('idle');
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleOpenPack = async () => {
        setIsLoading(true);
        setError(null);
        setCurrentIndex(0);

        try {
            const response = await axiosClient.post(`/api/packs/open?userId=${userId}`);
            setCards(response.data);
            setViewState('opening');
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

    const handleNextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Once the final rare card is swiped, show the summary
            setViewState('summary');
        }
    };

    const resetPack = () => {
        setCards([]);
        setViewState('idle');
        setCurrentIndex(0);
    };

    // --- VIEW 1: IDLE (READY TO OPEN) ---
    if (viewState === 'idle') {
        return (
            <div className="pack-container">
                <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Ready to pull a Chase Card?</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Packs restock every 4 hours.</p>

                <button onClick={handleOpenPack} disabled={isLoading} className="open-button pulse-anim">
                    <PackageOpen size={24} />
                    {isLoading ? 'Ripping Pack...' : 'Rip a Pack'}
                </button>

                {error && (
                    <div className="error-box">
                        <AlertCircle size={20} />
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{error}</p>
                    </div>
                )}
            </div>
        );
    }

    // --- VIEW 2: SWIPING THE STACK ---
    if (viewState === 'opening') {
        return (
            <div className="pack-container" style={{ paddingTop: '20px' }}>
                <h2 style={{ marginBottom: '5px' }}>
                    Card {currentIndex + 1} of {cards.length}
                </h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
                    {currentIndex === cards.length - 1 ? "🔥 THE RARE SLOT 🔥" : "Click the card to pull the next one"}
                </p>

                <div className="card-stack-container">
                    {cards.map((card, index) => {
                        const isPast = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const offset = index - currentIndex;

                        // CSS inline logic to calculate the 3D stack offset
                        let dynamicStyle = {};
                        if (isPast) {
                            dynamicStyle = { transform: 'translateX(-200%) rotate(-25deg)', opacity: 0, pointerEvents: 'none' };
                        } else if (isCurrent) {
                            dynamicStyle = { transform: 'translateX(0) rotate(0) scale(1)', zIndex: 50 };
                        } else {
                            // Stack cards behind the current one, getting smaller and darker
                            dynamicStyle = {
                                transform: `translate(${offset * 12}px, ${offset * 12}px) scale(${1 - offset * 0.04})`,
                                zIndex: 50 - offset,
                                opacity: 1 - offset * 0.15
                            };
                        }

                        // Add a glowing border to the final rare card if it's currently being viewed
                        const isFinalRare = isCurrent && index === cards.length - 1;

                        return (
                            <div
                                key={index}
                                className={`stacked-card ${isFinalRare ? 'rare-glow' : ''}`}
                                style={dynamicStyle}
                                onClick={isCurrent ? handleNextCard : undefined}
                            >
                                <img src={card.imageUrl} alt={card.name} />
                                {isCurrent && (
                                    <div className="card-quick-stats">
                                        <span className="quick-rarity">{card.rarity}</span>
                                        <span className="quick-price">${card.price?.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <button onClick={handleNextCard} className="next-card-btn" style={{ marginTop: '40px' }}>
                    {currentIndex === cards.length - 1 ? 'View Haul' : 'Next Card'} <ArrowRight size={20} />
                </button>
            </div>
        );
    }

    // --- VIEW 3: PACK SUMMARY ---
    return (
        <div className="pack-container">
            <h2>Pack Summary</h2>
            <div className="dashboard-stats" style={{ justifyContent: 'center', marginBottom: '30px' }}>
                <div className="stat-card" style={{ maxWidth: '300px' }}>
                    <h3>Total Value Pulled</h3>
                    <h2 style={{ color: 'var(--success)' }}>
                        ${cards.reduce((sum, card) => sum + (card.price || 0), 0).toFixed(2)}
                    </h2>
                </div>
            </div>

            <div className="library-grid" style={{ width: '100%', textAlign: 'left' }}>
                {cards.map((card, index) => (
                    <div key={index} className={`pokemon-card-wrapper ${index === cards.length - 1 ? 'rare-glow' : ''}`}>
                        {index === cards.length - 1 && <div className="hit-badge">THE HIT</div>}
                        <img src={card.imageUrl} alt={card.name} />
                        <h4 className="card-title">{card.name}</h4>
                        <p className="card-rarity">{card.rarity}</p>
                        <p className="card-price">${card.price?.toFixed(2) || '0.00'}</p>
                    </div>
                ))}
            </div>

            <button onClick={resetPack} className="open-button" style={{ marginTop: '40px' }}>
                <RefreshCcw size={20} /> Back to Opener
            </button>
        </div>
    );
}