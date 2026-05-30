import { BackIcon } from "../icons/AppIcons";
import ProfileAvatar from "./ProfileAvatar";
import ProfileSidebar from "./ProfileSidebar";
import PostCard from "../feed/PostCard";
import ProfileCommunities from "./ProfileCommunities";

export default function DesktopProfile({
  user,
  currentUser,
  imageUrl,
  userPosts = [],
  isOwnProfile = false,
  onEditProfile,
  onLogout,
  onPostDeleted,
  onPostUpdated,
  onGoBack,
  communities = [],
  showAllCommunities = false,
  onToggleCommunities,
  onOpenCommunity,
}) {
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
        <ProfileSidebar />

        <main className="flex-1 px-16 py-12">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={onGoBack}
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#343434] shadow-sm transition hover:bg-[#e8f7ef] hover:text-[#089464]"
                aria-label="Voltar para o feed"
                title="Voltar para o feed"
              >
                <BackIcon className="h-6 w-6" />
              </button>

              <h1 className="text-[42px] font-bold text-[#202020]">
                Perfil
              </h1>
            </div>

            {isOwnProfile && (
              <button
                type="button"
                onClick={onLogout}
                className="rounded-full border border-[#d9d9d9] px-5 py-2 text-sm text-[#343434]"
              >
                Sair
              </button>
            )}
          </div>

          <section className="w-full overflow-hidden rounded-[32px] bg-white shadow-sm">
            <div className="h-52 w-full">
              <img
                src="/images/campus-cefet.png"
                alt="Campus CEFET"
                className="h-full w-full object-cover"
              />
            </div>

          <div className="px-12 py-12">
            <div className="grid grid-cols-[340px_1fr] items-start gap-12">
              <div>
                <ProfileAvatar src={imageUrl} name={user?.nomeUsuario} />

                <div className="mt-7 grid grid-cols-2 gap-3 text-center">
                  <div className="rounded-2xl bg-[#f1f1f1] px-3 py-4">
                    <p className="text-2xl font-bold text-[#089464]">{userPosts.length}</p>
                    <p className="text-xs text-[#343434]">Posts</p>
                  </div>

                  <div className="rounded-2xl bg-[#f1f1f1] px-3 py-4">
                    <p className="text-2xl font-bold text-[#0291db]">
                      {communities.length}
                    </p>
                    <p className="text-xs text-[#343434]">Comunidades</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-[42px] font-bold leading-tight text-[#202020]">
                  {user?.nomeUsuario || "Usuário"}
                </h2>

                <p className="mt-2 text-base text-[#343434]">
                  {user?.email}
                </p>

                <div className="mt-8">
                  <h3 className="mb-3 text-lg font-semibold text-[#202020]">
                    Descrição acadêmica
                  </h3>

                  <p className="min-h-28 max-w-3xl rounded-2xl bg-[#f1f1f1] px-5 py-4 text-sm leading-relaxed text-[#343434]">
                    {user?.biografia?.trim()
                      ? user.biografia
                      : "Adicione uma descrição acadêmica no seu perfil, como curso, período, interesses, projetos e áreas que você acompanha."}
                  </p>
                </div>

                {isOwnProfile && (
                  <button
                    type="button"
                    onClick={onEditProfile}
                    className="mt-8 h-11 w-56 rounded-full bg-[#089464] text-sm font-semibold text-white"
                  >
                    Editar perfil
                  </button>
                )}
                <ProfileCommunities
                  communities={communities}
                  showAll={showAllCommunities}
                  onToggle={onToggleCommunities}
                  onOpenCommunity={onOpenCommunity}
                />
              </div>
            </div>
            </div>
            <div className="mt-10 border-t border-[#eeeeee] px-12 pt-8">
              <div className="mx-auto max-w-[680px]">
                <h3 className="mb-4 text-xl font-bold text-[#202020]">
                  Posts publicados
                </h3>

                {userPosts.length > 0 ? (
                  <div className="space-y-5">
                    {userPosts.map((post) => (
                      <PostCard
                        key={post.idPost}
                        post={post}
                        currentUser={currentUser}
                        onPostDeleted={onPostDeleted}
                        onPostUpdated={onPostUpdated}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="rounded-2xl bg-[#f1f1f1] px-5 py-4 text-sm text-[#777]">
                    {isOwnProfile
                      ? "Você ainda não publicou nenhum post."
                      : "Este usuário ainda não publicou nenhum post."}
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
    </div>
  );
}
