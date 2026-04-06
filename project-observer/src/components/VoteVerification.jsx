import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import API_BASE from '../config/api';

const VoteVerification = () => {
    const [receiptHash, setReceiptHash] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setResult(null);
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/verify-receipt`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionHash: receiptHash.trim() })
            });

            const data = await response.json();

            if (data.verified) {
                setResult(data);
            } else {
                setError(data.message || 'Receipt not found');
            }
        } catch (err) {
            setError('Connection failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '1rem' }}>Vote Receipt Verification</h2>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
                Enter your vote receipt ID to verify your vote was recorded.
            </p>

            <form onSubmit={handleVerify}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                        Vote Receipt ID (Transaction Hash)
                    </label>
                    <input
                        type="text"
                        value={receiptHash}
                        onChange={(e) => setReceiptHash(e.target.value)}
                        placeholder="e.g., 8f4a3c2d1e5b6a7c..."
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            fontSize: '0.95rem'
                        }}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        padding: '0.75rem 2rem',
                        background: '#F7941D',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: isLoading ? 0.7 : 1
                    }}
                >
                    <Search size={18} />
                    {isLoading ? 'Verifying...' : 'Verify Receipt'}
                </button>
            </form>

            {error && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: '#ffebee',
                    color: '#c62828',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <XCircle size={20} />
                    {error}
                </div>
            )}

            {result && result.verified && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: '#e8f5e9',
                    borderRadius: '8px',
                    border: '2px solid #4caf50'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <CheckCircle size={24} color="#2e7d32" />
                        <h3 style={{ margin: 0, color: '#2e7d32' }}>Vote Verified ✓</h3>
                    </div>
                    <p style={{ margin: '0.5rem 0', color: '#555' }}>
                        <strong>Constituency:</strong> {result.vote.constituency}
                    </p>
                    <p style={{ margin: '0.5rem 0', color: '#555' }}>
                        <strong>Recorded At:</strong> {new Date(result.vote.timestamp).toLocaleString()}
                    </p>
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.75rem',
                        background: 'white',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '0.5rem'
                    }}>
                        <AlertCircle size={16} color="#1976d2" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ color: '#666' }}>
                            Your vote is anonymously recorded on the blockchain. This verification confirms your vote was counted without revealing your choice.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoteVerification;
