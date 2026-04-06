import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

const DateOfBirthDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();
    const [showPicker, setShowPicker] = useState(false);

    // Parse stored dob (YYYY-MM-DD) or default to 18 years ago
    const getInitialDate = () => {
        if (formData.dob) {
            const [y, m, d] = formData.dob.split('-');
            const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
            if (!isNaN(date)) return date;
        }
        const d = new Date();
        d.setFullYear(d.getFullYear() - 18);
        return d;
    };

    const [selectedDate, setSelectedDate] = useState(getInitialDate());

    const formatDisplay = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day} / ${month} / ${year}`; // Exactly 13 chars — fits VARCHAR(20)
    };

    const formatStorage = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${date.getFullYear()}-${month}-${day}`; // YYYY-MM-DD for storage
    };

    const onPickerChange = (event, date) => {
        if (Platform.OS !== 'ios') {
            setShowPicker(false);
        }
        if (event.type === 'dismissed') return;
        if (date) {
            setSelectedDate(date);
            updateFormData({ dob: formatStorage(date) });
        }
    };

    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18); // Must be at least 18

    const handleNext = () => {
        if (!formData.dob) {
            Alert.alert('Error', 'Please select your Date of Birth.');
            return;
        }
        if (!formData.dobProofFile) {
            Alert.alert('Error', 'Please upload a document for proof of Date of Birth.');
            return;
        }
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
                updateFormData({ dobProofFile: { name: asset.name, base64: base64Data } });
            }
        } catch (error) {
            console.error('File upload error:', error);
            Alert.alert('Error', 'Failed to pick document.');
        }
    };

    return (
        <ECILayout step={7} totalSteps={14} title="G. Date of Birth Details" onClose={cancelForm}>
            <View className="gap-4">
                {/* DATE PICKER */}
                <View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 6 }}>
                        7(a) Date of Birth <Text style={{ color: '#ef4444' }}>*</Text>
                    </Text>

                    {Platform.OS === 'web' ? (
                        <input
                            type="date"
                            value={formData.dob || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                    const [y, m, d] = val.split('-');
                                    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                                    setSelectedDate(date);
                                    updateFormData({ dob: val });
                                }
                            }}
                            max={formatStorage(maxDate)}
                            min="1900-01-01"
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '16px',
                                backgroundColor: 'white',
                                color: '#1e293b',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={() => setShowPicker(true)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-4 bg-white flex-row items-center justify-between"
                            >
                                <Text className={formData.dob ? 'text-slate-800 text-base font-medium' : 'text-slate-400 text-base'}>
                                    {formData.dob ? formatDisplay(selectedDate) : 'Tap to select date'}
                                </Text>
                                <Text className="text-blue-600 font-bold text-sm">📅 PICK DATE</Text>
                            </TouchableOpacity>

                            {formData.dob && (
                                <Text className="text-xs text-slate-500 mt-1 ml-1">
                                    Selected: {formatDisplay(selectedDate)}
                                </Text>
                            )}

                            {/* Native Date Picker */}
                            {showPicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onPickerChange}
                                    maximumDate={maxDate}
                                    minimumDate={new Date(1900, 0, 1)}
                                />
                            )}

                            {/* iOS: confirm button to close the spinner */}
                            {showPicker && Platform.OS === 'ios' && (
                                <TouchableOpacity
                                    onPress={() => setShowPicker(false)}
                                    className="bg-blue-600 mt-2 py-2 rounded-lg items-center"
                                >
                                    <Text className="text-white font-bold">Confirm Date</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>

                {/* PROOF DOCUMENT */}
                <View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 6 }}>
                        7(b) Proof of Date of Birth <Text style={{ color: '#ef4444' }}>*</Text>
                    </Text>
                    <View className="gap-4 mb-4">
                        <TouchableOpacity
                            onPress={() => updateFormData({ dobDocumentType: 'proof' })}
                            className="flex-row items-center"
                        >
                            <Text className={`font-medium text-lg ${formData.dobDocumentType === 'proof' ? 'text-blue-600' : 'text-slate-400'}`}>◉</Text>
                            <Text className="text-slate-700 ml-2">Document for proof of Date of Birth</Text>
                        </TouchableOpacity>

                        {formData.dobDocumentType === 'proof' && (
                            <View className="ml-6">
                                <Text className="text-xs text-slate-500">e.g. Aadhaar Card, PAN Card, Birth Certificate</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            onPress={() => updateFormData({ dobDocumentType: 'other' })}
                            className="flex-row items-center mt-2"
                        >
                            <Text className={`font-medium text-lg ${formData.dobDocumentType === 'other' ? 'text-blue-600' : 'text-slate-400'}`}>◉</Text>
                            <Text className="text-slate-700 ml-2">Any other Document (Please Specify)</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="border-2 border-dashed border-slate-300 rounded-xl p-6 items-center">
                        <TouchableOpacity onPress={handleFileUpload} className="bg-slate-200 px-4 py-2 rounded-lg mb-2">
                            <Text className="font-medium text-slate-700">Choose File</Text>
                        </TouchableOpacity>
                        <Text className="text-slate-500 text-center" numberOfLines={1}>
                            {formData.dobProofFile ? formData.dobProofFile.name : 'No file chosen (PDF, JPG, PNG)'}
                        </Text>
                    </View>
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
export default DateOfBirthDetails;
