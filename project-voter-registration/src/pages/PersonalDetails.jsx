import React from 'react';
import { useNavigate } from 'react-router-dom';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const PersonalDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, handleFileChange } = useFormContext();

    // Handlers
    // handleFileChange is now imported from context

    const handleNext = () => {
        if (!formData.firstName) {
            alert('Please enter your First Name.');
            return;
        }
        // Check if image is uploaded (formData.image might be a File object or a string URL if already uploaded)
        // Adjust based on how your context handles it. Assuming formData.image is the file object.
        // If formData.image is null/undefined, block.
        if (!formData.image) {
            alert('Please upload your photograph.');
            return;
        }

        navigate('/relatives-details');
    };

    return (
        <ECILayout activeStep="B">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">B. Personal Details</h3>
            </div>

            <form className="space-y-8">
                {/* Names Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* First Name */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-800">
                            1. First Name followed by Middle Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateFormData({ firstName: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                        />

                    </div>

                    {/* Surname */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-800">
                            Surname (if any)
                        </label>
                        <input
                            type="text"
                            value={formData.surname}
                            onChange={(e) => updateFormData({ surname: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                        />

                    </div>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-800 leading-relaxed">
                        Upload Photograph (Unsigned and Passport size color photograph(4.5 cm X 3.5 cm) showing front view of full face with white background.)<br />
                        (Document size maximum 2MB,.jpg,.jpeg) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center">
                        <label className="flex items-center border border-gray-300 rounded bg-gray-100 px-3 py-1 cursor-pointer hover:bg-gray-200 transition-colors">
                            <span className="text-sm text-gray-700">Choose File</span>
                            <input
                                type="file"
                                accept=".jpg,.jpeg"
                                onChange={(e) => handleFileChange(e, 'image')}
                                className="hidden"
                            />
                        </label>
                        <span className="ml-3 text-sm text-gray-600">
                            {formData.image ? formData.image.name : 'No file chosen'}
                        </span>
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Navigation Buttons */}
                <div className="flex flex-col md:flex-row justify-end items-center gap-4 mt-8">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => navigate('/identity')}
                            className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                        >
                            &uarr; Previous
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            className="px-6 py-2 bg-blue-400 text-white font-medium text-sm rounded hover:bg-blue-500 shadow-sm transition-colors"
                        >
                            Next &darr;
                        </button>
                    </div>
                </div>
            </form>
        </ECILayout>
    );
};

export default PersonalDetails;
