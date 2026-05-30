import { useState } from "react";
import BrandLogo from "../auth/BrandLogo";
import CreatePostCard from "../feed/CreatePostCard";
import PostCard from "../feed/PostCard";
import CommunityMembersModal from "./CommunityMembersModal";
import { getCommunityImageUrl } from "../../services/comunidadeService";
import MobileBottomNav from "../common/MobileBottomNav";
import GlobalCreateMenu from "../common/GlobalCreateMenu";

export default function MobileCommunity({
  community,
  posts = [],
  currentUser,
  userImageUrl,
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
}) {
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);

  const members = Array.isArray(community?.membros) ? community.membros : [];
  const totalMembers = Number(community?.totalMembros || members.length || 0);

  function handleOpenCommunityPostComposer() {
    if (!community?.isMembro) {
      alert("Entre na comunidade para publicar um post.");
      return;
    }

    const composer = document.getElementById("community-post-composer");

    if (composer) {
      composer.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f1f1f1] pb-24 text-[#202020] lg:hidden">
      <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between bg-white px-5 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1f1f1] text-xl text-[#343434]"
            aria-label="Voltar"
          >
            ‹
          </button>

          <BrandLogo className="h-9 w-auto object-contain" />
        </div>

          {community?.isMembro ? (
            <button
              type="button"
              onClick={onLeaveCommunity}
              className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-500"
            >
              Sair
            </button>
          ) : (
            <button
              type="button"
              onClick={onJoinCommunity}
              className="rounded-full bg-[#089464] px-4 py-1.5 text-xs font-semibold text-white"
            >
              Entrar
            </button>
          )}
      </header>

      <main className="w-full max-w-full overflow-x-hidden px-4 pt-5">
        {isLoading ? (
          <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
            Carregando comunidade...
          </div>
        ) : (
          <div className="space-y-5">
            <section className="overflow-hidden rounded-[32px] bg-white pb-6 shadow-sm">
              <div className="h-36 w-full bg-[#d9d9d9]">
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

              <div className="-mt-8 px-5">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-[#d9d9d9] text-xl font-bold text-[#777]">
                  {community?.fotoUrlComunidade ? (
                    <img
                      src={getCommunityImageUrl(community.fotoUrlComunidade)}
                      alt={community.nomeComunidade}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    community?.nomeComunidade?.charAt(0)?.toUpperCase()
                  )}
                </div>

                <h1 className="mt-5 text-[28px] font-bold text-[#202020]">
                  {community?.nomeComunidade}
                </h1>

                <p className="mt-2 text-sm leading-relaxed text-[#666]">
                  {community?.descricaoComunidade ||
                    "Comunidade sem descrição."}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsMembersModalOpen(true)}
                    className="rounded-full bg-[#f1f1f1] px-4 py-2 text-xs font-bold text-[#343434]"
                  >
                    Ver membros
                  </button>

                  <span className="text-xs text-[#777]">
                    {totalMembers} membro(s)
                  </span>
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {community?.isMembro ? (
              <>
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
              </>
            ) : (
              <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                Entre na comunidade para ver e publicar posts.
              </div>
            )}
          </div>
        )}
      </main>

      <MobileBottomNav
        activePage="community"
        onCreatePost={handleOpenCommunityPostComposer}
      />

      <CommunityMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={members}
        communityName={community?.nomeComunidade}
      />
    </div>
  );
}