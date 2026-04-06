import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const DateOfBirthDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, handleFileChange } = useFormContext();

    return (
        <ECILayout activeStep="G">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">G. Date of Birth details</h3>
            </div>

            <form className="space-y-6">
                {/* 7(a) Date of Birth */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-800">
                        7(a.)<br />Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => updateFormData({ dob: e.target.value })}
                        className="w-full md:w-1/3 border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                    />
                </div>

                {/* 7(b) Document Proof */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-800">
                        7(b.)Self attested copy of document supporting age proof attached
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Option 1: Standard Document */}
                        <div className="space-y-3">
                            <label className="flex items-start space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="docType"
                                    value="proof"
                                    checked={formData.dobDocumentType === 'proof'}
                                    onChange={() => updateFormData({ dobDocumentType: 'proof' })}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Document for proof of Date of Birth</span>
                            </label>

                            <select
                                value={formData.dobSelectedDoc}
                                onChange={(e) => updateFormData({ dobSelectedDoc: e.target.value })}
                                disabled={formData.dobDocumentType !== 'proof'}
                                className={`w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formData.dobDocumentType !== 'proof' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Select Document</option>
                                <option value="birth_certificate">Birth Certificate</option>
                                <option value="aadhaar">Aadhaar Card</option>
                                <option value="pan">PAN Card</option>
                                <option value="driving_license">Driving License</option>
                                <option value="passport">Passport</option>
                            </select>
                        </div>

                        {/* Option 2: Other Document */}
                        <div className="space-y-3">
                            <label className="flex items-start space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="docType"
                                    value="other"
                                    checked={formData.dobDocumentType === 'other'}
                                    onChange={() => updateFormData({ dobDocumentType: 'other' })}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Any other Document for proof of Date of Birth (If no document is available) (Pl. Specify)
                                </span>
                            </label>

                            <input
                                type="text"
                                value={formData.dobOtherDocSpec}
                                onChange={(e) => updateFormData({ dobOtherDocSpec: e.target.value })}
                                disabled={formData.dobDocumentType !== 'other'}
                                className={`w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 ${formData.dobDocumentType !== 'other' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-800">
                        (b) Self-attested copy of document supporting age proof attached <span className="text-red-600">*</span>
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'dobProofFile')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {formData.dobProofFile ? (
                            <div className="text-sm text-green-600 font-medium">Document Uploaded (Ready)</div>
                        ) : (
                            <div className="space-y-2">
                                <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 2MB)</p>
                            </div>
                        )}
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/gender-details')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        &uarr; Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (!formData.dob) {
                                alert('Please enter your Date of Birth.');
                                return;
                            }
                            if (!formData.dobProofFile) {
                                alert('Please upload a document for proof of Date of Birth.');
                                return;
                            }
                            updateFormData({ dob: formData.dob });
                            navigate('/present-address-details');
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

export default DateOfBirthDetails;
