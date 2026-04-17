import BrandLogo from "./BrandLogo";
import RegisterForm from "./RegisterForm";

export default function MobileRegisterModal({
  isOpen,
  onClose,
  onGoToLogin,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 lg:hidden">
      <div className="min-h-screen w-full bg-[#f4f4f4] px-4 pt-6">
        <button
          type="button"
          onClick={onClose}
          className="mb-6 text-3xl leading-none text-black/70"
          aria-label="Voltar"
        >
          ‹
        </button>

        <div className="mx-auto w-full max-w-[320px]">
          <div className="mb-8 flex justify-center">
            <BrandLogo className="h-28 w-auto object-contain" />
          </div>

          <p className="mb-8 text-center text-[18px] text-[#3b3b3b]">
            Comece a usar <span className="text-[#86cf4f]">Cefet</span>{" "}
            <span className="text-[#2d67c5]">Connect</span> !
          </p>

          <RegisterForm onGoToLogin={onGoToLogin} />
        </div>
      </div>
    </div>
  );
}