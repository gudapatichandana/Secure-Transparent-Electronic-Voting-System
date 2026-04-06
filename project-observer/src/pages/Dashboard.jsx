import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RealTimeView from '../components/RealTimeView';
import LedgerView from '../components/LedgerView';
import ReportsView from '../components/ReportsView';
import VoteVerification from '../components/VoteVerification';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Dashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [observer, setObserver] = useState(null);
    const [view, setView] = useState('hub'); // 'hub', 'realtime', 'ledger', 'reports', 'verify'

    useEffect(() => {
        const storedObserver = localStorage.getItem('observer');
        if (!storedObserver) {
            navigate('/');
        } else {
            setObserver(JSON.parse(storedObserver));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('observer');
        localStorage.removeItem('observer_token');
        navigate('/');
    };

    if (!observer) return null;

    const DashboardHub = ({ t, setView, observer }) => (
        <>
            <div className="m5-hero">
                <div className="m5-hero-bg-icon">🛡️</div>
                <div className="m5-hero-content">
                    <h1>{t('hero.title')}</h1>
                    <p>
                        {t('hero.subtitle')}
                    </p>

                    <div className="m5-widgets">
                        <div className="m5-glass-widget">
                            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.25rem' }}>{t('hero.system_status')}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📡 <span>{t('hero.online')}</span>
                            </div>
                        </div>

                        <div className="m5-glass-widget">
                            <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.25rem' }}>{t('hero.activity')}</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                📈 <span>+12% {t('hero.trend')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="m5-section-title">{t('actions.title')}</h2>

            <div className="m5-grid">
                {/* General Observer: Real-Time Turnout */}
                {observer.role === 'general' && (
                    <div className="m5-card" onClick={() => setView('realtime')}>
                        <div>
                            <div className="m5-icon-box" style={{ background: '#e8f5e9', color: '#2e7d32' }}>
                                📊
                            </div>
                            <h3>{t('actions.realtime_title')}</h3>
                            <p>{t('actions.realtime_desc')}</p>
                        </div>
                        <div className="m5-access-link" style={{ color: '#2e7d32' }}>
                            {t('actions.access_analytics')} →
                        </div>
                    </div>
                )}

                {/* Expenditure Observer: Public Ledger */}
                {observer.role === 'expenditure' && (
                    <div className="m5-card" onClick={() => setView('ledger')}>
                        <div>
                            <div className="m5-icon-box" style={{ background: '#fff3e0', color: '#f57c00' }}>
                                ⛓️
                            </div>
                            <h3>{t('actions.ledger_title')}</h3>
                            <p>{t('actions.ledger_desc')}</p>
                        </div>
                        <div className="m5-access-link" style={{ color: '#f57c00' }}>
                            {t('actions.view_ledger')} →
                        </div>
                    </div>
                )}

                {/* Common: Reports - Blue Theme */}
                <div className="m5-card" onClick={() => setView('reports')}>
                    <div>
                        <div className="m5-icon-box" style={{ background: '#e3f2fd', color: '#1565c0' }}>
                            📝
                        </div>
                        <h3>{t('actions.reports_title')}</h3>
                        <p>{t('actions.reports_desc')}</p>
                    </div>
                    <div className="m5-access-link" style={{ color: '#1565c0' }}>
                        {t('actions.open_module')} →
                    </div>
                </div>

                {/* Vote Verification - Common for All Observers */}
                <div className="m5-card" onClick={() => setView('verify')}>
                    <div>
                        <div className="m5-icon-box" style={{ background: '#f3e5f5', color: '#7b1fa2' }}>
                            ✓
                        </div>
                        <h3>Vote Verification</h3>
                        <p>Verify voter receipts and confirm votes were recorded</p>
                    </div>
                    <div className="m5-access-link" style={{ color: '#7b1fa2' }}>
                        Verify Receipt →
                    </div>
                </div>

                {/* Common: Emergency - Red Theme */}
                <div className="m5-card" onClick={() => alert('Emergency Protocol Initiated')} style={{ border: '1px solid #ffebee' }}>
                    <div>
                        <div className="m5-icon-box" style={{ background: '#ffebee', color: '#c62828' }}>
                            🚨
                        </div>
                        <h3 style={{ color: '#c62828' }}>{t('actions.emergency_title')}</h3>
                        <p>{t('actions.emergency_desc')}</p>
                    </div>
                    <div className="m5-access-link" style={{ color: '#c62828' }}>
                        {t('actions.initiate_protocol')} →
                    </div>
                </div>
            </div>

            {/* Chat Bubble Bottom Right */}
            <div className="m5-chat-bubble">
                💬
            </div>
        </>
    );

    return (
        <div>
            {/* Header M-5 Style with TrustBallot Branding */}
            <header className="m5-header">
                <div className="m5-logo">
                    <img
                        src="/assets/images/logo.png"
                        alt="TrustBallot Logo"
                        style={{ height: '50px', width: 'auto' }}
                    />
                    <span>{t('header.title')}</span>
                </div>

                <nav className="m5-nav">
                    <div className={`m5-nav-item ${view === 'hub' ? 'active' : ''}`} onClick={() => setView('hub')}>{t('header.dashboard')}</div>
                    <div className="m5-nav-item" onClick={() => setView('realtime')}>{t('header.analytics')}</div>
                    <div className="m5-nav-item" onClick={() => setView('reports')}>{t('header.reports')}</div>
                    <div className="m5-nav-item">{t('header.help')}</div>
                </nav>

                <div className="m5-user-actions">
                    <LanguageSwitcher />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: '#333' }}>• {t('header.observer')} ({observer.role ? observer.role.toUpperCase() : 'GENERAL'})</span>
                    </div>
                    <button className="m5-logout-btn" onClick={handleLogout}>
                        <span>{t('header.logout')}</span>
                    </button>
                </div>
            </header>

            <main className="m5-container">
                {/* Back Button (Only show if not in Hub) */}
                {view !== 'hub' && (
                    <button
                        onClick={() => setView('hub')}
                        style={{
                            marginBottom: '1.5rem',
                            padding: '0.5rem 1rem',
                            border: '1px solid #ddd',
                            background: 'white',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: 600,
                            color: '#555'
                        }}
                    >
                        ← Back to Dashboard
                    </button>
                )}

                {view === 'hub' && <DashboardHub t={t} setView={setView} observer={observer} />}
                {view === 'realtime' && <RealTimeView />}
                {view === 'ledger' && <LedgerView />}
                {view === 'reports' && <ReportsView />}
                {view === 'verify' && <VoteVerification />}
            </main>
        </div>
    );
};

export default Dashboard;
