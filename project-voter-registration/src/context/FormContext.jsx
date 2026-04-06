import React, { createContext, useContext, useState } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        // Section A: Identity
        state: '',
        district: '',
        constituencyType: 'assembly', // 'assembly' | 'parliamentary'
        constituencyName: '',
        constituencyNo: '',

        // Section B: Personal Details
        firstName: '',
        surname: '',
        image: null, // Note: storing files in state might be heavy, but okay for prototype. 
        // Ideally, upload to server immediately or use ObjectURL + logic to keep it alive.
        // For now, we will just keep the file object reference.

        // Section C: Relatives
        relationType: '',
        relativeName: '',
        relativeSurname: '',

        // Section I: Disability Details
        disabilityCategories: {
            locomotive: false,
            visual: false,
            deafDumb: false,
            other: false
        },
        disabilityOtherSpec: '',
        disabilityPercentage: '',
        disabilityCertificateAttached: '', // 'yes' | 'no'
        disabilityFile: null,

        // Section J: Family Member Details
        familyName: '',
        relationship: '',
        epicNumber: '',

        // Section K: Declaration
        declVillage: '',
        declState: '',
        declDistrict: '',
        declResidenceDate: '',
        declPlace: '',
        // declDate is usually current date, we can handle it in component or here

        // Section L: Captcha
        captcha: '',

        // Section D: Contact Details
        mobileSelf: false,
        mobileRelative: false,
        mobileNumber: '',
        emailSelf: false,
        emailRelative: false,
        emailId: '',

        // Section M: Biometrics
        faceDescriptor: null,

        // Section E: Aadhaar Details
        aadhaarOption: 'aadhaar', // 'aadhaar' | 'no_aadhaar'
        aadhaarNumber: '',

        // Section F: Gender Details
        gender: '',

        // Add other sections as needed
    });

    const updateFormData = (newData) => {
        setFormData((prevData) => {
            // Check for File objects and log warning or handle conversion if possible here
            // Note: Since setFormData is synchronous but file reading is async, 
            // the conversion MUST happen in the Component before calling updateFormData.
            // However, we can add a safety check or specialized setter for files if needed.
            // For now, we assume components will pass Base64 strings for file fields.
            return {
                ...prevData,
                ...newData
            };
        });
    };

    // Helper for components to use
    const handleFileChange = async (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            console.log(`Processing file for ${fieldName}:`, file.name);
            const reader = new FileReader();
            reader.onloadend = () => {
                updateFormData({
                    [fieldName]: {
                        name: file.name,
                        base64: reader.result
                    }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData, handleFileChange }}>
            {children}
        </FormContext.Provider>
    );
};
