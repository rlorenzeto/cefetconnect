import { getCommunityImageUrl } from "../../services/comunidadeService";

export default function CommunitySelectorModal({
  isOpen,
  communities = [],
  selectedCommunityId,
  onSelect,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-[520px] overflow-hidden rounded-[28px] bg-white p-5 shadow-xl">
        <header className="mb-4 flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#202020]">
              Escolher comunidade
            </h2>

            <p className="mt-1 text-sm text-[#666]">
              Selecione onde essa publicação será enviada.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f1f1] text-xl text-[#343434]"
          >
            ×
          </button>
        </header>

        {communities.length > 0 ? (
          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {communities.map((community) => {
              const isSelected =
                String(selectedCommunityId || "") ===
                String(community.idComunidade || "");

              return (
                <button
                  key={community.idComunidade}
                  type="button"
                  onClick={() => onSelect(community)}
                  className={`flex min-w-0 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-[#089464] bg-[#e8f7ef]"
                      : "border-[#eeeeee] bg-white hover:bg-[#f7f7f7]"
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#d9d9d9] text-sm font-bold text-[#777]">
                    {community.fotoUrlComunidade ? (
                      <img
                        src={getCommunityImageUrl(community.fotoUrlComunidade)}
                        alt={community.nomeComunidade}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      community.nomeComunidade?.charAt(0)?.toUpperCase() || "C"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="max-w-full truncate text-sm font-bold text-[#202020]">
                      {community.nomeComunidade}
                    </p>

                    <p className="line-clamp-2 max-w-full break-words text-xs text-[#666] [overflow-wrap:anywhere]">
                      {community.descricaoComunidade ||
                        "Comunidade sem descrição."}
                    </p>
                  </div>

                  {isSelected && (
                    <span className="shrink-0 text-lg font-bold text-[#089464]">=
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f1f1f1] px-4 py-5 text-sm text-[#777]">
            Você ainda não participa de nenhuma comunidade.
          </div>
        )}
      </div>
    </div>
  );
}