import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';

const RelativesDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();
    const relations = ['Father', 'Mother', 'Husband', 'Wife', 'Legal Guardian'];

    const handleNext = () => {
        if (!formData.relationType) {
            Alert.alert('Error', 'Please select a relation type.');
            return;
        }
        if (!formData.relativeName) {
            Alert.alert('Error', 'Please enter relative name.');
            return;
        }
        nextStep();
    };

    return (
        <ECILayout step={3} totalSteps={14} title="C. Relatives Details" onClose={cancelForm}>
            <View className="gap-4">
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 2 }}>
                    2(a) Relation Type *
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Select one</Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {relations.map((type) => {
                        const selected = formData.relationType === type;
                        return (
                            <TouchableOpacity
                                key={type}
                                onPress={() => updateFormData({ relationType: type })}
                                style={{
                                    paddingVertical: 8, paddingHorizontal: 16,
                                    borderRadius: 20, borderWidth: 1.5,
                                    borderColor: selected ? '#2563eb' : '#cbd5e1',
                                    backgroundColor: selected ? '#2563eb' : '#f8fafc',
                                }}
                            >
                                <Text style={{
                                    color: selected ? '#fff' : '#475569',
                                    fontWeight: selected ? '700' : '400',
                                    fontSize: 13
                                }}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                        Relative's First Name *
                    </Text>
                    <TextInput
                        value={formData.relativeName}
                        onChangeText={(text) => updateFormData({ relativeName: text })}
                        placeholder="Enter first name"
                        style={{
                            borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8,
                            paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#1e293b'
                        }}
                    />
                </View>

                <View>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                        Relative's Surname (if any)
                    </Text>
                    <TextInput
                        value={formData.relativeSurname}
                        onChangeText={(text) => updateFormData({ relativeSurname: text })}
                        placeholder="Enter surname"
                        style={{
                            borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8,
                            paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#1e293b'
                        }}
                    />
                </View>

                <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between' }}>
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
export default RelativesDetails;
