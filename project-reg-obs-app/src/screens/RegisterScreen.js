import React, { useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import { FormProvider } from '../context/FormContext';

import IdentityCheck from '../components/registration/IdentityCheck';
import PersonalDetails from '../components/registration/PersonalDetails';
import RelativesDetails from '../components/registration/RelativesDetails';
import ContactDetails from '../components/registration/ContactDetails';
import AadhaarDetails from '../components/registration/AadhaarDetails';
import GenderDetails from '../components/registration/GenderDetails';
import DateOfBirthDetails from '../components/registration/DateOfBirthDetails';
import PresentAddressDetails from '../components/registration/PresentAddressDetails';
import DisabilityDetails from '../components/registration/DisabilityDetails';
import FamilyMemberDetails from '../components/registration/FamilyMemberDetails';
import Declaration from '../components/registration/Declaration';
import CaptchaDetails from '../components/registration/CaptchaDetails';
import FaceEnrollment from '../components/registration/FaceEnrollment';
import Success from '../components/registration/Success';

const RegisterFlow = ({ navigation }) => {
    const [step, setStep] = useState(1);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);
    const cancelForm = () => navigation.navigate('Dashboard');
    const finishForm = () => navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
    });

    const renderStep = () => {
        switch (step) {
            case 1: return <IdentityCheck nextStep={nextStep} cancelForm={cancelForm} />;
            case 2: return <PersonalDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 3: return <RelativesDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 4: return <ContactDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 5: return <AadhaarDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 6: return <GenderDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 7: return <DateOfBirthDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 8: return <PresentAddressDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 9: return <DisabilityDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 10: return <FamilyMemberDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 11: return <Declaration nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 12: return <CaptchaDetails nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 13: return <FaceEnrollment nextStep={nextStep} prevStep={prevStep} cancelForm={cancelForm} />;
            case 14: return <Success finishForm={finishForm} />;
            default: return <IdentityCheck nextStep={nextStep} cancelForm={cancelForm} />;
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {renderStep()}
        </SafeAreaView>
    );
};

const RegisterScreen = ({ navigation }) => {
    return (
        <FormProvider>
            <RegisterFlow navigation={navigation} />
        </FormProvider>
    );
};

export default RegisterScreen;
