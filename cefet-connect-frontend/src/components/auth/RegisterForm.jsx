import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import PasswordInput from "./PasswordInput";
import AuthButton from "./AuthButton";

export default function RegisterForm({ onGoToLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registration: "",
    password: "",
    dataNascimento: "",
    aceitouTermos: false,
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    registration: "",
    password: "",
    dataNascimento: "",
    aceitouTermos: "",
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
    if (!dataNascimento) return "A data de nascimento é obrigatória.";
    const nascimento = new Date(dataNascimento);
    if (isNaN(nascimento.getTime())) return "Data de nascimento inválida.";
    const hoje = new Date();
    const dezoitoAnosAtras = new Date(hoje.getFullYear() - 18, hoje.getMonth(), hoje.getDate());
    if (nascimento > dezoitoAnosAtras) return "Você deve ter pelo menos 18 anos para se cadastrar.";
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
      aceitouTermos: "",
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

    if (!formData.aceitouTermos) {
      newErrors.aceitouTermos = "Você deve aceitar os termos de compromisso para se cadastrar.";
    }

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.registration ||
      newErrors.password ||
      newErrors.dataNascimento ||
      newErrors.aceitouTermos
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
        aceitouTermos: formData.aceitouTermos,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <input
          type="date"
          name="dataNascimento"
          value={formData.dataNascimento}
          onChange={handleChange}
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.dataNascimento && (
          <p className="mt-1 text-sm text-red-500">{errors.dataNascimento}</p>
        )}
      </div>

      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          name="aceitouTermos"
          id="aceitouTermos"
          checked={formData.aceitouTermos}
          onChange={handleChange}
          className="mt-0.5 h-4 w-4 accent-[#089464]"
        />
        <label htmlFor="aceitouTermos" className="text-sm text-[#555]">
          Eu li e aceito os termos de compromisso
        </label>
      </div>
      {errors.aceitouTermos && (
        <p className="text-sm text-red-500">{errors.aceitouTermos}</p>
      )}

      {apiError && (
        <p className="text-sm text-red-500">{apiError}</p>
      )}

      <AuthButton
        type="submit"
        disabled={isSubmitting || !formData.aceitouTermos}
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