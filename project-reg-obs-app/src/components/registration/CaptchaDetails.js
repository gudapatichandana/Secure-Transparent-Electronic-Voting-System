import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';

const CaptchaDetails = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();
    const [captchaCode, setCaptchaCode] = useState('');

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        setCaptchaCode(captcha);
        updateFormData({ generatedCaptcha: captcha });
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const handleNext = () => {
        if (!formData.captcha || formData.captcha !== captchaCode) {
            Alert.alert('Error', 'Invalid Captcha Code.');
            return;
        }
        nextStep();
    };

    return (
        <ECILayout step={12} totalSteps={14} title="L. Captcha Verification" onClose={cancelForm}>
            <View className="gap-4">
                <Text className="text-sm font-bold text-slate-800 mb-4">Please verify you are human</Text>

                <View className="flex-row items-center gap-4 border border-slate-300 p-4 rounded-xl bg-slate-50">
                    <Text className="text-3xl font-serif tracking-[10px] text-slate-500 italic flex-1 text-center">
                        {captchaCode}
                    </Text>
                    <TouchableOpacity onPress={generateCaptcha} className="bg-slate-200 p-3 rounded-full">
                        <Text className="text-xl">↻</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Text className="text-sm font-semibold text-slate-700 mb-2">Enter Captcha Code *</Text>
                    <TextInput
                        value={formData.captcha}
                        onChangeText={(text) => updateFormData({ captcha: text })}
                        placeholder="Type the 6 characters above"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="w-full border border-slate-300 rounded-lg px-4 py-4 text-slate-800 bg-white text-lg tracking-widest font-mono"
                    />
                </View>

                <View className="mt-8 flex-col gap-4">
                    <View className="flex-row justify-between">
                        <TouchableOpacity onPress={prevStep} className="border border-blue-600 px-6 py-4 rounded-xl flex-1 mr-2 items-center">
                            <Text className="text-blue-600 font-bold">Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNext} className="bg-blue-600 px-6 py-4 rounded-xl flex-1 ml-2 items-center">
                            <Text className="text-white font-bold">Proceed to Face Reg</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={cancelForm} className="border border-slate-300 px-6 py-4 rounded-xl items-center mt-2">
                        <Text className="text-slate-600 font-bold">Cancel Registration</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ECILayout>
    );
};
export default CaptchaDetails;
