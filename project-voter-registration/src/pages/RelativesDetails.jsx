import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const RelativesDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormContext();

    return (
        <ECILayout activeStep="C">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">C. Name and Surname of any one of the relatives</h3>
            </div>

            <form className="space-y-6">
                {/* 2(a) Relatives Type Selection */}
                <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">
                        2(a.) Relatives
                    </label>
                    <div className="flex flex-wrap gap-6">
                        {['Father', 'Mother', 'Husband', 'Wife', 'Legal Guardian in case of orphan/Third Gender'].map((type) => (
                            <label key={type} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="relationType"
                                    value={type}
                                    checked={formData.relationType === type}
                                    onChange={(e) => updateFormData({ relationType: e.target.value })}
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{type}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Name */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-800">
                            b.Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.relativeName}
                            onChange={(e) => updateFormData({ relativeName: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    {/* Surname */}
                    <div className="space-y-3">
                        <label className="block text-sm font-bold text-gray-800">
                            Surname
                        </label>
                        <input
                            type="text"
                            value={formData.relativeSurname}
                            onChange={(e) => updateFormData({ relativeSurname: e.target.value })}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                        />

                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/personal-details')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        &uarr; Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (!formData.relationType) {
                                alert('Please select a relation type.');
                                return;
                            }
                            if (!formData.relativeName) {
                                alert('Please enter the relative\'s name.');
                                return;
                            }
                            const fullRelativeName = `${formData.relativeName} ${formData.relativeSurname || ''}`.trim();
                            updateFormData({ relativeName: fullRelativeName, relativeType: formData.relationType });
                            navigate('/contact-details');
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

export default RelativesDetails;
