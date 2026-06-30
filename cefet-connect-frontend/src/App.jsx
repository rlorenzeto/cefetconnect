import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import FeedPage from "./pages/feed/FeedPage";
import CommunitiesPage from "./pages/community/CommunitiesPage";
import CommunityPage from "./pages/community/CommunityPage";
import EventsPage from "./pages/events/EventsPage";
import LandingPage from "./pages/landing/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/confirm-email" element={<ConfirmEmailPage />} />

      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<EditProfilePage />} />
      <Route path="/profile/:idUsuarioPerfil" element={<ProfilePage />} />
      <Route path="/comunidades" element={<CommunitiesPage />} />
      <Route path="/comunidades/:idComunidade" element={<CommunityPage />} />
      <Route path="/eventos" element={<EventsPage />} />

      <Route path="/home" element={<FeedPage />} />
      <Route path="/feed" element={<FeedPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}