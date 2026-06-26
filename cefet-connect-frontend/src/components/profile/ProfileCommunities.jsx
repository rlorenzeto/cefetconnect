import { getCommunityImageUrl } from "../../services/comunidadeService";

export default function ProfileCommunities({
  communities = [],
  showAll = false,
  onToggle,
  onOpenCommunity,
}) {
  const visibleCommunities = showAll ? communities : communities.slice(0, 3);

  return (
    <section className="mt-8 w-full max-w-full overflow-hidden rounded-[28px] bg-[#f7f7f7] px-4 py-5">
      <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#202020]">
            Principais comunidades
          </h3>

          <p className="mt-1 text-xs text-[#777]">
            {communities.length} comunidade(s)
          </p>
        </div>

        {communities.length > 3 && (
          <button
            type="button"
            onClick={onToggle}
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#089464]"
          >
            {showAll ? "Mostrar menos" : "Visualizar demais"}
          </button>
        )}
      </div>

      {visibleCommunities.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleCommunities.map((community) => (
            <button
              key={community.idComunidade}
              type="button"
              onClick={() => onOpenCommunity(community.idComunidade)}
              className="flex w-full max-w-full min-w-0 items-center gap-3 overflow-hidden rounded-2xl bg-white p-3 text-left shadow-sm transition hover:bg-[#e8f7ef]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#d9d9d9] text-sm font-bold text-[#777]">
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

              <div className="min-w-0 flex-1 overflow-hidden">
                <p
                  className="max-w-full truncate text-sm font-bold text-[#202020]"
                  title={community.nomeComunidade}
                >
                  {community.nomeComunidade}
                </p>

                <p
                  className="max-w-full truncate text-xs text-[#777]"
                  title={community.descricaoComunidade || "Sem descrição."}
                >
                  {community.descricaoComunidade || "Sem descrição."}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-[#777]">
          Nenhuma comunidade ainda.
        </p>
      )}
    </section>
  );
}