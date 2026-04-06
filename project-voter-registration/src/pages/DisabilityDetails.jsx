import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegistration } from '../context/RegistrationContext';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const DisabilityDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData, handleFileChange } = useFormContext();

    const handleCategoryChange = (key) => {
        updateFormData({
            disabilityCategories: {
                ...formData.disabilityCategories,
                [key]: !formData.disabilityCategories[key]
            }
        });
    };

    return (
        <ECILayout activeStep="I">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">I. Category of Disability, if any (Optional)</h3>
            </div>

            <form className="space-y-6">
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-800">
                        9. Category
                    </label>

                    {/* Checkboxes Row 1 */}
                    <div className="flex flex-wrap gap-12">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.disabilityCategories.locomotive}
                                onChange={() => handleCategoryChange('locomotive')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Locomotive</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.disabilityCategories.visual}
                                onChange={() => handleCategoryChange('visual')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Visual</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.disabilityCategories.deafDumb}
                                onChange={() => handleCategoryChange('deafDumb')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">Deaf & Dumb</span>
                        </label>
                    </div>

                    {/* Other Row */}
                    <div className="flex items-center gap-3 mt-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.disabilityCategories.other}
                                onChange={() => handleCategoryChange('other')}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-bold text-gray-800">Other</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Other Disability"
                            value={formData.disabilityOtherSpec}
                            onChange={(e) => updateFormData({ disabilityOtherSpec: e.target.value })}
                            disabled={!formData.disabilityCategories.other}
                            className={`border border-gray-300 rounded px-3 py-1 text-sm bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 ${!formData.disabilityCategories.other ? 'opacity-60 cursor-not-allowed' : ''}`}
                        />
                    </div>

                    {/* Percentage */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-800 mb-1">
                            Percentage of<br />disability
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={formData.disabilityPercentage}
                                onChange={(e) => updateFormData({ disabilityPercentage: e.target.value })}
                                className="w-16 border border-gray-300 rounded px-2 py-1 bg-gray-100 text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">%</span>
                        </div>
                    </div>
                </div>

                {/* Certificate Attached */}
                <div className="space-y-4">
                    <p className="text-sm font-bold text-gray-800">
                        (b) Certificate (If prescribed percentage of disability) <span className="text-red-600">*</span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <select
                            value={formData.disabilityCertificateAttached}
                            onChange={(e) => updateFormData({ disabilityCertificateAttached: e.target.value })} // 'yes' | 'no'
                            className="border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 h-fit"
                        >
                            <option value="">Select Option</option>
                            <option value="yes">Yes, Attached</option>
                            <option value="no">No</option>
                        </select>

                        {formData.disabilityCertificateAttached === 'yes' && (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => handleFileChange(e, 'disabilityFile')}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {formData.disabilityFile ? (
                                    <div className="text-sm text-green-600 font-medium">Document Uploaded (Ready)</div>
                                ) : (
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-500">Upload Certificate</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <hr className="my-8 border-gray-200" />

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/present-address-details')}
                        className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm"
                    >
                        &uarr; Previous
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            // Collect disability details
                            const selectedCategories = Object.keys(formData.disabilityCategories).filter(key => formData.disabilityCategories[key]);
                            let disabilityString = selectedCategories.join(', ');
                            if (formData.disabilityCategories.other && formData.disabilityOtherSpec) {
                                disabilityString += ` (Other: ${formData.disabilityOtherSpec})`;
                            }
                            // Save to context
                            updateFormData({ disability: disabilityString });
                            // Navigate
                            navigate('/family-details');
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

export default DisabilityDetails;
