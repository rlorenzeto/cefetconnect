import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />

      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />

      <Route path="/home" element={<Navigate to="/profile" replace />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}