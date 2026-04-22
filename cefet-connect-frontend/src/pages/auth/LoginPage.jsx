import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/auth/BrandLogo";
import DesktopHero from "../../components/auth/DesktopHero";
import LoginForm from "../../components/auth/LoginForm";
import MobileHero from "../../components/auth/MobileHero";
import MobileLoginModal from "../../components/auth/MobileLoginModal";
import MobileForgotPasswordModal from "../../components/auth/MobileForgotPasswordModal";

export default function LoginPage() {
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);
  const [isMobileForgotOpen, setIsMobileForgotOpen] = useState(false);
  const navigate = useNavigate();

  function handleOpenForgotModal() {
    setIsMobileLoginOpen(false);
    setIsMobileForgotOpen(true);
  }

  return (
    <div className="bg-[#f4f4f4] text-black lg:min-h-screen">
      <div className="mx-auto bg-[#f4f4f4] lg:min-h-screen lg:max-w-360 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        <DesktopHero />

        <section className="hidden lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:px-10 lg:py-8 xl:px-16">
          <div className="w-full max-w-107.5">
            <div className="mb-8 flex justify-center">
              <BrandLogo className="h-32 w-auto object-contain" />
            </div>

            <p className="mb-8 text-center text-[18px] text-[#3b3b3b]">
              Entrar no <span className="text-[#86cf4f]">Cefet</span>{" "}
              <span className="text-[#2d67c5]">Connect</span>
            </p>

            <LoginForm
              onGoToRegister={() => navigate("/register")}
              onGoToForgotPassword={() => navigate("/forgot-password")}
            />
          </div>
        </section>

        <MobileHero
          onOpenLogin={() => setIsMobileLoginOpen(true)}
          onOpenRegister={() => navigate("/register")}
        />

        <MobileLoginModal
          isOpen={isMobileLoginOpen}
          onClose={() => setIsMobileLoginOpen(false)}
          onGoToRegister={() => navigate("/register")}
          onGoToForgotPassword={handleOpenForgotModal}
        />

        <MobileForgotPasswordModal
          isOpen={isMobileForgotOpen}
          onClose={() => setIsMobileForgotOpen(false)}
          onGoToLogin={() => {
            setIsMobileForgotOpen(false);
            setIsMobileLoginOpen(true);
          }}
        />
      </div>
    </div>
  );
}