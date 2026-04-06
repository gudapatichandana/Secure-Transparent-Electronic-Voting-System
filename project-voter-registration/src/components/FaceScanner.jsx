import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, RefreshCw } from 'lucide-react';

const FaceScanner = ({ onEnroll, onScanFailure }) => {
    const videoRef = useRef();
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [captured, setCaptured] = useState(false);

    useEffect(() => {
        loadModels();
        return () => stopVideo(); // Cleanup on unmount
    }, []);

    const loadModels = async () => {
        try {
            console.log("DEBUG: Starting Model Load");

            // Explicitly set backend (Crucial fix for "backend undefined" error)
            try {
                // Check if tf exists
                if (faceapi.tf) {
                    console.log("DEBUG: Tensorflow found. Current backend:", faceapi.tf.getBackend());
                    await faceapi.tf.setBackend('webgl');
                    await faceapi.tf.ready();
                    console.log("DEBUG: Backend set to:", faceapi.tf.getBackend());
                } else {
                    console.warn("DEBUG: faceapi.tf is undefined!");
                }
            } catch (tfErr) {
                console.error("DEBUG: TF Backend Init Error:", tfErr);
            }

            // Using the same path as Election Admin
            const MODEL_URL = '/models/weights';
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
            ]);
            setModelsLoaded(true);
            console.log("FaceAPI Models Loaded");
        } catch (err) {
            console.error("Failed to load FaceAPI models", err);
            // alert(`Face API Error: ${err.message}`); // Optional: Show alert to user
            if (onScanFailure) onScanFailure(err);
        }
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setCameraActive(true);
                    setCaptured(false);
                }
            })
            .catch(err => {
                console.error("Camera Error:", err);
                if (onScanFailure) onScanFailure(err);
            });
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setCameraActive(false);
        }
    };

    const captureFace = async () => {
        if (!videoRef.current || !modelsLoaded) return;

        try {
            const detections = await faceapi.detectSingleFace(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (detections) {
                const descriptorArray = Array.from(detections.descriptor); // Convert Float32Array to Array

                // Visual feedback
                setCaptured(true);
                stopVideo();

                // Pass data up
                if (onEnroll) onEnroll(descriptorArray);
            } else {
                alert("No face detected. Please ensure good lighting and look at the camera.");
            }
        } catch (err) {
            console.error("Capture Error:", err);
            if (onScanFailure) onScanFailure(err);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-80 h-60 bg-black rounded-xl overflow-hidden shadow-md">
                {!cameraActive && !captured && (
                    <div className="flex items-center justify-center w-full h-full text-white">
                        {modelsLoaded ? "Camera Off" : "Loading AI Models..."}
                    </div>
                )}
                {captured && (
                    <div className="flex items-center justify-center w-full h-full bg-gray-900 text-green-400 font-bold">
                        Face Captured ✅
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    width="320"
                    height="240"
                    className={cameraActive ? "block w-full h-full object-cover" : "hidden"}
                />
            </div>

            <div className="flex gap-4">
                {!cameraActive && !captured ? (
                    <button
                        type="button"
                        onClick={startVideo}
                        disabled={!modelsLoaded}
                        className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {modelsLoaded ? <><Camera size={18} /> Start Camera</> : 'Loading...'}
                    </button>
                ) : (
                    <>
                        {cameraActive && (
                            <button
                                type="button"
                                onClick={captureFace}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Camera size={18} /> Capture Face
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => { stopVideo(); setCaptured(false); }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                            Stop
                        </button>
                    </>
                )}
                {captured && (
                    <button
                        type="button"
                        onClick={startVideo}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <RefreshCw size={18} /> Retake
                    </button>
                )}
            </div>

            <p className="text-sm text-gray-500 mt-2">
                Ai Status: {modelsLoaded ? <span className="text-green-600 font-medium">Ready</span> : <span className="text-orange-500">Loading...</span>}
            </p>
        </div>
    );
};

export default FaceScanner;
