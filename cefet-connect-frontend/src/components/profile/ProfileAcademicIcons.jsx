import { AcademicPpcIcon } from "../icons/IconesGradment";

export default function ProfileAcademicIcons({
  icones = [],
  isOwnProfile = false,
  isRefreshing = false,
  onRefreshIcones,
}) {
  return (
    <section className="mt-8 w-full max-w-full overflow-hidden rounded-[28px] bg-[#f7f7f7] px-4 py-5">
      <div className="mb-4 flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-[#202020]">
            Ícones acadêmicos
          </h3>

          <p className="mt-1 text-xs text-[#777]">
            {icones.length} conquista(s) do PPC
          </p>
        </div>

        {isOwnProfile && (
          <button
            type="button"
            onClick={onRefreshIcones}
            disabled={isRefreshing}
            className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#089464] transition hover:bg-[#e8f7ef] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRefreshing ? "Atualizando..." : "Atualizar ícones"}
          </button>
        )}
      </div>

      {icones.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {icones.map((icone) => (
            <div
              key={icone.idIcone}
              className="group flex min-w-0 flex-col items-center text-center"
              title={icone.descricaoIcone}
            >
              <AcademicPpcIcon
                code={icone.codigoIcone}
                className="h-20 w-20 transition group-hover:scale-105"
              />

              <p className="mt-2 line-clamp-2 max-w-[95px] break-words text-[11px] font-bold leading-tight text-[#343434] [overflow-wrap:anywhere]">
                {icone.nomeIcone}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-[#777]">
          {isOwnProfile
            ? "Você ainda não possui ícones acadêmicos. Clique em Atualizar ícones para buscar suas conquistas no Gradment."
            : "Este usuário ainda não possui ícones acadêmicos."}
        </p>
      )}
    </section>
  );
}