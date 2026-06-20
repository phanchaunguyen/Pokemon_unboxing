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
            // Call the Spring Boot Controller we just wrote
            const response = await axiosClient.post(`/api/packs/open?userId=${userId}`);
            setCards(response.data);
        } catch (err) {
            // Catch the cooldown exception from Spring Boot
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
            <h2>Open a New Pack!</h2>

            <button
                onClick={handleOpenPack}
                disabled={isLoading}
                className="open-button"
            >
                <PackageOpen size={24} />
                {isLoading ? 'Ripping Pack...' : 'Open Pack'}
            </button>

            {error && (
                <div className="error-message">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            <div className="card-grid">
                {cards.map((card, index) => (
                    <div key={index} className="pokemon-card">
                        {/* We will add the shiny CSS animations to this image later! */}
                        <img src={card.imageUrl} alt={card.name} />
                        <p>{card.name}</p>
                        <span className="rarity-tag">{card.rarity}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}