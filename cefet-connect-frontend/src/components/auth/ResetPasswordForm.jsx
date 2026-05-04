import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import PasswordInput from "./PasswordInput";
import AuthButton from "./AuthButton";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      password: "",
      confirmPassword: "",
    };

    if (!token) {
      setApiError("Token de recuperação inválido ou ausente.");
      return;
    }

    if (!formData.password.trim()) {
      newErrors.password = "A nova senha é obrigatória.";
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirme sua nova senha.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }

    if (newErrors.password || newErrors.confirmPassword) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await resetPassword({
        token,
        password: formData.password,
      });

      setSuccessMessage(
        response?.message || "Senha redefinida com sucesso."
      );

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
        <PasswordInput
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua nova senha"
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <div>
        <PasswordInput
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirme sua nova senha"
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {apiError && <p className="text-sm text-red-500">{apiError}</p>}
      {successMessage && (
        <p className="text-sm text-[#2d67c5]">{successMessage}</p>
      )}

      <AuthButton
        type="submit"
        disabled={isSubmitting}
        className="mt-7"
      >
        {isSubmitting ? "Salvando..." : "Redefinir senha"}
      </AuthButton>
    </form>
  );
}