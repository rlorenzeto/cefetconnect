import BrandLogo from "./BrandLogo";
import RegisterForm from "./RegisterForm";

export default function MobileRegisterModal({
  isOpen,
  onClose,
  onGoToLogin,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#f4f4f4] lg:hidden">
      <div className="min-h-[100svh] w-full max-w-full bg-[#f4f4f4] px-4 pt-3 pb-[calc(96px+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onClose}
          className="mb-2 text-3xl leading-none text-black/70"
          aria-label="Voltar"
        >
          ‹
        </button>

        <div className="mx-auto flex w-full max-w-[360px] flex-col">
          <div className="mb-4 flex justify-center">
            <BrandLogo className="h-20 w-auto object-contain" />
          </div>

          <p className="mb-4 text-center text-[18px] text-[#3b3b3b]">
            Comece a usar <span className="text-[#86cf4f]">Cefet</span>{" "}
            <span className="text-[#2d67c5]">Connect</span> !
          </p>

          <RegisterForm onGoToLogin={onGoToLogin} compact />
        </div>
      </div>
    </div>
  );
}