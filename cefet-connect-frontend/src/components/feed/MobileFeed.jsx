import { useState } from "react";
import BrandLogo from "../auth/BrandLogo";
import CreatePostCard from "./CreatePostCard";
import PostCard from "./PostCard";
import MobileBottomNav from "../common/MobileBottomNav";
import {
  ChevronDownIcon,
  TrophyIcon,
} from "../icons/AppIcons";
import GlobalCreateMenu from "../common/GlobalCreateMenu";
import SearchBar from "../common/SearchBar";
import RankingCard from "../ranking/RankingCard";

const GRADMENT_URL =
  import.meta.env.VITE_GRADMENT_URL || "https://gradment.linceonline.com.br";

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
  communities = [],
  searchTerm = "",
  onSearchChange,
  onGoToProfile,
  onLogout,
  onCreatePostShortcut,
  onCreateCommunityShortcut,
  onCreateEventShortcut,
  rankingPreview = [],
  onOpenFullRanking,
  onRankingChanged,
  hasMorePosts = false,
  isLoadingMorePosts = false,
  onLoadMorePosts,
}) {
  const [isGradmentMenuOpen, setIsGradmentMenuOpen] = useState(false);
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f1f1f1] pb-24 text-[#202020] lg:hidden">
      <header className="sticky top-0 z-20 flex h-[60px] items-center justify-between bg-white px-5 shadow-sm">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsGradmentMenuOpen((prev) => !prev)}
            className="flex items-center gap-2"
            aria-label="Abrir opções do Cefet Connect"
            aria-expanded={isGradmentMenuOpen}
          >
            <BrandLogo className="h-9 w-auto object-contain" />

            <ChevronDownIcon
              open={isGradmentMenuOpen}
              className="h-4 w-4 text-[#111827]"
            />
          </button>

          {isGradmentMenuOpen && (
            <div className="absolute left-0 top-12 z-40 w-[216px] overflow-hidden rounded-b-md border border-[#d3d3d3] bg-white shadow-lg">

              <a
                href={GRADMENT_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsGradmentMenuOpen(false)}
                className="flex h-8 w-full items-center border-t border-[#d3d3d3] px-3 text-left transition hover:bg-[#f1f1f1]"
              >
                <span className="flex items-center gap-2">
                  <img
                    src="/images/gradment-logo.svg"
                    alt="GradMent"
                    className="h-5 w-auto object-contain"
                  />

                  <span className="text-sm font-extrabold text-[#39b02f]">
                    GradMent
                  </span>
                </span>
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-5 text-[#0f172a]">
          <button
            type="button"
            onClick={onOpenFullRanking}
            className="transition hover:text-[#089464]"
            aria-label="Ranking"
            title="Ranking"
          >
            <TrophyIcon className="h-6 w-6" />
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

      <main className="w-full max-w-full overflow-x-hidden px-3 pt-5">
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Pesquisar ..."
          className="mb-3"
        />

        <section className="mb-4 overflow-hidden rounded-[8px] bg-white shadow-sm">
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

          <div className="px-5 py-5 text-center">
            <h2 className="text-[24px] font-extrabold leading-tight text-[#39b02f]">
              A sua jornada acadêmica começa Aqui
            </h2>

            <a
              href={GRADMENT_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-[9px] bg-[#3dae21] px-6 text-[17px] font-extrabold text-white transition hover:bg-[#319219]"
            >
              conheça !
            </a>
          </div>
        </section>

        <div className="mb-4">
          <RankingCard
            ranking={rankingPreview}
            onOpenFullRanking={onOpenFullRanking}
          />
        </div>

        <div className="space-y-5">
          <div id="post-composer">
            <CreatePostCard
              user={user}
              userImageUrl={userImageUrl}
              onCreatePost={onCreatePost}
              isCreating={isCreating}
              communities={communities}
            />
          </div>

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
          {!isLoading && hasMorePosts && (
            <div className="flex justify-center pt-2 pb-8">
              <button
                type="button"
                onClick={onLoadMorePosts}
                disabled={isLoadingMorePosts}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-[#089464] shadow-sm transition hover:bg-[#e8f7ef] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMorePosts ? "Carregando..." : "Ver mais posts"}
              </button>
            </div>
          )}
        </div>
      </main>
      <MobileBottomNav
        activePage="home"
        onCreatePost={onCreatePostShortcut}
        onCreateCommunity={onCreateCommunityShortcut}
        onCreateEvent={onCreateEventShortcut}
      />
    </div>
  );
}