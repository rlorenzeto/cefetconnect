import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/auth/BrandLogo";
import DesktopHero from "../../components/auth/DesktopHero";
import MobileHero from "../../components/auth/MobileHero";
import RegisterForm from "../../components/auth/RegisterForm";
import MobileRegisterModal from "../../components/auth/MobileRegisterModal";
import MobileLoginModal from "../../components/auth/MobileLoginModal";

export default function RegisterPage() {
  const [isMobileRegisterOpen, setIsMobileRegisterOpen] = useState(true);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);
  const navigate = useNavigate();

  function handleGoToMobileLogin() {
    setIsMobileRegisterOpen(false);
    setIsMobileLoginOpen(true);
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f4f4f4] text-black">
      <div className="mx-auto h-screen overflow-hidden bg-[#f4f4f4] lg:max-w-400 lg:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.05fr_0.95fr]">
        <DesktopHero />

        <section className="hidden h-screen items-center justify-center overflow-hidden px-10 py-2 lg:flex xl:px-16">
          <div className="w-full max-w-107.5">
            <div className="mb-3 flex justify-center">
              <BrandLogo className="h-20 w-auto object-contain" />
            </div>

            <p className="mb-2 text-center text-[18px] text-[#3b3b3b]">
              Comece a usar <span className="text-[#2d67c5]">CEFET</span>
              <span className="text-[#86cf4f]">Connect</span>!
            </p>

            <p className="mx-auto mb-4 max-w-105 text-center text-sm leading-[1.35] text-[#666]">
              Crie uma conta para se conectar com o seu campus e ficar por
              dentro de todas as novidades, oportunidades e assuntos do momento.
            </p>

            <RegisterForm onGoToLogin={() => navigate("/login")} />
          </div>
        </section>

        <MobileHero
          onOpenLogin={() => navigate("/login")}
          onOpenRegister={() => setIsMobileRegisterOpen(true)}
        />

        <MobileRegisterModal
          isOpen={isMobileRegisterOpen}
          onClose={() => navigate("/login")}
          onGoToLogin={handleGoToMobileLogin}
        />

        <MobileLoginModal
          isOpen={isMobileLoginOpen}
          onClose={() => setIsMobileLoginOpen(false)}
          onGoToRegister={() => {
            setIsMobileLoginOpen(false);
            setIsMobileRegisterOpen(true);
          }}
          onGoToForgotPassword={() => {
            setIsMobileLoginOpen(false);
            navigate("/forgot-password");
          }}
        />
      </div>
    </div>
  );
}