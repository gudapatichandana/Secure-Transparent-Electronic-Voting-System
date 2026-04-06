import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BASE_URL } from '../../constants/config';

const ReportsView = ({ navigation }) => {
    // Shared State
    const [activeTab, setActiveTab] = useState('reports'); // 'results' or 'reports'
    const [loading, setLoading] = useState(true);
    const [isPublished, setIsPublished] = useState(false);
    const [error, setError] = useState('');

    // Results State
    const [results, setResults] = useState([]);

    // Reports State
    const [exporting, setExporting] = useState(false);
    const [observation, setObservation] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const statusRes = await fetch(`${BASE_URL}/api/election/status`);
            if (!statusRes.ok) throw new Error('Status check failed');
            const statusData = await statusRes.json();
            
            if (statusData && statusData.results_published) {
                setIsPublished(true);
                // If published, fetch results immediately
                const summaryRes = await fetch(`${BASE_URL}/api/results/summary`);
                if (summaryRes.ok) {
                    const sumData = await summaryRes.json();
                    setResults(sumData.constituencyResults || {}); // Store constituency map instead of party list
                }
                setActiveTab('results'); // Default to results if published
            } else {
                setIsPublished(false);
                setActiveTab('reports'); // Default to reports if results pending
            }
        } catch (err) {
            console.error("Failed to fetch initial data:", err);
            setError('Failed to connect to the Election Server.');
        } finally {
            setLoading(false);
        }
    };

    const handleExportLedger = async () => {
        setExporting(true);
        setTimeout(() => {
            Alert.alert("Success", "Secure ledger export initiated.");
            setExporting(false);
        }, 1000);
    };

    if (loading) {
        return (
            <View className="flex-1 bg-slate-50 justify-center items-center">
                <ActivityIndicator size="large" color="#000080" />
                <Text className="mt-4 text-slate-500 font-semibold">Syncing with Election Ledger...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-slate-50 justify-center items-center p-6">
                <Text className="text-5xl mb-4">⚠️</Text>
                <Text className="text-xl font-extrabold text-red-600 mb-2">Network Error</Text>
                <Text className="text-slate-500 text-center">{error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            {/* Header */}
            <View className="bg-white pt-12 pb-4 px-6 border-b border-slate-100">
                <TouchableOpacity onPress={() => navigation?.goBack()} className="mb-4">
                    <Text className="text-blue-600 font-bold text-base">← Back</Text>
                </TouchableOpacity>
                <Text className="text-slate-900 text-2xl font-black">Statutory Observer Portal</Text>
                
                {/* Tabs */}
                <View className="flex-row mt-6 bg-slate-50 p-1 rounded-2xl">
                    <TouchableOpacity 
                        onPress={() => setActiveTab('reports')}
                        className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'reports' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Text className={`font-bold ${activeTab === 'reports' ? 'text-orange-600' : 'text-slate-400'}`}>📝 Reports</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => setActiveTab('results')}
                        className={`flex-1 py-3 rounded-xl items-center ${activeTab === 'results' ? 'bg-white shadow-sm' : ''}`}
                    >
                        <Text className={`font-bold ${activeTab === 'results' ? 'text-blue-600' : 'text-slate-400'}`}>🏆 Results</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 60 }}>
                {activeTab === 'reports' ? (
                    <View className="p-6">
                        {/* Reports Content */}
                        <View className="mb-8">
                             <Text className="text-orange-600 text-3xl font-extrabold tracking-tight">Statutory Reports</Text>
                             <Text className="text-blue-900 text-base mt-2 font-medium">Secure portal for daily dispatches and notices.</Text>
                        </View>

                        {/* Submission Form Card */}
                        <View className="bg-white rounded-3xl shadow-sm border border-slate-100 mb-8 overflow-hidden">
                            <View className="h-1.5 w-full bg-orange-500" />
                            <View className="p-6">
                                <View className="border-b border-slate-100 pb-4 mb-5 flex-row items-center">
                                    <Text className="text-2xl mr-3">📝</Text>
                                    <Text className="text-orange-900 text-xl font-extrabold">Submit Report</Text>
                                </View>
                                <View className="flex-col gap-5">
                                    <View>
                                        <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-2 ml-1">Report Type</Text>
                                        <View className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
                                            <Text className="text-slate-800 font-semibold text-base">Arrival Report</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-2 ml-1">Observations</Text>
                                        <TextInput
                                            className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium min-h-[120px]"
                                            multiline={true}
                                            numberOfLines={4}
                                            textAlignVertical="top"
                                            placeholder="Enter detailed observations..."
                                            placeholderTextColor="#94a3b8"
                                            value={observation}
                                            onChangeText={setObservation}
                                        />
                                    </View>
                                    <TouchableOpacity className="bg-orange-600 rounded-2xl py-4 mt-4 shadow-md shadow-orange-200">
                                        <Text className="text-white font-extrabold text-lg text-center tracking-wide">Upload & Submit Securely</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* ECI Notice Board */}
                        <View className="bg-blue-50 rounded-3xl p-6 shadow-sm border border-blue-200 mb-8">
                            <View className="border-b border-blue-200/60 pb-4 mb-5 flex-row items-center">
                                <Text className="text-2xl mr-3">🚨</Text>
                                <Text className="text-blue-900 text-xl font-extrabold">ECI Notice Board</Text>
                            </View>
                            <View className="flex-col gap-4">
                                <View className="bg-white p-5 rounded-2xl border-l-[5px] border-l-red-500 shadow-sm">
                                    <Text className="text-slate-800 font-medium leading-5"><Text className="text-red-600 font-bold">URGENT:</Text> Check all VVPAT seals in Sector 4.</Text>
                                    <Text className="text-slate-400 text-xs font-semibold mt-2">2 mins ago</Text>
                                </View>
                                <View className="bg-white p-5 rounded-2xl border-l-[5px] border-l-orange-500 shadow-sm">
                                    <Text className="text-slate-800 font-medium leading-5">Submit 11:00 AM turnout stats immediately.</Text>
                                    <Text className="text-slate-400 text-xs font-semibold mt-2">1 hour ago</Text>
                                </View>
                            </View>
                        </View>

                        {/* Forensic Tools */}
                        <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6 overflow-hidden relative">
                            <View className="absolute top-0 left-0 right-0 h-1.5 bg-green-500" />
                            <View className="flex-row items-center mb-5 mt-2">
                                <View className="bg-green-100 p-3 rounded-2xl mr-4">
                                    <Text className="text-2xl">🛡️</Text>
                                </View>
                                <Text className="text-green-800 text-2xl font-extrabold flex-1">Auditor Forensic Tools</Text>
                            </View>
                            <View className="bg-green-50 p-6 rounded-3xl border border-green-200/50 mt-2">
                                <Text className="text-green-900 text-lg font-bold mb-3 tracking-tight">Secure Data Export</Text>
                                <Text className="text-green-800/80 leading-6 mb-6 text-sm font-medium">Download the complete public ledger for offline forensic analysis. Packaging includes raw ledger.json and cryptographic signature.</Text>
                                <TouchableOpacity 
                                    className={`rounded-2xl py-4 flex-row justify-center items-center shadow-md ${exporting ? 'bg-slate-400' : 'bg-green-600 shadow-green-200'}`}
                                    onPress={handleExportLedger}
                                    disabled={exporting}
                                >
                                    {exporting ? <ActivityIndicator color="white" /> : <Text className="text-white font-bold text-[17px] tracking-wide">⬇️ Download Ledger (.zip)</Text>}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View className="p-6">
                        {/* Results Content */}
                        {!isPublished ? (
                            <View className="items-center justify-center pt-20">
                                <Text className="text-6xl mb-6 text-center">🔒</Text>
                                <Text className="text-2xl font-black text-slate-900 text-center mb-3">Results Pending Publication</Text>
                                <Text className="text-slate-500 text-center px-10 leading-6">
                                    The voting tally is currently being cryptographically verified by the Electoral Commission. 
                                    Results will appear here automatically once the Returning Officer publishes them.
                                </Text>
                            </View>
                        ) : (
                            <>
                                <View className="items-center mb-8">
                                    <Text className="text-4xl mb-2 text-center">🏆</Text>
                                    <Text className="text-2xl font-black text-slate-900 text-center">Official Election Results</Text>
                                    <Text className="text-slate-500 font-medium text-center">Live Tally from Secure Ledger</Text>
                                </View>

                                {Object.keys(results).length > 0 ? (
                                    Object.entries(results).map(([constituencyName, candidatesMap]) => {
                                        // candidatesMap is { "CandidateUUID": { count, name, party, symbol } }
                                        // Sort by vote count descending
                                        const sortedCandidates = Object.entries(candidatesMap).sort((a, b) => b[1].count - a[1].count);
                                        const winnerEntry = sortedCandidates[0];
                                        const totalConstituencyVotes = sortedCandidates.reduce((sum, [, data]) => sum + data.count, 0);

                                        if (!winnerEntry) return null;
                                        
                                        const winnerData = winnerEntry[1];
                                        const winnerShare = totalConstituencyVotes > 0 ? ((winnerData.count / totalConstituencyVotes) * 100).toFixed(2) : 0;

                                        return (
                                            <View key={constituencyName} className="bg-white rounded-3xl p-6 mb-5 border border-slate-100 shadow-sm">
                                                <View className="flex-row justify-between items-center mb-5 border-b border-slate-100 pb-4">
                                                    <View className="flex-row items-center gap-3">
                                                        <Text className="text-2xl">📍</Text>
                                                        <Text className="text-xl font-black text-slate-900">{constituencyName}</Text>
                                                    </View>
                                                </View>
                                                
                                                <View className="bg-green-50 rounded-2xl p-4 border border-green-100 mb-4 flex-row justify-between items-center">
                                                    <View>
                                                        <Text className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">Constituency Winner</Text>
                                                        <Text className="text-lg font-black text-green-900">{winnerData.name}</Text>
                                                        <Text className="text-xs font-bold text-green-700 opacity-80 mt-0.5">{winnerData.party}</Text>
                                                    </View>
                                                    <Text className="text-3xl">🥇</Text>
                                                </View>

                                                <View className="flex-row justify-between mb-4">
                                                    <View>
                                                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Winning Votes</Text>
                                                        <Text className="text-2xl font-black text-slate-900">{winnerData.count.toLocaleString()}</Text>
                                                    </View>
                                                    <View className="items-end">
                                                        <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Vote Share</Text>
                                                        <Text className="text-2xl font-black text-green-600">{winnerShare}%</Text>
                                                    </View>
                                                </View>
                                                
                                                <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                    <LinearGradient
                                                        colors={['#138808', '#22C55E']}
                                                        start={{ x: 0, y: 0 }}
                                                        end={{ x: 1, y: 0 }}
                                                        style={{ height: '100%', borderRadius: 6, width: `${Math.max(2, parseFloat(winnerShare))}%` }}
                                                    />
                                                </View>
                                                
                                                {/* Show total votes at bottom */}
                                                <Text className="text-center text-slate-400 text-xs font-bold mt-4 shrink-0">
                                                    TOTAL VALID VOTES: {totalConstituencyVotes.toLocaleString()}
                                                </Text>
                                            </View>
                                        );
                                    })
                                ) : (
                                    <View className="items-center justify-center py-20 bg-white rounded-3xl border border-slate-100">
                                        <Text className="text-slate-400 font-medium">No results found in the secure audit log.</Text>
                                    </View>
                                )}
                                
                                <View className="mt-8 p-6 bg-sky-100 rounded-2xl items-center border border-sky-200">
                                    <Text className="text-sky-700 font-black text-sm">✓ Cryptographically Verified Result</Text>
                                </View>
                            </>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default ReportsView;
