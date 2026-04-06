import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Clipboard } from 'react-native';
import { useFormContext } from '../../context/FormContext';
import { API_URL } from '../../constants/config'; // Assuming we have config, if not fallback to localhost

const Success = ({ finishForm }) => {
    const { formData } = useFormContext();
    const [referenceId, setReferenceId] = useState(null);
    const [status, setStatus] = useState('Submitting Application...');
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);
    const hasSubmitted = useRef(false);

    useEffect(() => {
        const submitApplication = async () => {
            if (hasSubmitted.current) return;
            hasSubmitted.current = true;

            try {
                // Ensure proper URL pointing to Node backend
                const endpoint = API_URL ? `${API_URL}/api/registration/submit` : 'http://localhost:5000/api/registration/submit';

                // Basic validation
                if (!formData.faceDescriptor) {
                    throw new Error("Biometric data missing. Please complete face enrollment.");
                }

                if (!formData.firstName && !formData.aadhaar) {
                    throw new Error("Incomplete form data. Please restart.");
                }

                // Helper to extract base64 from React Native file object
                const getFileBase64 = (file) => {
                    if (!file) return null;
                    if (typeof file === 'string') return file;
                    if (file.base64) return file.base64;
                    return null;
                };

                const payload = {
                    aadhaar: formData.aadhaar,
                    faceDescriptor: formData.faceDescriptor,
                    formData: {
                        firstName: formData.firstName,
                        surname: formData.surname || '',
                        gender: formData.gender,
                        dobDay: formData.dob ? formData.dob.split('-')[0] : '01',
                        dobMonth: formData.dob ? formData.dob.split('-')[1] : '01',
                        dobYear: formData.dob ? formData.dob.split('-')[2] : '2000',

                        assemblyConstituency: formData.assemblyConstituency,

                        mobileSelf: formData.mobileSelf,
                        mobileNumber: formData.mobileNumber,
                        mobileRelativeNumber: formData.mobileRelativeNumber,

                        emailSelf: formData.emailSelf,
                        email: formData.email,
                        emailRelative: formData.emailRelative,

                        houseNo: formData.houseNo,
                        streetArea: formData.streetClass,
                        villageTown: formData.village,
                        district: formData.addressDistrict,
                        state: formData.addressState,
                        pincode: formData.pinCode,

                        relativeName: formData.relativeName,
                        relativeSurname: formData.relativeSurname,
                        relationType: formData.relationType,

                        disabilityOtherSpec: formData.disabilityOtherSpec,
                        disabilityCategories: formData.disabilityCategories,

                        image: getFileBase64(formData.image),
                        dobProofFile: getFileBase64(formData.dobProofFile),
                        addressProofFile: getFileBase64(formData.addressProofFile),
                        disabilityFile: getFileBase64(formData.disabilityFile)
                    }
                };

                console.log(`Submitting application to ${endpoint}...`);

                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.error || "Submission failed");
                }

                const data = await response.json();
                setReferenceId(data.referenceId);
                setStatus('Application Submitted Successfully');

            } catch (err) {
                console.error("Submission Error:", err);
                setError(err.message || 'Failed to submit application');
                setStatus('Submission Failed');
            }
        };

        submitApplication();
    }, [formData]);

    if (error) {
        return (
            <View className="flex-1 bg-white justify-center items-center px-6">
                <View className="bg-red-50 p-8 rounded-2xl w-full items-center border border-red-100">
                    <Text className="text-4xl mb-4">⚠️</Text>
                    <Text className="text-2xl font-bold text-slate-800 mb-2">Submission Failed</Text>
                    <Text className="text-slate-600 mb-8 text-center">{error}</Text>
                    <TouchableOpacity onPress={finishForm} className="bg-slate-800 px-6 py-3 rounded-xl w-full items-center">
                        <Text className="text-white font-bold text-lg">Return to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white justify-center items-center px-6">
            {referenceId ? (
                <View className="bg-white p-8 rounded-3xl w-full items-center shadow-lg border border-slate-100 elevation-5">
                    <View className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <Text className="text-green-600 text-4xl">✓</Text>
                    </View>
                    <Text className="text-3xl font-bold text-slate-800 mb-2 text-center">Application Submitted!</Text>
                    <Text className="text-slate-500 mb-8 text-center text-base">Your application has been successfully submitted to the Election Commission.</Text>

                    <View className="bg-blue-50 p-4 rounded-xl w-full items-center border border-blue-100 mb-8">
                        <Text className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Reference ID</Text>
                        <Text className="text-3xl font-mono font-bold text-blue-900 tracking-widest mb-3">{referenceId}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                Clipboard.setString(referenceId);
                                setCopied(true);
                                setTimeout(() => setCopied(false), 2000);
                            }}
                            className={`px-4 py-2 rounded-lg flex-row items-center gap-2 ${copied ? 'bg-green-500' : 'bg-blue-600'}`}
                        >
                            <Text className="text-white font-bold text-sm">
                                {copied ? '✓ Copied!' : '⎘ Copy ID'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={finishForm} className="bg-blue-600 px-6 py-4 rounded-2xl w-full items-center shadow-lg">
                        <Text className="text-white font-bold text-lg tracking-wide">Return to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="items-center">
                    <ActivityIndicator size="large" color="#2563eb" className="mb-4" />
                    <Text className="text-lg font-medium text-slate-600">{status}</Text>
                </View>
            )}
        </View>
    );
};

export default Success;
