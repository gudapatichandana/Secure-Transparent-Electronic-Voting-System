import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

import axios from 'axios';
import API_BASE from '../config/api';

const TrackStatus = () => {
    const navigate = useNavigate();
    const [referenceId, setReferenceId] = React.useState('');
    const [statusResult, setStatusResult] = React.useState(null);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const handleTrack = async () => {
        if (!referenceId) return;

        setLoading(true);
        setError('');
        setStatusResult(null);

        try {
            console.log(`Fetching status for: ${referenceId}`);

            const token = localStorage.getItem('voter_token');
            const response = await axios.get(`${API_BASE}/api/application/status/${referenceId}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            if (response.data.success) {
                setStatusResult(response.data);
            }
        } catch (err) {
            console.error("Track Status Error:", err);
            setError(err.response?.data?.error || err.message || 'Failed to fetch status. Check Reference ID.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Track Application Status</h2>
                    <p className="text-gray-500 mb-6">Enter your Reference ID to check the current status of your application.</p>

                    <input
                        type="text"
                        placeholder="Enter Reference ID"
                        value={referenceId}
                        onChange={(e) => setReferenceId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-4 focus:ring-2 focus:ring-purple-500 outline-none"
                    />

                    <button
                        onClick={handleTrack}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Checking...' : 'Track Status'}
                    </button>

                    {error && (
                        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}

                    {statusResult && (
                        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg text-left shadow-sm">
                            <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Application Details</h4>
                            <div className="text-sm text-gray-700 space-y-2">
                                <p><span className="font-semibold w-24 inline-block">Name:</span> {statusResult.name}</p>
                                <p><span className="font-semibold w-24 inline-block">Constituency:</span> {statusResult.constituency}</p>

                                <div className="mt-3 pt-2 border-t border-dashed">
                                    <p className="flex items-center">
                                        <span className="font-semibold w-24 inline-block">Status: </span>
                                        <span className={`font-bold px-2 py-1 rounded text-xs ${statusResult.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                            statusResult.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {statusResult.status}
                                        </span>
                                    </p>

                                    {statusResult.status === 'APPROVED' && (
                                        <p className="mt-2 text-green-700 bg-green-50 p-2 rounded border border-green-100">
                                            <span className="font-bold">EPIC Number:</span> {statusResult.voter_id}
                                        </p>
                                    )}

                                    {statusResult.status === 'REJECTED' && (
                                        <p className="mt-2 text-red-700 bg-red-50 p-2 rounded border border-red-100">
                                            <span className="font-bold">Reason:</span> {statusResult.rejection_reason || 'No reason provided'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-6 text-sm text-gray-500 hover:text-gray-700 hover:underline block w-full"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrackStatus;
