import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const AddressDetails = ({ formData, setFormData, nextStep, prevStep }) => {
    return (
        <ScrollView className="flex-1 bg-white p-4">
            <Text className="text-xl font-bold mb-4 text-slate-800">Address Details</Text>

            <View className="mb-4">
                <Text className="text-slate-600 mb-1">House No. / Building</Text>
                <TextInput
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                    value={formData.houseNo}
                    onChangeText={(text) => setFormData({ ...formData, houseNo: text })}
                />
            </View>

            <View className="mb-4">
                <Text className="text-slate-600 mb-1">Street / Locality</Text>
                <TextInput
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                    value={formData.street}
                    onChangeText={(text) => setFormData({ ...formData, street: text })}
                />
            </View>

            <View className="mb-4">
                <Text className="text-slate-600 mb-1">City / District</Text>
                <TextInput
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                    value={formData.city}
                    onChangeText={(text) => setFormData({ ...formData, city: text })}
                />
            </View>
            <View className="mb-4">
                <Text className="text-slate-600 mb-1">Pincode</Text>
                <TextInput
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4"
                    keyboardType="numeric"
                    value={formData.pincode}
                    onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                />
            </View>

            <View className="flex-row gap-4 mt-4">
                <TouchableOpacity onPress={prevStep} className="flex-1 bg-slate-200 p-4 rounded-xl items-center">
                    <Text className="text-slate-700 font-bold">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={nextStep} className="flex-1 bg-blue-600 p-4 rounded-xl items-center">
                    <Text className="text-white font-bold">Next</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddressDetails;
