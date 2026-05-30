import { useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import CreatePostCard from "../feed/CreatePostCard";
import PostCard from "../feed/PostCard";
import CommunityMembersModal from "./CommunityMembersModal";
import { getCommunityImageUrl } from "../../services/comunidadeService";

export default function DesktopCommunity({
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
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
        <ProfileSidebar activePage="community" />

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
                <section className="mb-6 overflow-hidden rounded-[32px] bg-white shadow-sm">
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

                    <h1 className="mt-5 text-[36px] font-bold text-[#202020]">
                      {community?.nomeComunidade}
                    </h1>

                    <p className="mt-2 text-sm leading-relaxed text-[#666]">
                      {community?.descricaoComunidade ||
                        "Comunidade sem descrição."}
                    </p>
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
                    <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {community?.isMembro ? (
                    <>
                      <CreatePostCard
                        user={currentUser}
                        userImageUrl={userImageUrl}
                        onCreatePost={onCreatePost}
                        isCreating={isCreating}
                        communities={currentCommunityAsOption}
                        fixedCommunity={community}
                      />

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
    </div>
  );
}