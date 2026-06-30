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
import { getRankingCompleto } from "../../services/rankingService";
import RankingModal from "../../components/ranking/RankingModal";

const MIN_BIRTH_DATE = "1930-01-01";
const MAX_AGE = 100;

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMaxBirthDate() {
  const today = new Date();

  const eighteenYearsAgo = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  );

  return formatDateInput(eighteenYearsAgo);
}

function isRealDate(year, month, day) {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

function getAgeFromDateInput(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  const today = new Date();
  let age = today.getFullYear() - year;

  const birthdayAlreadyHappened =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day);

  if (!birthdayAlreadyHappened) {
    age -= 1;
  }

  return age;
}

function validateDateOfBirth(dataNascimento) {
  if (!dataNascimento) {
    return "A data de nascimento é obrigatória.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
    return "Digite uma data de nascimento válida.";
  }

  const [year, month, day] = dataNascimento.split("-").map(Number);

  if (!year || !month || !day) {
    return "Digite uma data de nascimento válida.";
  }

  if (year < 1930) {
    return "Digite uma data de nascimento válida.";
  }

  if (!isRealDate(year, month, day)) {
    return "Digite uma data de nascimento válida.";
  }

  const birthDate = new Date(year, month - 1, day);
  const minDate = new Date(MIN_BIRTH_DATE);
  const maxDate = new Date(getMaxBirthDate());

  if (birthDate < minDate) {
    return "Digite uma data de nascimento válida.";
  }

  if (birthDate > maxDate) {
    return "Você deve ter pelo menos 18 anos.";
  }

  const age = getAgeFromDateInput(dataNascimento);

  if (age === null || age > MAX_AGE) {
    return "Digite uma data de nascimento válida.";
  }

  return "";
}

