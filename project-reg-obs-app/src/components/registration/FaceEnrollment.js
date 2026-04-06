import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Animated, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFormContext } from '../../context/FormContext';
import { ENDPOINTS } from '../../constants/config';
import ECILayout from './ECILayout';

const FaceEnrollment = ({ nextStep, prevStep, cancelForm }) => {
    const { formData, updateFormData } = useFormContext();
    const [permission, requestPermission] = useCameraPermissions();
    const [photo, setPhoto] = useState(formData.faceDescriptor ? { uri: null, stored: true } : null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusMsg, setStatusMsg] = useState('ALIGN FACE IN FRAME');
    const [statusColor, setStatusColor] = useState('#3b82f6');
    const cameraRef = useRef(null);
    const scanAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (!photo) {
            // Scanning line animation
            const scan = Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
                    Animated.timing(scanAnim, { toValue: 0, duration: 2500, useNativeDriver: true })
                ])
            );
            scan.start();

            // Pulse animation on capture button
            const pulse = Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.12, duration: 900, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true })
                ])
            );
            pulse.start();

            return () => { scan.stop(); pulse.stop(); };
        }
    }, [photo]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <ECILayout step={13} totalSteps={14} title="M. Face Enrollment" onClose={cancelForm}>
                <View className="flex-1 justify-center items-center py-10">
                    <Text className="text-center mb-6 text-slate-700">Camera permission is required for biometric enrollment</Text>
                    <TouchableOpacity onPress={requestPermission} className="bg-blue-600 px-6 py-3 rounded-lg">
                        <Text className="text-white font-bold">Grant Camera Permission</Text>
                    </TouchableOpacity>
                </View>
            </ECILayout>
        );
    }

    const takePicture = async () => {
        if (!cameraRef.current || isProcessing) return;

        setIsProcessing(true);
        setStatusMsg('CAPTURING...');
        setStatusColor('#f59e0b');

        try {
            const result = await cameraRef.current.takePictureAsync({
                quality: 0.6,
                base64: true,
            });

            // --- REAL AI VALIDATION VIA BACKEND ---
            setStatusMsg('AI ANALYZING FACE...');
            setStatusColor('#8b5cf6');

            const response = await fetch(ENDPOINTS.FACE_DETECT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: result.base64 }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                // No real face detected — reject
                setStatusMsg('NO FACE DETECTED — RETAKE');
                setStatusColor('#ef4444');
                setIsProcessing(false);
                Alert.alert(
                    'Face Not Detected',
                    data.error || 'No face was found in the image. Please look directly at the camera in good lighting and try again.',
                    [{ text: 'Retake', style: 'default' }]
                );
                return;
            }

            // Face validated! Store the AI-generated descriptor (not raw base64)
            setStatusMsg('FACE ENROLLED ✓');
            setStatusColor('#22c55e');
            setPhoto({ uri: result.uri });
            // Store the 128-float descriptor returned by the backend AI
            updateFormData({ faceDescriptor: data.descriptor });

        } catch (err) {
            setStatusMsg('ERROR — CHECK CONNECTION');
            setStatusColor('#ef4444');
            Alert.alert('Connection Error', 'Could not reach the AI service. Please ensure your backend is running and try again.');
            console.error('[FaceEnrollment] Error:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    const retakePicture = () => {
        setPhoto(null);
        updateFormData({ faceDescriptor: null });
        setStatusMsg('ALIGN FACE IN FRAME');
        setStatusColor('#3b82f6');
    };

    return (
        <ECILayout step={13} totalSteps={14} title="M. Face Enrollment" onClose={cancelForm}>
            <View style={{ gap: 16, height: 450 }}>
                {photo ? (
                    <View className="flex-1 items-center justify-center gap-4">
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: photo.uri }}
                                style={{ width: 200, height: 250, borderRadius: 16, borderWidth: 3, borderColor: '#22c55e' }}
                            />
                            <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#22c55e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                                <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>ENROLLED</Text>
                            </View>
                        </View>
                        <Text style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 12, letterSpacing: 2 }}>
                            ✓ BIOMETRIC DESCRIPTOR SAVED
                        </Text>
                        <TouchableOpacity onPress={retakePicture} className="bg-slate-200 px-6 py-3 rounded-lg">
                            <Text className="text-slate-700 font-bold">Retake Enrollment</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={{ flex: 1, overflow: 'hidden', borderRadius: 16, backgroundColor: '#000', borderWidth: 2, borderColor: '#1e293b' }}>
                        <CameraView
                            style={{ flex: 1 }}
                            facing="front"
                            ref={cameraRef}
                        />

                        {/* AI Scanning Line */}
                        <Animated.View
                            style={{
                                position: 'absolute',
                                left: 0, right: 0, height: 2,
                                backgroundColor: isProcessing ? statusColor : '#3b82f6',
                                shadowColor: isProcessing ? statusColor : '#3b82f6',
                                shadowOffset: { width: 0, height: 0 },
                                shadowOpacity: 0.9,
                                shadowRadius: 12,
                                transform: [{
                                    translateY: scanAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [50, 400]
                                    })
                                }]
                            }}
                        />

                        {/* Status HUD */}
                        <View style={{
                            position: 'absolute', top: 16, alignSelf: 'center',
                            backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 16, paddingVertical: 8,
                            borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'
                        }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 11, color: statusColor, letterSpacing: 2 }}>
                                ● {statusMsg}
                            </Text>
                        </View>

                        {/* Corner brackets */}
                        <View style={{ position: 'absolute', top: 40, left: 30, width: 30, height: 30, borderTopWidth: 2, borderLeftWidth: 2, borderColor: '#3b82f6' }} />
                        <View style={{ position: 'absolute', top: 40, right: 30, width: 30, height: 30, borderTopWidth: 2, borderRightWidth: 2, borderColor: '#3b82f6' }} />
                        <View style={{ position: 'absolute', bottom: 70, left: 30, width: 30, height: 30, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: '#3b82f6' }} />
                        <View style={{ position: 'absolute', bottom: 70, right: 30, width: 30, height: 30, borderBottomWidth: 2, borderRightWidth: 2, borderColor: '#3b82f6' }} />

                        {/* Processing Overlay — covers camera so user knows AI is working */}
                        {isProcessing && (
                            <View style={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.75)',
                                alignItems: 'center', justifyContent: 'center', gap: 16
                            }}>
                                <ActivityIndicator size="large" color={statusColor} />
                                <Text style={{ color: statusColor, fontWeight: 'bold', fontSize: 13, letterSpacing: 2 }}>
                                    {statusMsg}
                                </Text>
                                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
                                    Please wait...
                                </Text>
                            </View>
                        )}

                        {/* Capture button */}
                        {!isProcessing && (
                            <Animated.View style={{
                                position: 'absolute', bottom: 16, alignSelf: 'center',
                                transform: [{ scale: pulseAnim }]
                            }}>
                                <TouchableOpacity
                                    onPress={takePicture}
                                    style={{
                                        width: 72, height: 72, borderRadius: 36,
                                        borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#ef4444' }} />
                                </TouchableOpacity>
                            </Animated.View>
                        )}
                    </View>
                )}

                <Text style={{ textAlign: 'center', color: '#94a3b8', fontSize: 9, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' }}>
                    SecureAI Biometric Bridge v2.1 — Neural Face Validation Active
                </Text>
            </View>

            <View className="mt-8 flex-row justify-between">
                <TouchableOpacity onPress={prevStep} className="border border-blue-600 px-6 py-3 rounded-lg">
                    <Text className="text-blue-600 font-bold">Previous</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={nextStep}
                    disabled={!photo || isProcessing}
                    className={`px-6 py-3 rounded-lg ${photo ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                    <Text className="text-white font-bold">Review & Submit</Text>
                </TouchableOpacity>
            </View>
        </ECILayout>
    );
};
export default FaceEnrollment;
