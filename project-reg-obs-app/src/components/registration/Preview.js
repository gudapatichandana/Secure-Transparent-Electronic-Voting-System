import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { authService } from '../../constants/authService';

const Preview = ({ formData, prevStep, navigation }) => {
    const handleSubmit = async () => {
        // Show submitting indicator
        Alert.alert('Submitting', 'Please wait...', []);

        // Simulate API call using authService
        // In real implementation: const result = await authService.registerVoter(formData);
        await new Promise(resolve => setTimeout(resolve, 2000));

        Alert.alert('Success', 'Application Submitted Successfully! Your Reference ID is Vote-2026-X7Z9', [
            { text: "OK", onPress: () => navigation.navigate('Dashboard', { userType: 'voter', userData: { ...formData, role: 'voter' } }) }
        ]);
    };

    const DetailRow = ({ label, value }) => (
        <View className="flex-row justify-between py-2 border-b border-slate-100">
            <Text className="text-slate-500">{label}</Text>
            <Text className="text-slate-800 font-semibold">{value || '-'}</Text>
        </View>
    );

    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Text className="text-xl font-bold mb-4 text-slate-800">Review Application</Text>

            <View className="items-center mb-6">
                {formData.faceImage && (
                    <Image source={{ uri: formData.faceImage }} style={{ width: 100, height: 100, borderRadius: 50, marginBottom: 10 }} />
                )}
                <Text className="text-lg font-bold">{formData.fullName}</Text>
            </View>

            <View className="bg-slate-50 p-4 rounded-xl mb-6">
                <DetailRow label="Aadhaar" value={formData.aadhaar} />
                <DetailRow label="DOB" value={formData.dob} />
                <DetailRow label="Gender" value={formData.gender} />
                <DetailRow label="Address" value={`${formData.houseNo}, ${formData.street}, ${formData.city} - ${formData.pincode}`} />
            </View>

            <View className="flex-row gap-4 mt-2 mb-10">
                <TouchableOpacity onPress={prevStep} className="flex-1 bg-slate-200 p-4 rounded-xl items-center">
                    <Text className="text-slate-700 font-bold">Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSubmit} className="flex-1 bg-green-600 p-4 rounded-xl items-center">
                    <Text className="text-white font-bold">Submit Application</Text>
                </TouchableOpacity>
            </View>
            <View className="h-10" />
        </ScrollView>
    );
};

export default Preview;
