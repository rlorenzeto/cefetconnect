import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BrandLogo from "../../components/auth/BrandLogo";
import DesktopHero from "../../components/auth/DesktopHero";
import LoginForm from "../../components/auth/LoginForm";
import MobileLoginModal from "../../components/auth/MobileLoginModal";
import MobileForgotPasswordModal from "../../components/auth/MobileForgotPasswordModal";

export default function LoginPage() {
  const [isMobileForgotOpen, setIsMobileForgotOpen] = useState(false);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const ssoToken = searchParams.get("ssoToken");
    const searchTopic = searchParams.get("search");

    if (ssoToken) {
      import("../../services/authService").then(({ loginUser }) => {
        loginUser({ ssoToken })
          .then(() => {
            const redirectUrl = searchTopic
              ? `/home?search=${encodeURIComponent(searchTopic)}`
              : "/home";

            navigate(redirectUrl, { replace: true });
          })
          .catch((err) => alert(err.message || "SSO falhou."));
      });

      setSearchParams({});
    }
  }, [searchParams, setSearchParams, navigate]);

  function handleOpenForgotModal() {
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

        <MobileLoginModal
          isOpen={!isMobileForgotOpen}
          onClose={() => navigate("/")}
          onGoToRegister={() => navigate("/register")}
          onGoToForgotPassword={handleOpenForgotModal}
        />

        <MobileForgotPasswordModal
          isOpen={isMobileForgotOpen}
          onClose={() => setIsMobileForgotOpen(false)}
          onGoToLogin={() => {
            setIsMobileForgotOpen(false);
          }}
        />
      </div>
    </div>
  );
}