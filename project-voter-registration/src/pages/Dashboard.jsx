import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (!storedUser) {
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            {/* Main Content */}
            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Dashboard</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Card 1: New Voter Registration */}
                        <div
                            onClick={() => navigate('/identity')}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-blue-200 transition-all cursor-pointer group"
                        >
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                                📝
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">New Voter Registration</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Apply for inclusion of name in the electoral roll. Fill Form 6 for new voter registration.
                            </p>
                            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                Start Application
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </div>
                        </div>

                        {/* Card 2: Track Application Status */}
                        <div
                            onClick={() => navigate('/track-status')}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 hover:shadow-xl hover:border-green-200 transition-all cursor-pointer group"
                        >
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                                🔍
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Track Application Status</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Check the status of your submitted application using the reference ID generated.
                            </p>
                            <div className="mt-6 flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                Check Status
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
