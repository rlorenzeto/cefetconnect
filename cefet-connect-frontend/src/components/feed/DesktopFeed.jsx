import ProfileSidebar from "../profile/ProfileSidebar";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";

const GRADMENT_URL = "https://gradment.com.br"; //MUDAR COM A UTL DO GRADMENT, VER COM OS MENINOS


export default function DesktopFeed({
  user,
  userImageUrl,
  posts,
  communities = [],
  events = [],
  isLoading,
  error,
  isCreating,
  onCreatePost,
  onPostDeleted,
  onPostUpdated,
  onLogout,
  onOpenEvents,
  onOpenEventDetails,
}) {
  
  function formatEventDate(date) {
    if (!date) return "";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

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
                  communities={communities}
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
              <section className="overflow-hidden rounded-[8px] bg-white shadow-sm">
                <div className="flex h-[54px] items-center justify-center border-b border-[#d9d9d9]">
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/gradment-logo.svg"
                      alt="GradMent"
                      className="h-7 w-auto object-contain"
                    />

                    <span className="text-[22px] font-extrabold text-[#39b02f]">
                      GradMent
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4 text-center">
                  <h2 className="text-[21px] font-extrabold leading-tight text-[#39b02f]">
                    A sua jornada acadêmica começa Aqui
                  </h2>

                  <button
                    type="button"
                    onClick={() => window.open(GRADMENT_URL, "_blank", "noreferrer")}
                    className="mt-4 h-10 rounded-[9px] bg-[#3dae21] px-5 text-[16px] font-extrabold text-white transition hover:bg-[#319219]"
                  >
                    conheça !
                  </button>
                </div>
              </section>
              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-[#202020]">
                    Próximos eventos
                  </h2>

                  <button
                    type="button"
                    onClick={onOpenEvents}
                    className="text-xs font-bold text-[#089464] hover:underline"
                  >
                    Ver todos
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-sm text-[#343434]">
                  {events.slice(0, 3).map((event) => (
                    <button
                      key={event.idEvento}
                      type="button"
                      onClick={() => onOpenEventDetails(event)}
                      className="block w-full rounded-2xl bg-[#f1f1f1] p-3 text-left transition hover:bg-[#e8f7ef]"
                    >
                      <p className="truncate font-semibold text-[#202020]">
                        {event.titulo}
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold text-[#089464]">
                        {formatEventDate(event.dataEvento)}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#777]">
                        {event?.comunidade?.nomeComunidade || "Evento público"}
                      </p>
                    </button>
                  ))}

                  {events.length === 0 && (
                    <p className="rounded-2xl bg-[#f1f1f1] p-3 text-sm text-[#777]">
                      Nenhum evento disponível.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-[#202020]">
                    Minhas comunidades
                  </h2>

                  <button
                    type="button"
                    onClick={() => window.location.assign("/comunidades")}
                    className="text-xs font-bold text-[#089464] hover:underline"
                  >
                    Ver todas
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-sm text-[#343434]">
                  {communities.slice(0, 3).map((community) => (
                    <button
                      key={community.idComunidade}
                      type="button"
                      onClick={() =>
                        window.location.assign(`/comunidades/${community.idComunidade}`)
                      }
                      className="block w-full rounded-2xl bg-[#f1f1f1] p-3 text-left transition hover:bg-[#e8f7ef]"
                    >
                      <p className="truncate font-semibold text-[#202020]">
                        {community.nomeComunidade}
                      </p>

                      <p className="mt-1 text-xs text-[#777]">
                        {Number(community.totalMembros || 0)} membros
                      </p>
                    </button>
                  ))}

                  {communities.length === 0 && (
                    <p className="rounded-2xl bg-[#f1f1f1] p-3 text-sm text-[#777]">
                      Você ainda não participa de comunidades.
                    </p>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}