import { Platform } from 'react-native';

// In production (Render deploy): set EXPO_PUBLIC_API_URL in Render dashboard.
// In local dev: leave EXPO_PUBLIC_API_URL unset — falls back to localhost automatically.
const RENDER_URL = process.env.EXPO_PUBLIC_API_URL;

export const BASE_URL = RENDER_URL
    ? RENDER_URL
    : (process.env.NODE_ENV === 'production'
        ? 'https://secure-transparent-electronic-voting.onrender.com' // Explicit production fallback
        : (Platform.OS === 'web'
            ? 'http://localhost:5000'          // Local web browser dev
            : 'http://10.23.235.233:5000'));    // Expo Go on mobile (LAN IP)

export const API_URL = BASE_URL; // Alias used in LoginScreen.js

export const ENDPOINTS = {
    OBSERVER_LOGIN: `${BASE_URL}/api/observer/login`,
    OBSERVER_REGISTER: `${BASE_URL}/api/observer/register`,
    OBSERVER_FORGOT_PW: `${BASE_URL}/api/observer/forgot-password`,
    OBSERVER_VERIFY_OTP: `${BASE_URL}/api/observer/verify-otp`,
    OBSERVER_RESET_PW: `${BASE_URL}/api/observer/reset-password`,

    VOTER_LOGIN: `${BASE_URL}/api/voter/login`,
    VOTER_REGISTER: `${BASE_URL}/api/voter/signup`,
    VOTER_FORGOT_PW: `${BASE_URL}/api/voter/forgot-password`,
    VOTER_VERIFY_OTP: `${BASE_URL}/api/voter/verify-otp`,
    VOTER_RESET_PW: `${BASE_URL}/api/voter/reset-password`,
    FACE_DETECT: `${BASE_URL}/api/face/detect`,
};
