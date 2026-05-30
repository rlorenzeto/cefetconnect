import { getCommunityImageUrl } from "../../services/comunidadeService";

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
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm">
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
            className="rounded-full bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-[#343434] transition hover:bg-[#e8f7ef] hover:text-[#089464]"
          >
            Abrir
          </button>
        </div>

        <h2 className="mt-4 text-lg font-bold text-[#202020]">
          {community.nomeComunidade}
        </h2>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[#666]">
          {community.descricaoComunidade || "Comunidade sem descrição."}
        </p>

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