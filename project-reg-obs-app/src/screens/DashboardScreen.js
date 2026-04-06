import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAccounts } from '../context/AccountContext';
import { LinearGradient } from 'expo-linear-gradient';

// Citizen screens
import CitizenHomeScreen from './dashboard/CitizenHomeScreen';
import ProfileScreen from './ProfileScreen';

// Observer screens
import ObserverHomeScreen from './dashboard/ObserverHomeScreen';
import RealTimeView from '../components/observer/RealTimeView';
import LedgerView from '../components/observer/LedgerView';
import ReportsView from '../components/observer/ReportsView';

const Tab = createBottomTabNavigator();

const getInitials = (name = '') =>
    name.split(' ').slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || '?';

// Shared header bar component
const DashboardHeader = ({ navigation, title, accentColor }) => {
    const { activeAccount, accounts, activeIndex, switchAccount } = useAccounts();
    const user = activeAccount?.user;
    const initials = getInitials(user?.name || user?.full_name || user?.username || '');
    const otherAccount = accounts.find((_, i) => i !== activeIndex);

    return (
        <LinearGradient colors={[accentColor, accentColor + 'DD']} style={styles.header}>
            <View style={{ flex: 1, marginRight: 16 }}>
                <Text style={styles.headerLabel}>Welcome back</Text>
                <Text style={styles.headerName}>
                    {user?.name || user?.full_name || user?.username || 'User'}
                </Text>
            </View>
            <View style={styles.headerRight}>
                {/* Switch account pill */}
                {otherAccount && (
                    <TouchableOpacity
                        style={styles.switchPill}
                        onPress={() => switchAccount(accounts.indexOf(otherAccount))}
                    >
                        <Text style={styles.switchPillText}>
                            {otherAccount.appRole === 'citizen' ? '🗳️' : '👁️'} Switch
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
};

// Tab icon helper
const TabIcon = ({ emoji, label, focused, color }) => (
    <View style={styles.tabIcon}>
        <Text style={[styles.tabEmoji, { opacity: focused ? 1 : 0.55 }]}>{emoji}</Text>
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
    </View>
);

// ──────────────────────────────
// CITIZEN DASHBOARD
// ──────────────────────────────
const CitizenDashboard = ({ navigation }) => (
    <View style={{ flex: 1 }}>
        <DashboardHeader navigation={navigation} title="Voter Portal" accentColor="#2563EB" />
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="CitizenHome"
                component={CitizenHomeScreen}
                options={{ tabBarIcon: ({ focused, color }) => <TabIcon emoji="🏠" label="Home" focused={focused} color={color} /> }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarIcon: ({ focused, color }) => <TabIcon emoji="👤" label="Profile" focused={focused} color={color} /> }}
            />
        </Tab.Navigator>
    </View>
);

// ──────────────────────────────
// OBSERVER DASHBOARD
// ──────────────────────────────
const ObserverDashboard = ({ navigation }) => (
    <View style={{ flex: 1 }}>
        <DashboardHeader navigation={navigation} title="Observer Hub" accentColor="#EA580C" />
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#EA580C',
                tabBarInactiveTintColor: '#94A3B8',
                tabBarShowLabel: false,
            }}
        >
            <Tab.Screen
                name="ObserverHome"
                component={ObserverHomeScreen}
                options={{ tabBarIcon: ({ focused, color }) => <TabIcon emoji="🏠" label="Home" focused={focused} color={color} /> }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ tabBarIcon: ({ focused, color }) => <TabIcon emoji="👤" label="Profile" focused={focused} color={color} /> }}
            />
        </Tab.Navigator>
    </View>
);

// ──────────────────────────────
// ROOT: picks citizen vs observer
// ──────────────────────────────
const DashboardScreen = ({ navigation }) => {
    const { activeAccount } = useAccounts();

    if (!activeAccount) {
        navigation.replace('Landing');
        return null;
    }

    if (activeAccount.appRole === 'observer') {
        return <ObserverDashboard navigation={navigation} />;
    }
    return <CitizenDashboard navigation={navigation} />;
};

export default DashboardScreen;

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 52, paddingBottom: 14, paddingHorizontal: 20 },
    headerLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
    headerName: { color: '#fff', fontSize: 19, fontWeight: '800' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    switchPill: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
    switchPillText: { color: '#fff', fontSize: 12, fontWeight: '700' },
    avatarBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
    avatarText: { color: '#fff', fontSize: 15, fontWeight: '800' },
    tabBar: { height: 64, paddingTop: 6, paddingBottom: 8, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0', elevation: 12, shadowOpacity: 0.08 },
    tabIcon: { alignItems: 'center', gap: 2 },
    tabEmoji: { fontSize: 20 },
    tabLabel: { fontSize: 10, fontWeight: '600' },
});
