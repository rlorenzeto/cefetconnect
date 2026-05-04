export default function PasswordChangedCard({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[438px] rounded-lg bg-white px-8 py-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#089464] text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m5 12 4 4 10-10" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#202020]">
          Senha alterada
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#343434]">
          Sua senha foi alterada com sucesso.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-7 h-10 w-40 rounded-full bg-[#089464] text-sm font-semibold text-white"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}