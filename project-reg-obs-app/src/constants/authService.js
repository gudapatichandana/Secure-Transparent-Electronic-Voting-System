import { ENDPOINTS } from '../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
    loginObserver: async (username, password, role) => {
        try {
            const response = await fetch(ENDPOINTS.OBSERVER_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });
            const data = await response.json();

            // Store token if successful
            if (data.success && data.token) {
                await AsyncStorage.setItem('observer_token', data.token);
            }
            return data;
        } catch (error) {
            console.error('Observer Login Error:', error);
            return { success: false, error: 'Network request failed' };
        }
    },

    loginVoter: async (phone, password) => {
        try {
            const response = await fetch(ENDPOINTS.VOTER_LOGIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });
            const data = await response.json();

            // Store token if successful
            if (data.success && data.token) {
                await AsyncStorage.setItem('voter_token', data.token);
            }
            return data;
        } catch (error) {
            console.error('Voter Login Error:', error);
            return { success: false, error: 'Network request failed' };
        }
    },

    registerVoter: async (userData) => {
        try {
            const response = await fetch(ENDPOINTS.VOTER_REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            return await response.json();
        } catch (error) {
            console.error('Voter Registration Error:', error);
            return { success: false, error: 'Network request failed' };
        }
    }
};
