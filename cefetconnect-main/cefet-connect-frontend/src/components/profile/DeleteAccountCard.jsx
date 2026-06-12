export default function DeleteAccountCard({
  onCancel,
  onConfirm,
  isDeleting,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[438px] rounded-lg bg-white px-8 py-8 text-center shadow-xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f82b2b] text-white">
          <svg
            viewBox="0 0 24 24"
            className="h-9 w-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M12 8v5" />
            <path d="M12 17h.01" />
            <path d="M10.3 4.4 2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.4a1.9 1.9 0 0 0-3.4 0Z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-[#202020]">
          Excluir conta
        </h2>

        <p className="mt-3 text-sm leading-relaxed text-[#343434]">
          Tem certeza que deseja excluir sua conta? Essa ação não poderá ser desfeita.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-full border border-[#d9d9d9] px-8 text-sm font-semibold text-[#343434]"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-10 rounded-full bg-[#f82b2b] px-8 text-sm font-semibold text-white disabled:opacity-70"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}