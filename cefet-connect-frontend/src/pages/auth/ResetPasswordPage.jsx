import BrandLogo from "../../components/auth/BrandLogo";
import DesktopHero from "../../components/auth/DesktopHero";
import ResetPasswordForm from "../../components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="bg-[#f4f4f4] text-black lg:h-screen lg:overflow-hidden">
      <div className="mx-auto bg-[#f4f4f4] lg:h-screen lg:overflow-hidden lg:max-w-400 lg:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1.05fr_0.95fr]">
        <DesktopHero />

        <section className="flex min-h-screen items-center justify-center px-4 py-8 lg:px-10 xl:px-16">
          <div className="w-full max-w-107.5">
            <div className="mb-8 flex justify-center">
              <BrandLogo className="h-32 w-auto object-contain" />
            </div>

            <p className="mb-4 text-center text-[18px] text-[#3b3b3b]">
              Definir nova <span className="text-[#86cf4f]">senha</span>
            </p>

            <p className="mx-auto mb-8 max-w-105 text-center text-sm leading-[1.45] text-[#666]">
              Digite sua nova senha para voltar a acessar sua conta.
            </p>

            <ResetPasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}