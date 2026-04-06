import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';

const FamilyMemberDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();

    return (
        <ECILayout step={10} totalSteps={14} title="J. Family Member Details (Optional)" onClose={cancelForm}>
            <View style={{ gap: 16 }}>
                <Text className="text-sm font-bold text-slate-800 mb-2">10. Details of a family member already included in electoral roll</Text>

                <View>
                    <Text className="text-sm font-semibold text-slate-700 mb-1">Name of Family Member</Text>
                    <TextInput
                        value={formData.familyName}
                        onChangeText={(text) => updateFormData({ familyName: text })}
                        placeholder="Full Name"
                        className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
                    />
                </View>

                <View>
                    <Text className="text-sm font-semibold text-slate-700 mb-1">Relationship</Text>
                    <TextInput
                        value={formData.relationship}
                        onChangeText={(text) => updateFormData({ relationship: text })}
                        placeholder="e.g. Father, Mother, Husband, Wife"
                        className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
                    />
                </View>

                <View>
                    <Text className="text-sm font-semibold text-slate-700 mb-1">His/Her EPIC Number</Text>
                    <TextInput
                        value={formData.epicNumber}
                        onChangeText={(text) => updateFormData({ epicNumber: text })}
                        placeholder="EPIC Number"
                        className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
                    />
                </View>

                <View className="mt-8 flex-row justify-between">
                    <TouchableOpacity onPress={prevStep} className="border border-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-blue-600 font-bold">Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={nextStep} className="bg-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-white font-bold">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ECILayout>
    );
};
export default FamilyMemberDetails;
