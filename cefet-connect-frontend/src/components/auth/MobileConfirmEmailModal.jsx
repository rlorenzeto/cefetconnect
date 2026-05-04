import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  verifyEmail,
  resendEmailVerificationCode,
} from "../../services/authService";
import EmailVerificationIcon from "./EmailVerificationIcon";

export default function MobileConfirmEmailModal({
  isOpen,
  onClose,
  matricula,
  email,
}) {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const codigoCompleto = codigo.join("");

  if (!isOpen) return null;

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

  function handleCodeChange(index, value) {
    const onlyNumber = value.replace(/\D/g, "").slice(-1);

    setCodigo((prev) => {
      const next = [...prev];
      next[index] = onlyNumber;
      return next;
    });

    clearMessages();

    if (onlyNumber && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
    if (event.key === "Backspace" && !codigo[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event) {
    event.preventDefault();

    const pastedCode = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedCode) return;

    const nextCode = ["", "", "", "", "", ""];

    pastedCode.split("").forEach((number, index) => {
      nextCode[index] = number;
    });

    setCodigo(nextCode);
    clearMessages();

    const focusIndex = Math.min(pastedCode.length, 5);
    inputRefs.current[focusIndex]?.focus();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    clearMessages();

    if (!codigoCompleto.trim()) {
      setError("Digite o código recebido por e-mail.");
      return;
    }

    if (!/^\d{6}$/.test(codigoCompleto)) {
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
        codigo: codigoCompleto,
      });

      setSuccessMessage(response?.mensagem || "E-mail confirmado com sucesso!");

      localStorage.removeItem("cefetconnect_pending_verification");

      setTimeout(() => {
        navigate("/login?openMobileLogin=true");
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
      setCodigo(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      setApiError(getFriendlyError(error.message));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 lg:hidden">
      <div className="relative w-full max-w-[352px] overflow-hidden rounded-md bg-white shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-2 z-10 text-xl leading-none text-black"
          aria-label="Fechar"
        >
          ×
        </button>

        <div className="flex h-[104px] items-center justify-center bg-gradient-to-b from-[#20a7df] to-[#86cf4f]">
          <EmailVerificationIcon />
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-7 pt-9">
          <p className="mb-2 text-center text-sm font-bold text-[#242424]">
            Verifique seu endereço de email
          </p>

          <div className="mb-3 flex items-center justify-center gap-1.5">
            {codigo.map((digit, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <input
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleCodeChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  className="h-8 w-8 rounded border border-[#c8c8c8] bg-white text-center text-sm outline-none focus:border-[#009b72]"
                />

                {index === 2 && (
                  <span className="text-sm font-bold text-[#242424]">-</span>
                )}
              </div>
            ))}
          </div>

          {email && (
            <p className="mb-3 text-center text-[11px] leading-[1.35] text-[#666]">
              Código enviado para <strong>{email}</strong>
            </p>
          )}

          {error && (
            <p className="mb-2 text-center text-xs text-red-500">{error}</p>
          )}

          {apiError && (
            <p className="mb-2 text-center text-xs text-red-500">{apiError}</p>
          )}

          {successMessage && (
            <p className="mb-2 text-center text-xs text-[#009b72]">
              {successMessage}
            </p>
          )}

          {resendMessage && (
            <p className="mb-2 text-center text-xs text-[#009b72]">
              {resendMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mx-auto block h-8 w-[188px] rounded bg-[#009b72] text-sm font-semibold text-white disabled:opacity-70"
          >
            {isSubmitting ? "Confirmando..." : "Confirmar email"}
          </button>

          <p className="mt-3 text-center text-xs text-[#242424]">
            Não recebeu o email ?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending}
              className="text-[#69bd45] disabled:opacity-70"
            >
              {isResending ? "Reenviando..." : "Reenviar"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}