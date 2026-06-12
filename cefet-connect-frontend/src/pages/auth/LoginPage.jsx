import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("openMobileLogin") === "true") {
      setIsMobileLoginOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  function handleOpenForgotModal() {
    setIsMobileLoginOpen(false);
    setIsMobileForgotOpen(true);
  }

  return (
    <div className="bg-[#f4f4f4] text-black lg:min-h-screen">
      <div className="mx-auto bg-[#f4f4f4] lg:h-screen lg:overflow-hidden lg:max-w-400 lg:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.05fr_0.95fr]">
        <DesktopHero />

        <section className="hidden lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:px-10 lg:py-8 xl:px-16">
          <div className="w-full max-w-[560px]">
            <div className="mb-24 flex justify-center">
              <BrandLogo variant="large" />
            </div>

            <p className="mb-10 text-center text-[22px] font-normal text-[#111111]">
              Entrar no <span className="text-[#65c64d]">Cefet</span>{" "}
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