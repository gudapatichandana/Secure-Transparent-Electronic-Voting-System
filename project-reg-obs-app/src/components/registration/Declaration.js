import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormContext } from '../../context/FormContext';
import ECILayout from './ECILayout';
import SelectDropdown from '../common/SelectDropdown';
import { locationData } from '../../data/locationData';

const Declaration = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();
    const [currentDate, setCurrentDate] = useState('');
    const [showResidencePicker, setShowResidencePicker] = useState(false);
    const getResidenceDate = () => {
        if (formData.declResidenceDate) {
            const [y, m, d] = formData.declResidenceDate.split('-');
            const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d || 1));
            if (!isNaN(date)) return date;
        }
        return new Date();
    };
    const [residenceDate, setResidenceDate] = useState(getResidenceDate);
    const formatResidenceDisplay = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day} / ${month} / ${date.getFullYear()}`;
    };

    const states = Object.keys(locationData);
    const districts = formData.declState && locationData[formData.declState]
        ? Object.keys(locationData[formData.declState].districts)
        : [];

    useEffect(() => {
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
        setCurrentDate(formattedDate);
    }, []);

    const handleNext = () => {
        if (!formData.declVillage || !formData.declState || !formData.declResidenceDate || !formData.declPlace) {
            Alert.alert('Error', 'Please fill all required declaration fields.');
            return;
        }
        nextStep();
    };

    return (
        <ECILayout step={11} totalSteps={14} title="K. Declaration" onClose={cancelForm}>
            <View className="gap-6">
                <Text className="text-sm font-medium text-slate-800">I Hereby declare that to the best of my knowledge and belief:</Text>

                <View className="gap-4">
                    <Text className="text-sm text-slate-700">(i) I am a citizen of India and place of my birth is</Text>

                    <View>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                            Village/Town <Text style={{ color: '#ef4444' }}>*</Text>
                        </Text>
                        <TextInput
                            value={formData.declVillage}
                            onChangeText={(text) => updateFormData({ declVillage: text })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
                        />
                    </View>

                    <SelectDropdown
                        label="State/UT"
                        value={formData.declState}
                        options={states}
                        onSelect={(state) => updateFormData({ declState: state, declDistrict: '' })}
                        placeholder="Select State"
                        required
                    />

                    <SelectDropdown
                        label="District"
                        value={formData.declDistrict}
                        options={districts}
                        onSelect={(district) => updateFormData({ declDistrict: district })}
                        placeholder="Select District"
                        disabled={!formData.declState}
                        required={false}
                    />
                </View>

                <View className="gap-4 mt-4">
                    <Text className="text-sm text-slate-700">(ii) I am ordinarily a resident at the address mentioned at Section 8(a) since *</Text>
                    {Platform.OS === 'web' ? (
                        <input
                            type="date"
                            value={formData.declResidenceDate || ''}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                    const [y, m, d] = val.split('-');
                                    const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
                                    setResidenceDate(date);
                                    updateFormData({ declResidenceDate: val });
                                }
                            }}
                            max={new Date().toISOString().split('T')[0]}
                            min="1900-01-01"
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontSize: '16px',
                                backgroundColor: 'white',
                                color: '#1e293b',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                        />
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={() => setShowResidencePicker(true)}
                                className="w-full border border-slate-300 rounded-lg px-4 py-4 bg-white flex-row items-center justify-between"
                            >
                                <Text className={formData.declResidenceDate ? 'text-slate-800 text-base font-medium' : 'text-slate-400 text-base'}>
                                    {formData.declResidenceDate ? formatResidenceDisplay(residenceDate) : 'Tap to select date'}
                                </Text>
                                <Text className="text-blue-600 font-bold text-sm">Pick Date</Text>
                            </TouchableOpacity>
                            {showResidencePicker && (
                                <DateTimePicker
                                    value={residenceDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS !== 'ios') setShowResidencePicker(false);
                                        if (event.type === 'dismissed') return;
                                        if (date) {
                                            setResidenceDate(date);
                                            const y = date.getFullYear();
                                            const m = String(date.getMonth() + 1).padStart(2, '0');
                                            const d = String(date.getDate()).padStart(2, '0');
                                            updateFormData({ declResidenceDate: `${y}-${m}-${d}` });
                                        }
                                    }}
                                    maximumDate={new Date()}
                                    minimumDate={new Date(1900, 0, 1)}
                                />
                            )}
                            {showResidencePicker && Platform.OS === 'ios' && (
                                <TouchableOpacity onPress={() => setShowResidencePicker(false)} className="bg-blue-600 mt-2 py-2 rounded-lg items-center">
                                    <Text className="text-white font-bold">Confirm Date</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>

                <View className="gap-4 mt-2">
                    <Text className="text-sm text-slate-600">(iii) I am applying for inclusion in Electoral Roll for the first time and my name is not included in any Assembly/Parliamentary Constituency.</Text>
                    <Text className="text-sm text-slate-600">(iv) I am aware that making the above statement or declaration in relation to this application which is false and which I know or believe to be false or do not believe to be true, is punishable under Section 31 of Representation of the People Act,1950.</Text>
                </View>

                <View className="flex-row gap-4 mt-4">
                    <View className="flex-1">
                        <Text style={{ fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 }}>
                            Place <Text style={{ color: '#ef4444' }}>*</Text>
                        </Text>
                        <TextInput
                            value={formData.declPlace}
                            onChangeText={(text) => updateFormData({ declPlace: text })}
                            className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-800 bg-white"
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-semibold text-slate-700 mb-1">Date</Text>
                        <TextInput
                            value={currentDate}
                            editable={false}
                            className="w-full border border-slate-300 rounded-lg px-3 py-3 text-slate-500 bg-slate-100"
                        />
                    </View>
                </View>

                <View className="mt-8 flex-row justify-between">
                    <TouchableOpacity onPress={prevStep} className="border border-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-blue-600 font-bold">Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNext} className="bg-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-white font-bold">Next</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ECILayout>
    );
};
export default Declaration;
