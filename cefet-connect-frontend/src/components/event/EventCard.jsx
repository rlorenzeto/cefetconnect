import { getEventImageUrl } from "../../services/eventoService";

export default function EventCard({
  event,
  currentUser,
  isLoadingAction,
  onOpen,
  onEdit,
  onDelete,
  onToggleParticipation,
}) {
  const creatorId = String(event?.usuario?.idUsuario || "");
  const currentUserId = String(currentUser?.idUsuario || "");
  const isCreator = creatorId && currentUserId && creatorId === currentUserId;
  const isFinished = Boolean(event?.isFinalizado);
  const isParticipating = Boolean(event?.isParticipando);
  const communityName = event?.comunidade?.nomeComunidade;

  function formatDate(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <article className="overflow-hidden rounded-[28px] bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onOpen(event)}
        className="block h-40 w-full bg-[#d9d9d9]"
      >
        {event.capaEvento ? (
          <img
            src={getEventImageUrl(event.capaEvento)}
            alt={event.titulo}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#e8f7ef] text-sm font-bold text-[#089464]">
            CEFET Connect
          </div>
        )}
      </button>

      <div className="px-5 pb-5 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-[#202020]">
              {event.titulo}
            </h2>

            <p className="mt-1 text-xs font-semibold text-[#089464]">
              {communityName ? `Comunidade: ${communityName}` : "Evento público"}
            </p>
          </div>

          {event.isParticipando && (
            <span className="shrink-0 rounded-full bg-[#e8f7ef] px-3 py-1 text-xs font-bold text-[#089464]">
              Participando
            </span>
          )}
          {isFinished && (
            <span className="shrink-0 rounded-full bg-[#eeeeee] px-3 py-1 text-xs font-bold text-[#777]">
              Finalizado
            </span>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-[#666]">
          {event.descricaoEvento || "Evento sem descrição."}
        </p>
        {!event?.isFinalizado && (
          <p className="mt-3 rounded-2xl bg-[#e8f7ef] px-4 py-3 text-xs font-bold text-[#089464]">
            Confirme sua presença e participe desse momento!
          </p>
        )}

        <div className="mt-4 space-y-1 text-xs text-[#777]">
          <p>{formatDate(event.dataEvento)}</p>
          <p>{event.localEvento || "Local não informado"}</p>
          <p>Criado por {event?.usuario?.nomeUsuario || "Usuário"}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOpen(event)}
            className="rounded-full bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-[#343434] transition hover:bg-[#e8f7ef] hover:text-[#089464]"
          >
            Ver detalhes
          </button>

          <button
            type="button"
            disabled={isLoadingAction || isFinished}
            onClick={() => {
              if (isFinished) return;

              onToggleParticipation({
                ...event,
                isParticipando: isParticipating,
              });
            }}
            className={`rounded-full px-4 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isFinished
                ? "bg-[#c7eadc] text-[#089464]"
                : isParticipating
                  ? "border border-red-200 text-red-500 hover:bg-red-50"
                  : "bg-[#089464] text-white hover:bg-[#067f57]"
            }`}
          >
            {isFinished
              ? "Evento finalizado"
              : isParticipating
                ? "Sair do evento"
                : "Participar"}
          </button>

          {isCreator && !isFinished && (
            <>
              <button
                type="button"
                onClick={() => onEdit(event)}
                className="rounded-full bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-[#343434]"
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() => onDelete(event)}
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