import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ViewAllProperties from "./pages/ViewAllProperties";
import MultiStepForm from "./forms/MultiStepForm"; 
import SavedProperties from "./pages/SavedProperties";
import OwnerRegistrationForm from "./components/OwnerRegistrationForm";
import OwnerLoginForm from "./components/OwnerLoginForm";
import ProtectedRoute from "./components/ProtectedRoute"; // 1. Import Guard
import Profile from "./components/Profile";
import RegisterUser from "./forms/RegisterUser";
import LoginUser from "./pages/LoginUser";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes - Anyone can visit */}
  
        <Route path="/register-owner" element={<OwnerRegistrationForm />} />
        <Route path="/login-owner" element={<OwnerLoginForm />} />
        <Route path="/register-user" element={<RegisterUser />} />
        <Route path="/login-user" element={<LoginUser />} />

        {/* 🔒 Protected Routes - Only logged-in users can visit */}
        
        <Route element={<ProtectedRoute />}>
          <Route path="/list-property" element={<MultiStepForm />} /> 
          <Route path="/saved-properties" element={<SavedProperties />} />
          <Route path="/owner-profile" element={<Profile />} />
          <Route path="/" element={<HomePage />} />
        <Route path="/all-properties" element={<ViewAllProperties />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;