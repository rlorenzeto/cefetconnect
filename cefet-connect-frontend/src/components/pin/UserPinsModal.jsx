import PinBadge from "./PinBadge";

export default function UserPinsModal({
  isOpen,
  onClose,
  user,
  pins = [],
  onOpenPin,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="max-h-[90vh] w-full max-w-[460px] overflow-hidden rounded-[24px] bg-white p-6 shadow-xl">
        <div className="flex min-w-0 items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="max-w-full break-words text-lg font-bold text-[#202020] [overflow-wrap:anywhere]">
              Pins de {user?.nomeUsuario || "usuário"}
            </h2>
            <p className="mt-1 text-xs text-[#777]">
              {pins.length} pin(s) associado(s)
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-2xl text-[#555] transition hover:bg-[#f1f1f1]"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="mt-5 max-h-[360px] overflow-y-auto">
          {pins.length > 0 ? (
            <div className="flex min-w-0 max-w-full flex-wrap gap-2">
              {pins.map((pin) => (
                <PinBadge
                  key={pin.idPin}
                  pin={pin}
                  onClick={() => onOpenPin?.(pin)}
                />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-[#f7f7f7] px-4 py-3 text-sm text-[#777]">
              Este usuário ainda não possui pins.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}