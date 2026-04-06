import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { API_URL } from '../../constants/config';
import { locationData } from '../../data/locationData';
import SelectDropdown from '../common/SelectDropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RealTimeView = ({ navigation }) => {
    const [stats, setStats] = useState({ totalVotes: 0, breakdown: [] });
    const [constituencies, setConstituencies] = useState([]);
    const [totalRegistered, setTotalRegistered] = useState(0);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const states = Object.keys(locationData).sort();
    const districts = selectedState && locationData[selectedState]?.districts
        ? Object.keys(locationData[selectedState].districts).sort()
        : [];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const base = API_URL || 'http://localhost:5000';

                // Fetch turnout stats (votes per constituency + overall totals)
                const statsRes = await fetch(`${base}/api/stats/turnout`);
                if (statsRes.ok) {
                    const data = await statsRes.json();
                    const breakdown = data.breakdown || [];
                    setStats({
                        totalVotes: data.totalVotes || 0,
                        breakdown
                    });
                    setTotalRegistered(data.totalRegistered || 0);
                }

                // Fetch constituencies (for filtering by state/district)
                const conRes = await fetch(`${base}/api/constituencies`);
                if (conRes.ok) {
                    const conData = await conRes.json();
                    setConstituencies(Array.isArray(conData) ? conData : []);
                }
            } catch (err) {
                console.error("Fetch stats failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    // Compute overall percentage
    const overallPercent = totalRegistered > 0
        ? ((stats.totalVotes / totalRegistered) * 100).toFixed(1)
        : (stats.totalVotes > 0 ? '100.0' : '0.0');

    // Get constituency names from locationData for selected state+district
    const locationConstituencies = selectedState && selectedDistrict && locationData[selectedState]?.districts[selectedDistrict]
        ? locationData[selectedState].districts[selectedDistrict].map(c => c.name)
        : [];

    // Filter breakdown based on selection
    const filteredBreakdown = stats.breakdown.filter(item => {
        if (!selectedState) return true;

        // Find if this constituency belongs to the selected state
        const dbConstituency = constituencies.find(c => c.name === item.constituency);
        if (dbConstituency) {
            if (dbConstituency.state !== selectedState) return false;
            if (selectedDistrict && dbConstituency.district !== selectedDistrict) return false;
            return true;
        }

        // Fallback: check if constituency name is in locationData for selected filters
        if (selectedDistrict) {
            return locationConstituencies.includes(item.constituency);
        }
        // Check all districts in the state
        const stateData = locationData[selectedState]?.districts || {};
        const allNames = Object.values(stateData).flat().map(c => c.name);
        return allNames.includes(item.constituency);
    });

    // Show all constituency names from locationData when a district is selected (even if 0 votes)
    const displayRows = selectedDistrict && locationConstituencies.length > 0
        ? locationConstituencies.map(name => {
            const match = stats.breakdown.find(b => b.constituency === name);
            const dbC = constituencies.find(c => c.name === name);
            const voterCount = dbC ? parseInt(dbC.voter_count) || 0 : 0;
            const voteCount = match ? parseInt(match.count) : 0;
            const pct = voterCount > 0 ? ((voteCount / voterCount) * 100).toFixed(1) : (voteCount > 0 ? '100.0' : '0.0');
            return { constituency: name, count: voteCount, voterCount, percentage: pct };
        })
        : filteredBreakdown.map(item => {
            const dbC = constituencies.find(c => c.name === item.constituency);
            const voterCount = dbC ? parseInt(dbC.voter_count) || 0 : 0;
            const voteCount = parseInt(item.count);
            const pct = voterCount > 0 ? ((voteCount / voterCount) * 100).toFixed(1) : (voteCount > 0 ? '100.0' : '0.0');
            return { constituency: item.constituency, count: voteCount, voterCount, percentage: pct };
        });

    return (
        <ScrollView className="flex-1 bg-slate-50">
            <View className="p-6">
                {/* Header with Back */}
                <View className="flex-row items-center mb-6 mt-4">
                    <TouchableOpacity onPress={() => navigation?.goBack()} className="mr-3">
                        <Text className="text-blue-600 font-semibold text-base">← Back</Text>
                    </TouchableOpacity>
                    <Text className="text-2xl font-bold text-slate-800 flex-1">Real-Time Analytics</Text>
                </View>

                {loading ? (
                    <View className="items-center justify-center p-10">
                        <ActivityIndicator size="large" color="#16a34a" />
                        <Text className="text-slate-500 mt-4">Connecting to live feed...</Text>
                    </View>
                ) : (
                    <>
                        {/* ── Live Turnout Counter ── */}
                        <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-green-500 mb-6">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-slate-700">Live Voter Turnout</Text>
                                <View className="bg-red-100 flex-row items-center px-2 py-1 rounded-full border border-red-200">
                                    <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
                                    <Text className="text-red-700 font-bold text-xs uppercase">Live</Text>
                                </View>
                            </View>
                            {/* Votes / Total Registered */}
                            <View className="flex-row items-baseline mt-2">
                                <Text className="text-4xl font-extrabold text-slate-900">{stats.totalVotes.toLocaleString()}</Text>
                                <Text className="text-2xl font-bold text-slate-400 mx-1">/</Text>
                                <Text className="text-2xl font-bold text-slate-500">{totalRegistered > 0 ? totalRegistered.toLocaleString() : '—'}</Text>
                            </View>
                            <Text className="text-slate-500 font-medium mt-1">Votes Cast / Total Registered Voters</Text>

                            {/* Percentage Bar */}
                            <View className="mt-4 mb-2">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-sm font-bold text-green-600">{overallPercent}% Turnout</Text>
                                </View>
                                <View className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <View
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${Math.min(parseFloat(overallPercent), 100)}%` }}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* ── Anomaly Detection ── */}
                        <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-red-500 mb-6">
                            <Text className="text-lg font-bold text-slate-700 mb-4">Anomaly Detection System</Text>
                            <View className="bg-red-50 p-4 rounded-xl border-l-4 border-red-500">
                                <Text className="font-bold text-red-800 mb-1">⚠️ Suspicious Spike</Text>
                                <Text className="text-red-600 mb-1">Kuppam, Booth 14</Text>
                                <Text className="text-xs text-red-400">120 votes in 5 mins (High Velocity)</Text>
                            </View>
                        </View>

                        {/* ── Constituency Performance with Filters ── */}
                        <View className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                            <View className="p-4 border-b border-slate-100 bg-slate-50">
                                <Text className="text-lg font-bold text-slate-700">Constituency Performance</Text>
                            </View>

                            {/* State & District Filters */}
                            <View className="p-4 gap-3 border-b border-slate-100">
                                <SelectDropdown
                                    label="State"
                                    value={selectedState}
                                    options={states}
                                    onSelect={(state) => {
                                        setSelectedState(state);
                                        setSelectedDistrict('');
                                    }}
                                    placeholder="All States"
                                />
                                <SelectDropdown
                                    label="District"
                                    value={selectedDistrict}
                                    options={districts}
                                    onSelect={(district) => setSelectedDistrict(district)}
                                    placeholder="All Districts"
                                    disabled={!selectedState}
                                />
                                {(selectedState || selectedDistrict) && (
                                    <TouchableOpacity
                                        onPress={() => { setSelectedState(''); setSelectedDistrict(''); }}
                                        className="self-start bg-slate-100 px-3 py-1 rounded-lg border border-slate-200"
                                    >
                                        <Text className="text-slate-600 text-xs font-semibold">✕ Clear Filters</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Table Header */}
                            <View className="p-4">
                                <View className="border-b border-slate-200 pb-2 mb-2 flex-row justify-between flex-wrap">
                                    <View className="flex-[2]"><Text className="font-bold text-slate-500">Constituency</Text></View>
                                    <View className="flex-1 items-end"><Text className="font-bold text-slate-500">Polled</Text></View>
                                    <View className="flex-1 items-end"><Text className="font-bold text-slate-500">Turnout %</Text></View>
                                </View>

                                {displayRows.length > 0 ? (
                                    displayRows.map((item, index) => (
                                        <View key={index} className="flex-row py-3 justify-between flex-wrap border-b border-slate-50">
                                            <View className="flex-[2] justify-center">
                                                <Text className="text-slate-700 font-medium">{item.constituency}</Text>
                                            </View>
                                            <View className="flex-1 justify-center items-end">
                                                <Text className="font-bold text-slate-900">{item.count}</Text>
                                            </View>
                                            <View className="flex-1 justify-center items-end">
                                                <Text className={`font-bold text-xs ${parseFloat(item.percentage) > 50 ? 'text-green-600' : parseFloat(item.percentage) > 0 ? 'text-orange-500' : 'text-slate-400'}`}>
                                                    {item.percentage}%
                                                </Text>
                                            </View>
                                        </View>
                                    ))
                                ) : (
                                    <View className="py-6 items-center">
                                        <Text className="text-slate-400">
                                            {selectedState ? 'No polling data for selected filters' : 'Select a state and district to view constituency data'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </>
                )}
                <View className="h-10" />
            </View>
        </ScrollView>
    );
};

export default RealTimeView;
