import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const VoterDashboard = ({ user, navigation }) => (
    <View className="flex-1 bg-white p-6 justify-center items-center">
        <Text className="text-2xl font-bold mb-4">Welcome, {user?.name || 'Voter'}</Text>

        <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            className="bg-blue-600 w-full p-4 rounded-xl items-center mb-4 shadow-lg shadow-blue-500/30"
        >
            <Text className="text-white font-bold text-lg">New Registration / Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={() => navigation.navigate('TrackStatus')}
            className="bg-white border border-slate-200 w-full p-4 rounded-xl items-center mb-4 shadow-sm"
        >
            <Text className="text-slate-700 font-bold">Track Application Status</Text>
        </TouchableOpacity>
    </View>
);

export default VoterDashboard;
