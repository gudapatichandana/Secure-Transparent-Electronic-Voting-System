import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';

const RadioCard = ({ label, sublabel, selected, onPress }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            flexDirection: 'row', alignItems: 'flex-start',
            padding: 14, borderRadius: 10, borderWidth: 2,
            borderColor: selected ? '#2563eb' : '#e2e8f0',
            backgroundColor: selected ? '#eff6ff' : '#f8fafc',
            marginBottom: 10,
        }}
    >
        <View style={{
            width: 20, height: 20, borderRadius: 10, borderWidth: 2,
            borderColor: selected ? '#2563eb' : '#94a3b8',
            alignItems: 'center', justifyContent: 'center',
            marginRight: 12, marginTop: 1, flexShrink: 0,
        }}>
            {selected && <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: '#2563eb' }} />}
        </View>
        <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: selected ? '600' : '400', color: selected ? '#1d4ed8' : '#374151' }}>
                {label}
            </Text>
            {sublabel ? <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{sublabel}</Text> : null}
        </View>
    </TouchableOpacity>
);

const AadhaarDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();

    const handleNext = () => {
        if (!formData.aadhaarOption) {
            Alert.alert('Error', 'Please select an option.');
            return;
        }
        if (formData.aadhaarOption === 'aadhaar') {
            if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
                Alert.alert('Error', 'Please enter a valid 12-digit Aadhaar number.');
                return;
            }
        }
        nextStep();
    };

    return (
        <ECILayout step={5} totalSteps={14} title="E. Aadhaar Details" onClose={cancelForm}>
            <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                    5. Aadhaar Card <Text style={{ color: '#ef4444' }}>*</Text>
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 10 }}>
                    Select one option below
                </Text>

                <RadioCard
                    label="I have an Aadhaar Number"
                    sublabel="You will be asked to enter it below"
                    selected={formData.aadhaarOption === 'aadhaar'}
                    onPress={() => {
                        updateFormData({ aadhaarOption: 'aadhaar' });
                    }}
                />

                {formData.aadhaarOption === 'aadhaar' && (
                    <View style={{ marginBottom: 10, paddingHorizontal: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                            Aadhaar Number <Text style={{ color: '#ef4444' }}>*</Text>
                        </Text>
                        <TextInput
                            value={formData.aadhaarNumber}
                            onChangeText={(text) => {
                                updateFormData({ aadhaarNumber: text.replace(/\D/g, '').slice(0, 12) });
                            }}
                            placeholder="Enter 12-digit Aadhaar Number"
                            keyboardType="number-pad"
                            maxLength={12}
                            style={{
                                borderWidth: 1.5, borderColor: '#93c5fd', borderRadius: 8,
                                paddingHorizontal: 14, paddingVertical: 12,
                                backgroundColor: '#fff', color: '#1e293b',
                                fontSize: 16, letterSpacing: 2
                            }}
                        />
                        {formData.aadhaarNumber?.length > 0 && (
                            <Text style={{ fontSize: 11, color: formData.aadhaarNumber.length === 12 ? '#16a34a' : '#64748b', marginTop: 4 }}>
                                {formData.aadhaarNumber.length}/12 digits
                            </Text>
                        )}
                    </View>
                )}

                <RadioCard
                    label="I do not have an Aadhaar Number"
                    sublabel="I am not able to furnish my Aadhaar Number because I don't have one"
                    selected={formData.aadhaarOption === 'no_aadhaar'}
                    onPress={() => updateFormData({ aadhaarOption: 'no_aadhaar', aadhaarNumber: '' })}
                />

                <View style={{ marginTop: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
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
export default AadhaarDetails;
