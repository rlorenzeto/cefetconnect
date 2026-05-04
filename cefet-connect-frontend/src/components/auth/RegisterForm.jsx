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
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    registration: "",
    password: "",
  });

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
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

    if (!formData.registration.trim()) {
      newErrors.registration = "A matrícula é obrigatória.";
    } else if (!/^\d{11}$/.test(formData.registration)) {
      newErrors.registration = "A matrícula deve ter exatamente 11 dígitos.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "A senha é obrigatória.";
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.registration ||
      newErrors.password
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
        senha: formData.password,
      });

      console.log("Resposta cadastro:", response);

      const pendingVerification = {
        matricula: response?.dados?.matricula || formData.registration,
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
          placeholder="Digite seu email"
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

      {apiError && (
        <p className="text-sm text-red-500">{apiError}</p>
      )}

      <AuthButton
        type="submit"
        disabled={isSubmitting}
        className="mt-7"
      >
        {isSubmitting ? "Cadastrando..." : "Cadastrar"}
      </AuthButton>

      <p className="mt-4 text-center text-sm text-[#777]">
        Já possui conta?{" "}
       <AuthButton
          type="button"
          onClick={onGoToLogin}
          className="mt-4"
        >
          Já tenho uma conta
        </AuthButton>
      </p>
    </form>
  );
}