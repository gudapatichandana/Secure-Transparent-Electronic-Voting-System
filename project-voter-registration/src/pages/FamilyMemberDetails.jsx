import React from 'react';
import { useNavigate } from 'react-router-dom';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const FamilyMemberDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormContext();

    return (
        <ECILayout activeStep="J">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">J. The details of my family member already included in the electoral roll at current address with whom I currently reside are as under</h3>
            </div>

            <form className="space-y-6">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-800">10. Family Member</h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                Name of Family Member
                            </label>
                            <input
                                type="text"
                                value={formData.familyName}
                                onChange={(e) => updateFormData({ familyName: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        {/* Relationship */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                Relationship with applicant
                            </label>
                            <select
                                value={formData.relationship}
                                onChange={(e) => updateFormData({ relationship: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Select Relation</option>
                                <option value="father">Father</option>
                                <option value="mother">Mother</option>
                                <option value="husband">Husband</option>
                                <option value="wife">Wife</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* EPIC Number */}
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-gray-800">
                                His/Her EPIC Number
                            </label>
                            <input
                                type="text"
                                value={formData.epicNumber}
                                onChange={(e) => updateFormData({ epicNumber: e.target.value })}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/disability-details')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        &uarr; Previous
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/declaration')}
                        className="px-6 py-2 bg-blue-400 text-white font-medium text-sm rounded hover:bg-blue-500 shadow-sm transition-colors"
                    >
                        &darr; Next
                    </button>
                </div>
            </form>
        </ECILayout>
    );
};

export default FamilyMemberDetails;
