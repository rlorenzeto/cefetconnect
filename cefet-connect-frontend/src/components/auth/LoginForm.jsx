import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import PasswordInput from "./PasswordInput";
import AuthButton from "./AuthButton";

export default function LoginForm({ onGoToRegister, onGoToForgotPassword }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    login: "",
    senha: "",
  });

  const [errors, setErrors] = useState({
    login: "",
    senha: "",
  });

  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showConfirmEmailHelp, setShowConfirmEmailHelp] = useState(false);
  const [verificationRegistration, setVerificationRegistration] = useState("");
  const [verificationError, setVerificationError] = useState("");

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
    setShowConfirmEmailHelp(false);
    setVerificationRegistration("");
    setVerificationError("");
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /*function validateEmail(email) {
    return /^[^\s@]+@aluno\.cefetmg\.br$/i.test(email.trim());
  }*/

  async function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      login: "",
      senha: "",
    };

    if (!formData.login.trim()) {
      newErrors.login = "O e-mail é obrigatório.";
    } else if (!validateEmail(formData.login)) {
      newErrors.login = "Digite um e-mail válido.";
    }

    if (!formData.senha.trim()) {
      newErrors.senha = "A senha é obrigatória.";
    }

    if (newErrors.login || newErrors.senha) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError("");

      const response = await loginUser({
        email: formData.login,
        senha: formData.senha,
      });

      console.log("Resposta login:", response);

      navigate("/profile");
    } catch (error) {
      const message = error.message || "Não foi possível entrar.";
      const normalizedMessage = message.toLowerCase();

      setApiError(message);

      if (
        normalizedMessage.includes("verificado") ||
        normalizedMessage.includes("confirmado") ||
        normalizedMessage.includes("confirme") ||
        normalizedMessage.includes("verifique")
      ) {
        setShowConfirmEmailHelp(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGoToConfirmEmail() {
    setVerificationError("");

    if (!verificationRegistration.trim()) {
      setVerificationError("Digite sua matrícula para confirmar o e-mail.");
      return;
    }

    if (!/^\d{11}$/.test(verificationRegistration.trim())) {
      setVerificationError("A matrícula deve ter exatamente 11 dígitos.");
      return;
    }

    const pendingVerification = {
      matricula: verificationRegistration.trim(),
      email: formData.login.trim(),
    };

    localStorage.setItem(
      "cefetconnect_pending_verification",
      JSON.stringify(pendingVerification)
    );

    navigate("/confirm-email", {
      state: pendingVerification,
    });
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
           name="senha"
          value={formData.senha}
          onChange={handleChange}
          placeholder="Digite sua senha"
          autoComplete="current-password"
        />
        {errors.senha && (
          <p className="mt-1 text-sm text-red-500">{errors.senha}</p>
        )}
      </div>

      {apiError && (
        <p className="text-sm text-red-500">{apiError}</p>
      )}
      {showConfirmEmailHelp && (
        <div className="rounded-xl border border-[#8ad142] bg-[#f7fff1] p-3">
          <p className="text-sm leading-relaxed text-[#3b3b3b]">
            Esse e-mail ainda não foi confirmado. Para confirmar agora, digite sua
            matrícula e acesse a tela de confirmação.
          </p>

          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            value={verificationRegistration}
            onChange={(event) => {
              const onlyNumbers = event.target.value.replace(/\D/g, "").slice(0, 11);
              setVerificationRegistration(onlyNumbers);
              setVerificationError("");
            }}
            placeholder="Digite sua matrícula"
            className="mt-3 h-10 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
          />

          {verificationError && (
            <p className="mt-1 text-sm text-red-500">{verificationError}</p>
          )}

          <button
            type="button"
            onClick={handleGoToConfirmEmail}
            className="mt-3 h-10 w-full rounded-full bg-[#8ad142] text-sm font-semibold text-white"
          >
            Confirmar meu e-mail
          </button>
        </div>
      )}

      <AuthButton
        type="submit"
        disabled={isSubmitting}
        className="mt-7"
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </AuthButton>

      <AuthButton
        type="button"
        variant="text"
        onClick={onGoToForgotPassword}
        className="mt-8 h-auto"
      >
        Esqueceu a senha?
      </AuthButton>

      <AuthButton
        type="button"
        onClick={onGoToRegister}
        className="mt-12"
      >
        Criar nova conta
      </AuthButton>
    </form>
  );
}