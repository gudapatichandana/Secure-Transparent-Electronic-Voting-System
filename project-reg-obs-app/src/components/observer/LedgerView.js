import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { API_URL } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LedgerView = ({ navigation }) => {
    const [hashId, setHashId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // { found: boolean, data: object }
    const [hasSearched, setHasSearched] = useState(false);

    const handleVerify = async () => {
        if (!hashId.trim()) {
            Alert.alert("Error", "Please enter a valid Hash ID");
            return;
        }

        Keyboard.dismiss();
        setLoading(true);
        setHasSearched(true);
        setResult(null);

        try {
            const token = await AsyncStorage.getItem('observer_token');
            const endpoint = `${API_URL || 'http://localhost:5000'}/api/verify-receipt`;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ transactionHash: hashId.trim() })
            });

            if (res.ok) {
                const data = await res.json();
                if (data.verified && data.vote) {
                    setResult({ found: true, data: data.vote });
                } else {
                    setResult({ found: false });
                }
            } else {
                setResult({ found: false });
            }
        } catch (err) {
            console.error("Verification failed", err);
            Alert.alert("Error", "Failed to connect to the verification node.");
            setHasSearched(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-slate-50" keyboardShouldPersistTaps="handled">
            <View className="p-6 pt-12 pb-12">
                <TouchableOpacity onPress={() => navigation?.goBack()} className="mb-6">
                    <Text className="text-blue-600 font-bold text-base">← Back</Text>
                </TouchableOpacity>

                {/* Header Area */}
                <View className="mb-8 border-b border-slate-200 pb-5 mt-2">
                    <Text className="text-emerald-700 text-3xl font-extrabold tracking-tight">Vote Verification</Text>
                    <Text className="text-blue-900 text-base mt-2 font-medium leading-5">
                        Enter the cryptographically generated Hash ID to verify its presence on the blockchain.
                    </Text>
                </View>

                {/* Search Card */}
                <View className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
                    <View className="h-1.5 w-full bg-gradient-to-r from-emerald-400 to-emerald-600" />

                    <View className="p-6 pb-8">
                        <View className="flex-row items-center mb-6 mt-1">
                            <Text className="text-2xl mr-3">🔍</Text>
                            <Text className="text-emerald-900 text-xl font-extrabold flex-1">Hash Verification</Text>
                        </View>

                        <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-2 ml-1">Transaction Hash ID</Text>

                        <View className="flex-row gap-3">
                            <TextInput
                                className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-mono text-sm shadow-sm"
                                placeholder="e.g. 5e884898da28047151d0e56f8dc62927"
                                placeholderTextColor="#94a3b8"
                                value={hashId}
                                onChangeText={setHashId}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        <TouchableOpacity
                            className={`rounded-2xl py-4 mt-6 shadow-md ${(loading || !hashId.trim()) ? 'bg-slate-400 shadow-none' : 'bg-emerald-600 shadow-emerald-200'}`}
                            onPress={handleVerify}
                            disabled={loading || !hashId.trim()}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text className="text-white font-extrabold text-lg text-center tracking-wide">Verify on Blockchain</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Results Section */}
                {hasSearched && !loading && (
                    <View className="mt-2">
                        {result?.found ? (
                            <View className="bg-white rounded-3xl p-6 shadow-sm border border-green-200 overflow-hidden relative">
                                <View className="border-l-4 border-l-green-500 bg-green-50 rounded-2xl p-5 mb-5 flex-row items-center">
                                    <View className="bg-green-100 p-2 rounded-full mr-3">
                                        <Text className="text-xl">✅</Text>
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-green-800 font-extrabold text-lg">Verification Successful</Text>
                                        <Text className="text-green-700 font-medium text-xs mt-0.5">Hash exists on the immutable ledger</Text>
                                    </View>
                                </View>

                                <View className="space-y-4">
                                    <View className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">VOTING CONSTITUENCY</Text>
                                        <Text className="text-slate-900 font-bold text-lg">{result.data.constituency}</Text>
                                    </View>

                                    <View className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-3">
                                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">TIMESTAMP</Text>
                                        <Text className="text-slate-700 font-semibold">{new Date(result.data.timestamp).toLocaleString()}</Text>
                                    </View>

                                    <View className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mt-3">
                                        <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">VERIFIED HASH</Text>
                                        <Text className="text-slate-500 font-mono text-[11px] leading-4">{result.data.transaction_hash}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className="bg-red-50 rounded-3xl p-6 shadow-sm border border-red-200 items-center justify-center py-10 flex-col">
                                <Text className="text-4xl mb-3">⚠️</Text>
                                <Text className="text-red-800 font-extrabold text-xl mb-1 text-center">Hash Not Found</Text>
                                <Text className="text-red-600 font-medium text-center leading-5 px-4 text-sm mt-2">
                                    This Hash ID could not be located on the public ledger. It may be invalid or not yet confirmed.
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                <View className="h-6"></View>
            </View>
        </ScrollView>
    );
};

export default LedgerView;
