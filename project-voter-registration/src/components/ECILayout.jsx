import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

const ECILayout = ({ children, activeStep = 'A' }) => {
    const navigate = useNavigate();
    const { state } = useLocation();

    const steps = [
        { id: 'A', label: 'A. Select State, District & AC', path: '/identity' },
        { id: 'B', label: 'B. Personal Details', path: '/personal-details' },
        { id: 'C', label: 'C. Relatives Details', path: '/relatives-details' },
        { id: 'D', label: 'D. Contact Details', path: '/contact-details' },
        { id: 'E', label: 'E. Aadhaar Details', path: '/aadhaar-details' },
        { id: 'F', label: 'F. Gender', path: '/gender-details' },
        { id: 'G', label: 'G. Date of Birth details', path: '/dob-details' },
        { id: 'H', label: 'H. Present Address Details', path: '/present-address-details' },
        { id: 'I', label: 'I. Disability Details', path: '/disability-details' },
        { id: 'J', label: 'J. Family member Details', path: '/family-details' },
        { id: 'K', label: 'K. Declaration', path: '/declaration' },
        { id: 'L', label: 'L. Captcha', path: '/captcha-details' },
        { id: 'M', label: 'M. Face Registration', path: '/face-enroll' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-sm">
            <Header />

            <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-700">
                            Form Particulars
                            <div className="text-xs font-normal text-gray-500 mt-1">Click section to jump</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {steps.map((step) => (
                                <button
                                    key={step.id}
                                    onClick={() => navigate(step.path, { state })}
                                    className={`w-full text-left px-4 py-3 text-xs font-medium transition-colors duration-200 flex items-center
                                        ${activeStep === step.id
                                            ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                                            : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'}`}
                                >
                                    {step.label}
                                </button>
                            ))}
                        </div>

                        {/* Global Action Buttons in Sidebar */}
                        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
                            <button className="w-full px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded hover:bg-blue-600 shadow-sm transition-colors">
                                Preview and Submit
                            </button>
                            <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 shadow-sm transition-colors">
                                Save
                            </button>
                            <button className="w-full px-4 py-2 bg-white border border-blue-500 text-blue-500 text-sm font-medium rounded hover:bg-blue-50 shadow-sm transition-colors">
                                Cancel
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1">
                    <div className="bg-white rounded shadow-sm border border-gray-200 p-6 min-h-[600px]">
                        <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Form 6</h2>
                                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">(See Rules 13(1) and 26)</p>
                                <p className="text-sm font-semibold text-gray-700 mt-1">ELECTION COMMISSION OF INDIA</p>
                                <p className="text-sm text-gray-600">Application Form for New Voters</p>
                            </div>
                        </div>

                        {children}
                    </div>
                </main>
            </div >
        </div >
    );
};

export default ECILayout;
