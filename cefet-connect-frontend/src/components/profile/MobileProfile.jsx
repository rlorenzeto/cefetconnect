import BrandLogo from "../auth/BrandLogo";
import { BackIcon } from "../icons/AppIcons";
import ProfileAvatar from "./ProfileAvatar";
import PostCard from "../feed/PostCard";

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
}) {
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#202020] lg:hidden">
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

      <main className="px-5 pb-10 pt-8">
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

        <section className="overflow-hidden rounded-[32px] bg-white pb-8 shadow-sm">
          <div className="h-36 w-full">
            <img
              src="/images/campus-cefet.png"
              alt="Campus CEFET"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="-mt-12 px-5">
            <ProfileAvatar src={imageUrl} name={user?.nomeUsuario} size="small" />

          <h2 className="mt-6 text-center text-[30px] font-bold leading-tight text-[#202020]">
            {user?.nomeUsuario || "Usuário"}
          </h2>

          <p className="mt-2 text-center text-sm text-[#343434]">
            {user?.email}
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-2xl bg-[#f1f1f1] px-3 py-4">
              <p className="text-2xl font-bold text-[#089464]">{userPosts.length}</p>
              <p className="text-xs text-[#343434]">Posts</p>
            </div>

            <div className="rounded-2xl bg-[#f1f1f1] px-3 py-4">
              <p className="text-2xl font-bold text-[#0291db]">0</p>
              <p className="text-xs text-[#343434]">Comunidades</p>
            </div>
          </div>

          <div className="mt-7">
            <h3 className="mb-3 text-lg font-semibold text-[#202020]">
              Descrição acadêmica
            </h3>

            <p className="min-h-28 rounded-2xl bg-[#f1f1f1] px-5 py-4 text-left text-sm leading-relaxed text-[#343434]">
              {user?.biografia?.trim()
                ? user.biografia
                : "Adicione uma descrição acadêmica no seu perfil."}
            </p>
          </div>

          {isOwnProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              className="mt-8 h-11 w-full rounded-full bg-[#089464] text-sm font-semibold text-white"
            >
              Editar perfil
            </button>
          )}
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
    </div>
  );
}
