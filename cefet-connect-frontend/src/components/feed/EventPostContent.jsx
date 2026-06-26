import { useMemo, useState } from "react";
import { getEventImageUrl } from "../../services/eventoService";

const COLLAPSED_LIMIT = 170;
const EXPANDED_LIMIT = 520;

export default function EventPostContent({ event, formatDate }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = event?.capaEvento || event?.fotoUrlEvento;
  const communityName = event?.comunidade?.nomeComunidade;
  const description = event?.descricaoEvento || "";

  const isLongDescription = description.length > COLLAPSED_LIMIT;
  const isVeryLongDescription = description.length > EXPANDED_LIMIT;

  const visibleDescription = useMemo(() => {
    if (!isLongDescription) return description;

    if (isExpanded) {
      return description.slice(0, EXPANDED_LIMIT);
    }

    return description.slice(0, COLLAPSED_LIMIT);
  }, [description, isExpanded, isLongDescription]);

  function handleOpenFullEvent() {
    setIsModalOpen(true);
  }

  return (
    <>
      <section className="overflow-hidden rounded-[22px] border border-[#d8f0e4] bg-white shadow-sm">
        <div className="relative h-[180px] w-full bg-[#d9d9d9] sm:h-[210px]">
          {imageUrl ? (
            <img
              src={getEventImageUrl(imageUrl)}
              alt={event?.titulo || "Evento"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#e8f7ef] text-sm font-bold text-[#089464]">
              Evento CEFET Connect
            </div>
          )}

          <div className="absolute left-3 top-3 rounded-full bg-[#089464] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
            Evento
          </div>
        </div>

        <div className="p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#089464]">
            {communityName ? `Evento em ${communityName}` : "Evento público"}
          </p>

          <h2 className="mt-1 line-clamp-2 break-words text-[22px] font-extrabold leading-tight text-[#202020] [overflow-wrap:anywhere]">
            {event?.titulo}
          </h2>
            {!event?.isFinalizado && (
                <p className="mt-3 rounded-2xl bg-[#e8f7ef] px-4 py-3 text-sm font-bold text-[#089464]">
                    Confirme sua presença e venha participar!
                </p>
            )}

          {description && (
            <div className="mt-2">
              <p className="max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-[#343434] [overflow-wrap:anywhere]">
                {visibleDescription}
                {isLongDescription &&
                  !isExpanded &&
                  visibleDescription.length < description.length &&
                  "..."}
                {isVeryLongDescription &&
                  isExpanded &&
                  visibleDescription.length < description.length &&
                  "..."}
              </p>

              {isLongDescription && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="rounded-full bg-[#e8f7ef] px-4 py-2 text-xs font-bold text-[#089464] transition hover:bg-[#d8f0e4]"
                  >
                    {isExpanded ? "Ver menos" : "Ver mais"}
                  </button>

                  {isVeryLongDescription && isExpanded && (
                    <button
                      type="button"
                      onClick={handleOpenFullEvent}
                      className="rounded-full bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-[#343434] transition hover:bg-[#e5e5e5]"
                    >
                      Abrir completo
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-4 grid gap-3 text-sm text-[#343434] sm:grid-cols-2">
            <div className="rounded-2xl bg-[#f1f1f1] px-4 py-3">
              <p className="text-[11px] font-bold uppercase text-[#777]">
                Data
              </p>

              <p className="mt-1 text-sm font-bold text-[#202020]">
                {formatDate(event?.dataEvento)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#f1f1f1] px-4 py-3">
              <p className="text-[11px] font-bold uppercase text-[#777]">
                Local
              </p>
              <p className="mt-1 line-clamp-2 break-words text-sm font-bold text-[#202020] [overflow-wrap:anywhere]">
                {event?.localEvento || "Local não informado"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4 py-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="max-h-[92vh] w-full max-w-[720px] overflow-hidden rounded-[28px] bg-white shadow-xl">
            <div className="relative h-[230px] w-full bg-[#d9d9d9] sm:h-[300px]">
              {imageUrl ? (
                <img
                  src={getEventImageUrl(imageUrl)}
                  alt={event?.titulo || "Evento"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#e8f7ef] text-sm font-bold text-[#089464]">
                  Evento CEFET Connect
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl font-bold text-[#343434] shadow-sm transition hover:bg-[#f1f1f1]"
                aria-label="Fechar evento completo"
              >
                ×
              </button>
            </div>

            <div className="max-h-[calc(92vh-230px)] overflow-y-auto p-6 sm:max-h-[calc(92vh-300px)]">
              <p className="text-xs font-bold uppercase tracking-wide text-[#089464]">
                {communityName ? `Evento em ${communityName}` : "Evento público"}
              </p>

              <h2 className="mt-2 text-[28px] font-extrabold leading-tight text-[#202020]">
                {event?.titulo}
              </h2>

              <div className="mt-5 grid gap-3 text-sm text-[#343434] sm:grid-cols-2">
                <div className="rounded-2xl bg-[#f1f1f1] px-4 py-3">
                  <p className="text-xs font-bold uppercase text-[#777]">
                    Data
                  </p>

                  <p className="mt-1 font-bold text-[#202020]">
                    {formatDate(event?.dataEvento)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f1f1f1] px-4 py-3">
                  <p className="text-xs font-bold uppercase text-[#777]">
                    Local
                  </p>

                  <p className="mt-1 font-bold text-[#202020]">
                    {event?.localEvento || "Local não informado"}
                  </p>
                </div>
              </div>

              {description && (
                <p className="mt-5 max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-[#343434] [overflow-wrap:anywhere]">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}