import ProfileSidebar from "../profile/ProfileSidebar";
import EventCard from "./EventCard";
import SearchBar from "../common/SearchBar";

export default function DesktopEvents({
  events = [],
  searchTerm = "",
  onSearchChange,
  currentUser,
  isLoading,
  error,
  loadingActionId,
  onOpenCreate,
  onOpenDetails,
  onEdit,
  onDelete,
  onToggleParticipation,
  onOpenFullRanking,
  onOpenNotifications,
}) {
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
        <ProfileSidebar
          activePage="events"
          onOpenFullRanking={onOpenFullRanking}
          onOpenNotifications={onOpenNotifications}
        />

        <main className="flex-1 px-12 py-10">
          <div className="mx-auto max-w-[1120px]">
            <header className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h1 className="text-[42px] font-bold text-[#202020]">
                  Eventos
                </h1>

                <p className="mt-2 text-sm text-[#666]">
                  Descubra eventos do feed e das comunidades do CEFET.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenCreate}
                className="rounded-full bg-[#089464] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#067f57]"
              >
                Novo evento
              </button>
            </header>
            <SearchBar
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Pesquisar eventos ..."
              className="mb-6"
            />

            {error && (
              <div className="mb-5 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                Carregando eventos...
              </div>
            ) : events.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event) => (
                  <EventCard
                    key={event.idEvento}
                    event={event}
                    currentUser={currentUser}
                    isLoadingAction={loadingActionId === event.idEvento}
                    onOpen={onOpenDetails}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleParticipation={onToggleParticipation}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                Nenhum evento criado ainda.
              </div>
            )}
          </div>
        </main>
      </div>
  );
}