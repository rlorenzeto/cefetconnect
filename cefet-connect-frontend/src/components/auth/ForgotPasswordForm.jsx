import { useState } from "react";
import { forgotPassword } from "../../services/authService";

export default function ForgotPasswordForm({ onGoToLogin }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setApiError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("O e-mail é obrigatório.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Digite um e-mail válido.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await forgotPassword({ email });

      setSuccessMessage(
        response?.message ||
          "Se o e-mail estiver cadastrado, enviaremos as instruções de recuperação."
      );

      setEmail("");
    } catch (err) {
      setApiError(
        err.message || "Não foi possível solicitar a recuperação de senha."
      );
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
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setError("");
            setApiError("");
            setSuccessMessage("");
          }}
          placeholder="Digite seu e-mail"
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      {apiError && <p className="text-sm text-red-500">{apiError}</p>}

      {successMessage && (
        <p className="text-sm text-[#2d67c5]">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-3 h-12 w-full rounded-full bg-[#8ad142] text-sm font-semibold text-white disabled:opacity-70"
      >
        {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
      </button>

      <button
        type="button"
        onClick={onGoToLogin}
        className="mt-8 h-11 w-full rounded-full border border-[#8ad142] bg-transparent text-sm font-medium text-[#8ad142]"
      >
        Voltar para entrar
      </button>
    </form>
  );
}