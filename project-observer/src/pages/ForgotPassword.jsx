import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import API_BASE from '../config/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE}/api/observer/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (data.success) {
                // Only show demo OTP if provided (fallback mode), otherwise use standard message
                if (data.demoOtp) {
                    setMessage(`OTP Sent! (Demo Code: ${data.demoOtp})`);
                } else {
                    setMessage(data.message);
                }
                setStep(2);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch(`${API_BASE}/api/observer/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await response.json();
            if (data.success) {
                setMessage('OTP Verified. Set new password.');
                setStep(3);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Verification failed');
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/api/observer/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            });
            const data = await response.json();
            if (data.success) {
                alert('Password reset successfully! Please login.');
                navigate('/');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Reset failed');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e3f2fd', // Light Blue fallback
            padding: '1rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2.5rem',
                borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '450px',
                border: '1px solid #dee2e6'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: '#192742', margin: 0, fontSize: '1.8rem' }}>Reset Password</h2>
                    <p style={{ color: '#666', marginTop: '0.5rem', fontSize: '0.95rem' }}>
                        {step === 1 && "Enter your email to receive an OTP."}
                        {step === 2 && "Enter the code sent to your email."}
                        {step === 3 && "Create a new secure password."}
                    </p>
                </div>

                {error && <div style={{ color: '#c62828', marginBottom: '1rem', background: '#ffebee', padding: '0.75rem', borderRadius: '8px', border: '1px solid #ffcdd2', fontSize: '0.9rem' }}>⚠️ {error}</div>}
                {message && <div style={{ color: '#2e7d32', marginBottom: '1rem', background: '#e8f5e9', padding: '0.75rem', borderRadius: '8px', border: '1px solid #c8e6c9', fontSize: '0.9rem' }}>✅ {message}</div>}

                {step === 1 && (
                    <form onSubmit={handleSendOtp}>
                        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Registered Email</label>
                            <input
                                type="email"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    fontSize: '1rem',
                                    boxSizing: 'border-box'
                                }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="e.g. observer@eci.gov.in"
                            />
                        </div>
                        <button type="submit" disabled={isLoading} style={{
                            width: '100%',
                            padding: '1rem',
                            background: '#F7941D',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyOtp}>
                        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Enter 6-Digit OTP</label>
                            <input
                                type="text"
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    fontSize: '1rem',
                                    textAlign: 'center',
                                    letterSpacing: '5px',
                                    boxSizing: 'border-box'
                                }}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                placeholder="------"
                                maxLength="6"
                            />
                        </div>
                        <button type="submit" style={{
                            width: '100%',
                            padding: '1rem',
                            background: '#138808',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            Verify Code
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div style={{ marginBottom: '1rem', textAlign: 'left', position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>New Password</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    paddingRight: '3rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxSizing: 'border-box'
                                }}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
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
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div style={{ marginBottom: '1.5rem', textAlign: 'left', position: 'relative' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#333' }}>Confirm Password</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                style={{
                                    width: '100%',
                                    padding: '0.8rem',
                                    paddingRight: '3rem',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    boxSizing: 'border-box'
                                }}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
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
                        <button type="submit" style={{
                            width: '100%',
                            padding: '1rem',
                            background: '#192742',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}>
                            Save New Password
                        </button>
                    </form>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
