import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccountCard from "../../components/profile/DeleteAccountCard";
import DesktopEditProfile from "../../components/profile/DesktopEditProfile";
import MobileEditProfile from "../../components/profile/MobileEditProfile";
import PasswordChangedCard from "../../components/profile/PasswordChangedCard";
import {
  changeUserEmail,
  changeUserPassword,
  deleteUserAccount,
  getCurrentUser,
  getProfileImageUrl,
  getUserProfile,
  logoutUser,
  saveCurrentUser,
  updateUserProfile,
} from "../../services/authService";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const savedUser = getCurrentUser();

  const [user, setUser] = useState(savedUser);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    nomeUsuario: "",
    biografia: "",
  });

  const [emailForm, setEmailForm] = useState({
    novoEmail: "",
    senha: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isDeleteCardOpen, setIsDeleteCardOpen] = useState(false);
  const [isPasswordCardOpen, setIsPasswordCardOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const matricula = savedUser?.matricula || user?.matricula;

  const currentPhotoUrl = useMemo(() => {
    if (photoPreview) return photoPreview;
    return getProfileImageUrl(user?.fotoUrl);
  }, [photoPreview, user?.fotoUrl]);

  useEffect(() => {
    async function loadProfile() {
      if (!matricula) {
        navigate("/login");
        return;
      }

      try {
        const response = await getUserProfile(matricula);
        const profile = response?.dados || response;

        setUser(profile);

        setProfileForm({
          nomeUsuario: profile?.nomeUsuario || "",
          biografia: profile?.biografia || "",
        });

        setEmailForm((prev) => ({
          ...prev,
          novoEmail: profile?.email || "",
        }));
      } catch (error) {
        setProfileError(error.message || "Não foi possível carregar o perfil.");
      }
    }

    loadProfile();
  }, [matricula, navigate]);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setProfileError("");
    setProfileMessage("");
  }

  function handleEmailChange(event) {
    const { name, value } = event.target;

    setEmailForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setEmailError("");
    setEmailMessage("");
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setPasswordError("");
  }

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setProfileError("");
    setProfileMessage("");
  }

  async function handleSaveProfile(event) {
    event.preventDefault();

    if (!profileForm.nomeUsuario.trim()) {
      setProfileError("O nome é obrigatório.");
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileError("");
      setProfileMessage("");

      const response = await updateUserProfile(matricula, {
        nomeUsuario: profileForm.nomeUsuario,
        biografia: profileForm.biografia,
        fotoUrl: photoFile,
      });

      const updatedUser = response?.dados || response;

      setUser(updatedUser);
      saveCurrentUser(updatedUser);
      setPhotoFile(null);
      setProfileMessage("Perfil atualizado com sucesso.");
    } catch (error) {
      setProfileError(error.message || "Não foi possível atualizar o perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  }

async function handleSaveEmail(event) {
    event.preventDefault();

    if (!emailForm.novoEmail.trim()) {
        setEmailError("O novo e-mail é obrigatório.");
        return;
    }

    if (!emailForm.senha.trim()) {
        setEmailError("Digite sua senha atual para alterar o e-mail.");
        return;
    }

    try {
        setIsSavingEmail(true);
        setEmailError("");
        setEmailMessage("");

        await changeUserEmail(matricula, {
        novoEmail: emailForm.novoEmail,
        senha: emailForm.senha,
        });

        const pendingVerification = {
        matricula,
        email: emailForm.novoEmail,
        };

        localStorage.setItem(
        "cefetconnect_pending_verification",
        JSON.stringify(pendingVerification)
        );

        setEmailMessage(
        "E-mail alterado com sucesso. Verifique seu novo e-mail para ativar a conta."
        );

        setEmailForm((prev) => ({
        ...prev,
        senha: "",
        }));
    } catch (error) {
        setEmailError(error.message || "Não foi possível alterar o e-mail.");
    } finally {
        setIsSavingEmail(false);
    }
}

  async function handleSavePassword(event) {
    event.preventDefault();

    if (!passwordForm.senhaAtual.trim()) {
      setPasswordError("Digite sua senha atual.");
      return;
    }

    if (!passwordForm.novaSenha.trim()) {
      setPasswordError("Digite a nova senha.");
      return;
    }

    if (passwordForm.novaSenha.length < 8) {
      setPasswordError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }

    if (passwordForm.novaSenha !== passwordForm.confirmarNovaSenha) {
      setPasswordError("As senhas não coincidem.");
      return;
    }

    try {
      setIsSavingPassword(true);
      setPasswordError("");

      await changeUserPassword(matricula, {
        senhaAtual: passwordForm.senhaAtual,
        novaSenha: passwordForm.novaSenha,
      });

      setPasswordForm({
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: "",
      });

      setIsPasswordCardOpen(true);
    } catch (error) {
      setPasswordError(error.message || "Não foi possível alterar a senha.");
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleConfirmDelete() {
    try {
      setIsDeleting(true);

      await deleteUserAccount(matricula);

      logoutUser();
      navigate("/login");
    } catch (error) {
      alert(error.message || "Não foi possível excluir a conta.");
    } finally {
      setIsDeleting(false);
    }
  }

  const sharedProps = {
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
    onBack: () => navigate("/profile"),
    onProfileChange: handleProfileChange,
    onEmailChange: handleEmailChange,
    onPasswordChange: handlePasswordChange,
    onPhotoChange: handlePhotoChange,
    onSaveProfile: handleSaveProfile,
    onSaveEmail: handleSaveEmail,
    onSavePassword: handleSavePassword,
    onOpenDelete: () => setIsDeleteCardOpen(true),
    onConfirmEmail: () => navigate("/confirm-email"),
  };
  
  return (
    <>
      <DesktopEditProfile {...sharedProps} />
      <MobileEditProfile {...sharedProps} />

      {isPasswordCardOpen && (
        <PasswordChangedCard onClose={() => setIsPasswordCardOpen(false)} />
      )}

      {isDeleteCardOpen && (
        <DeleteAccountCard
          isDeleting={isDeleting}
          onCancel={() => setIsDeleteCardOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}