import BrandLogo from "../auth/BrandLogo";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";

export default function MobileFeed({
  user,
  userImageUrl,
  posts,
  isLoading,
  error,
  isCreating,
  onCreatePost,
  onPostDeleted,
  onPostUpdated,
  onGoToProfile,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-[#f1f1f1] pb-24 text-[#202020] lg:hidden">
      <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between bg-white px-5 shadow-sm">
        <BrandLogo className="h-9 w-auto object-contain" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGoToProfile}
            className="rounded-full bg-[#089464] px-4 py-1.5 text-xs font-semibold text-white"
          >
            Perfil
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-500"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="px-3 pt-5">
        <div className="mb-6">
          <h1 className="text-[32px] font-bold text-[#202020]">
            Feed
          </h1>

          <p className="mt-1 text-sm text-[#666]">
            Acompanhe as novidades do Cefet.
          </p>
        </div>

        <div className="space-y-5">
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
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-[#e3e3e3] bg-white">
        <button type="button" className="text-sm font-semibold text-[#089464]">
          Início
        </button>

        <button type="button" className="text-sm text-[#777]">
          Buscar
        </button>

        <button
          type="button"
          className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#089464] text-3xl font-light text-white shadow-lg"
        >
          +
        </button>

        <button type="button" className="text-sm text-[#777]">
          Avisos
        </button>

        <button
          type="button"
          onClick={onGoToProfile}
          className="text-sm text-[#777]"
        >
          Perfil
        </button>
      </nav>
    </div>
  );
}