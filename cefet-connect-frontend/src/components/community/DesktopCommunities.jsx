import ProfileSidebar from "../profile/ProfileSidebar";
import CommunityCard from "./CommunityCard";
import SearchBar from "../common/SearchBar";

export default function DesktopCommunities({
  communities = [],
  searchTerm = "",
  onSearchChange,
  currentUser,
  isLoading,
  error,
  loadingActionId,
  onOpenCreate,
  onOpenCommunity,
  onJoin,
  onLeave,
  onEdit,
  onDelete,
  onOpenFullRanking,
  onOpenNotifications,
}) {
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
        <ProfileSidebar
          activePage="community"
          currentUser={currentUser}
          onOpenFullRanking={onOpenFullRanking}
          onOpenNotifications={onOpenNotifications}
        />

        <main className="flex-1 px-12 py-10">
          <div className="mx-auto max-w-[1120px]">
            <header className="mb-8 flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-[42px] font-bold text-[#202020]">
                  Comunidades
                </h1>

                <p className="mt-2 text-sm text-[#666]">
                  Entre em comunidades, acompanhe posts e participe dos assuntos
                  do CEFET.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenCreate}
                className="shrink-0 rounded-full bg-[#089464] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#067f57]"
              >
                Nova comunidade
              </button>
            </header>

            <SearchBar
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Pesquisar comunidades ..."
              className="mb-6"
            />

            {error && (
              <div className="mb-5 rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600 break-words [overflow-wrap:anywhere]">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                Carregando comunidades...
              </div>
            ) : communities.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {communities.map((community) => (
                  <CommunityCard
                    key={community.idComunidade}
                    community={community}
                    currentUser={currentUser}
                    isLoadingAction={loadingActionId === community.idComunidade}
                    onOpen={() => onOpenCommunity(community.idComunidade)}
                    onJoin={() => onJoin(community)}
                    onLeave={() => onLeave(community)}
                    onEdit={() => onEdit(community)}
                    onDelete={() => onDelete(community)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                Nenhuma comunidade criada ainda.
              </div>
            )}
          </div>
        </main>
    </div>
  );
}