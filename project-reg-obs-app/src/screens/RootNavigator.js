import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAccounts } from '../context/AccountContext';
import { View, ActivityIndicator } from 'react-native';

import LandingScreen from './LandingScreen';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import RegisterScreen from './RegisterScreen';
import TrackStatusScreen from './TrackStatusScreen';
import ProfileScreen from './ProfileScreen';
import RealTimeView from '../components/observer/RealTimeView';
import LedgerView from '../components/observer/LedgerView';
import ReportsView from '../components/observer/ReportsView';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { isReady, activeAccount } = useAccounts();

    // Show nothing while AsyncStorage is loading
    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'fade' }}
            // If a saved session exists skip Landing/Login entirely
            initialRouteName={activeAccount ? 'Dashboard' : 'Landing'}
        >
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                // Prevent going back to Login/Landing from Dashboard
                options={{ gestureEnabled: false }}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ headerShown: false, presentation: 'modal' }}
            />
            <Stack.Screen name="TrackStatus" component={TrackStatusScreen} />
            <Stack.Screen name="Analytics" component={RealTimeView} />
            <Stack.Screen name="Ledger" component={LedgerView} />
            <Stack.Screen name="Reports" component={ReportsView} />
        </Stack.Navigator>
    );
};

export default RootNavigator;