export default function EditProfilePage() {
  const PROFILE_NAME_MAX = 80;
  const PROFILE_BIO_MAX = 300;
  const PROFILE_MATRICULA_MAX = 11;
  const navigate = useNavigate();
  const savedUser = getCurrentUser();

  const [user, setUser] = useState(savedUser);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoFile, setPhotoFile] = useState(null);

  const [profileForm, setProfileForm] = useState({
    nomeUsuario: "",
    matricula: "",
    biografia: "",
    dataNascimento: "",
    aceitouTermos: false,
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
  const [rankingCompleto, setRankingCompleto] = useState([]);
  const [isRankingModalOpen, setIsRankingModalOpen] = useState(false);
  const [isRankingLoading, setIsRankingLoading] = useState(false);

  const idUsuario = savedUser?.idUsuario || user?.idUsuario;

  const currentPhotoUrl = useMemo(() => {
    if (photoPreview) return photoPreview;
    return getProfileImageUrl(user?.fotoUrl);
  }, [photoPreview, user?.fotoUrl]);

  useEffect(() => {
    async function loadProfile() {
      if (!idUsuario) {
        navigate("/login");
        return;
      }

      try {
        const response = await getUserProfile(idUsuario);
        const profile = response?.dados || response;

        setUser(profile);

        setProfileForm({
          nomeUsuario: profile?.nomeUsuario || "",
          matricula: profile?.matricula || "",
          biografia: profile?.biografia || "",
          dataNascimento: profile?.dataNascimento || "",
          aceitouTermos: Boolean(profile?.aceitouTermos),
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
  }, [idUsuario, navigate]);

  function handleProfileChange(event) {
    const { name, value, type, checked } = event.target;

    const fieldValue = type === "checkbox" ? checked : value;

    const limits = {
      nomeUsuario: PROFILE_NAME_MAX,
      biografia: PROFILE_BIO_MAX,
      matricula: PROFILE_MATRICULA_MAX,
    };

    const limit = limits[name];

    const limitedValue =
      typeof fieldValue === "string" && limit
        ? fieldValue.slice(0, limit)
        : fieldValue;

    setProfileForm((prev) => ({
      ...prev,
      [name]: limitedValue,
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

    const matricula = profileForm.matricula.trim();

    if (!matricula) {
      setProfileError("A matrícula é obrigatória.");
      return;
    }

    if (!/^\d+$/.test(matricula)) {
      setProfileError("A matrícula deve conter apenas números.");
      return;
    }

    if (!/^\d{7}$|^\d{11}$/.test(matricula)) {
      setProfileError("A matrícula deve ter exatamente 7 ou 11 dígitos.");
      return;
    }

    const dateError = validateDateOfBirth(profileForm.dataNascimento);

    if (dateError) {
      setProfileError(dateError);
      return;
    }

    if (!profileForm.aceitouTermos) {
      setProfileError(
        "Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar."
      );
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileError("");
      setProfileMessage("");

      const response = await updateUserProfile(idUsuario, {
        nomeUsuario: profileForm.nomeUsuario,
        matricula,
        biografia: profileForm.biografia,
        dataNascimento: profileForm.dataNascimento,
        aceitouTermos: profileForm.aceitouTermos,
        fotoUrl: photoFile,
      });

      const updatedProfile = response?.dados || response;

      const normalizedUser = {
        ...user,
        ...updatedProfile,
        idUsuario: updatedProfile?.idUsuario || user?.idUsuario || idUsuario,
        matricula: updatedProfile?.matricula || profileForm.matricula,
        dataNascimento:
          updatedProfile?.dataNascimento || profileForm.dataNascimento,
        aceitouTermos:
          updatedProfile?.aceitouTermos !== undefined
            ? Boolean(updatedProfile.aceitouTermos)
            : Boolean(profileForm.aceitouTermos),
      };

      setUser(normalizedUser);
      saveCurrentUser(normalizedUser);
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

        await changeUserEmail(idUsuario, {
        novoEmail: emailForm.novoEmail,
        senha: emailForm.senha,
        });

        const pendingVerification = {
          idUsuario,
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

  function validatePassword(password) {
    if (!password) {
      return "Digite a nova senha.";
    }

    if (password.length < 8) {
      return "A nova senha deve ter no mínimo 8 caracteres.";
    }

    if (password.length > 25) {
      return "A nova senha deve ter no máximo 25 caracteres.";
    }

    if (!/[A-Z]/.test(password)) {
      return "A nova senha deve conter pelo menos uma letra maiúscula.";
    }

    if (!/\d/.test(password)) {
      return "A nova senha deve conter pelo menos um número.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password)) {
      return "A nova senha deve conter pelo menos um caractere especial.";
    }

    return "";
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

    const novaSenha = passwordForm.novaSenha.trim();

    const passwordValidationError = validatePassword(novaSenha);

    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    if (novaSenha !== passwordForm.confirmarNovaSenha.trim()) {
      setPasswordError("As senhas não coincidem.");
      return;
    }

    try {
      setIsSavingPassword(true);
      setPasswordError("");

      await changeUserPassword(idUsuario, {
        senhaAtual: passwordForm.senhaAtual,
        novaSenha,
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

      await deleteUserAccount(idUsuario);

      logoutUser();
      navigate("/login");
    } catch (error) {
      alert(error.message || "Não foi possível excluir a conta.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleOpenFullRanking() {
    try {
      setIsRankingModalOpen(true);
      setIsRankingLoading(true);

      const response = await getRankingCompleto();
      const dados = response?.dados || response;

      setRankingCompleto(Array.isArray(dados) ? dados : []);
    } catch {
      setRankingCompleto([]);
    } finally {
      setIsRankingLoading(false);
    }
  }

  const sharedProps = {
    user,
    currentPhotoUrl,
    profileForm,
    minBirthDate: MIN_BIRTH_DATE,
    maxBirthDate: getMaxBirthDate(),
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
    onOpenFullRanking: handleOpenFullRanking,
  };
  
  return (
    <>
      <DesktopEditProfile {...sharedProps} />
      <MobileEditProfile {...sharedProps} />

      <RankingModal
        isOpen={isRankingModalOpen}
        ranking={rankingCompleto}
        isLoading={isRankingLoading}
        onClose={() => setIsRankingModalOpen(false)}
      />

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