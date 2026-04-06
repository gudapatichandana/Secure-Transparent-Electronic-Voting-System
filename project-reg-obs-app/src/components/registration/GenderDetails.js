import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';

const GenderDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();
    const genders = [
        { value: 'Male', icon: '♂', color: '#2563eb' },
        { value: 'Female', icon: '♀', color: '#db2777' },
        { value: 'Third Gender', icon: '⚧', color: '#7c3aed' },
    ];

    const handleNext = () => {
        if (!formData.gender) {
            Alert.alert('Error', 'Please select your Gender.');
            return;
        }
        nextStep();
    };

    return (
        <ECILayout step={6} totalSteps={14} title="F. Gender" onClose={cancelForm}>
            <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>6. Gender *</Text>
                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Select one option below</Text>

                {genders.map(({ value, icon, color }) => {
                    const selected = formData.gender === value;
                    return (
                        <TouchableOpacity
                            key={value}
                            onPress={() => updateFormData({ gender: value })}
                            style={{
                                flexDirection: 'row', alignItems: 'center',
                                padding: 16, borderRadius: 12, borderWidth: 2,
                                borderColor: selected ? color : '#e2e8f0',
                                backgroundColor: selected ? `${color}10` : '#f8fafc',
                            }}
                        >
                            <View style={{
                                width: 22, height: 22, borderRadius: 11, borderWidth: 2,
                                borderColor: selected ? color : '#94a3b8',
                                alignItems: 'center', justifyContent: 'center', marginRight: 12
                            }}>
                                {selected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />}
                            </View>
                            <Text style={{ fontSize: 18, marginRight: 10 }}>{icon}</Text>
                            <Text style={{ fontSize: 15, fontWeight: selected ? '700' : '400', color: selected ? color : '#475569' }}>
                                {value}
                            </Text>
                            {selected && (
                                <View style={{ marginLeft: 'auto', backgroundColor: color, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2 }}>
                                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>SELECTED</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}

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
export default GenderDetails;
