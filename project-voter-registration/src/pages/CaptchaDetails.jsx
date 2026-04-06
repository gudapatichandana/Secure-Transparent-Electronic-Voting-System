import React from 'react';
import { useNavigate } from 'react-router-dom';
import ECILayout from '../components/ECILayout';
import { useFormContext } from '../context/FormContext';

const CaptchaDetails = () => {
    const navigate = useNavigate();
    const { formData, updateFormData } = useFormContext();
    const [captchaCode, setCaptchaCode] = React.useState('');

    const generateCaptcha = () => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        setCaptchaCode(captcha);
        updateFormData({ generatedCaptcha: captcha }); // Store in context if needed for validation later
    };

    React.useEffect(() => {
        generateCaptcha();
    }, []);

    return (
        <ECILayout activeStep="L">
            {/* Section Header */}
            <div className="bg-blue-100 border border-blue-200 p-3 rounded-t-sm mb-6">
                <h3 className="text-sm font-bold text-gray-800">L. Captcha</h3>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="border border-gray-300 p-2 bg-white rounded select-none font-serif tracking-widest text-2xl text-gray-500 w-40 text-center italic">
                        {/* Placeholder Captcha */}
                        {captchaCode}
                    </div>
                    <button
                        type="button"
                        onClick={generateCaptcha}
                        className="text-gray-500 hover:text-blue-600 focus:outline-none"
                        title="Refresh Captcha"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    </button>
                    <button type="button" className="text-gray-500 hover:text-blue-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
                    </button>
                </div>

                <div className="w-full md:w-1/3 space-y-2">
                    <label className="block text-sm font-bold text-red-600">Captcha *</label>
                    <input
                        type="text"
                        placeholder="Enter Captcha"
                        value={formData.captcha}
                        onChange={(e) => updateFormData({ captcha: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            <hr className="my-8 border-gray-200" />

            {/* Final Action Buttons */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Previous Button */}
                <button
                    type="button"
                    onClick={() => navigate('/declaration')}
                    className="px-4 py-2 bg-white border border-gray-300 text-blue-500 font-medium text-sm rounded hover:bg-gray-50 flex items-center shadow-sm w-fit"
                >
                    &uarr; Previous
                </button>

                <div className="flex flex-wrap gap-4 items-center">
                    <button
                        type="button"
                        onClick={() => navigate('/face-enroll')}
                        className="px-6 py-2 bg-blue-500 text-white font-medium text-sm rounded hover:bg-blue-600 shadow-sm transition-colors"
                    >
                        Proceed to Face Registration
                    </button>
                    <button
                        type="button"
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded hover:bg-gray-50 shadow-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </ECILayout>
    );
};

export default CaptchaDetails;
