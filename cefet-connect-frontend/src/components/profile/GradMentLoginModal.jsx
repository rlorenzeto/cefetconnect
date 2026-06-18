import { useState } from "react";
import { apiFetch } from "../../services/api"; // This is for CefetConnect backend
import { getUserProfile } from "../../services/authService";

export default function GradMentLoginModal({ isOpen, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isOpen) return null;

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // 1. Envia as credenciais para o backend do CefetConnect, que fará a comunicação com o GradMent
      const response = await apiFetch("/gradment/integrate", {
        method: "POST",
        body: JSON.stringify({ email, password: senha }),
      });

      if (response && response.success) {
        setSuccess("Integração concluída! Você já pode importar seus dados.");
        
        setTimeout(() => {
          onSuccess("integrado");
          onClose();
        }, 2000);
      } else {
        throw new Error(response?.error || "Erro ao logar no GradMent.");
      }
    } catch (err) {
      setError(err.message || "Falha na conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-[32px] bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-[#202020] text-center mb-2">Conectar ao GradMent</h2>
        <p className="text-sm text-[#777] text-center mb-6">
          Faça login com sua conta do GradMent para vincular seu histórico acadêmico.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#202020] mb-1">
              E-mail do GradMent
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl border border-[#d9d9d9] bg-[#f1f1f1] px-4 py-3 text-[#343434] outline-none transition focus:border-[#089464]"
              placeholder="Digite seu e-mail"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#202020] mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="w-full rounded-2xl border border-[#d9d9d9] bg-[#f1f1f1] px-4 py-3 text-[#343434] outline-none transition focus:border-[#089464]"
              placeholder="Sua senha"
            />
          </div>

          {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
          {success && <p className="text-sm text-[#089464] font-medium text-center">{success}</p>}

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-full border border-[#d9d9d9] py-3 text-sm font-bold text-[#343434] transition hover:bg-[#f1f1f1] disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-[#089464] py-3 text-sm font-bold text-white transition hover:bg-[#067a52] disabled:opacity-50"
            >
              {loading ? "Conectando..." : "Conectar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
