import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RegistrationProvider } from './context/RegistrationContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import TrackStatus from './pages/TrackStatus';
import IdentityCheck from './pages/IdentityCheck';
import PersonalDetails from './pages/PersonalDetails';
import RelativesDetails from './pages/RelativesDetails';
import ContactDetails from './pages/ContactDetails';
import AadhaarDetails from './pages/AadhaarDetails';
import GenderDetails from './pages/GenderDetails';
import DateOfBirthDetails from './pages/DateOfBirthDetails';
import PresentAddressDetails from './pages/PresentAddressDetails';
import DisabilityDetails from './pages/DisabilityDetails';
import FamilyMemberDetails from './pages/FamilyMemberDetails';
import Declaration from './pages/Declaration';
import CaptchaDetails from './pages/CaptchaDetails';
import FaceEnrollment from './pages/FaceEnrollment';
import Success from './pages/Success';
import ForgotPassword from './pages/ForgotPassword';

import { FormProvider } from './context/FormContext';

function App() {
  return (
    <Router>
      <FormProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track-status" element={<TrackStatus />} />
          <Route path="/identity" element={<IdentityCheck />} />
          <Route path="/personal-details" element={<PersonalDetails />} />
          <Route path="/relatives-details" element={<RelativesDetails />} />
          <Route path="/contact-details" element={<ContactDetails />} />
          <Route path="/aadhaar-details" element={<AadhaarDetails />} />
          <Route path="/gender-details" element={<GenderDetails />} />
          <Route path="/dob-details" element={<DateOfBirthDetails />} />
          <Route path="/present-address-details" element={<PresentAddressDetails />} />
          <Route path="/disability-details" element={<DisabilityDetails />} />
          <Route path="/family-details" element={<FamilyMemberDetails />} />
          <Route path="/declaration" element={<Declaration />} />
          <Route path="/captcha-details" element={<CaptchaDetails />} />
          <Route path="/face-enroll" element={<FaceEnrollment />} />
          <Route path="/success" element={<Success />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </FormProvider>
    </Router>
  );
}

export default App;
