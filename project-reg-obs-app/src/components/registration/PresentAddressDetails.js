import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';
import SelectDropdown from '../common/SelectDropdown';
import { locationData } from '../../data/locationData';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

const AddressField = ({ label, value, onChangeText, required = false, keyboardType = 'default' }) => (
    <View className="mb-4">
        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
            {label} {required && <Text style={{ color: '#ef4444' }}>*</Text>}
        </Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
        />
    </View>
);

const PresentAddressDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();

    const states = Object.keys(locationData);
    const districts = formData.addressState && locationData[formData.addressState]
        ? Object.keys(locationData[formData.addressState].districts)
        : [];

    const handleNext = () => {
        const requiredFields = ['houseNo', 'streetClass', 'village', 'postOffice', 'pinCode', 'tehsil', 'addressState', 'addressDistrict'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                Alert.alert('Error', 'Please fill all required address fields.');
                return;
            }
        }
        if (!formData.addressProofFile) {
            Alert.alert('Error', 'Please upload a document for proof of residence.');
            return;
        }
        const fullAddress = `${formData.houseNo}, ${formData.streetClass}, ${formData.village}, ${formData.postOffice}, ${formData.tehsil}, ${formData.addressDistrict}, ${formData.addressState} - ${formData.pinCode}`;
        updateFormData({ address: fullAddress });
        nextStep();
    };

    const handleFileUpload = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
                copyToCacheDirectory: true,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                let base64Data = '';
                if (Platform.OS === 'web') {
                    const response = await fetch(asset.uri);
                    const blob = await response.blob();
                    base64Data = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.onerror = (error) => reject(error);
                        reader.readAsDataURL(blob);
                    });
                } else {
                    const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
                    base64Data = `data:${asset.mimeType};base64,${base64}`;
                }
                updateFormData({ addressProofFile: { name: asset.name, base64: base64Data } });
            }
        } catch (error) {
            console.error('File upload error:', error);
            Alert.alert('Error', 'Failed to pick document.');
        }
    };

    return (
        <ECILayout step={8} totalSteps={14} title="H. Present Address Details" onClose={cancelForm}>
            <View className="gap-4">
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>
                    8(a) Present Ordinary Residence <Text style={{ color: '#ef4444' }}>*</Text>
                </Text>

                <AddressField label="House/Building/Apartment No" value={formData.houseNo} onChangeText={(val) => updateFormData({ houseNo: val })} required />
                <AddressField label="Street/Area/Locality/Road" value={formData.streetClass} onChangeText={(val) => updateFormData({ streetClass: val })} required />
                <AddressField label="Village/Town" value={formData.village} onChangeText={(val) => updateFormData({ village: val })} required />
                <AddressField label="Post Office" value={formData.postOffice} onChangeText={(val) => updateFormData({ postOffice: val })} required />
                <AddressField label="PIN Code" value={formData.pinCode} onChangeText={(val) => updateFormData({ pinCode: val })} required keyboardType="numeric" />
                <AddressField label="Tehsil/Taluqa/Mandal" value={formData.tehsil} onChangeText={(val) => updateFormData({ tehsil: val })} required />

                <SelectDropdown
                    label="State/UT"
                    value={formData.addressState}
                    options={states}
                    onSelect={(state) => updateFormData({ addressState: state, addressDistrict: '' })}
                    placeholder="Select State"
                    required
                />

                <SelectDropdown
                    label="District"
                    value={formData.addressDistrict}
                    options={districts}
                    onSelect={(district) => updateFormData({ addressDistrict: district })}
                    placeholder="Select District"
                    disabled={!formData.addressState}
                    required
                />

                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginTop: 8, marginBottom: 6 }}>
                    8(b) Address Proof Document <Text style={{ color: '#ef4444' }}>*</Text>
                </Text>
                <View className="border-2 border-dashed border-slate-300 rounded-xl p-6 items-center">
                    <TouchableOpacity onPress={handleFileUpload} className="bg-slate-200 px-4 py-2 rounded-lg mb-2">
                        <Text className="font-medium text-slate-700">Choose File</Text>
                    </TouchableOpacity>
                    <Text className="text-slate-500 text-center" numberOfLines={1}>
                        {formData.addressProofFile ? formData.addressProofFile.name : 'No file chosen (PDF, JPG, PNG)'}
                    </Text>
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
export default PresentAddressDetails;
