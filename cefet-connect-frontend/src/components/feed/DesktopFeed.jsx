import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ProfileSidebar from "../profile/ProfileSidebar";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";
import SearchBar from "../common/SearchBar";
import RankingCard from "../ranking/RankingCard";


const GRADMENT_URL =
  import.meta.env.VITE_GRADMENT_URL || "https://gradment.linceonline.com.br";

export default function DesktopFeed({
  user,
  userImageUrl,
  posts,
  communities = [],
  events = [],
  searchTerm = "",
  onSearchChange,
  isLoading,
  error,
  isCreating,
  onCreatePost,
  onPostDeleted,
  onPostUpdated,
  onLogout,
  rankingPreview = [],
  onOpenFullRanking,
  onRankingChanged,
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

  const rightSidebarRef = useRef(null);
  const [rightSidebarOffset, setRightSidebarOffset] = useState(0);

  useEffect(() => {
    const TOP_DISTANCE = 40; // equivale ao top-10 do Tailwind
    const BOTTOM_DISTANCE = 24; // folga para não cortar no fim da tela
    let frameId = null;

    function updateSidebarPosition() {
      const sidebar = rightSidebarRef.current;

      if (!sidebar) return;

      const sidebarHeight = sidebar.offsetHeight;
      const visibleHeight = window.innerHeight - TOP_DISTANCE - BOTTOM_DISTANCE;

      const maxOffset = Math.max(0, sidebarHeight - visibleHeight);
      const nextOffset = Math.min(window.scrollY, maxOffset);

      setRightSidebarOffset((currentOffset) =>
        currentOffset === nextOffset ? currentOffset : nextOffset
      );
    }

    function requestUpdate() {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(updateSidebarPosition);
    }

    updateSidebarPosition();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    let resizeObserver = null;

    if (typeof ResizeObserver !== "undefined" && rightSidebarRef.current) {
      resizeObserver = new ResizeObserver(requestUpdate);
      resizeObserver.observe(rightSidebarRef.current);
    }

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);

      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);
    
  return (
    <div className="hidden min-h-screen bg-[#f1f1f1] text-[#202020] lg:block">
        <ProfileSidebar
          activePage="home"
          onOpenFullRanking={onOpenFullRanking}
        />

          <main className="ml-[100px] min-h-screen bg-[#f1f1f1] pb-10 pt-5 pl-8 pr-[460px]">
            <section className="mx-auto w-full max-w-[790px]">
              <div className="mb-4 flex justify-end">
                <button
                  type="button"
                  onClick={onLogout}
                  className="rounded-full bg-white px-5 py-2 text-sm font-bold text-red-500 shadow-sm transition hover:bg-red-50"
                >
                  Sair
                </button>
              </div>

              <SearchBar
                value={searchTerm}
                onChange={onSearchChange}
                placeholder="Pesquisar posts ..."
                className="mb-4"
              />

              <div className="space-y-6">
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
                      onRankingChanged={onRankingChanged}
                    />
                  ))
                )}

                {!isLoading && posts.length === 0 && (
                  <div className="rounded-[28px] bg-white p-6 text-sm text-[#777] shadow-sm">
                    {searchTerm?.trim()
                      ? "Nenhum post encontrado para essa busca."
                      : "Nenhum post publicado ainda."}
                  </div>
                )}
              </div>
            </section>

            <aside className="fixed right-12 top-10 w-[320px] max-h-[calc(100vh-5rem)] space-y-5 overflow-y-auto pr-1">
              <section className="overflow-hidden rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 bg-white px-5 py-3 border-b border-[#e8e8e8]">
                  <img
                    src="/images/gradment-logo.svg"
                    alt="GradMent"
                    className="h-6 w-auto object-contain"
                  />
                  <span className="text-lg font-extrabold text-[#39b02f]">
                    GradMent
                  </span>
                </div>

                <div className="bg-gradient-to-b from-[#f0faf4] to-[#e2f5ea] px-5 py-5 text-center">
                  <h2 className="text-base font-extrabold leading-snug text-[#1a7a3f]">
                    A sua jornada acadêmica começa aqui
                  </h2>

                  <p className="mt-1.5 text-xs text-[#4a7c5f]">
                    Conecte-se à plataforma acadêmica e importe suas disciplinas automaticamente.
                  </p>

                  <a
                    href={GRADMENT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#3dae21] py-2.5 text-sm font-bold text-white transition hover:bg-[#319219]"
                  >
                    Conhecer o GradMent
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
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
        </main>
    </div>
  );
}