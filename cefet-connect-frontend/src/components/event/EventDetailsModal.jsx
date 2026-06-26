import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEventImageUrl } from "../../services/eventoService";
import { getProfileImageUrl } from "../../services/authService";
import ProfileAvatar from "../profile/ProfileAvatar";

export default function EventDetailsModal({
  isOpen,
  event,
  currentUser,
  loadingActionId,
  onClose,
  onEdit,
  onDelete,
  onToggleParticipation,
}) {
  if (!isOpen || !event) return null;

  const navigate = useNavigate();

  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  const participantes = Array.isArray(event?.participantes)
    ? event.participantes
    : [];

  function handleGoToParticipantProfile(idUsuario) {
    if (!idUsuario) return;

    onClose();
    navigate(`/profile/${idUsuario}`);
  }

  const isCreator =
    String(event?.usuario?.idUsuario || "") ===
    String(currentUser?.idUsuario || "");

  const isFinished = Boolean(event?.isFinalizado || isPastEvent(event?.dataEvento));
  const canSeeParticipants = true;
  const isParticipating = Boolean(event?.isParticipando);
    
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

  function isPastEvent(date) {
    if (!date) return false;

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return false;

    return parsedDate < new Date();
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 px-4">
      <div className="max-h-[92vh] w-full max-w-[560px] overflow-y-auto overflow-x-hidden rounded-[28px] bg-white shadow-xl">
        <div className="h-48 w-full bg-[#d9d9d9]">
          {event.capaEvento ? (
            <img
              src={getEventImageUrl(event.capaEvento)}
              alt={event.titulo}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#e8f7ef] text-[#089464]">
              CEFET Connect
            </div>
          )}
        </div>

        <div className="p-6">
          <header className="mb-5 flex min-w-0 items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h2 className="max-w-full break-words text-2xl font-bold text-[#202020] [overflow-wrap:anywhere]">
                {event.titulo}
              </h2>

              <p className="mt-1 max-w-full break-words text-sm text-[#089464] [overflow-wrap:anywhere]">
                {event?.comunidade?.nomeComunidade
                  ? `Comunidade: ${event.comunidade.nomeComunidade}`
                  : "Evento público"}
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

          <div className="min-w-0 max-w-full space-y-3 text-sm text-[#343434]">
            <p className="max-w-full whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
              {event.descricaoEvento || "Evento sem descrição."}
            </p>

            <p className="max-w-full break-words [overflow-wrap:anywhere]">
              <strong>Data:</strong> {formatDate(event.dataEvento)}
            </p>

            <p className="max-w-full break-words [overflow-wrap:anywhere]">
              <strong>Local:</strong> {event.localEvento || "Local não informado"}
            </p>

            <p className="max-w-full break-words [overflow-wrap:anywhere]">
              <strong>Criado por:</strong> {event?.usuario?.nomeUsuario || "Usuário"}
            </p>

            {canSeeParticipants && (
              <div className="min-w-0 max-w-full overflow-hidden rounded-2xl bg-[#f7f7f7] px-4 py-4">
                <div className="flex min-w-0 items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <strong>Participantes</strong>

                    <p className="mt-1 text-xs text-[#777]">
                      Veja quem confirmou presença no evento.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#e8f7ef] px-3 py-1 text-xs font-bold text-[#089464]">
                    {participantes.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsParticipantsOpen((prev) => !prev)}
                  className="mt-4 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#089464] transition hover:bg-[#e8f7ef]"
                >
                  {isParticipantsOpen ? "Ocultar participantes" : "Ver participantes"}
                </button>

                {isParticipantsOpen && (
                  <div className="mt-4 space-y-2">
                    {participantes.length > 0 ? (
                      participantes.map((participante) => (
                        <button
                          key={participante.idUsuario || participante.nomeUsuario}
                          type="button"
                          onClick={() => handleGoToParticipantProfile(participante.idUsuario)}
                          className="flex min-w-0 w-full items-center justify-start gap-3 rounded-2xl bg-white px-4 py-3 text-left transition hover:bg-[#eeeeee]"
                        >
                          <ProfileAvatar
                            src={getProfileImageUrl(participante.fotoUrl)}
                            name={participante.nomeUsuario}
                            size="post"
                          />

                          <div className="min-w-0 flex-1 text-left">
                            <p className="max-w-full truncate text-sm font-bold text-[#202020]">
                              {participante.nomeUsuario || "Usuário"}
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="rounded-2xl bg-white px-4 py-3 text-sm text-[#777]">
                        Ninguém confirmou presença ainda.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
          {!isFinished && !isParticipating && (
            <div className="mt-6 rounded-2xl bg-[#e8f7ef] px-4 py-3">
              <p className="text-sm font-bold text-[#089464]">
                Confirme sua presença e não perca essa oportunidade!
              </p>
            </div>
          )}
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            {isCreator && (
              <>
                <button
                  type="button"
                  onClick={() => onEdit(event)}
                  className="rounded-full bg-[#f1f1f1] px-5 py-2 text-sm font-bold text-[#343434]"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(event)}
                  className="rounded-full bg-red-50 px-5 py-2 text-sm font-bold text-red-500"
                >
                  Excluir
                </button>
              </>
            )}
            
            <button
              type="button"
              disabled={loadingActionId === event.idEvento || isFinished}
              onClick={() => {
                if (isFinished) return;

                onToggleParticipation({
                  ...event,
                  isParticipando: isParticipating,
                  isFinalizado: isFinished,
                });
              }}
              className={`rounded-full px-5 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60 ${
                isFinished
                  ? "bg-[#c7eadc] text-[#089464]"
                  : isParticipating
                    ? "border border-red-200 text-red-500"
                    : "bg-[#089464] text-white"
              }`}
            >
              {isFinished
                ? "Evento finalizado"
                : isParticipating
                  ? "Sair do evento"
                  : "Participar de evento"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}