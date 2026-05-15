import ProfileSidebar from "../profile/ProfileSidebar";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";

export default function DesktopFeed({
  user,
  userImageUrl,
  posts,
  isLoading,
  error,
  isCreating,
  onCreatePost,
  onPostDeleted,
  onPostUpdated,
  onLogout,
}) {
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
      <div className="flex min-h-screen w-full bg-[#f1f1f1]">
        <ProfileSidebar activePage="home" />

        <main className="flex-1 px-12 py-10">
          <div className="mx-auto grid max-w-[1120px] grid-cols-[minmax(0,680px)_320px] justify-center gap-8">
            <section>
              <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-[42px] font-bold text-[#202020]">
                    Feed
                  </h1>

                  <p className="mt-2 text-sm text-[#666]">
                    Veja publicações, dúvidas, oportunidades e avisos da comunidade Cefet.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-red-500 shadow-sm transition hover:bg-red-50"
                >
                  Sair
                </button>
              </div>

              <div className="space-y-6">
                <CreatePostCard
                  user={user}
                  userImageUrl={userImageUrl}
                  onCreatePost={onCreatePost}
                  isCreating={isCreating}
                />

                {error && (
                  <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">
                    {error}
                  </div>
                )}

                {isLoading ? (
                  <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                    Carregando posts...
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.idPost}
                      post={post}
                      currentUser={user}
                      onPostDeleted={onPostDeleted}
                      onPostUpdated={onPostUpdated}
                    />
                  ))
                )}

                {!isLoading && posts.length === 0 && (
                  <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                    Nenhum post publicado ainda.
                  </div>
                )}
              </div>
            </section>

            <aside className="space-y-5">
              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-[#202020]">
                  Próximos eventos
                </h2>

                <div className="mt-4 space-y-3 text-sm text-[#343434]">
                  <p className="rounded-2xl bg-[#f1f1f1] p-3">
                    Semana acadêmica de Computação
                  </p>

                  <p className="rounded-2xl bg-[#f1f1f1] p-3">
                    Workshop de Currículo e LinkedIn
                  </p>
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-[#202020]">
                  Comunidades em destaque
                </h2>

                <div className="mt-4 space-y-3 text-sm text-[#343434]">
                  <p className="rounded-2xl bg-[#f1f1f1] p-3">
                    Programação
                  </p>

                  <p className="rounded-2xl bg-[#f1f1f1] p-3">
                    Monitorias
                  </p>

                  <p className="rounded-2xl bg-[#f1f1f1] p-3">
                    Estágios
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}