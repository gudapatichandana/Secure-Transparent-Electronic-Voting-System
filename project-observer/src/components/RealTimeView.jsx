import React, { useEffect, useState } from 'react';
import API_BASE from '../config/api';

const RealTimeView = () => {
    const [stats, setStats] = useState({ totalVotes: 0, breakdown: [] });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/stats/turnout`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Fetch stats failed", err);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    // Mock Geo-Heatmap visual
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Live Turnout Counter */}
            <div className="stat-card" style={{ borderTop: '4px solid var(--accent-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ margin: 0 }}>Live Voter Turnout</h3>
                    <span className="badge live">● LIVE</span>
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                    {stats.totalVotes.toLocaleString()} <span style={{ fontSize: '1rem', color: '#666' }}>Votes Cast</span>
                </div>
                <div style={{ height: '8px', background: '#eee', borderRadius: '4px', marginTop: '1rem' }}>
                    <div style={{ width: '45%', height: '100%', background: 'var(--accent-color)', borderRadius: '4px' }}></div>
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Estimated 45% of eligible voters</p>
            </div>

            {/* Anomaly Alerts */}
            <div className="stat-card" style={{ borderTop: '4px solid #d32f2f' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>Anomaly Detection System</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ padding: '0.75rem', background: '#ffebee', borderRadius: '6px', borderLeft: '3px solid #d32f2f' }}>
                        <strong>⚠️ Suspicious Spike</strong> - Kuppam, Booth 14 <br />
                        <span style={{ fontSize: '0.8rem' }}>120 votes in 5 mins (High Velocity)</span>
                    </div>
                </div>
            </div>

            {/* Constituency Breakdown */}
            <div className="stat-card" style={{ gridColumn: '1 / -1' }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>Constituency Performance</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', background: '#f8f9fa' }}>
                            <th style={{ padding: '0.75rem' }}>Constituency</th>
                            <th style={{ padding: '0.75rem' }}>Votes Polled</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.breakdown.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.75rem' }}>{item.constituency}</td>
                                <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.count}</td>
                                <td style={{ padding: '0.75rem', color: 'var(--success-color)' }}>Active</td>
                            </tr>
                        ))}
                        {stats.breakdown.length === 0 && (
                            <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center' }}>Waiting for data...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RealTimeView;
