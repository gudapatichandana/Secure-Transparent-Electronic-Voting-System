import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const Success = () => {
    const navigate = useNavigate();
    const { formData } = useFormContext();
    const [referenceId, setReferenceId] = useState(null);
    const [status, setStatus] = useState('Submitting Application...');
    const [error, setError] = useState(null);
    const hasSubmitted = useRef(false);

    useEffect(() => {
        const submitApplication = async () => {
            if (hasSubmitted.current) return;
            hasSubmitted.current = true;

            console.log("Success Page: Submitting...", formData);
            if (!formData.faceDescriptor) {
                console.error("Success Page: NO FACE DESCRIPTOR in formData!");
            }

            try {
                // Determine port - assuming backend is on 5000 based on previous context
                const API_URL = '/api/registration/submit';

                // Basic validation
                if (!formData.faceDescriptor) {
                    throw new Error("Biometric data missing. Please complete face enrollment.");
                }

                if (!formData.firstName && !formData.aadhaarNumber) {
                    // If context is empty (reload), show error or redirect
                    // For now, allow dry run or handle error
                    // throw new Error("Incomplete form data. Please restart.");
                }

                const payload = {
                    aadhaar: formData.aadhaarNumber,
                    faceDescriptor: formData.faceDescriptor,
                    formData: {
                        firstName: formData.firstName,
                        surname: formData.surname,
                        gender: formData.gender,
                        dobDay: formData.dob ? formData.dob.split('-')[2] : '01',
                        dobMonth: formData.dob ? formData.dob.split('-')[1] : '01',
                        dobYear: formData.dob ? formData.dob.split('-')[0] : '2000',

                        assemblyConstituency: formData.assemblyConstituency,

                        mobileSelf: formData.mobileSelf,
                        mobileNumber: formData.mobileNumber,
                        mobileRelativeNumber: formData.mobileRelativeNumber,

                        emailSelf: formData.emailSelf,
                        email: formData.emailId,
                        emailRelative: formData.emailRelative,

                        houseNo: formData.houseNo,
                        streetArea: formData.streetClass,
                        villageTown: formData.village, // Use Present Address village, not birth place
                        district: formData.district,
                        state: formData.state,
                        pincode: formData.pinCode,

                        relativeName: formData.relativeName,
                        relativeSurname: formData.relativeSurname,
                        relationType: formData.relationType,

                        disabilityOtherSpec: formData.disabilityOtherSpec,
                        disabilityCategories: formData.disabilityCategories,

                        image: formData.image, // Ensure this matches FormContext key
                        dobProofFile: formData.dobProofFile,
                        addressProofFile: formData.addressProofFile,
                        disabilityFile: formData.disabilityFile
                    }
                };

                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || "Submission failed");
                }

                const data = await response.json();
                setReferenceId(data.referenceId);
                setStatus('Application Submitted Successfully');

            } catch (err) {
                console.error("Submission Error:", err);
                setError(err.message);
                setStatus('Submission Failed');
            }
        };

        submitApplication();
    }, [formData]);

    // Render Logic
    if (error) {
        return (
            <ECILayout activeStep="Success">
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
                    <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm max-w-lg w-full">
                        <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission Failed</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </ECILayout>
        );
    }

    return (
        <ECILayout activeStep="Success">
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">

                {referenceId ? (
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 max-w-lg w-full">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
                        <p className="text-gray-500 mb-6">Your application has been successfully submitted to the Election Commission.</p>

                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-8">
                            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide mb-1">Reference ID</p>
                            <p className="text-3xl font-mono font-bold text-blue-900 tracking-wider select-all">
                                {referenceId}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.print()}
                                className="w-full bg-white border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Download Acknowledgement
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-lg font-medium text-gray-600">{status}</p>
                    </div>
                )}
            </div>
        </ECILayout>
    );
};

export default Success;
