import { useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import CreatePostCard from "../feed/CreatePostCard";
import PostCard from "../feed/PostCard";
import CommunityMembersModal from "./CommunityMembersModal";
import { getCommunityImageUrl } from "../../services/comunidadeService";
import PinBadge from "../pin/PinBadge";
import PinDetailsModal from "../pin/PinDetailsModal";
import CommunityPinsManagerModal from "../pin/CommunityPinsManagerModal";
import SearchBar from "../common/SearchBar";

export default function DesktopCommunity({
  community,
  posts = [],
  searchTerm = "",
  onSearchChange,
  currentUser,
  userImageUrl,
  pins = [],
  onRefreshCommunityPins,
  isLoading,
  isCreating,
  error,
  currentCommunityAsOption = [],
  onBack,
  onLeaveCommunity,
  onJoinCommunity,
  onCreatePost,
  onPostDeleted,
  onPostUpdated,
  onOpenFullRanking,
  onOpenNotifications,
}) {
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [isPinDetailsOpen, setIsPinDetailsOpen] = useState(false);
  const [isPinsManagerOpen, setIsPinsManagerOpen] = useState(false);

  const isCommunityCreator =
    String(
      community?.idCriador ||
        community?.criador?.idUsuario ||
        community?.usuario?.idUsuario ||
        ""
    ) === String(currentUser?.idUsuario || "");

  function handleOpenPin(pin) {
    setSelectedPin(pin);
    setIsPinDetailsOpen(true);
  }

  const members = Array.isArray(community?.membros) ? community.membros : [];
  const totalMembers = Number(community?.totalMembros || members.length || 0);
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
        <ProfileSidebar
          activePage="community"
          currentUser={currentUser}
          onOpenFullRanking={onOpenFullRanking}
          onOpenNotifications={onOpenNotifications}
        />

        <main className="flex-1 px-12 py-10">
          <div className="mx-auto max-w-[920px]">
            <button
              type="button"
              onClick={onBack}
              className="mb-5 rounded-full bg-white px-5 py-2 text-sm font-bold text-[#343434] shadow-sm transition hover:bg-[#e8f7ef] hover:text-[#089464]"
            >
              Voltar
            </button>

            {isLoading ? (
              <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                Carregando comunidade...
              </div>
            ) : (
              <>
                <section className="mb-6 min-w-0 max-w-full overflow-hidden rounded-[32px] bg-white shadow-sm">
                  <div className="h-56 w-full bg-[#d9d9d9]">
                    {community?.capaComunidade ? (
                      <img
                        src={getCommunityImageUrl(community.capaComunidade)}
                        alt={community.nomeComunidade}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#e8f7ef] text-[#089464]">
                        CEFET Connect
                      </div>
                    )}
                  </div>

                  <div className="px-8 pb-8">
                    <div className="-mt-10 flex items-end justify-between gap-4">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-[#d9d9d9] text-2xl font-bold text-[#777]">
                        {community?.fotoUrlComunidade ? (
                          <img
                            src={getCommunityImageUrl(
                              community.fotoUrlComunidade
                            )}
                            alt={community.nomeComunidade}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          community?.nomeComunidade?.charAt(0)?.toUpperCase()
                        )}
                      </div>

                      {community?.isMembro ? (
                        <button
                          type="button"
                          onClick={onLeaveCommunity}
                          className="rounded-full border border-red-200 px-5 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50"
                        >
                          Sair da comunidade
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onJoinCommunity}
                          className="rounded-full bg-[#089464] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#067f57]"
                        >
                          Entrar na comunidade
                        </button>
                      )}
                    </div>

                    <h1 className="mt-5 max-w-full break-words text-[36px] font-bold text-[#202020] [overflow-wrap:anywhere]">
                      {community?.nomeComunidade}
                    </h1>

                    <p className="mt-2 max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed text-[#666] [overflow-wrap:anywhere]">
                      {community?.descricaoComunidade ||
                        "Comunidade sem descrição."}
                    </p>
                    {pins.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#777]">
                          Pins relacionados
                        </p>

                        <div className="flex min-w-0 max-w-full flex-wrap gap-2">
                          {pins.map((pin) => (
                            <PinBadge key={pin.idPin} pin={pin} />
                          ))}
                        </div>
                      </div>
                    )}

                    {isCommunityCreator && (
                      <button
                        type="button"
                        onClick={() => setIsPinsManagerOpen(true)}
                        className="mt-4 rounded-full bg-[#089464] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#067f57]"
                      >
                        Gerenciar pins
                      </button>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsMembersModalOpen(true)}
                        className="rounded-full bg-[#f1f1f1] px-4 py-2 text-sm font-bold text-[#343434] transition hover:bg-[#e8f7ef] hover:text-[#089464]"
                      >
                        Ver membros
                      </button>

                      <span className="text-sm text-[#777]">
                        {totalMembers} membro(s)
                      </span>
                    </div>
                  </div>
                </section>

                <div className="space-y-6">
                  {error && (
                    <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600 break-words [overflow-wrap:anywhere]">
                      {error}
                    </div>
                  )}
                  {community?.isMembro ? (
                    <>
                      <div className="pb-6">
                        <SearchBar
                          value={searchTerm}
                          onChange={onSearchChange}
                          placeholder="Pesquisar ..."
                        />
                      </div>

                      <div className="space-y-6">
                        <div id="community-post-composer">
                          <CreatePostCard
                            user={currentUser}
                            userImageUrl={userImageUrl}
                            onCreatePost={onCreatePost}
                            isCreating={isCreating}
                            communities={currentCommunityAsOption}
                            fixedCommunity={community}
                          />
                        </div>

                        {posts.map((post) => (
                          <PostCard
                            key={post.idPost}
                            post={post}
                            currentUser={currentUser}
                            onPostDeleted={onPostDeleted}
                            onPostUpdated={onPostUpdated}
                          />
                        ))}

                        {posts.length === 0 && (
                          <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                            Nenhum post publicado nesta comunidade ainda.
                          </div>
                        )}
                      </div>                    </>
                  ) : (
                    <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                      Entre na comunidade para ver e publicar posts.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>

      <CommunityMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={members}
        communityName={community?.nomeComunidade}
      />

      <PinDetailsModal
        pin={selectedPin}
        isOpen={isPinDetailsOpen}
        onClose={() => setIsPinDetailsOpen(false)}
      />
      <CommunityPinsManagerModal
        isOpen={isPinsManagerOpen}
        onClose={() => setIsPinsManagerOpen(false)}
        community={community}
        currentPins={pins}
        onUpdated={onRefreshCommunityPins}
      />
    </div>
  );
}