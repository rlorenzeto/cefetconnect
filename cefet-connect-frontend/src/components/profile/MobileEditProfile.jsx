import BrandLogo from "../auth/BrandLogo";
import PasswordInput from "../auth/PasswordInput";
import ProfileAvatar from "./ProfileAvatar";

export default function MobileEditProfile({
  user,
  currentPhotoUrl,
  profileForm,
  emailForm,
  passwordForm,
  profileError,
  emailError,
  passwordError,
  profileMessage,
  emailMessage,
  isSavingProfile,
  isSavingEmail,
  isSavingPassword,
  onBack,
  onProfileChange,
  onEmailChange,
  onPasswordChange,
  onPhotoChange,
  onSaveProfile,
  onSaveEmail,
  onSavePassword,
  onOpenDelete,
  onConfirmEmail,
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
          <button
            type="button"
            onClick={onBack}
            className="text-3xl leading-none text-[#343434]"
          >
            ‹
          </button>

          <h1 className="text-[28px] font-bold text-[#202020]">
            Editar perfil
          </h1>

          <div className="w-6" />
        </div>

        <div className="mb-6 overflow-hidden rounded-[28px] bg-white shadow-sm">
          <img
            src="../../../public/images/campus-cefet.png"
            alt="Campus CEFET"
            className="h-36 w-full object-cover"
          />
        </div>
        <section className="rounded-[32px] bg-white px-5 py-7 shadow-sm">
          <form onSubmit={onSaveProfile}>
            <ProfileAvatar src={currentPhotoUrl} name={user?.nomeUsuario} size="small" />

            <div className="mt-5 text-center">
              <label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-[#089464] px-6 text-sm font-semibold text-white">
                Alterar imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="mt-7 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-[#343434]">
                  Nome
                </label>
                <input
                  type="text"
                  name="nomeUsuario"
                  value={profileForm.nomeUsuario}
                  onChange={onProfileChange}
                  className="h-11 w-full rounded-md border border-[#d9d9d9] bg-[#f1f1f1] px-3 text-sm outline-none"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-[#343434]">
                  Descrição acadêmica
                </label>
                <textarea
                  name="biografia"
                  value={profileForm.biografia}
                  onChange={onProfileChange}
                  rows={5}
                  placeholder="Fale sobre seu curso, período e interesses..."
                  className="w-full resize-none rounded-md border border-[#d9d9d9] bg-[#f1f1f1] px-3 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {profileError && (
              <p className="mt-3 text-sm text-red-500">{profileError}</p>
            )}

            {profileMessage && (
              <p className="mt-3 text-sm text-[#089464]">{profileMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSavingProfile}
              className="mt-7 h-11 w-full rounded-full bg-[#089464] text-sm font-semibold text-white disabled:opacity-70"
            >
              {isSavingProfile ? "Salvando..." : "Salvar perfil"}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-[28px] bg-white px-5 py-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#202020]">
            Alterar e-mail
          </h2>

          <form onSubmit={onSaveEmail} className="space-y-4">
            <input
              type="email"
              name="novoEmail"
              value={emailForm.novoEmail}
              onChange={onEmailChange}
              placeholder="Novo e-mail"
              className="h-11 w-full rounded-md border border-[#d9d9d9] bg-[#f1f1f1] px-3 text-sm outline-none"
            />

            <PasswordInput
              name="senha"
              value={emailForm.senha}
              onChange={onEmailChange}
              placeholder="Senha atual"
              autoComplete="current-password"
            />

            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            {emailMessage && (
              <p className="text-sm leading-relaxed text-[#089464]">
                {emailMessage}{" "}
                <button
                  type="button"
                  onClick={onConfirmEmail}
                  className="font-semibold underline"
                >
                  Clique aqui para confirmar seu e-mail.
                </button>
                <br />
                <span className="text-xs text-[#666]">
                  Use o código enviado para o novo e-mail. Se o código não funcionar,
                  solicite o reenvio na tela de confirmação.
                </span>
              </p>
            )}
            <button
              type="submit"
              disabled={isSavingEmail}
              className="h-10 w-full rounded-full border border-[#089464] text-sm font-semibold text-[#089464] disabled:opacity-70"
            >
              {isSavingEmail ? "Salvando..." : "Alterar e-mail"}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-[28px] bg-white px-5 py-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#202020]">
            Alterar senha
          </h2>

          <form onSubmit={onSavePassword} className="space-y-4">
            <PasswordInput
              name="senhaAtual"
              value={passwordForm.senhaAtual}
              onChange={onPasswordChange}
              placeholder="Senha atual"
              autoComplete="current-password"
            />

            <PasswordInput
              name="novaSenha"
              value={passwordForm.novaSenha}
              onChange={onPasswordChange}
              placeholder="Nova senha"
              autoComplete="new-password"
            />

            <PasswordInput
              name="confirmarNovaSenha"
              value={passwordForm.confirmarNovaSenha}
              onChange={onPasswordChange}
              placeholder="Confirmar nova senha"
              autoComplete="new-password"
            />

            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}

            <button
              type="submit"
              disabled={isSavingPassword}
              className="h-10 w-full rounded-full bg-[#089464] text-sm font-semibold text-white disabled:opacity-70"
            >
              {isSavingPassword ? "Alterando..." : "Alterar senha"}
            </button>
          </form>
        </section>

        <section className="mt-6 rounded-[28px] bg-white px-5 py-6 shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-[#202020]">
            Excluir conta
          </h2>

          <p className="mb-5 text-sm leading-relaxed text-[#343434]">
            Ao excluir sua conta, seus dados de acesso serão removidos.
          </p>

          <button
            type="button"
            onClick={onOpenDelete}
            className="h-10 w-full rounded-full bg-[#f82b2b] text-sm font-semibold text-white"
          >
            Excluir minha conta
          </button>
        </section>
      </main>
    </div>
  );
}