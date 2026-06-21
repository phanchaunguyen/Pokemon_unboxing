import { useState } from 'react';
import axiosClient from '../api/axiosClient';
import { PackageOpen, AlertCircle, RefreshCcw, ArrowDown } from 'lucide-react';

export default function PackOpener({ userId }) {
    const [cards, setCards] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // View States: 'idle' -> 'opening' -> 'summary'
    const [viewState, setViewState] = useState('idle');
    const [currentIndex, setCurrentIndex] = useState(0);

    // --- Drag Physics State ---
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);

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
            setViewState('summary');
        }
    };

    const resetPack = () => {
        setCards([]);
        setViewState('idle');
        setCurrentIndex(0);
    };

    // --- Pointer Events for Dragging ---
    const handlePointerDown = (e) => {
        // Capture pointer so dragging works even if mouse leaves the card element
        e.target.setPointerCapture(e.pointerId);
        setIsDragging(true);
        setStartY(e.clientY);
        setDragOffset(0);
    };

    const handlePointerMove = (e) => {
        if (!isDragging) return;
        const currentY = e.clientY;
        const offset = currentY - startY;

        // Only allow pulling downwards (with a tiny bit of upward flex for realism)
        if (offset > -30) {
            setDragOffset(offset);
        }
    };

    const handlePointerUp = (e) => {
        if (!isDragging) return;
        setIsDragging(false);
        e.target.releasePointerCapture(e.pointerId);

        // If dragged down more than 150px, consider it swiped!
        if (dragOffset > 150) {
            handleNextCard();
        }

        // Reset offset so the next card starts at the top (or current snaps back)
        setDragOffset(0);
    };

    // --- VIEW 1: IDLE ---
    if (viewState === 'idle') {
        return (
            <div className="pack-container">
                <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>Ready to pull a Chase Card?</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Packs restock every 1 hours.</p>

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
        const isLastCard = currentIndex === cards.length - 1;

        return (
            <div className="pack-container fullscreen-opener">
                <h2 style={{ marginBottom: '5px', fontSize: '1.5rem' }}>
                    Card {currentIndex + 1} of {cards.length}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '30px' }}>
                    {isLastCard ? "🔥 THE RARE SLOT 🔥" : <><ArrowDown size={18} className="bounce-anim" /> Pull down to reveal</>}
                </div>

                <div className="card-stack-container large-stack">
                    {cards.map((card, index) => {
                        const isPast = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const offset = index - currentIndex;

                        let dynamicStyle = {};

                        if (isPast) {
                            // Cards already swiped fly down and disappear
                            dynamicStyle = { transform: 'translateY(200%) rotate(15deg)', opacity: 0, pointerEvents: 'none' };
                        } else if (isCurrent) {
                            // The active card follows the mouse drag
                            dynamicStyle = {
                                transform: `translateY(${dragOffset}px) rotate(${dragOffset * 0.05}deg) scale(1)`,
                                zIndex: 50,
                                opacity: 1 - (dragOffset / 400), // Fades out as you pull down
                                transition: isDragging ? 'none' : 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)' // Snap back if released too early
                            };
                        } else {
                            // The cards waiting underneath
                            dynamicStyle = {
                                transform: `translate(${offset * 15}px, ${offset * 15}px) scale(${1 - offset * 0.05})`,
                                zIndex: 50 - offset,
                                opacity: 1 - offset * 0.2,
                                pointerEvents: 'none'
                            };
                        }

                        const isFinalRare = isCurrent && isLastCard;

                        return (
                            <div
                                key={index}
                                className={`stacked-card ${isFinalRare ? 'rare-glow' : ''} ${isDragging && isCurrent ? 'grabbing' : ''}`}
                                style={dynamicStyle}
                                // Attach the pointer events ONLY to the current top card
                                onPointerDown={isCurrent ? handlePointerDown : undefined}
                                onPointerMove={isCurrent ? handlePointerMove : undefined}
                                onPointerUp={isCurrent ? handlePointerUp : undefined}
                                onPointerCancel={isCurrent ? handlePointerUp : undefined}
                            >
                                <img src={card.imageUrl} alt={card.name} draggable="false" />
                                {isCurrent && !isDragging && dragOffset === 0 && (
                                    <div className="card-quick-stats">
                                        <span className="quick-rarity">{card.rarity}</span>
                                        <span className="quick-price">${card.price?.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isLastCard && dragOffset === 0 && !isDragging && (
                    <button onClick={() => setViewState('summary')} className="next-card-btn" style={{ marginTop: '50px', animation: 'slideUpFade 0.5s forwards' }}>
                        View Haul
                    </button>
                )}
            </div>
        );
    }

    // --- VIEW 3: PACK SUMMARY ---
    return (
        <div className="pack-container">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Pack Summary</h2>
            <div className="dashboard-stats" style={{ justifyContent: 'center', marginBottom: '40px' }}>
                <div className="stat-card" style={{ maxWidth: '300px', transform: 'scale(1.1)', borderColor: 'var(--accent-primary)' }}>
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

            <button onClick={resetPack} className="open-button" style={{ marginTop: '50px' }}>
                <RefreshCcw size={20} /> Back to Opener
            </button>
        </div>
    );
}