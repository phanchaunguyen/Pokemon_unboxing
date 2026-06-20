import { useState } from 'react';
import axiosClient from '../api/axiosClient';

export default function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axiosClient.post('/api/auth/login', { username, password });
            // response.data contains the userId
            onLoginSuccess(response.data);
        } catch (err) {
            setError("Invalid credentials. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
            <div className="stat-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
                <div className="logo-circle" style={{ margin: '0 auto 20px auto', width: '50px', height: '50px' }}></div>
                <h2 style={{ marginBottom: '20px' }}>Log in to PokéRip</h2>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={inputStyle}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        required
                    />

                    {error && <p style={{ color: '#ef4444', margin: 0 }}>{error}</p>}

                    <button type="submit" disabled={isLoading} className="open-button" style={{ justifyContent: 'center', margin: '10px 0 0 0' }}>
                        {isLoading ? 'Loading...' : 'Enter'}
                    </button>
                </form>
            </div>
        </div>
    );
}

const inputStyle = {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--bg-main)',
    color: 'var(--text-main)',
    fontSize: '1rem',
    outline: 'none'
};