import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';

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

const ContactDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();

    const handleNext = () => {
        if (!formData.mobileNumber || formData.mobileNumber.length !== 10) {
            Alert.alert('Error', 'Please enter a valid 10-digit mobile number.');
            return;
        }
        nextStep();
    };

    return (
        <ECILayout step={4} totalSteps={14} title="D. Contact Details" onClose={cancelForm}>
            <View className="gap-6">
                {/* Mobile */}
                <View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>
                        3. Mobile Number *
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Whose number is this?</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <RadioButton
                            label="My Own"
                            selected={formData.mobileSelf === true}
                            onPress={() => updateFormData({ mobileSelf: true, mobileRelative: false })}
                        />
                        <RadioButton
                            label="Relative's"
                            selected={formData.mobileRelative === true}
                            onPress={() => updateFormData({ mobileSelf: false, mobileRelative: true })}
                        />
                    </View>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8,
                        backgroundColor: '#fff', paddingHorizontal: 12
                    }}>
                        <Text style={{ color: '#94a3b8', fontWeight: '700', marginRight: 8 }}>+91 |</Text>
                        <TextInput
                            value={formData.mobileNumber}
                            onChangeText={(text) => updateFormData({ mobileNumber: text })}
                            placeholder="10-digit number"
                            keyboardType="phone-pad"
                            maxLength={10}
                            style={{ flex: 1, paddingVertical: 12, color: '#1e293b', fontSize: 15 }}
                        />
                    </View>
                    {formData.mobileSelf === false && formData.mobileRelative === true && (
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Relative's mobile number</Text>
                            <TextInput
                                value={formData.mobileRelativeNumber}
                                onChangeText={(text) => updateFormData({ mobileRelativeNumber: text })}
                                placeholder="Relative's 10-digit number"
                                keyboardType="phone-pad"
                                maxLength={10}
                                style={{
                                    borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8,
                                    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#1e293b'
                                }}
                            />
                        </View>
                    )}
                </View>

                {/* Email */}
                <View>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>
                        4. Email ID (Optional)
                    </Text>
                    <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Whose email is this?</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                        <RadioButton
                            label="My Own"
                            selected={formData.emailSelf === true}
                            onPress={() => updateFormData({ emailSelf: true, emailRelative: false })}
                        />
                        <RadioButton
                            label="Relative's"
                            selected={formData.emailRelative === true}
                            onPress={() => updateFormData({ emailSelf: false, emailRelative: true })}
                        />
                    </View>
                    <TextInput
                        value={formData.email}
                        onChangeText={(text) => updateFormData({ email: text })}
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{
                            borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8,
                            paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#1e293b'
                        }}
                    />
                    {formData.emailRelative === true && (
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Relative's email</Text>
                            <TextInput
                                value={formData.emailRelative}
                                onChangeText={(text) => updateFormData({ emailRelative: text })}
                                placeholder="Relative's email address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={{
                                    borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8,
                                    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#fff', color: '#1e293b'
                                }}
                            />
                        </View>
                    )}
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
export default ContactDetails;
