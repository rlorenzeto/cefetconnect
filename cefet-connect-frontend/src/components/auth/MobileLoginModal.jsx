import BrandLogo from "./BrandLogo";
import LoginForm from "./LoginForm";

export default function MobileLoginModal({ isOpen, onClose, onGoToRegister}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 lg:hidden">
      <div className="min-h-screen w-full bg-[#f4f4f4] px-4 pt-6">
        <button
          onClick={onClose}
          className="mb-6 text-3xl leading-none text-black/70"
        >
          ‹
        </button>

        <div className="mx-auto w-full max-w-[320px]">
          <div className="mb-8 flex justify-center">
            <BrandLogo className="h-28 w-auto object-contain" />
          </div>
          
          <p className="mb-8 text-center text-[18px] text-[#3b3b3b]">
            Entrar no <span className="text-[#86cf4f]">Cefet</span>{" "}
            <span className="text-[#2d67c5]">Connect</span>
          </p>

          <LoginForm onGoToRegister={onGoToRegister} />
        </div>
      </div>
    </div>
  );
}