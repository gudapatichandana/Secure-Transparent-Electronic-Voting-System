import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const GenderDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormContext();

    return (
        <ECILayout activeStep="F">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">F. Gender</h3>
            </div>

            <form className="space-y-6">
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-800">
                        6. Gender
                    </label>

                    <div className="flex items-center space-x-12">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="Male"
                                checked={formData.gender === 'Male'}
                                onChange={(e) => updateFormData({ gender: e.target.value })}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Male</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="Female"
                                checked={formData.gender === 'Female'}
                                onChange={(e) => updateFormData({ gender: e.target.value })}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Female</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="Third Gender"
                                checked={formData.gender === 'Third Gender'}
                                onChange={(e) => updateFormData({ gender: e.target.value })}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Third Gender</span>
                        </label>
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/aadhaar-details')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        &uarr; Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (!formData.gender) {
                                alert('Please select your gender.');
                                return;
                            }
                            updateFormData({ gender: formData.gender });
                            navigate('/dob-details');
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

export default GenderDetails;
