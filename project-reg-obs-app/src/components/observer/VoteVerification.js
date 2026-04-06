import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { API_URL } from '../../constants/config';

import AsyncStorage from '@react-native-async-storage/async-storage';

const VoteVerification = () => {
    const [receiptHash, setReceiptHash] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = async () => {
        if (!receiptHash.trim()) {
            Alert.alert("Error", "Please enter a valid Receipt ID");
            return;
        }

        setError('');
        setResult(null);
        setIsLoading(true);

        try {
            const token = await AsyncStorage.getItem('observer_token');
            const endpoint = (API_URL || 'http://localhost:5000') + '/api/verify-receipt';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionHash: receiptHash.trim() })
            });

            const data = await response.json();

            if (data.verified) {
                setResult(data);
            } else {
                setError(data.message || 'Receipt not found in the blockchain.');
            }
        } catch (err) {
            setError('Connection failed. Please check network and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="p-6">
                <View className="flex-row items-center justify-between mb-2 mt-4">
                    <Text className="text-2xl font-bold text-slate-800">Vote Verification</Text>
                </View>
                <Text className="text-slate-500 mb-8">Enter a vote receipt transaction hash to cryptographically verify it was recorded on the ledger.</Text>

                <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">
                    <Text className="text-slate-700 font-bold mb-2">Vote Receipt ID (Transaction Hash)</Text>
                    <TextInput
                        className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 font-mono mb-6"
                        placeholder="e.g., 8f4a3c2d1e5b6a7c..."
                        value={receiptHash}
                        onChangeText={setReceiptHash}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TouchableOpacity
                        onPress={handleVerify}
                        disabled={isLoading}
                        className={`p-4 rounded-xl items-center flex-row justify-center ${isLoading ? 'bg-purple-400' : 'bg-purple-600'}`}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text className="text-white text-lg mr-2">🔍</Text>
                                <Text className="text-white font-bold text-lg">Verify Receipt</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {error ? (
                    <View className="bg-red-50 p-4 rounded-xl border border-red-200 flex-row items-center">
                        <Text className="text-red-500 text-xl mr-3">⚠️</Text>
                        <Text className="text-red-700 font-medium flex-1">{error}</Text>
                    </View>
                ) : null}

                {result && result.verified && (
                    <View className="bg-green-50 p-6 rounded-2xl border-2 border-green-500 mt-2 shadow-sm">
                        <View className="flex-row items-center mb-4 pb-4 border-b border-green-200">
                            <View className="w-10 h-10 bg-green-200 items-center justify-center rounded-full mr-3">
                                <Text className="text-xl">✓</Text>
                            </View>
                            <Text className="text-green-800 font-bold text-xl">Vote Verified</Text>
                        </View>

                        <View className="mb-2 flex-row">
                            <Text className="text-slate-500 font-medium w-32">Constituency:</Text>
                            <Text className="text-slate-800 font-bold">{result.vote.constituency}</Text>
                        </View>
                        <View className="mb-4 flex-row">
                            <Text className="text-slate-500 font-medium w-32">Recorded At:</Text>
                            <Text className="text-slate-800 font-bold">{new Date(result.vote.timestamp).toLocaleString()}</Text>
                        </View>

                        <View className="bg-white p-4 rounded-xl border border-green-100 flex-row items-start mt-2">
                            <Text className="text-blue-500 mr-2 mt-1">ℹ️</Text>
                            <Text className="text-slate-600 text-sm flex-1 leading-relaxed">
                                This vote is anonymously recorded on the blockchain. This verification confirms the vote was counted without revealing the candidate choice.
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default VoteVerification;
