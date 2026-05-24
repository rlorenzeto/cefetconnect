import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import PasswordInput from "./PasswordInput";
import AuthButton from "./AuthButton";

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    codigo: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    codigo: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePassword(password) {
    if (!password.trim()) {
      return "A nova senha é obrigatória.";
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

  function handleChange(event) {
    const { name, value } = event.target;

    const nextValue =
      name === "codigo" ? value.replace(/\D/g, "").slice(0, 6) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setApiError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      email: "",
      codigo: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    };

    const email = formData.email.trim();
    const codigo = formData.codigo.trim();
    const novaSenha = formData.novaSenha.trim();
    const confirmarNovaSenha = formData.confirmarNovaSenha.trim();

    if (!email) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Digite um e-mail válido.";
    }

    if (!codigo) {
      newErrors.codigo = "O código de recuperação é obrigatório.";
    } else if (!/^\d{6}$/.test(codigo)) {
      newErrors.codigo = "O código deve ter exatamente 6 dígitos.";
    }

    const passwordError = validatePassword(novaSenha);
    if (passwordError) {
      newErrors.novaSenha = passwordError;
    }

    if (!confirmarNovaSenha) {
      newErrors.confirmarNovaSenha = "Confirme sua nova senha.";
    } else if (novaSenha !== confirmarNovaSenha) {
      newErrors.confirmarNovaSenha = "As senhas não coincidem.";
    }

    if (
      newErrors.email ||
      newErrors.codigo ||
      newErrors.novaSenha ||
      newErrors.confirmarNovaSenha
    ) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await resetPassword({
        email,
        codigo,
        novaSenha,
      });

      setSuccessMessage(response?.mensagem || "Senha redefinida com sucesso.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setApiError(err.message || "Não foi possível redefinir a senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu e-mail"
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          inputMode="numeric"
          name="codigo"
          maxLength={6}
          value={formData.codigo}
          onChange={handleChange}
          placeholder="Digite o código recebido"
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-center text-sm tracking-[0.35em] outline-none"
        />

        {errors.codigo && (
          <p className="mt-1 text-sm text-red-500">{errors.codigo}</p>
        )}
      </div>

      <div>
        <PasswordInput
          name="novaSenha"
          value={formData.novaSenha}
          onChange={handleChange}
          placeholder="Digite sua nova senha"
          autoComplete="new-password"
        />

        {errors.novaSenha && (
          <p className="mt-1 text-sm text-red-500">{errors.novaSenha}</p>
        )}
      </div>

      <div>
        <PasswordInput
          name="confirmarNovaSenha"
          value={formData.confirmarNovaSenha}
          onChange={handleChange}
          placeholder="Confirme sua nova senha"
          autoComplete="new-password"
        />

        {errors.confirmarNovaSenha && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmarNovaSenha}
          </p>
        )}
      </div>

      {apiError && <p className="text-sm text-red-500">{apiError}</p>}

      {successMessage && (
        <p className="text-sm text-[#2d67c5]">{successMessage}</p>
      )}

      <AuthButton type="submit" disabled={isSubmitting} className="mt-7">
        {isSubmitting ? "Salvando..." : "Redefinir senha"}
      </AuthButton>
    </form>
  );
}