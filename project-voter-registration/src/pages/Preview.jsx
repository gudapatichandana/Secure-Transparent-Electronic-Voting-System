import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';
import axios from 'axios';
import API_BASE from '../config/api';

const Preview = () => {
    const { formData } = useFormContext();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');

        try {
            const response = await axios.post(`${API_BASE}/api/registration/submit`, {
                aadhaar: formData.aadhaarNumber || 'NO_AADHAAR',
                formData: formData, // Contains Base64 files
                faceDescriptor: formData.faceDescriptor
            });

            if (response.data.success) {
                navigate('/success', {
                    state: {
                        voterId: response.data.voterId,
                        referenceId: response.data.referenceId,
                        name: `${formData.firstName} ${formData.surname}`
                    }
                });
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Submission failed. Please try again.');
            setSubmitting(false);
        }
    };

    const renderField = (label, value) => (
        <div className="mb-2">
            <span className="text-gray-500 text-sm block">{label}</span>
            <span className="font-semibold text-gray-800">{value || '-'}</span>
        </div>
    );

    return (
        <ECILayout activeStep="Preview">
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">Application Preview</h3>
            </div>

            <div className="space-y-8">
                {/* Personal Details */}
                <section className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">Personal Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {renderField('Name', `${formData.firstName} ${formData.surname}`)}
                        {renderField('Date of Birth', `${formData.dobDay}/${formData.dobMonth}/${formData.dobYear}`)}
                        {renderField('Gender', formData.gender)}
                        {renderField('Mobile', formData.mobileNumber)}
                        {renderField('Email', formData.email)}
                    </div>
                </section>

                {/* Address */}
                <section className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">Address</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField('Address', `${formData.houseNo}, ${formData.streetArea}, ${formData.villageTown}`)}
                        {renderField('District/State', `${formData.district}, ${formData.state} - ${formData.pincode}`)}
                        {renderField('Constituency', formData.assemblyConstituency)}
                    </div>
                </section>

                {/* Identity & Family */}
                <section className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">Identity & Family</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderField('Aadhaar Number', formData.aadhaarNumber)}
                        {renderField('Relative Name', `${formData.relativeName} ${formData.relativeSurname} (${formData.relationType})`)}
                    </div>
                </section>

                {/* Documents & Biometric */}
                <section className="bg-white p-4 rounded shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold text-blue-600 mb-4 border-b pb-2">Documents & Biometrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Profile Image */}
                        <div>
                            <span className="text-gray-500 text-sm block mb-1">Photograph</span>
                            {formData.imageFile ? (
                                <img src={formData.imageFile} alt="Profile" className="w-24 h-24 object-cover rounded border" />
                            ) : <span className="text-red-500 text-sm">Not Uploaded</span>}
                        </div>

                        {/* Other Docs Status */}
                        <div className="col-span-3 grid grid-cols-3 gap-4">
                            {renderField('DOB Proof', formData.dobProofFile ? 'Uploaded' : 'Not Uploaded')}
                            {renderField('Address Proof', formData.addressProofFile ? 'Uploaded' : 'Not Uploaded')}
                            {renderField('Face Scan', formData.faceDescriptor ? 'Completed' : 'Not Completed')}
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/face-enroll')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        Edit Details
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className={`px-8 py-2 bg-green-600 text-white font-bold text-sm rounded hover:bg-green-700 shadow-sm transition-colors ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Submitting...' : 'Final Submit'}
                    </button>
                </div>
            </div>
        </ECILayout>
    );
};

export default Preview;
