import BrandLogo from "../auth/BrandLogo";
import CommunityCard from "./CommunityCard";
import GlobalCreateMenu from "../common/GlobalCreateMenu";

export default function MobileCommunities({
  communities = [],
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
}) {
  return (
    <div className="min-h-screen bg-[#f1f1f1] pb-24 text-[#202020] lg:hidden">
      <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between bg-white px-5 shadow-sm">
        <BrandLogo className="h-9 w-auto object-contain" />

        <button
          type="button"
          onClick={onOpenCreate}
          className="rounded-full bg-[#089464] px-4 py-1.5 text-xs font-semibold text-white"
        >
          Nova
        </button>
      </header>

      <main className="px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-[#202020]">
            Comunidades
          </h1>

          <p className="mt-1 text-sm text-[#666]">
            Participe dos grupos do CEFET.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
            Carregando comunidades...
          </div>
        ) : communities.length > 0 ? (
          <div className="space-y-5">
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
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#e3e3e3] bg-white">
        <button
          type="button"
          onClick={() => window.location.assign("/home")}
          className="text-sm text-[#777]"
        >
          Início
        </button>

        <button type="button" className="text-sm font-semibold text-[#089464]">
          Comunidades
        </button>

        <GlobalCreateMenu />

        <button type="button" className="text-sm text-[#777]">
          Avisos
        </button>

        <button
          type="button"
          onClick={() => window.location.assign("/profile")}
          className="text-sm text-[#777]"
        >
          Perfil
        </button>
      </nav>
    </div>
  );
}