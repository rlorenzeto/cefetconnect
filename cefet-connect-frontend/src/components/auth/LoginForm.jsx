import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import PasswordInput from "./PasswordInput";

export default function LoginForm({ onGoToRegister, onGoToForgotPassword }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    login: "",
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
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      login: "",
      password: "",
    };

    if (!formData.login.trim()) {
      newErrors.login = "O e-mail é obrigatório.";
    } else if (!validateEmail(formData.login)) {
      newErrors.login = "Digite um e-mail válido.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "A senha é obrigatória.";
    }

    if (newErrors.login || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const response = await loginUser({
        login: formData.login,
        password: formData.password,
      });

      console.log("Resposta login:", response);

      navigate("/home");
    } catch (error) {
      setApiError(error.message || "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          name="login"
          value={formData.login}
          onChange={handleChange}
          placeholder="Digite seu e-mail"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.login && (
          <p className="mt-1 text-sm text-red-500">{errors.login}</p>
        )}
      </div>

      <div>
        <PasswordInput
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          autoComplete="current-password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      {apiError && (
        <p className="text-sm text-red-500">{apiError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 h-12 w-full rounded-full bg-[#8ad142] text-sm font-semibold text-white disabled:opacity-70"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>

      <button
        type="button"
        onClick={onGoToForgotPassword}
        className="mt-6 block w-full text-center text-sm text-[#666]"
      >
        Esqueceu a senha ?
     </button>

      <button
        type="button"
        onClick={onGoToRegister}
        className="mt-8 h-11 w-full rounded-full border border-[#8ad142] bg-transparent text-sm font-medium text-[#8ad142]"
      >
        Criar nova conta
      </button>
    </form>
  );
}