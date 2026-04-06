import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import logo from '../assets/logo.png';

const Landing = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Optional: Check if already logged in
    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleLoginSuccess = (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setIsModalOpen(false);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen relative overflow-hidden font-sans">
            {/* Background with white theme */}
            <div className="absolute inset-0 bg-white z-0" />

            {/* Ambient background blobs - Tricolor Theme */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">

                {/* Main Card - Adjusted for Light Mode */}
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-8 md:p-12 max-w-4xl w-full text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

                    {/* Header Section */}
                    {/* Header Section */}
                    <div className="mb-10 flex flex-col items-center">
                        <img src={logo} alt="TrustBallot Logo" className="h-20 mb-6" />
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-800 mb-6 tracking-tight">
                            Vote <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-500 to-green-500">Securely.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                            Experience the future of democracy. Register, verify, and cast your vote with state-of-the-art encryption and biometric security.
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12 text-left">
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center text-orange-600 mb-4 text-xl">🔒</div>
                            <h3 className="text-slate-800 font-bold text-lg mb-2">Secure & Private</h3>
                            <p className="text-slate-500 text-sm">End-to-end encryption ensures your vote remains anonymous and tamper-proof.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-4 text-xl">⚡</div>
                            <h3 className="text-slate-800 font-bold text-lg mb-2">Instant Access</h3>
                            <p className="text-slate-500 text-sm">Quick verification using Aadhaar and Facial Recognition technology.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4 text-xl">🌍</div>
                            <h3 className="text-slate-800 font-bold text-lg mb-2">Accessible to All</h3>
                            <p className="text-slate-500 text-sm">Designed for ease of use across all devices and accessibility needs.</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group relative inline-flex items-center justify-center px-8 py-4 px-12 font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 font-lg rounded-full hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-blue-400"
                        >
                            <span>Login / Register</span>
                            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                        </button>
                        <p className="text-slate-400 text-sm">
                            Existing user? Simply login to proceed.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="mt-8 text-slate-400 text-xs">
                    &copy; 2026 Election Commission of India. All rights reserved.
                </div>
            </div>

            <LoginModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </div>
    );
};

export default Landing;
