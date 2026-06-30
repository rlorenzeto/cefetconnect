import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import PasswordInput from "./PasswordInput";
import AuthButton from "./AuthButton";

const MIN_BIRTH_DATE = "1930-01-01";
const TERMOS_URL = "/documentos/termos_de_uso-cefetconnect.pdf";
const POLITICA_URL = "/documentos/politicas_privacidade-cefetconnect.pdf";

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

export default function RegisterForm({ onGoToLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registration: "",
    password: "",
    dataNascimento: "",
    declarouMaioridade: false,
    aceitouTermos: false,
    aceitouPolitica: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    registration: "",
    password: "",
    dataNascimento: "",
    declarouMaioridade: "",
    aceitouTermos: "",
    aceitouPolitica: "",
  });

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validatePassword(password) {
    if (!password) {
      return "A senha é obrigatória.";
    }

    if (password.length < 8) {
      return "A senha deve ter no mínimo 8 caracteres.";
    }

    if (password.length > 25) {
      return "A senha deve ter no máximo 25 caracteres.";
    }

    if (!/[A-Z]/.test(password)) {
      return "A senha deve conter pelo menos uma letra maiúscula.";
    }

    if (!/\d/.test(password)) {
      return "A senha deve conter pelo menos um número.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(password)) {
      return "A senha deve conter pelo menos um caractere especial.";
    }

    return "";
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
  }

  function validateDateOfBirth(dataNascimento) {
    if (!dataNascimento) {
      return "A data de nascimento é obrigatória.";
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      return "Digite uma data de nascimento válida.";
    }

    const [year, month, day] = dataNascimento.split("-").map(Number);

    if (year < 1900) {
      return "Digite uma data de nascimento válida.";
    }

    if (!isRealDate(year, month, day)) {
      return "Digite uma data de nascimento válida.";
    }

    const minDate = new Date(MIN_BIRTH_DATE);
    const birthDate = new Date(year, month - 1, day);
    const maxDate = new Date(getMaxBirthDate());

    if (birthDate < minDate) {
      return "Digite uma data de nascimento válida.";
    }

    if (birthDate > maxDate) {
      return "Você deve ter pelo menos 18 anos para se cadastrar.";
    }

    const age = getAgeFromDateInput(dataNascimento);

    if (age > 120) {
      return "Digite uma data de nascimento válida.";
    }

    return "";
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    //return /^[^\s@]+@aluno\.cefetmg\.br$/i.test(email.trim());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      registration: "",
      password: "",
      dataNascimento: "",
      declarouMaioridade: "",
      aceitouTermos: "",
      aceitouPolitica: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    }

    /*if (!formData.email.trim()) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Digite um e-mail válido.";
    }*/

    if (!formData.email.trim()) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Digite um e-mail válido.";
    }

    const registration = formData.registration.trim();
    const password = formData.password.trim();


    if (!registration) {
      newErrors.registration = "A matrícula é obrigatória.";
    } else if (!/^\d+$/.test(registration)) {
      newErrors.registration = "A matrícula deve conter apenas números.";
    } else if (!/^\d{7}$|^\d{11}$/.test(registration)) {
      newErrors.registration = "A matrícula deve ter exatamente 7 ou 11 dígitos.";
    }

    newErrors.password = validatePassword(password);
    newErrors.dataNascimento = validateDateOfBirth(formData.dataNascimento);

    if (!formData.declarouMaioridade) {
      newErrors.declarouMaioridade =
        "Você precisa declarar que possui 18 anos ou mais.";
    }

    if (!formData.aceitouTermos) {
      newErrors.aceitouTermos =
        "Você precisa aceitar os Termos de Uso para se cadastrar.";
    }

    if (!formData.aceitouPolitica) {
      newErrors.aceitouPolitica =
        "Você precisa concordar com a Política de Privacidade para se cadastrar.";
    }

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.registration ||
      newErrors.password ||
      newErrors.dataNascimento ||
      newErrors.declarouMaioridade ||
      newErrors.aceitouTermos ||
      newErrors.aceitouPolitica
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const response = await registerUser({
        matricula: formData.registration,
        nomeUsuario: formData.name,
        email: formData.email,
        senha: password,
        dataNascimento: formData.dataNascimento,
        aceitouTermos:
          formData.declarouMaioridade &&
          formData.aceitouTermos &&
          formData.aceitouPolitica,
      });

      console.log("Resposta cadastro:", response);

      const pendingVerification = {
        idUsuario: response?.dados?.idUsuario,
        email: response?.dados?.email || formData.email,
      };

      localStorage.setItem(
        "cefetconnect_pending_verification",
        JSON.stringify(pendingVerification)
      );

      navigate("/confirm-email", {
        state: pendingVerification,
      });
    } catch (error) {
      setApiError(error.message || "Não foi possível criar a conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const dateError = validateDateOfBirth(formData.dataNascimento);

  const canSubmit =
    formData.name.trim() &&
    formData.email.trim() &&
    formData.registration.trim() &&
    formData.password.trim() &&
    formData.dataNascimento &&
    !dateError &&
    formData.aceitouTermos &&
    !isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Digite seu nome"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu e-mail"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          name="registration"
          value={formData.registration}
          onChange={handleChange}
          placeholder="Digite sua matrícula"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.registration && (
          <p className="mt-1 text-sm text-red-500">{errors.registration}</p>
        )}
      </div>

      <div>
        <PasswordInput
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#555]">
          Data de nascimento
        </label>

        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          min={MIN_BIRTH_DATE}
          max={getMaxBirthDate()}
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />

        {errors.dataNascimento && (
          <p className="mt-1 text-sm text-red-500">{errors.dataNascimento}</p>
        )}
      </div>
      <div className="space-y-3 rounded-xl border border-[#d7d7d7] bg-white/70 p-3">
        <label className="flex items-start gap-2 text-sm leading-relaxed text-[#555]">
          <input
            type="checkbox"
            name="declarouMaioridade"
            checked={formData.declarouMaioridade}
            onChange={handleChange}
            className="mt-1 h-4 w-4 shrink-0 accent-[#089464]"
          />
          <span>Declaro que tenho 18 anos ou mais.</span>
        </label>

        {errors.declarouMaioridade && (
          <p className="text-sm text-red-500">{errors.declarouMaioridade}</p>
        )}

        <label className="flex items-start gap-2 text-sm leading-relaxed text-[#555]">
          <input
            type="checkbox"
            name="aceitouTermos"
            checked={formData.aceitouTermos}
            onChange={handleChange}
            className="mt-1 h-4 w-4 shrink-0 accent-[#089464]"
          />
          <span>
            Li e aceito os{" "}
            <a
              href={TERMOS_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#089464] underline"
            >
              Termos de Uso
            </a>
            .
          </span>
        </label>

        {errors.aceitouTermos && (
          <p className="text-sm text-red-500">{errors.aceitouTermos}</p>
        )}

        <label className="flex items-start gap-2 text-sm leading-relaxed text-[#555]">
          <input
            type="checkbox"
            name="aceitouPolitica"
            checked={formData.aceitouPolitica}
            onChange={handleChange}
            className="mt-1 h-4 w-4 shrink-0 accent-[#089464]"
          />
          <span>
            Li e concordo com a{" "}
            <a
              href={POLITICA_URL}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-[#089464] underline"
            >
              Política de Privacidade
            </a>
            .
          </span>
        </label>

        {errors.aceitouPolitica && (
          <p className="text-sm text-red-500">{errors.aceitouPolitica}</p>
        )}
      </div>

      {apiError && (
        <p className="text-sm text-red-500">{apiError}</p>
      )}

      <AuthButton
        type="submit"
        disabled={!canSubmit}
        className="mt-7"
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </AuthButton>

      <p className="mt-4 text-center text-sm text-[#777]">
        Já possui uma conta?{" "}
        <button
          type="button"
          onClick={onGoToLogin}
          className="font-semibold text-[#089464] underline-offset-2 hover:underline"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}