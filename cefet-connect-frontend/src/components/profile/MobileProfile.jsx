import BrandLogo from "../auth/BrandLogo";
import ProfileAvatar from "./ProfileAvatar";

export default function MobileProfile({
  user,
  imageUrl,
  onEditProfile,
  onLogout,
}) {
  return (
    <div className="min-h-screen bg-[#f1f1f1] text-[#202020] lg:hidden">
      <header className="flex h-[60px] items-center justify-between bg-white px-5">
        <BrandLogo className="h-9 w-auto object-contain" />

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

          <button
            type="button"
            onClick={onLogout}
            className="rounded-full border border-[#d9d9d9] px-4 py-1.5 text-xs text-[#343434]"
          >
            Sair
          </button>
        </div>

        <section className="overflow-hidden rounded-[32px] bg-white pb-8 shadow-sm">
          <div className="h-36 w-full">
            <img
              src="../../../public/images/campus-cefet.png"
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
              <p className="text-2xl font-bold text-[#089464]">0</p>
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

          <button
            type="button"
            onClick={onEditProfile}
            className="mt-8 h-11 w-full rounded-full bg-[#089464] text-sm font-semibold text-white"
          >
            Editar perfil
          </button>
        </div>
        </section>
      </main>
    </div>
  );
}
