import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';

const SelectDropdown = ({ label, value, options, onSelect, placeholder, required, disabled }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOptions = options ? options.filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase())) : [];

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-sm font-semibold text-slate-700 mb-1">
                    {label} {required && <Text className="text-red-500">*</Text>}
                </Text>
            )}
            <TouchableOpacity
                className={`w-full border border-slate-300 rounded-lg px-3 py-3 bg-white flex-row justify-between items-center ${disabled ? 'opacity-50' : ''}`}
                onPress={() => {
                    if (!disabled) {
                        setModalVisible(true);
                    }
                }}
                disabled={disabled}
            >
                <Text className={value ? "text-slate-800" : "text-slate-400"} numberOfLines={1}>
                    {value || placeholder}
                </Text>
                <Text className="text-slate-400">▼</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View className="bg-white h-2/3 rounded-t-3xl p-4">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-slate-800">Select {label}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="px-3 py-2">
                                <Text className="text-blue-600 font-bold">Close</Text>
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="w-full border border-slate-300 rounded-lg px-3 py-3 mb-4 text-slate-800 bg-slate-50"
                        />

                        <FlatList
                            data={filteredOptions}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    className="py-4 border-b border-slate-100"
                                    onPress={() => {
                                        onSelect(item);
                                        setModalVisible(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <Text className={`text-base ${value === item ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text className="text-center text-slate-500 mt-4">No results found.</Text>}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default SelectDropdown;
