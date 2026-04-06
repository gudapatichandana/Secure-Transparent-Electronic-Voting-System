import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';
import SelectDropdown from '../common/SelectDropdown';
import { locationData } from '../../data/locationData';

const IdentityCheck = ({ nextStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();
    const [constituencyType, setConstituencyType] = useState(formData.constituencyType || 'assembly');

    const states = Object.keys(locationData);
    const districts = formData.state && locationData[formData.state]
        ? Object.keys(locationData[formData.state].districts)
        : [];
    const constituencies = formData.state && formData.district && locationData[formData.state]?.districts[formData.district]
        ? locationData[formData.state].districts[formData.district].map(c => c.name)
        : [];

    const handleNext = () => {
        if (!formData.state || !formData.district || (constituencyType === 'assembly' && !formData.assemblyConstituency)) {
            Alert.alert('Error', 'Please fill in all required fields (State, District, Constituency).');
            return;
        }
        updateFormData({ constituencyType });
        nextStep();
    };

    return (
        <ECILayout step={1} totalSteps={14} title="A. Select State, District & Constituency" onClose={cancelForm}>
            <View className="mb-4">
                <Text className="text-slate-700">To,</Text>
                <Text className="text-slate-700">The Electoral Registration Officer,</Text>
            </View>

            <View className="gap-4">
                <SelectDropdown
                    label="State"
                    value={formData.state}
                    options={states}
                    onSelect={(state) => updateFormData({ state, district: '', assemblyConstituency: '' })}
                    placeholder="Select State"
                    required
                />

                <SelectDropdown
                    label="District"
                    value={formData.district}
                    options={districts}
                    onSelect={(district) => updateFormData({ district, assemblyConstituency: '' })}
                    placeholder="Select District"
                    disabled={!formData.state}
                    required
                />

                <SelectDropdown
                    label="Assembly Constituency"
                    value={formData.assemblyConstituency}
                    options={constituencies}
                    onSelect={(assemblyConstituency) => updateFormData({ assemblyConstituency })}
                    placeholder="Select Constituency Name"
                    disabled={!formData.district}
                    required
                />

                <View className="mt-8 flex-row justify-end">
                    <TouchableOpacity onPress={handleNext} className="bg-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-white font-bold">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ECILayout>
    );
};
export default IdentityCheck;
