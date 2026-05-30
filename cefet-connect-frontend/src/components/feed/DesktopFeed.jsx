import { Link } from "react-router-dom";
import ProfileSidebar from "../profile/ProfileSidebar";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";


const GRADMENT_URL =
  import.meta.env.VITE_GRADMENT_URL || "https://gradment.linceonline.com.br";

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
}) {
  function getEventDate(event) {
    const date = new Date(event?.dataEvento);

    return Number.isNaN(date.getTime()) ? null : date;
  }

  function getEventParticipantsTotal(event) {
    return Array.isArray(event?.participantes)
      ? event.participantes.length
      : 0;
  }

  const importantEvents = [...events]
    .filter((event) => {
      const eventDate = getEventDate(event);

      if (!eventDate) return false;

      return eventDate >= new Date();
    })
    .sort((a, b) => {
      const dateA = getEventDate(a);
      const dateB = getEventDate(b);

      const dateDifference = dateA - dateB;

      if (dateDifference !== 0) {
        return dateDifference;
      }

      return getEventParticipantsTotal(b) - getEventParticipantsTotal(a);
    })
    .slice(0, 3);

  const importantCommunities = [...communities]
    .sort(
      (a, b) =>
        Number(b?.totalMembros || 0) - Number(a?.totalMembros || 0)
    )
    .slice(0, 3);
    
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
        <ProfileSidebar activePage="home" />

        <main className="relative flex-1 px-12 py-10">
          <div className="mx-auto grid max-w-[1180px] grid-cols-[minmax(0,680px)_320px] justify-center gap-8">
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

            <aside className="fixed right-12 top-10 w-[320px] max-h-[calc(100vh-5rem)] space-y-5 overflow-y-auto pr-1">
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

                  <a
                    href={GRADMENT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-[9px] bg-[#3dae21] px-5 text-[16px] font-extrabold text-white transition hover:bg-[#319219]"
                  >
                    conheça !
                  </a>
                </div>
              </section>
              <section className="rounded-[28px] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-bold text-[#202020]">
                    Próximos eventos
                  </h2>

                  <Link
                    to="/eventos"
                    className="text-xs font-bold text-[#089464] hover:underline"
                  >
                    Ver todos
                  </Link>
                </div>

                <div className="mt-4 space-y-3 text-sm text-[#343434]">
                  {importantEvents.map((event) => (
                    <Link
                      key={event.idEvento}
                      to="/eventos"
                      className="block w-full rounded-2xl bg-[#f1f1f1] p-3 text-left transition hover:bg-[#e8f7ef]"
                    >
                      <p className="truncate font-semibold text-[#202020]">
                        {event.titulo}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#777]">
                        {event?.comunidade?.nomeComunidade || "Evento público"}
                      </p>
                    </Link>
                  ))}

                  {importantEvents.length === 0 && (
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

                  <Link
                    to="/comunidades"
                    className="text-xs font-bold text-[#089464] hover:underline"
                  >
                    Ver todas
                  </Link>
                </div>

                <div className="mt-4 space-y-3 text-sm text-[#343434]">
                  {importantCommunities.map((community) => (
                    <Link
                      key={community.idComunidade}
                      to={`/comunidades/${community.idComunidade}`}
                      className="block w-full rounded-2xl bg-[#f1f1f1] p-3 text-left transition hover:bg-[#e8f7ef]"
                    >
                      <p className="truncate font-semibold text-[#202020]">
                        {community.nomeComunidade}
                      </p>

                      <p className="mt-1 text-xs text-[#777]">
                        {Number(community.totalMembros || 0)} membros
                      </p>
                    </Link>
                  ))}

                  {importantCommunities.length === 0 && (
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
  );
}