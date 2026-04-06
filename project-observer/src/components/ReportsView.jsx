import React, { useState } from 'react';
import API_BASE from '../config/api';

const ReportsView = () => {
    const [exporting, setExporting] = useState(false);

    const handleExportLedger = async () => {
        setExporting(true);
        try {
            // Trigger download from backend API
            const response = await fetch(`${API_BASE}/api/observer/export-ledger`);
            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'secure_voting_ledger_export.zip';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            alert('Failed to securely export the ledger. Please check system connection.');
        } finally {
            setExporting(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
            {/* Header Area */}
            <div style={{ marginBottom: '2.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
                <h2 style={{ color: '#ea580c', fontSize: '2.2rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                    Statutory Reports & Communication
                </h2>
                <p style={{ color: '#1e3a8a', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>
                    Secure portal for daily dispatches and official ECI notices.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                {/* Submission Form Card (Premium Saffron Theme) */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', boxShadow: '0 20px 40px -10px rgba(234, 88, 12, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #ffedd5', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #f97316, #ea580c)' }}></div>
                    <h3 style={{ marginTop: 0, color: '#9a3412', fontSize: '1.5rem', borderBottom: '1px solid #ffedd5', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800 }}>
                        <span style={{ fontSize: '1.6rem' }}>📝</span> Submit Report
                    </h3>
                    <form onSubmit={(e) => e.preventDefault()} style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Report Type</label>
                            <select style={{ width: '100%', padding: '0.9rem', border: '2px solid #fed7aa', borderRadius: '10px', outline: 'none', transition: 'all 0.2s', backgroundColor: '#fff7ed', color: '#0f172a', fontWeight: 500 }}>
                                <option>Arrival Report</option>
                                <option>Pre-Poll Activity</option>
                                <option>Poll Day Report (Hourly)</option>
                                <option>Post-Poll Scrutiny</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Observations</label>
                            <textarea rows="4" style={{ width: '100%', padding: '0.9rem', border: '2px solid #fed7aa', borderRadius: '10px', outline: 'none', resize: 'vertical', backgroundColor: '#fff7ed', color: '#0f172a', transition: 'all 0.2s' }} placeholder="Enter detailed observations..." />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 700, color: '#334155', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Attachments (Photos/Docs)</label>
                            <input type="file" style={{ width: '100%', padding: '0.8rem', background: '#fff7ed', borderRadius: '10px', border: '2px dashed #fb923c', cursor: 'pointer', color: '#ea580c', fontWeight: 500 }} />
                        </div>
                        <button style={{ width: '100%', padding: '1rem', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)', color: 'white', fontWeight: 800, fontSize: '1.1rem', marginTop: '0.5rem', cursor: 'pointer', boxShadow: '0 8px 16px -4px rgba(234, 88, 12, 0.4)', transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0px)' }}>
                            Upload & Submit Securely
                        </button>
                    </form>
                </div>

                {/* ECI Notices Card (Deep Blue Theme) */}
                <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.15)', border: '1px solid #bfdbfe' }}>
                    <h3 style={{ marginTop: 0, color: '#1e3a8a', fontSize: '1.4rem', borderBottom: '2px solid #bfdbfe', paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        🚨 ECI Notice Board
                    </h3>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #ef4444', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            <strong style={{ color: '#ef4444' }}>URGENT:</strong> Check all VVPAT seals in Sector 4.
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.4rem', fontWeight: 500 }}>2 mins ago</div>
                        </div>
                        <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #f97316', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            Submit 11:00 AM turnout stats immediately.
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.4rem', fontWeight: 500 }}>1 hour ago</div>
                        </div>
                        <div style={{ background: '#ffffff', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid #22c55e', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                            Deployment Plan approved for tomorrow.
                            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.4rem', fontWeight: 500 }}>Yesterday</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Auditor Tools: Section 5.5 - Premium Green Theme */}
            <div style={{ marginTop: '3rem', background: '#ffffff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.1)', border: '1px solid #bbf7d0', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative Top Bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', background: 'linear-gradient(90deg, #16a34a, #22c55e)' }}></div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#dcfce7', padding: '0.8rem', borderRadius: '12px', color: '#16a34a' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                    </div>
                    <h2 style={{ margin: 0, color: '#15803d', fontSize: '1.8rem', fontWeight: '800' }}>
                        Auditor Forensic Tools
                    </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', background: '#f0fdf4', padding: '2rem', borderRadius: '12px', border: '1px solid #86efac' }}>
                    <div style={{ flex: '1 1 500px' }}>
                        <h3 style={{ margin: '0 0 0.8rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#166534', fontSize: '1.3rem' }}>
                            Secure Data Export (Immutable Ledger)
                        </h3>
                        <p style={{ margin: 0, color: '#14532d', lineHeight: '1.6', fontSize: '1rem' }}>
                            Download the complete public ledger for offline forensic analysis.
                            The export is packaged as a highly-compressed <strong style={{ color: '#14532d' }}>.zip</strong> archive containing the raw <code style={{ background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#166534', fontSize: '0.9rem', border: '1px solid #bbf7d0' }}>ledger.json</code>
                            and a cryptographic <code style={{ background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: '6px', color: '#166534', fontSize: '0.9rem', border: '1px solid #bbf7d0' }}>signature.sha256</code> to mathematically verify data integrity against any tampering.
                        </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', flex: '1 1 max-content' }}>
                        <button
                            onClick={handleExportLedger}
                            disabled={exporting}
                            style={{
                                background: exporting ? '#94a3b8' : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                                color: 'white',
                                padding: '1.2rem 2.5rem',
                                borderRadius: '12px',
                                border: 'none',
                                cursor: exporting ? 'not-allowed' : 'pointer',
                                fontSize: '1.15rem',
                                fontWeight: 'bold',
                                boxShadow: exporting ? 'none' : '0 10px 20px -5px rgba(22, 163, 74, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.8rem',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: exporting ? 'none' : 'translateY(0)'
                            }}
                            onMouseOver={(e) => { if (!exporting) e.currentTarget.style.transform = 'translateY(-3px)' }}
                            onMouseOut={(e) => { if (!exporting) e.currentTarget.style.transform = 'translateY(0px)' }}
                        >
                            {exporting ? (
                                <>
                                    <svg className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                                    Packaging Secure Ledger...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                    Download Ledger (.zip)
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Embedded Keyframes for Spinner */}
            <style>
                {`
                    @keyframes spin {
                        100% { transform: rotate(360deg); }
                    }
                `}
            </style>
        </div>
    );
};

export default ReportsView;
