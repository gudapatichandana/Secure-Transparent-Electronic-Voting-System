import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FaceScanner from '../components/FaceScanner';
import { useFormContext } from '../context/FormContext';
import ECILayout from '../components/ECILayout';

const FaceEnrollment = () => {
    const navigate = useNavigate();
    const { updateFormData } = useFormContext();
    const [error, setError] = useState("");
    const [isCaptured, setIsCaptured] = useState(false);

    const handleEnroll = (descriptor) => {
        console.log("FaceEnrollment: Received descriptor from Scanner", descriptor);

        // Descriptor comes as Float32Array from `face-api.js` (inside FaceScanner)
        // Convert to standard Array for JSON serialization
        const descriptorArray = Array.from(descriptor);

        updateFormData({ faceDescriptor: descriptorArray });
        setIsCaptured(true);
    };

    const handleScanFailure = (err) => {
        console.error("Scan Failure:", err);
        setError(err.message || "Face Scan Failed");
        setIsCaptured(false);
    };

    const handleSubmit = () => {
        if (isCaptured) {
            navigate('/success');
        } else {
            setError("Please complete face biometric verification first.");
        }
    };

    return (
        <ECILayout activeStep="Face Enrollment">
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 bg-gray-50">

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Biometric Verification (Final)</h2>
                    <p className="text-gray-600">Secure AI-powered Identity Check</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-lg">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {isCaptured ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Face Captured Successfully</h3>
                            <p className="text-gray-500">Your biometric data has been securely recorded.</p>
                            <button
                                onClick={() => setIsCaptured(false)}
                                className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                                Retake Photo
                            </button>
                        </div>
                    ) : (
                        /* 
                            Using the exact FaceScanner component.
                            mode="enroll" ensures it captures the first valid face and calls onEnroll.
                        */
                        <FaceScanner
                            mode="enroll"
                            onEnroll={handleEnroll}
                            onScanFailure={handleScanFailure}
                        />
                    )}
                </div>

                <div className="mt-8 flex gap-6">
                    <button
                        onClick={() => navigate('/captcha-details')}
                        className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 hover:shadow-md transition-all"
                    >
                        Back
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={!isCaptured}
                        className={`px-8 py-3 font-bold rounded-xl shadow-md transition-all flex items-center gap-2
                            ${isCaptured
                                ? 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-1'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                        Submit Application &rarr;
                    </button>
                </div>
            </div>
        </ECILayout>
    );
};

export default FaceEnrollment;
