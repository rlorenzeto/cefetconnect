import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLogo from "../../components/auth/BrandLogo";
import DesktopHero from "../../components/auth/DesktopHero";
import MobileHero from "../../components/auth/MobileHero";
import MobileLoginModal from "../../components/auth/MobileLoginModal";
import MobileForgotPasswordModal from "../../components/auth/MobileForgotPasswordModal";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isMobileForgotOpen, setIsMobileForgotOpen] = useState(true);
  const [isMobileLoginOpen, setIsMobileLoginOpen] = useState(false);

  function handleGoToMobileLogin() {
    setIsMobileForgotOpen(false);
    setIsMobileLoginOpen(true);
  }

  return (
    <div className="bg-[#f4f4f4] text-black lg:h-screen lg:overflow-hidden">
      <div className="mx-auto bg-[#f4f4f4] lg:h-screen lg:overflow-hidden lg:max-w-360 lg:grid lg:grid-cols-[1.15fr_0.85fr]">
        <DesktopHero />

        <section className="hidden lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:px-10 lg:py-8 xl:px-16">
          <div className="w-full max-w-107.5">
            <div className="mb-8 flex justify-center">
              <BrandLogo className="h-32 w-auto object-contain" />
            </div>

            <p className="mb-4 text-center text-[18px] text-[#3b3b3b]">
              Recuperar <span className="text-[#86cf4f]">senha</span>
            </p>

            <p className="mx-auto mb-8 max-w-105 text-center text-sm leading-[1.45] text-[#666]">
              Informe seu e-mail para receber as instruções de redefinição.
            </p>

            <ForgotPasswordForm onGoToLogin={() => navigate("/login")} />
          </div>
        </section>

        <MobileHero
          onOpenLogin={() => navigate("/login")}
          onOpenRegister={() => navigate("/register")}
        />

        <MobileForgotPasswordModal
          isOpen={isMobileForgotOpen}
          onClose={() => navigate("/login")}
          onGoToLogin={handleGoToMobileLogin}
        />

        <MobileLoginModal
          isOpen={isMobileLoginOpen}
          onClose={() => setIsMobileLoginOpen(false)}
          onGoToRegister={() => navigate("/register")}
        />
      </div>
    </div>
  );
}