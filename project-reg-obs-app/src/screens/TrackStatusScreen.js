import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { API_URL } from '../constants/config';

const TrackStatusScreen = ({ navigation }) => {
    const [referenceId, setReferenceId] = useState('');
    const [statusData, setStatusData] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkStatus = async () => {
        if (!referenceId.trim()) {
            Alert.alert("Error", "Please enter a valid Reference ID");
            return;
        }

        setLoading(true);
        setStatusData(null);

        try {
            const endpoint = (API_URL || 'http://localhost:5000') + `/api/application/status/${referenceId.trim()}`;
            const response = await fetch(endpoint);
            const data = await response.json();

            if (response.ok && data.success) {
                // Map backend status to UI steps
                let stepIdx = 0;
                let msg = '';
                let statusLabel = 'In Progress';
                let levelLabel = 'Level 1';
                let levelColor = 'yellow';

                if (data.status === 'PENDING') {
                    stepIdx = 1; // Submitted and Verified (just pending ERO)
                    msg = 'Your application is currently pending verification by the Electoral Registration Officer.';
                } else if (data.status === 'APPROVED') {
                    stepIdx = 3; // Fully ready
                    statusLabel = 'Approved';
                    levelLabel = 'Complete';
                    levelColor = 'green';
                    msg = `Your application has been approved. Your EPIC/Voter ID is: ${data.voter_id}`;
                } else if (data.status === 'REJECTED') {
                    stepIdx = 0;
                    statusLabel = 'Rejected';
                    levelLabel = 'Failed';
                    levelColor = 'red';
                    msg = `Your application was rejected. Reason: ${data.rejection_reason || 'Administrative rejection.'}`;
                }

                setStatusData({
                    step: stepIdx,
                    message: msg,
                    updated: new Date().toLocaleDateString(),
                    statusLabel,
                    levelLabel,
                    levelColor,
                    rawData: data
                });
            } else {
                Alert.alert("Not Found", data.error || "Application not found with the provided Reference ID.");
            }
        } catch (error) {
            Alert.alert("Network Error", "Failed to connect to the server to check status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-6">
                <Text className="text-3xl font-bold mb-2 text-slate-800 mt-4">Track Application</Text>
                <Text className="text-slate-500 mb-8">Enter your reference ID to track your voting enrollment status.</Text>

                <View className="mb-6">
                    <Text className="text-slate-700 font-bold mb-2">Reference ID</Text>
                    <TextInput
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-lg text-slate-800"
                        placeholder="e.g. Vote-2026-X7Z9"
                        value={referenceId}
                        onChangeText={setReferenceId}
                        autoCapitalize="characters"
                    />
                </View>

                <TouchableOpacity
                    onPress={checkStatus}
                    disabled={loading}
                    className={`p-4 rounded-xl items-center mb-8 shadow-sm ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Check Status</Text>
                    )}
                </TouchableOpacity>

                {statusData && (
                    <View className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm mt-2">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="font-bold text-lg text-slate-800">Status: {statusData.statusLabel}</Text>
                            <View className={`bg-${statusData.levelColor}-100 px-3 py-1 rounded-full border border-${statusData.levelColor}-200`}>
                                <Text className={`text-${statusData.levelColor}-700 font-bold text-xs`}>{statusData.levelLabel}</Text>
                            </View>
                        </View>

                        <Text className="font-bold text-slate-800 mb-4 text-lg">Applicant: {statusData.rawData.name}</Text>

                        <View className="flex-row items-center mb-6">
                            {['Submitted', 'Verified', 'Approved', 'Ready'].map((step, index) => (
                                <React.Fragment key={step}>
                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${index <= statusData.step ? (statusData.statusLabel === 'Rejected' ? 'bg-red-500' : 'bg-green-500') : 'bg-slate-200'}`}>
                                        <Text className="text-white text-xs">{index + 1}</Text>
                                    </View>
                                    {index < 3 && <View className={`h-1 flex-1 ${index < statusData.step ? (statusData.statusLabel === 'Rejected' ? 'bg-red-500' : 'bg-green-500') : 'bg-slate-200'}`} />}
                                </React.Fragment>
                            ))}
                        </View>

                        <Text className="text-slate-700 leading-relaxed mb-6">{statusData.message}</Text>
                        <Text className="text-slate-400 text-xs text-right">Last Updated: {statusData.updated}</Text>
                    </View>
                )}

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mt-8 items-center p-4 border border-slate-200 rounded-xl bg-white"
                >
                    <Text className="text-slate-600 font-medium">Back to Dashboard</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default TrackStatusScreen;
