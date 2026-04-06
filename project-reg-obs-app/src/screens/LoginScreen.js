import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { API_URL } from '../constants/config';
import { useAccounts } from '../context/AccountContext';

const StyledLinearGradient = styled(LinearGradient);

const LoginScreen = ({ navigation, route }) => {
    const { addOrUpdateAccount } = useAccounts();
    const addingAccount = route?.params?.addingAccount || false;
    // Mode toggles
    const [appRole, setAppRole] = useState('citizen'); // 'citizen' or 'observer'
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [observerRole, setObserverRole] = useState('general'); // 'general' or 'expenditure'
    const [loading, setLoading] = useState(false);
    const [uiError, setUiError] = useState(''); // Inline error message
    const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0=Off, 1=Email, 2=OTP, 3=New Password
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        mobile_number: '', // For observer
        email: '',
        password: '',
    });

    const handleChange = (name, value) => {
        setUiError(''); // Clear error on typing
        setFormData({ ...formData, [name]: value });
    };

    const handleCitizenSubmit = async () => {
        setUiError('');
        setLoading(true);
        const endpoint = isLoginMode ? '/api/voter/login' : '/api/voter/signup';
        const url = (API_URL || 'http://localhost:5000') + endpoint;

        try {
            const payload = isLoginMode
                ? { mobile: formData.phone, password: formData.password }
                : { name: formData.fullName, mobile: formData.phone, email: formData.email, password: formData.password };

            const req = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const res = await req.json();

            if (req.ok && res.success) {
                if (!isLoginMode) {
                    Alert.alert("Success", "Registration successful. Please login.");
                    setIsLoginMode(true);
                    setLoading(false);
                    return;
                }

                // Save session and navigate to dashboard
                const userData = { name: res.user?.name || 'Citizen', ...res.user };
                await addOrUpdateAccount(userData, 'citizen');
                navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
            } else {
                setUiError(res.error || "Authentication failed");
                Alert.alert("Error", res.error || "Authentication failed");
            }
        } catch (e) {
            setUiError("Network Error. Unable to connect to server.");
            console.error("Login Error:", e);
        }
        setLoading(false);
    };

    const handleObserverSubmit = async () => {
        setUiError('');
        setLoading(true);
        const endpoint = isLoginMode ? '/api/observer/login' : '/api/observer/register';
        const url = (API_URL || 'http://localhost:5000') + endpoint;

        try {
            const payload = isLoginMode
                ? { mobile_number: formData.phone, password: formData.password, role: observerRole }
                : {
                    mobile_number: formData.phone,
                    password: formData.password,
                    fullName: formData.fullName,
                    email: formData.email,
                    role: observerRole
                };

            const req = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const res = await req.json();

            if (req.ok && res.success) {
                if (!isLoginMode) {
                    Alert.alert("Success", "Observer registered successfully. Please login.");
                    setIsLoginMode(true);
                    setLoading(false);
                    return;
                }

                const userData = { name: res.observer.full_name || res.observer.mobile_number, ...res.observer };
                await addOrUpdateAccount(userData, 'observer');
                navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
            } else {
                setUiError(res.error || "Authentication failed");
                Alert.alert("Error", res.error || "Authentication failed");
            }
        } catch (e) {
            setUiError("Network Error. Unable to connect to server.");
            console.error("Login Error:", e);
        }
        setLoading(false);
    };

    const handleSendOTP = async () => {
        if (!formData.email) return Alert.alert("Error", "Please enter your email");
        setLoading(true);
        const endpoint = appRole === 'citizen' ? '/api/voter/forgot-password' : '/api/observer/forgot-password';
        const url = (API_URL || 'http://localhost:5000') + endpoint;

        try {
            const req = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const res = await req.json();
            if (req.ok && res.success) {
                setForgotPasswordStep(2);
                Alert.alert("Success", res.message || "OTP sent to your email.");
            } else {
                setUiError(res.error || "Failed to send OTP");
            }
        } catch (e) {
            setUiError("Network Error. Unable to connect to server.");
        }
        setLoading(false);
    };

    const handleVerifyOTP = async () => {
        setUiError('');
        if (!otp) {
            setUiError("Please enter the OTP");
            return;
        }
        setLoading(true);
        const endpoint = appRole === 'citizen' ? '/api/voter/verify-otp' : '/api/observer/verify-otp';
        const url = (API_URL || 'http://localhost:5000') + endpoint;

        try {
            const req = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp })
            });
            const res = await req.json();
            if (req.ok && res.success) {
                setForgotPasswordStep(3);
                Alert.alert("Success", "OTP Verified. Please enter new password.");
            } else {
                setUiError(res.error || "Invalid OTP");
            }
        } catch (e) {
            setUiError("Network Error. Unable to connect to server.");
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        setUiError('');
        if (!newPassword) {
            setUiError("Please enter a new password");
            return;
        }
        setLoading(true);
        const endpoint = appRole === 'citizen' ? '/api/voter/reset-password' : '/api/observer/reset-password';
        const url = (API_URL || 'http://localhost:5000') + endpoint;

        try {
            const req = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, newPassword })
            });
            const res = await req.json();
            if (req.ok && res.success) {
                Alert.alert("Success", "Password reset successfully. You can now login.");
                setForgotPasswordStep(0);
                setIsLoginMode(true);
            } else {
                setUiError(res.error || "Failed to reset password");
            }
        } catch (e) {
            setUiError("Network Error. Unable to connect to server.");
        }
        setLoading(false);
    };

    const handleSubmit = () => {
        setUiError('');
        // Validation
        if (appRole === 'citizen') {
            if (isLoginMode) {
                if (!formData.phone || !formData.password) {
                    setUiError('Mobile and Password are required');
                    return;
                }
            } else {
                if (!formData.fullName || !formData.phone || !formData.email || !formData.password) {
                    setUiError('All fields are required');
                    return;
                }
            }
            handleCitizenSubmit();
        } else {
            if (isLoginMode) {
                if (!formData.phone || !formData.password) {
                    setUiError('Mobile Number and Password are required');
                    return;
                }
            } else {
                if (!formData.fullName || !formData.phone || !formData.email || !formData.password) {
                    setUiError('All fields are required');
                    return;
                }
            }
            handleObserverSubmit();
        }
    };

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View className="flex-1 justify-center p-6 bg-slate-50">

                    {/* Role Toggle Tabs */}
                    <View className="flex-row bg-slate-200 rounded-2xl p-1 mb-6 mt-10 shadow-sm border border-slate-300">
                        <TouchableOpacity
                            onPress={() => { setAppRole('citizen'); setIsLoginMode(true); }}
                            className={`flex-1 py-3 items-center rounded-xl ${appRole === 'citizen' ? 'bg-white border border-slate-100' : ''}`}
                        >
                            <Text className={`font-bold ${appRole === 'citizen' ? 'text-blue-600' : 'text-slate-500'}`}>Citizen</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setAppRole('observer'); setIsLoginMode(true); }}
                            className={`flex-1 py-3 items-center rounded-xl ${appRole === 'observer' ? 'bg-white border border-slate-100' : ''}`}
                        >
                            <Text className={`font-bold ${appRole === 'observer' ? 'text-orange-600' : 'text-slate-500'}`}>Observer</Text>
                        </TouchableOpacity>
                    </View>

                    <View className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                        {/* Header Area */}
                        <StyledLinearGradient
                            colors={appRole === 'citizen' ? ['#2563EB', '#4338ca'] : ['#F97316', '#EA580C']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="p-8 items-center"
                        >
                            <Text className="text-3xl font-bold text-white mb-2">
                                {appRole === 'observer' ? 'Observer Login' : (isLoginMode ? 'Welcome Back' : 'Create Account')}
                            </Text>
                            <Text className="text-white text-center opacity-80">
                                {appRole === 'observer' ? 'Access the secure monitoring tools' : (isLoginMode ? 'Login to continue to the Voter Portal' : 'Register to access voting services')}
                            </Text>
                        </StyledLinearGradient>

                        <View className="p-6">

                            {/* Inline Error Display */}
                            {uiError ? (
                                <View className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 rounded">
                                    <Text className="text-red-700 font-medium">{uiError}</Text>
                                </View>
                            ) : null}

                            {/* Forgot Password Flow Overlay */}
                            {forgotPasswordStep > 0 && (
                                <View className="mb-4">
                                    {forgotPasswordStep === 1 && (
                                        <View>
                                            <Text className="text-lg font-bold text-slate-800 mb-2">Reset Password</Text>
                                            <Text className="text-slate-500 mb-4">Enter your {appRole} email address to receive a verification code.</Text>
                                            <Text className="text-sm font-medium text-slate-700 mb-1">Email Address</Text>
                                            <TextInput
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:border-blue-500 mb-4"
                                                placeholder="Enter your email"
                                                keyboardType="email-address"
                                                value={formData.email}
                                                onChangeText={(text) => handleChange('email', text)}
                                                autoCapitalize="none"
                                            />
                                            <View className="flex-row gap-3">
                                                <TouchableOpacity onPress={() => setForgotPasswordStep(0)} className="flex-1 py-4 border border-slate-300 rounded-xl items-center bg-white"><Text className="text-slate-700 font-medium">Cancel</Text></TouchableOpacity>
                                                <TouchableOpacity onPress={handleSendOTP} disabled={loading} className="flex-1 py-4 bg-blue-600 rounded-xl items-center"><Text className="text-white font-bold">{loading ? 'Sending...' : 'Send OTP'}</Text></TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    {forgotPasswordStep === 2 && (
                                        <View>
                                            <Text className="text-lg font-bold text-slate-800 mb-2">Verify OTP</Text>
                                            <Text className="text-slate-500 mb-4">Enter the 6-digit code sent to {formData.email}</Text>
                                            <TextInput
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:border-blue-500 mb-4 text-center tracking-widest text-2xl"
                                                placeholder="------"
                                                keyboardType="numeric"
                                                maxLength={6}
                                                value={otp}
                                                onChangeText={setOtp}
                                            />
                                            <View className="flex-row gap-3">
                                                <TouchableOpacity onPress={() => setForgotPasswordStep(0)} className="flex-1 py-4 border border-slate-300 rounded-xl items-center bg-white"><Text className="text-slate-700 font-medium">Cancel</Text></TouchableOpacity>
                                                <TouchableOpacity onPress={handleVerifyOTP} disabled={loading} className="flex-1 py-4 bg-blue-600 rounded-xl items-center"><Text className="text-white font-bold">{loading ? 'Verifying...' : 'Verify OTP'}</Text></TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                    {forgotPasswordStep === 3 && (
                                        <View>
                                            <Text className="text-lg font-bold text-slate-800 mb-2">Set New Password</Text>
                                            <Text className="text-slate-500 mb-4">Please create a strong new password.</Text>
                                            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl mb-4">
                                                <TextInput
                                                    className="flex-1 p-4 text-slate-800"
                                                    placeholder="Enter new password"
                                                    secureTextEntry={!showNewPassword}
                                                    value={newPassword}
                                                    onChangeText={setNewPassword}
                                                />
                                                <TouchableOpacity
                                                    onPress={() => setShowNewPassword(!showNewPassword)}
                                                    className="px-4 py-4"
                                                >
                                                    <Text className="text-slate-400 text-base">{showNewPassword ? '🙈' : '👁️'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View className="flex-row gap-3">
                                                <TouchableOpacity onPress={() => setForgotPasswordStep(0)} className="flex-1 py-4 border border-slate-300 rounded-xl items-center bg-white"><Text className="text-slate-700 font-medium">Cancel</Text></TouchableOpacity>
                                                <TouchableOpacity onPress={handleResetPassword} disabled={loading} className="flex-1 py-4 bg-blue-600 rounded-xl items-center"><Text className="text-white font-bold">{loading ? 'Saving...' : 'Reset Password'}</Text></TouchableOpacity>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Standard Form Area */}
                            {forgotPasswordStep === 0 && (
                                <>
                                    {/* Registration Fields */}
                                    {!isLoginMode && (
                                        <>
                                            <View>
                                                <Text className="text-sm font-medium text-slate-700 mb-1">Full Name</Text>
                                                <TextInput
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:border-blue-500"
                                                    placeholder="Enter your full name"
                                                    value={formData.fullName}
                                                    onChangeText={(text) => handleChange('fullName', text)}
                                                />
                                            </View>
                                            <View className="mt-4">
                                                <Text className="text-sm font-medium text-slate-700 mb-1">Email Address</Text>
                                                <TextInput
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:border-blue-500"
                                                    placeholder="Enter your email"
                                                    keyboardType="email-address"
                                                    value={formData.email}
                                                    onChangeText={(text) => handleChange('email', text)}
                                                    autoCapitalize="none"
                                                />
                                            </View>
                                        </>
                                    )}

                                    {/* Identifier Field */}
                                    <View className="mt-4">
                                        <Text className="text-sm font-medium text-slate-700 mb-1">Mobile Number</Text>
                                        <TextInput
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-800 focus:border-blue-500"
                                            placeholder="Enter 10-digit mobile number"
                                            keyboardType="phone-pad"
                                            maxLength={10}
                                            value={formData.phone}
                                            autoCapitalize="none"
                                            onChangeText={(text) => handleChange('phone', text)}
                                        />
                                    </View>

                                    <View className="mt-4">
                                        <Text className="text-sm font-medium text-slate-700 mb-1">Password</Text>
                                        <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl">
                                            <TextInput
                                                className="flex-1 p-4 text-slate-800"
                                                placeholder="Enter your password"
                                                secureTextEntry={!showPassword}
                                                value={formData.password}
                                                onChangeText={(text) => handleChange('password', text)}
                                            />
                                            <TouchableOpacity
                                                onPress={() => setShowPassword(!showPassword)}
                                                className="px-4 py-4"
                                            >
                                                <Text className="text-slate-400 text-base">{showPassword ? '🙈' : '👁️'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        {isLoginMode && (
                                            <TouchableOpacity onPress={() => setForgotPasswordStep(1)} className="mt-2 items-end">
                                                <Text className={`text-sm font-medium ${appRole === 'citizen' ? 'text-blue-600' : 'text-orange-600'}`}>Forgot Password?</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* Action Buttons */}
                                    <View className="flex-row gap-3 items-center mt-8">
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (forgotPasswordStep > 0) {
                                                    setForgotPasswordStep(0); // If in forgot pw overlay, go back to login
                                                } else if (!isLoginMode) {
                                                    setIsLoginMode(true); // If registering, go back to login
                                                } else {
                                                    navigation.goBack(); // If on root login, go back to home/landing
                                                }
                                            }}
                                            className="flex-1 py-4 border border-slate-300 rounded-xl items-center bg-white shadow-sm"
                                        >
                                            <Text className="text-slate-700 font-medium text-lg">Back</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={handleSubmit}
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            <StyledLinearGradient
                                                colors={appRole === 'citizen' ? ['#4F46E5', '#3730A3'] : ['#EA580C', '#C2410C']}
                                                start={{ x: 0, y: 0 }}
                                                end={{ x: 1, y: 0 }}
                                                className={`py-4 rounded-xl items-center shadow-md ${loading ? 'opacity-70' : ''}`}
                                            >
                                                <Text className="text-white font-bold text-lg">
                                                    {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
                                                </Text>
                                            </StyledLinearGradient>
                                        </TouchableOpacity>
                                    </View>

                                    {/* Toggle Mode */}
                                    <View className="mt-6 flex-row justify-center items-center">
                                        <Text className="text-slate-500">
                                            {isLoginMode ? "Don't have an account? " : "Already have an account? "}
                                        </Text>
                                        <TouchableOpacity onPress={toggleMode}>
                                            <Text className="text-blue-600 font-bold ml-1">
                                                {isLoginMode ? 'Register Here' : 'Login Here'}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}

                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
