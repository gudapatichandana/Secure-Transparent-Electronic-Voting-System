import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { styled } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardHub = ({ setView, observer }) => {
    const role = observer?.role || 'general';

    const ActionCard = ({ title, desc, icon, color, onPress, borderColor }) => (
        <TouchableOpacity
            onPress={onPress}
            className={`bg-white p-4 rounded-xl border mb-4 shadow-sm ${borderColor ? borderColor : 'border-slate-100'}`}
        >
            <View className="flex-row items-center mb-2">
                <View className={`p-2 rounded-lg mr-3 ${color}`}>
                    <Text className="text-xl">{icon}</Text>
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-lg text-slate-800">{title}</Text>
                </View>
            </View>
            <Text className="text-slate-500 text-sm mb-3">{desc}</Text>
            <Text className="text-blue-600 font-semibold text-xs text-right">Access Module →</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView className="flex-1 bg-slate-50">
            {/* Hero Section */}
            <View className="bg-slate-900 p-6 pt-10 rounded-b-3xl mb-6">
                <View className="flex-row justify-between items-center mb-6">
                    <View>
                        <Text className="text-slate-400 text-xs uppercase tracking-wider">Welcome Back</Text>
                        <Text className="text-white text-2xl font-bold">{observer?.name || 'Observer'}</Text>
                    </View>
                    <View className="bg-slate-800 px-3 py-1 rounded-full">
                        <Text className="text-blue-400 text-xs font-bold uppercase">{role}</Text>
                    </View>
                </View>

                {/* Widgets */}
                <View className="flex-row gap-4">
                    <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                        <Text className="text-slate-300 text-xs mb-1">System Status</Text>
                        <View className="flex-row items-center gap-2">
                            <Text>📡</Text>
                            <Text className="text-green-400 font-bold">Online</Text>
                        </View>
                    </View>
                    <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' }}>
                        <Text className="text-slate-300 text-xs mb-1">Activity</Text>
                        <View className="flex-row items-center gap-2">
                            <Text>📈</Text>
                            <Text className="text-white font-bold">+12% Trend</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="p-4">
                <Text className="text-slate-800 font-bold text-xl mb-4">Quick Actions</Text>

                {/* General Observer: Real-Time Turnout */}
                {role === 'general' && (
                    <ActionCard
                        title="Real-Time Analytics"
                        desc="Monitor voter turnout and polling station statistics live."
                        icon="📊"
                        color="bg-green-100"
                        onPress={() => setView('realtime')}
                    />
                )}

                {/* Expenditure Observer: Public Ledger */}
                {role === 'expenditure' && (
                    <ActionCard
                        title="Public Ledger"
                        desc="Track campaign expenditures and financial logs."
                        icon="⛓️"
                        color="bg-orange-100"
                        onPress={() => setView('ledger')}
                    />
                )}

                {/* Common: Reports */}
                <ActionCard
                    title="Reports & Logs"
                    desc="Access detailed statutory reports and incident logs."
                    icon="📝"
                    color="bg-blue-100"
                    onPress={() => setView('reports')}
                />

                {/* Vote Verification */}
                <ActionCard
                    title="Vote Verification"
                    desc="Verify voter receipts and confirm votes were recorded."
                    icon="✓"
                    color="bg-purple-100"
                    onPress={() => setView('verify')}
                />

                {/* Emergency */}
                <ActionCard
                    title="Emergency Protocol"
                    desc="Initiate emergency lockdown or report critical violations."
                    icon="🚨"
                    color="bg-red-100"
                    borderColor="border-red-100" // Highlight border
                    onPress={() => alert('Emergency Protocol Initiated')}
                />
            </View>
            <View className="h-20" />
        </ScrollView>
    );
};

export default DashboardHub;
