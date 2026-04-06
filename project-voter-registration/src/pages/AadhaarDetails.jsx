import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const AadhaarDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormContext();

    return (
        <ECILayout activeStep="E">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">E. Aadhaar Details</h3>
            </div>

            <form className="space-y-6">
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-800">
                        5. Aadhaar Details
                    </label>

                    {/* Option 1: Aadhaar Number */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="radio"
                            id="has_aadhaar"
                            name="aadhaar_option"
                            value="aadhaar"
                            checked={formData.aadhaarOption === 'aadhaar'}
                            onChange={() => updateFormData({ aadhaarOption: 'aadhaar' })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="has_aadhaar" className="text-sm text-gray-700">
                            Aadhaar Number
                        </label>
                    </div>

                    {/* Aadhaar Input Field (Conditional) */}
                    {formData.aadhaarOption === 'aadhaar' && (
                        <div className="ml-7 max-w-sm">
                            <input
                                type="text"
                                placeholder="Enter Aadhaar Number"
                                value={formData.aadhaarNumber}
                                onChange={(e) => updateFormData({ aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Option 2: No Aadhaar */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="radio"
                            id="no_aadhaar"
                            name="aadhaar_option"
                            value="no_aadhaar"
                            checked={formData.aadhaarOption === 'no_aadhaar'}
                            onChange={() => updateFormData({ aadhaarOption: 'no_aadhaar' })}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="no_aadhaar" className="text-sm text-gray-700">
                            I am not able to furnish my Aadhaar Number because I don't have Aadhaar Number.
                        </label>
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/contact-details')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        &uarr; Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (!formData.aadhaarOption) {
                                alert('Please select an Aadhaar option.');
                                return;
                            }
                            if (formData.aadhaarOption === 'aadhaar') {
                                if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
                                    alert('Please enter a valid 12-digit Aadhaar number.');
                                    return;
                                }
                            }
                            updateFormData({ aadhaar: formData.aadhaarNumber });
                            navigate('/gender-details');
                        }}
                        className="px-6 py-2 bg-blue-400 text-white font-medium text-sm rounded hover:bg-blue-500 shadow-sm transition-colors"
                    >
                        &darr; Next
                    </button>
                </div>
            </form>
        </ECILayout>
    );
};

export default AadhaarDetails;
