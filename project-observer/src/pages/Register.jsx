import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import API_BASE from '../config/api';

const Register = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobile_number: '',
        password: '',
        confirmPassword: '',
        role: 'general' // Default role
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE}/api/observer/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    mobile_number: formData.mobile_number, // Changed from username to mobile_number
                    password: formData.password,
                    role: formData.role
                })
            });

            const data = await response.json();

            if (data.success) {
                // Redirect to login with success message
                navigate('/?registration=success');
            } else {
                setError(data.error || 'Registration failed');
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
                {/* Left Side: Visuals - Identical to Login.jsx */}
                <div className="login-visual">
                    {/* TrustBallot Branding in Visual Area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <img
                            src="/assets/images/logo.png"
                            alt="TrustBallot Logo"
                            style={{ height: '80px', width: 'auto', background: 'white', borderRadius: '12px', padding: '5px' }}
                        />
                    </div>

                    <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', color: 'white' }}>{t('register.title')}</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.95, lineHeight: 1.6, fontWeight: 500 }}>
                        {t('register.subtitle')}
                    </p>

                    <div style={{ margin: '2rem 0', borderLeft: '3px solid #F7941D', paddingLeft: '1rem' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.5, fontStyle: 'italic' }}>
                            "{t('register.legal_disclaimer')}"
                        </p>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '0.5px', fontWeight: 500 }}>
                                {t('login.secure_access')}
                            </div>
                            <div style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.1)', letterSpacing: '0.5px', fontWeight: 500 }}>
                                {t('login.encrypted')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="login-form-section">
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#192742' }}>Create Account</h2>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>Enter your details to register as an Observer.</p>

                    {/* Role Toggle */}
                    <div className="role-toggle" style={{ marginBottom: '1.5rem' }}>
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'general' ? 'active' : ''}`}
                            onClick={() => handleRoleChange('general')}
                        >
                            {t('login.general_obs')}
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'expenditure' ? 'active' : ''}`}
                            onClick={() => handleRoleChange('expenditure')}
                        >
                            {t('login.expenditure_obs')}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('register.full_name')}</label>
                            <input
                                type="text"
                                className="input-field"
                                name="fullName"
                                placeholder="e.g. Rahul Sharma"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Email Address</label>
                            <input
                                type="email"
                                className="input-field"
                                name="email"
                                placeholder="e.g. observer@eci.gov.in"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Mobile Number</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} color="#666" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input
                                    type="text"
                                    name="mobile_number"
                                    className="input-field"
                                    placeholder="e.g. 9876543210"
                                    value={formData.mobile_number}
                                    onChange={handleChange}
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
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
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

                        <div className="input-group" style={{ position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>{t('register.confirm_password')}</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="input-field"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                style={{ paddingRight: '3rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
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
                                background: '#138808', // Green for Registration
                                color: 'white',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(19, 136, 8, 0.3)',
                                transition: 'all 0.3s'
                            }}
                        >
                            {isLoading ? t('login.verifying') : `${t('register.submit')} ?`}
                        </button>
                    </form>

                    <p style={{ marginTop: '2rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
                        {t('register.login_prompt')} <Link to="/" style={{ color: '#F7941D', fontWeight: 'bold', textDecoration: 'none' }}>{t('register.login_link')}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
