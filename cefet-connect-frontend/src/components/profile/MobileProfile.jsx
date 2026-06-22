import BrandLogo from "../auth/BrandLogo";
import { BackIcon } from "../icons/AppIcons";
import ProfileAvatar from "./ProfileAvatar";
import PostCard from "../feed/PostCard";
import MobileBottomNav from "../common/MobileBottomNav";
import ProfileCommunities from "./ProfileCommunities";
import ProfilePins from "../pin/ProfilePins";
import ProfileAcademicIcons from "./ProfileAcademicIcons";
import GradMentIntegrationCard from "./GradMentIntegrationCard";

export default function MobileProfile({
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
  pins = [],
  onRefreshPins,
  onRemovePin,
  icones = [],
  isRefreshingIcones = false,
  onRefreshIcones,
  onConnectGradMent,
  onDisconnectGradMent,
}) {
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f1f1f1] text-[#202020] lg:hidden">
      <header className="flex h-[60px] items-center justify-between bg-white px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoBack}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1f1f1] text-[#343434] transition hover:bg-[#e8f7ef] hover:text-[#089464]"
            aria-label="Voltar para o feed"
            title="Voltar para o feed"
          >
            <BackIcon className="h-5 w-5" />
          </button>

          <BrandLogo className="h-9 w-auto object-contain" />
        </div>

        <button className="flex flex-col gap-1" type="button" aria-label="Menu">
          <span className="h-0.5 w-6 bg-[#343434]" />
          <span className="h-0.5 w-6 bg-[#343434]" />
          <span className="h-0.5 w-6 bg-[#343434]" />
        </button>
      </header>

      <main className="w-full max-w-full overflow-x-hidden px-4 pt-6">
        <div className="mb-7 flex items-center justify-between">
          <h1 className="text-[32px] font-bold text-[#202020]">
            Perfil
          </h1>

          {isOwnProfile && (
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-[#d9d9d9] px-4 py-1.5 text-xs text-[#343434]"
            >
              Sair
            </button>
          )}
        </div>

        <section className="max-w-full overflow-hidden rounded-[32px] bg-white pb-8 shadow-sm">
          <div className="h-36 w-full">
            <img
              src="/images/campus-cefet.png"
              alt="Campus CEFET"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="-mt-12 min-w-0 max-w-full overflow-hidden px-5">
            <ProfileAvatar src={imageUrl} name={user?.nomeUsuario} size="small" />

            <h2 className="mt-6 max-w-full break-words text-center text-[30px] font-bold leading-tight text-[#202020] [overflow-wrap:anywhere]">
              {user?.nomeUsuario || "Usuário"}
            </h2>

            <p className="mt-2 break-all text-center text-sm text-[#343434]">
              {user?.email}
            </p>

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

          <div className="mt-7">
            <h3 className="mb-3 text-lg font-semibold text-[#202020]">
              Descrição acadêmica
            </h3>

            <p className="min-h-28 whitespace-pre-line break-words rounded-2xl bg-[#f1f1f1] px-5 py-4 text-left text-sm leading-relaxed text-[#343434] [overflow-wrap:anywhere]">
              {user?.biografia?.trim()
                ? user.biografia
                : "Adicione uma descrição acadêmica no seu perfil."}
            </p>
          </div>
          <ProfilePins
            pins={pins}
            isOwnProfile={isOwnProfile}
            onRefreshPins={onRefreshPins}
            onRemovePin={onRemovePin}
          />

          <ProfileAcademicIcons
            icones={icones}
            isOwnProfile={isOwnProfile}
            isRefreshing={isRefreshingIcones}
            onRefreshIcones={onRefreshIcones}
          />

          {isOwnProfile && (
          <div className="mt-8 px-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={onEditProfile}
              className="w-full rounded-full bg-[#089464] py-3 text-sm font-semibold text-white transition hover:bg-[#067a52]"
            >
              Editar perfil
            </button>
          </div>
        )}

        {isOwnProfile && (
          <GradMentIntegrationCard 
            token={user?.tokenIntegracao || null}
            onConnect={onConnectGradMent}
            onDisconnect={onDisconnectGradMent}
          />
        )}
          <ProfileCommunities
            communities={communities}
            showAll={showAllCommunities}
            onToggle={onToggleCommunities}
            onOpenCommunity={onOpenCommunity}
          />
          <div className="mt-8 border-t border-[#eeeeee] pt-6">
            <h3 className="mb-4 text-lg font-bold text-[#202020]">
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
              <p className="rounded-2xl bg-[#f1f1f1] px-4 py-3 text-left text-sm text-[#777]">
                {isOwnProfile
                  ? "Você ainda não publicou nenhum post."
                  : "Este usuário ainda não publicou nenhum post."}
              </p>
            )}
          </div>
        </div>
        </section>
      </main>
      <MobileBottomNav activePage="profile" />
    </div>
  );
}
