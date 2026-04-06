import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';


const TransliterationInput = ({ label, value, onChange, required = false }) => (
    <div className="space-y-3">
        <label className="block text-sm font-bold text-gray-800">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
        />
    </div>
);

const PresentAddressDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, handleFileChange } = useFormContext();
    const [locationData, setLocationData] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const { fetchLocationData } = await import('../utils/api');
                const data = await fetchLocationData();
                setLocationData(data);
            } catch (e) {
                console.error("Failed to load location data", e);
            }
        };
        loadData();
    }, []);



    return (
        <ECILayout activeStep="H">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">H. Present Address Details</h3>
            </div>

            <form className="space-y-8">
                <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-4">8(a.) Present Ordinary Residence (Full Address)</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <TransliterationInput
                            label="House/Building/ Apartment No"
                            value={formData.houseNo}
                            onChange={(val) => updateFormData({ houseNo: val })}
                            required
                        />
                        <TransliterationInput
                            label="Street/Area/Locality/Mohalla/Road"
                            value={formData.streetClass}
                            onChange={(val) => updateFormData({ streetClass: val })}
                            required
                        />
                        <TransliterationInput
                            label="Village/Town"
                            value={formData.village}
                            onChange={(val) => updateFormData({ village: val })}
                            required
                        />

                        <TransliterationInput
                            label="Post Office"
                            value={formData.postOffice}
                            onChange={(val) => updateFormData({ postOffice: val })}
                            required
                        />

                        {/* PIN Code - No transliteration */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-800">
                                PIN Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.pinCode}
                                onChange={(e) => updateFormData({ pinCode: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            {/* Empty div to align grid if needed, or just leave as single input */}
                        </div>

                        <TransliterationInput
                            label="Tehsil/Taluqa/Mandal"
                            value={formData.tehsil}
                            onChange={(val) => updateFormData({ tehsil: val })}
                            required
                        />
                    </div>

                    {/* District & State Dropdowns */}
                    {/* District & State Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                State/UT <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.addressState}
                                onChange={(e) => updateFormData({ addressState: e.target.value, addressDistrict: '' })}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select State</option>
                                {Object.keys(locationData).map((state) => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                District <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.addressDistrict}
                                onChange={(e) => updateFormData({ addressDistrict: e.target.value })}
                                disabled={!formData.addressState}
                                className={`w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!formData.addressState ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Select District</option>
                                {formData.addressState && locationData[formData.addressState]?.districts &&
                                    Object.keys(locationData[formData.addressState].districts).map((dist) => (
                                        <option key={dist} value={dist}>
                                            {dist}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                </div>

                {/* 8(b) Address Proof Section */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-800 leading-relaxed">
                        8(b.) Self-attested copy of address proof either in the name of applicant or any one of parents/spouse/adult child, if already enrolled as elector at the same address<br />
                        (Attach anyone of them)
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        {/* Option 1: Standard Document */}
                        <div className="space-y-3">
                            <label className="flex items-start space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="docType"
                                    value="proof"
                                    checked={formData.addressProofType === 'proof'}
                                    onChange={() => updateFormData({ addressProofType: 'proof' })}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">Document for Proof of Residence</span>
                            </label>

                            <select
                                value={formData.addressSelectedDoc}
                                onChange={(e) => updateFormData({ addressSelectedDoc: e.target.value })}
                                disabled={formData.addressProofType !== 'proof'}
                                className={`w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 ${formData.addressProofType !== 'proof' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="">Select Document</option>
                                <option value="aadhaar">Aadhaar Card</option>
                                <option value="passport">Passport</option>
                                <option value="water_bill">Water Bill</option>
                                <option value="electricity_bill">Electricity Bill</option>
                            </select>
                        </div>

                        {/* Option 2: Other Document */}
                        <div className="space-y-3">
                            <label className="flex items-start space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="docType"
                                    value="other"
                                    checked={formData.addressProofType === 'other'}
                                    onChange={() => updateFormData({ addressProofType: 'other' })}
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    Any other document for Proof of Residence (If no document is available) (Pl. Specify)
                                </span>
                            </label>

                            <input
                                type="text"
                                value={formData.addressOtherDocSpec}
                                onChange={(e) => updateFormData({ addressOtherDocSpec: e.target.value })}
                                disabled={formData.addressProofType !== 'other'}
                                className={`w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 ${formData.addressProofType !== 'other' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            />
                        </div>
                    </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-800">
                        (b) Self-attested copy of address proof either in the name of applicant or any one of parents/spouse/adult child included in the electoral roll at the same address <span className="text-red-600">*</span>
                    </p>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, 'addressProofFile')}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {formData.addressProofFile ? (
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
                        onClick={() => navigate('/dob-details')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        &uarr; Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            // Validation
                            const requiredFields = ['houseNo', 'streetClass', 'village', 'postOffice', 'pinCode', 'tehsil', 'addressState', 'addressDistrict'];
                            for (const field of requiredFields) {
                                if (!formData[field]) {
                                    alert(`Please fill the ${field} field.`);
                                    return;
                                }
                            }
                            if (!formData.addressProofFile) {
                                alert('Please upload a document for proof of residence.');
                                return;
                            }
                            // Construct full address string
                            const fullAddress = `${formData.houseNo}, ${formData.streetClass}, ${formData.village}, ${formData.postOffice}, PIN: ${formData.pinCode}, ${formData.tehsil}, ${formData.addressDistrict}, ${formData.addressState}`;
                            updateFormData({ address: fullAddress });
                            navigate('/disability-details');
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

export default PresentAddressDetails;
