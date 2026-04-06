import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import API_BASE from '../config/api';

const Login = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('general'); // 'general' | 'expenditure'
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // const location = useLocation();
    // const [successMessage, setSuccessMessage] = useState('');

    // useEffect(() => {
    //     if (location.state?.message) {
    //         setSuccessMessage(t(`login.${location.state.message}`));
    //         // Clear state to prevent message reappearing on refresh
    //         window.history.replaceState({}, document.title);
    // useEffect(() => {
    //     if (location.state?.message) {
    //         setSuccessMessage(t(`login.${location.state.message}`));
    //         // Clear state to prevent message reappearing on refresh
    //         window.history.replaceState({}, document.title);
    //     }
    // }, [location, t]);

    const [searchParams] = useSearchParams();
    const successMessage = searchParams.get('registration') === 'success' ? t('login.registration_success') : '';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/observer/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile_number: mobileNumber, password, role })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('observer_token', data.token);
                localStorage.setItem('observer', JSON.stringify(data.observer));
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Server connection failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                {/* Left Side: Visuals */}
                <div className="login-visual">
                    {/* TrustBallot Branding in Visual Area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <img
                            src="/assets/images/logo.png"
                            alt="TrustBallot Logo"
                            style={{ height: '80px', width: 'auto', background: 'white', borderRadius: '12px', padding: '5px' }}
                        />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'white' }}>{t('login.title')}</h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.6 }}>
                        {t('login.subtitle')}
                        <br /><br />
                        Access the ECI's secure monitoring tools, real-time analytics, and statutory reporting modules.
                    </p>
                    <div style={{ marginTop: 'auto', display: 'flex', gap: '1rem' }}>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                            {t('login.secure_access')}
                        </div>
                        <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                            {t('login.encrypted')}
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="login-form-section">
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#192742' }}>{t('login.welcome')}</h2>
                    <p style={{ color: '#666', marginBottom: '2.5rem' }}>{t('login.identify')}</p>

                    {successMessage && (
                        <div style={{
                            marginBottom: '1.5rem',
                            padding: '1rem',
                            background: '#e8f5e9',
                            color: '#2e7d32',
                            borderRadius: '8px',
                            fontWeight: '600',
                            border: '1px solid #c8e6c9',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            ? {successMessage}
                        </div>
                    )}

                    {/* Tricolor Role Toggle */}
                    <div style={{ marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Select Your Role:</div>
                    <div className="role-toggle">
                        <button
                            className={`role-btn ${role === 'general' ? 'active' : ''}`}
                            onClick={() => setRole('general')}
                        >
                            {t('login.general_obs')}
                        </button>
                        <button
                            className={`role-btn ${role === 'expenditure' ? 'active' : ''}`}
                            onClick={() => setRole('expenditure')}
                        >
                            {t('login.expenditure_obs')}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Mobile Number</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} color="#666" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. 9876543210"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                    style={{ paddingLeft: '3rem' }}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('login.password')}</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="input-field"
                                placeholder="Enter secure password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '2.3rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0.25rem'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                            <Link to="/forgot-password" style={{ color: '#F7941D', fontSize: '0.9rem', textDecoration: 'none' }}>{t('login.forgot_password', 'Forgot Password?')}</Link>
                        </div>


                        {error && <div style={{ color: '#d32f2f', marginBottom: '1.5rem', fontWeight: 500, background: '#ffebee', padding: '1rem', borderRadius: '8px' }}>?? {error}</div>}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                background: '#F7941D', // Saffron for Primary Action
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(247, 148, 29, 0.3)',
                                transition: 'all 0.3s'
                            }}
                        >
                            {isLoading ? t('login.verifying') : `${t('login.access_portal')} ?`}
                        </button>
                    </form>

                    <p style={{ marginTop: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                        {t('login.register_prompt')} <Link to="/register" style={{ color: '#F7941D', fontWeight: 'bold', textDecoration: 'none' }}>{t('login.register_link')}</Link>
                    </p>
                    <p style={{ marginTop: '1rem', textAlign: 'center', color: '#888', fontSize: '0.8rem', opacity: 0.7 }}>
                        {t('login.unauthorized')}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
