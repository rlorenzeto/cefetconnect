import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BrandLogo from "../../components/auth/BrandLogo";
import DesktopHero from "../../components/auth/DesktopHero";
import ConfirmEmailForm from "../../components/auth/ConfirmEmailForm";
import MobileConfirmEmailModal from "../../components/auth/MobileConfirmEmailModal";

export default function ConfirmEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const pendingVerification = useMemo(() => {
    if (location.state?.matricula) {
      return location.state;
    }

    const saved = localStorage.getItem("cefetconnect_pending_verification");
    return saved ? JSON.parse(saved) : null;
  }, [location.state]);

  const matricula = pendingVerification?.matricula || "";
  const email = pendingVerification?.email || "";

  return (
    <div className="bg-[#f4f4f4] text-black lg:h-screen lg:overflow-hidden">
      <div className="mx-auto bg-[#f4f4f4] lg:h-screen lg:overflow-hidden lg:max-w-400 lg:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.05fr_0.95fr]">
        <DesktopHero />

        <section className="hidden lg:flex lg:min-h-screen lg:items-center lg:justify-center lg:px-10 lg:py-8 xl:px-16">
          <div className="w-full max-w-107.5">
            <div className="mb-8 flex justify-center">
              <BrandLogo className="h-32 w-auto object-contain" />
            </div>

            <p className="mb-4 text-center text-[18px] text-[#3b3b3b]">
              Confirme seu <span className="text-[#86cf4f]">e-mail</span>
            </p>

            <p className="mx-auto mb-8 max-w-105 text-center text-sm leading-[1.45] text-[#666]">
              Digite o código enviado para o seu e-mail institucional para
              ativar sua conta no Cefet Connect.
            </p>

            {matricula ? (
              <ConfirmEmailForm matricula={matricula} email={email} />
            ) : (
              <div className="space-y-4">
                <p className="text-center text-sm text-red-500">
                  Não encontramos um cadastro pendente de confirmação.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="h-11 w-full rounded-full border border-[#8ad142] bg-transparent text-sm font-medium text-[#8ad142]"
                >
                  Voltar para cadastro
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="lg:hidden">
          {matricula ? (
            <MobileConfirmEmailModal
              isOpen={true}
              onClose={() => navigate("/register")}
              matricula={matricula}
              email={email}
            />
          ) : (
            <div className="flex min-h-screen items-center justify-center bg-black/50 px-3">
              <div className="w-full max-w-[352px] rounded-md bg-white px-8 py-7 shadow-lg">
                <p className="mb-4 text-center text-sm text-red-500">
                  Não encontramos um cadastro pendente de confirmação.
                </p>

                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="h-10 w-full rounded-md bg-[#009b72] text-sm font-semibold text-white"
                >
                  Voltar para cadastro
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}