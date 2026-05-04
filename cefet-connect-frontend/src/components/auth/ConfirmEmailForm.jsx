import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyEmail,
  resendEmailVerificationCode,
} from "../../services/authService";
import AuthButton from "./AuthButton";

export default function ConfirmEmailForm({ matricula, email }) {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  function clearMessages() {
    setError("");
    setApiError("");
    setSuccessMessage("");
    setResendMessage("");
  }

  function getFriendlyError(message) {
    const normalized = String(message || "").toLowerCase();

    if (normalized.includes("verificado")) {
      return "Este e-mail já foi verificado. Você já pode entrar na sua conta.";
    }

    if (
      normalized.includes("inválido") ||
      normalized.includes("invalido") ||
      normalized.includes("incorreto")
    ) {
      return "Código incorreto. Confira o código enviado para o seu e-mail.";
    }

    if (normalized.includes("expirado")) {
      return "Código expirado. Clique em reenviar código para receber um novo.";
    }

    if (
      normalized.includes("não encontrado") ||
      normalized.includes("nao encontrado")
    ) {
      return "Cadastro não encontrado. Faça o cadastro novamente.";
    }

    return message || "Não foi possível confirmar o e-mail.";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    clearMessages();

    if (!codigo.trim()) {
      setError("Digite o código recebido por e-mail.");
      return;
    }

    if (!/^\d{6}$/.test(codigo.trim())) {
      setError("O código deve ter exatamente 6 dígitos.");
      return;
    }

    if (!matricula) {
      setApiError("Não foi possível identificar o cadastro para confirmar.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await verifyEmail({
        matricula,
        codigo: codigo.trim(),
      });

      setSuccessMessage(response?.mensagem || "E-mail confirmado com sucesso!");

      localStorage.removeItem("cefetconnect_pending_verification");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setApiError(getFriendlyError(error.message));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    clearMessages();

    if (!matricula) {
      setApiError("Não foi possível identificar o cadastro para reenviar o código.");
      return;
    }

    try {
      setIsResending(true);

      const response = await resendEmailVerificationCode({ matricula });

      setResendMessage(response?.mensagem || "Novo código enviado para o seu e-mail.");
      setCodigo("");
    } catch (error) {
      setApiError(getFriendlyError(error.message));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {email && (
        <p className="text-center text-sm leading-[1.45] text-[#666]">
          Enviamos um código para <strong>{email}</strong>.
        </p>
      )}

      <div>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={codigo}
          onChange={(event) => {
            const onlyNumbers = event.target.value.replace(/\D/g, "").slice(0, 6);
            setCodigo(onlyNumbers);
            clearMessages();
          }}
          placeholder="Digite o código"
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-center text-sm tracking-[0.4em] outline-none"
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>

      {apiError && <p className="text-sm text-red-500">{apiError}</p>}

      {successMessage && (
        <p className="text-sm text-[#2d67c5]">{successMessage}</p>
      )}

      {resendMessage && (
        <p className="text-sm text-[#2d67c5]">{resendMessage}</p>
      )}

      <AuthButton
        type="submit"
        disabled={isSubmitting}
        className="mt-7"
      >
        {isSubmitting ? "Confirmando..." : "Confirmar e-mail"}
      </AuthButton>

      <AuthButton
        type="button"
        onClick={handleResendCode}
        disabled={isResending}
        className="mt-3"
      >
        {isResending ? "Reenviando..." : "Reenviar código"}
      </AuthButton>
    </form>
  );
}