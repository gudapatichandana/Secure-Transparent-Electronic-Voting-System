import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';
import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

const PersonalDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();

    const handleNext = () => {
        if (!formData.firstName) {
            Alert.alert('Error', 'Please enter your First Name.');
            return;
        }
        if (!formData.image) {
            Alert.alert('Error', 'Please upload your photograph.');
            return;
        }
        nextStep();
    };

    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                let base64Data = '';

                if (Platform.OS === 'web') {
                    // For web, we fetch the blob and use FileReader
                    const response = await fetch(asset.uri);
                    const blob = await response.blob();
                    base64Data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = error => reject(error);
                        reader.readAsDataURL(blob);
                    });
                } else {
                    // For native, use expo-file-system
                    const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
                    base64Data = `data:${asset.mimeType};base64,${base64}`;
                }

                updateFormData({ image: { name: asset.name, base64: base64Data } });
            }
        } catch (error) {
            console.error("File upload error:", error);
            Alert.alert('Error', 'Failed to pick document.');
        }
    };

    return (
        <ECILayout step={2} totalSteps={14} title="B. Personal Details" onClose={cancelForm}>
            <View className="gap-4">
                <View>
                    <Text className="text-sm font-semibold text-slate-700 mb-1">First Name followed by Middle Name *</Text>
                    <TextInput
                        value={formData.firstName}
                        onChangeText={(text) => updateFormData({ firstName: text })}
                        placeholder="e.g. Rahul Kumar"
                        className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
                    />
                </View>
                <View>
                    <Text className="text-sm font-semibold text-slate-700 mb-1">Surname (if any)</Text>
                    <TextInput
                        value={formData.surname}
                        onChangeText={(text) => updateFormData({ surname: text })}
                        placeholder="e.g. Sharma"
                        className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
                    />
                </View>

                <View className="mt-4">
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Upload Photograph *</Text>
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={handleFileUpload} className="bg-slate-200 px-4 py-2 rounded-lg border border-slate-300">
                            <Text className="text-slate-700 font-medium">Choose File</Text>
                        </TouchableOpacity>
                        <Text className="ml-3 text-slate-600 flex-1" numberOfLines={1}>
                            {formData.image ? formData.image.name : 'No file chosen'}
                        </Text>
                    </View>
                    <Text className="text-xs text-slate-500 mt-2">Document size max 2MB, .jpg, .jpeg</Text>
                </View>

                <View className="mt-8 flex-row justify-between">
                    <TouchableOpacity onPress={prevStep} className="border border-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-blue-600 font-bold">Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} className="bg-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-white font-bold">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ECILayout>
    );
};
export default PersonalDetails;
