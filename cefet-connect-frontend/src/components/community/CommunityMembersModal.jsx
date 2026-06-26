import { getProfileImageUrl } from "../../services/authService";

export default function CommunityMembersModal({
  isOpen,
  onClose,
  members = [],
  communityName = "",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-[440px] overflow-hidden rounded-[24px] bg-white shadow-xl">
        <header className="flex min-w-0 items-center justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-[#202020]">
              Membros
            </h2>

            <p className="mt-1 max-w-full break-words text-xs text-[#777] [overflow-wrap:anywhere]">
              {communityName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f1f1] text-xl font-bold text-[#555] transition hover:bg-[#e5e5e5]"
            aria-label="Fechar modal de membros"
          >
            ×
          </button>
        </header>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {members.length > 0 ? (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.idUsuario}
                  className="flex min-w-0 items-center gap-3 rounded-2xl bg-[#f7f7f7] px-4 py-3"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9] text-sm font-bold text-[#777]">
                    {member.fotoUrl ? (
                      <img
                        src={getProfileImageUrl(member.fotoUrl)}
                        alt={member.nomeUsuario}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      member.nomeUsuario?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="max-w-full truncate text-sm font-bold text-[#202020]">
                      {member.nomeUsuario || "Usuário"}
                    </p>

                    <p className="text-xs text-[#777]">
                      Membro da comunidade
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-[#f7f7f7] px-4 py-4 text-sm text-[#777]">
              Nenhum membro encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}