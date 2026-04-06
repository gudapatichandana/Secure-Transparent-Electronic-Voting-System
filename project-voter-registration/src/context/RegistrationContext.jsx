import React, { createContext, useState, useContext } from 'react';

const RegistrationContext = createContext();

export const useRegistration = () => useContext(RegistrationContext);

export const RegistrationProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        state: '',
        district: '',
        constituency: '',
        aadhaar: '',
        name: '',
        dob: '',
        gender: '',
        relativesName: '',
        relativeType: '',
        mobile: '',
        email: '',
        address: '',
        disability: '',
        // Add other fields as needed
    });

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    return (
        <RegistrationContext.Provider value={{ formData, updateFormData }}>
            {children}
        </RegistrationContext.Provider>
    );
};
