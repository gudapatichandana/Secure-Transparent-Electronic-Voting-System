import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const ECILayout = ({ children, step, totalSteps, title, onClose }) => {
    return (
        <View className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="px-4 py-4 border-b border-slate-200 bg-white flex-row items-center">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-800">{title}</Text>
                    <Text className="text-xs text-slate-500">Step {step} of {totalSteps}</Text>
                </View>
                {onClose && (
                    <TouchableOpacity onPress={onClose} className="p-2">
                        <Text className="text-slate-500 font-bold">Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Progress Bar */}
            <View className="h-1 bg-slate-200 w-full mb-2">
                <View className={`h-1 bg-blue-600`} style={{ width: `${(step / totalSteps) * 100}%` }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 min-h-[500px]">
                    <View className="mb-4 border-b border-slate-100 pb-2">
                        <Text className="text-lg font-bold text-slate-800">Form 6</Text>
                        <Text className="text-xs text-slate-500">ELECTION COMMISSION OF INDIA</Text>
                    </View>
                    {children}
                </View>
            </ScrollView>
        </View>
    );
};

export default ECILayout;
