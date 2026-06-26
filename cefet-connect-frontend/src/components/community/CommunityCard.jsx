import { getCommunityImageUrl } from "../../services/comunidadeService";
import PinBadge from "../pin/PinBadge";

export default function CommunityCard({
  community,
  currentUser,
  onOpen,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  isLoadingAction,
}) {
  const isCreator =
    String(community.idCriador || community.criador?.idUsuario || "") ===
    String(currentUser?.idUsuario || "");

  const isMember = Boolean(community.isMembro);

  return (
    <article className="w-full max-w-full overflow-hidden rounded-[28px] bg-white shadow-sm">
      <div className="h-32 w-full bg-[#d9d9d9]">
        {community.capaComunidade ? (
          <img
            src={getCommunityImageUrl(community.capaComunidade)}
            alt={community.nomeComunidade}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#e8f7ef] text-sm font-semibold text-[#089464]">
            CEFET Connect
          </div>
        )}
      </div>

      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between gap-3">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#d9d9d9] text-xl font-bold text-[#777]">
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

          <button
            type="button"
            onClick={onOpen}
            className="mt-15 rounded-full border border-[#bbbebd] bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-[#343434] transition hover:bg-[#e8f7ef] hover:text-[#089464]"
          >
            Abrir
          </button>
        </div>

        <h2 className="mt-4 max-w-full break-words text-lg font-bold leading-tight text-[#202020] [overflow-wrap:anywhere]">
          {community.nomeComunidade}
        </h2>

        <p className="mt-2 line-clamp-3 max-w-full break-words text-sm leading-relaxed text-[#666] [overflow-wrap:anywhere]">
          {community.descricaoComunidade || "Comunidade sem descrição."}
        </p>
        {Array.isArray(community.pins) && community.pins.length > 0 && (
          <div className="mt-3">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-[#777]">
              Pins principais
            </p>

            <div className="flex min-w-0 max-w-full flex-wrap gap-1 overflow-hidden">
              {community.pins.slice(0, 2).map((pin) => (
                <PinBadge
                  key={pin.idPin}
                  pin={pin}
                  compact
                />
              ))}

              {community.pins.length > 2 && (
                <span className="rounded-full bg-[#f1f1f1] px-2 py-0.5 text-[10px] font-bold text-[#777]">
                  +{community.pins.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#777]">
          <span className="rounded-full bg-[#f1f1f1] px-3 py-1">
            {Number(community.totalMembros || 0)} membros
          </span>

          <span className="rounded-full bg-[#f1f1f1] px-3 py-1">
            {Number(community.totalPosts || 0)} posts
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {isMember ? (
            <button
              type="button"
              onClick={onLeave}
              disabled={isLoadingAction}
              className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:opacity-60"
            >
              Sair
            </button>
          ) : (
            <button
              type="button"
              onClick={onJoin}
              disabled={isLoadingAction}
              className="rounded-full bg-[#089464] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#067f57] disabled:opacity-60"
            >
              Entrar
            </button>
          )}

          {isCreator && (
            <>
              <button
                type="button"
                onClick={onEdit}
                className="rounded-full bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-[#343434]"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={onDelete}
                className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-500"
              >
                Excluir
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}