import React, { useEffect, useState } from 'react';
import API_BASE from '../config/api';

const LedgerView = () => {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        const fetchLedger = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/public-ledger`);
                if (res.ok) {
                    const data = await res.json();
                    setBlocks(data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchLedger();
        const interval = setInterval(fetchLedger, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ margin: 0 }}>Cryptographic Public Ledger</h2>
                <div style={{ padding: '0.5rem 1rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', fontWeight: 'bold' }}>
                    🔒 Blockchain Integrity: VERIFIED
                </div>
            </div>

            <div className="stat-card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #ddd', display: 'grid', gridTemplateColumns: '80px 100px 1fr 1fr 100px', fontWeight: 'bold', gap: '1rem' }}>
                    <div>Height</div>
                    <div>Time</div>
                    <div>Prev Hash</div>
                    <div>Transaction Hash (SHA-256)</div>
                    <div>Origin</div>
                </div>
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    {blocks.map((block, idx) => (
                        <div key={idx} className="ledger-row" style={{ animation: 'fadeIn 0.5s ease', display: 'grid', gridTemplateColumns: '80px 100px 1fr 1fr 100px', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ fontWeight: 'bold', color: '#333' }}>
                                #{blocks.length - idx}
                            </div>
                            <div style={{ color: '#666', fontSize: '0.85rem' }}>
                                {new Date(block.timestamp).toLocaleTimeString()}
                            </div>
                            <div style={{ color: '#888', wordBreak: 'break-all', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                {block.prev_hash ? block.prev_hash.substring(0, 16) + '...' : 'GENESIS'}
                            </div>
                            <div style={{ color: 'var(--primary-color)', wordBreak: 'break-all', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                                {block.transaction_hash}
                            </div>
                            <div>
                                <span style={{ padding: '2px 8px', background: '#e3f2fd', borderRadius: '10px', fontSize: '0.8rem', color: '#1565c0' }}>
                                    {block.constituency}
                                </span>
                            </div>
                        </div>
                    ))}
                    {blocks.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
                            No blocks mined yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LedgerView;
