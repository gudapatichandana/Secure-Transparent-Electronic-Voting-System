import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';

// Reusable checkbox component with proper checked/unchecked visuals
const Checkbox = ({ label, checked, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            flexDirection: 'row', alignItems: 'center',
            paddingVertical: 10, paddingHorizontal: 12,
            borderRadius: 8, borderWidth: 1.5,
            borderColor: checked ? '#2563eb' : '#cbd5e1',
            backgroundColor: checked ? '#eff6ff' : '#f8fafc',
            marginBottom: 8,
        }}
    >
        <View style={{
            width: 20, height: 20, borderRadius: 4, borderWidth: 2,
            borderColor: checked ? '#2563eb' : '#94a3b8',
            backgroundColor: checked ? '#2563eb' : '#fff',
            alignItems: 'center', justifyContent: 'center', marginRight: 10
        }}>
            {checked && <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold', lineHeight: 16 }}>✓</Text>}
        </View>
        <Text style={{ color: checked ? '#1d4ed8' : '#475569', fontWeight: checked ? '600' : '400', fontSize: 14 }}>
            {label}
        </Text>
    </TouchableOpacity>
);

// Reusable radio button component
const RadioButton = ({ label, selected, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            flexDirection: 'row', alignItems: 'center',
            paddingVertical: 10, paddingHorizontal: 14,
            borderRadius: 8, borderWidth: 1.5,
            borderColor: selected ? '#2563eb' : '#cbd5e1',
            backgroundColor: selected ? '#eff6ff' : '#f8fafc',
            marginRight: 10, marginBottom: 8,
        }}
    >
        <View style={{
            width: 18, height: 18, borderRadius: 9, borderWidth: 2,
            borderColor: selected ? '#2563eb' : '#94a3b8',
            alignItems: 'center', justifyContent: 'center', marginRight: 8
        }}>
            {selected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb' }} />}
        </View>
        <Text style={{ color: selected ? '#1d4ed8' : '#475569', fontWeight: selected ? '600' : '400', fontSize: 14 }}>
            {label}
        </Text>
    </TouchableOpacity>
);

const DisabilityDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();

    const categories = [
        { key: 'locomotive', label: 'Locomotor Disability' },
        { key: 'visual', label: 'Visual Impairment' },
        { key: 'deafDumb', label: 'Deaf & Mute' },
    ];

    const handleCategoryChange = (key) => {
        updateFormData({
            disabilityCategories: {
                ...formData.disabilityCategories,
                [key]: !formData.disabilityCategories[key]
            }
        });
    };

    const handleNext = () => {
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
                        reader.onerror = error => reject(error);
                        reader.readAsDataURL(blob);
                    });
                } else {
                    const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
                    base64Data = `data:${asset.mimeType};base64,${base64}`;
                }
                updateFormData({ disabilityFile: { name: asset.name, base64: base64Data } });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick document.');
        }
    };

    const anySelected = Object.values(formData.disabilityCategories || {}).some(Boolean);

    return (
        <ECILayout step={9} totalSteps={14} title="I. Disability Details" onClose={cancelForm}>
            <View className="gap-6">
                <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                    This section is optional. Leave all unchecked if not applicable.
                </Text>

                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 6 }}>
                    9. Category (select all that apply)
                </Text>

                {categories.map(({ key, label }) => (
                    <Checkbox
                        key={key}
                        label={label}
                        checked={!!formData.disabilityCategories?.[key]}
                        onPress={() => handleCategoryChange(key)}
                    />
                ))}

                {/* Other */}
                <Checkbox
                    label="Other"
                    checked={!!formData.disabilityCategories?.other}
                    onPress={() => handleCategoryChange('other')}
                />
                {formData.disabilityCategories?.other && (
                    <TextInput
                        value={formData.disabilityOtherSpec}
                        onChangeText={(text) => updateFormData({ disabilityOtherSpec: text })}
                        placeholder="Please specify"
                        style={{
                            borderWidth: 1, borderColor: '#93c5fd', borderRadius: 8,
                            paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff',
                            color: '#1e293b', marginBottom: 8
                        }}
                    />
                )}

                {anySelected && (
                    <>
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                                Percentage of Disability (%)
                            </Text>
                            <TextInput
                                value={formData.disabilityPercentage}
                                onChangeText={(text) => updateFormData({ disabilityPercentage: text })}
                                placeholder="e.g. 40"
                                keyboardType="numeric"
                                maxLength={3}
                                style={{
                                    width: 100, borderWidth: 1, borderColor: '#cbd5e1',
                                    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
                                    backgroundColor: '#fff', color: '#1e293b'
                                }}
                            />
                        </View>

                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 6 }}>
                                Certificate Attached?
                            </Text>
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton
                                    label="Yes"
                                    selected={formData.disabilityCertificateAttached === 'yes'}
                                    onPress={() => updateFormData({ disabilityCertificateAttached: 'yes' })}
                                />
                                <RadioButton
                                    label="No"
                                    selected={formData.disabilityCertificateAttached === 'no'}
                                    onPress={() => updateFormData({ disabilityCertificateAttached: 'no', disabilityFile: null })}
                                />
                            </View>

                            {formData.disabilityCertificateAttached === 'yes' && (
                                <View style={{
                                    borderWidth: 2, borderStyle: 'dashed', borderColor: '#cbd5e1',
                                    borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 4
                                }}>
                                    <TouchableOpacity
                                        onPress={handleFileUpload}
                                        style={{ backgroundColor: '#e2e8f0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, marginBottom: 6 }}
                                    >
                                        <Text style={{ color: '#334155', fontWeight: '500' }}>Choose Certificate</Text>
                                    </TouchableOpacity>
                                    <Text style={{ color: '#94a3b8', fontSize: 11 }} numberOfLines={1}>
                                        {formData.disabilityFile ? formData.disabilityFile.name : 'No file chosen (PDF, JPG, PNG)'}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </>
                )}

                <View style={{ marginTop: 24, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        onPress={prevStep}
                        style={{ borderWidth: 1.5, borderColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
                    >
                        <Text style={{ color: '#2563eb', fontWeight: '700' }}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handleNext}
                        style={{ backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '700' }}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ECILayout>
    );
};
export default DisabilityDetails;
