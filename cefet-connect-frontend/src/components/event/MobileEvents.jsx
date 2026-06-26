import BrandLogo from "../auth/BrandLogo";
import EventCard from "./EventCard";
import MobileBottomNav from "../common/MobileBottomNav";
import SearchBar from "../common/SearchBar";

export default function MobileEvents({
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
}) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f1f1f1] pb-24 text-[#202020] lg:hidden">
      <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between bg-white px-5 shadow-sm">
        <BrandLogo className="h-9 w-auto object-contain" />

        <button
          type="button"
          onClick={onOpenCreate}
          className="shrink-0 rounded-full bg-[#089464] px-4 py-1.5 text-xs font-semibold text-white"
        >
          Novo
        </button>
      </header>

      <main className="w-full max-w-full overflow-x-hidden px-4 pt-6">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Pesquisar eventos ..."
          className="mb-5"
        />
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-[#202020]">
            Eventos
          </h1>

          <p className="mt-1 text-sm text-[#666]">
            Descubra eventos do CEFET.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 break-words [overflow-wrap:anywhere]">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
            Carregando eventos...
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-5">
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
      </main>
      <MobileBottomNav
        activePage="events"
        onCreateEvent={onOpenCreate}
      />
    </div>
  );
}