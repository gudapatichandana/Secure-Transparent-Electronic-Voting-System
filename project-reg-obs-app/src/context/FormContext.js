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
        image: null,

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
    });

    const updateFormData = (newData) => {
        setFormData((prevData) => {
            return {
                ...prevData,
                ...newData
            };
        });
    };

    return (
        <FormContext.Provider value={{ formData, updateFormData }}>
            {children}
        </FormContext.Provider>
    );
};
