import { useState } from "react";
import { CheckCircle2, Link2, Unlink, X, CalendarDays, ShieldCheck } from "lucide-react";

export default function GradMentIntegrationCard({ token, onConnect, onDisconnect }) {
  const [showDetails, setShowDetails] = useState(false);

  // Decode JWT payload to get integration date (iat)
  let integrationDate = "Data desconhecida";
  if (token) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const payload = JSON.parse(jsonPayload);
      if (payload.iat) {
        integrationDate = new Date(payload.iat * 1000).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'long', year: 'numeric'
        });
      }
    } catch (e) {
      console.error("Failed to parse JWT", e);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-[#eeeeee] bg-white overflow-hidden transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
      <div className="flex flex-col sm:flex-row items-center p-6 gap-6 relative overflow-hidden">
        
        {/* Background Decorative Element */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-[#e8f7ef] to-[#d1f0e0] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        {/* Logos Container */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#f1f1f1] shadow-sm flex items-center justify-center p-2 relative z-10">
            <img src="/logo-CefetConnect-semFundo.png" alt="CefetConnect Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col items-center justify-center text-[#d9d9d9]">
            <Link2 size={24} className={token ? "text-[#089464]" : "text-[#d9d9d9]"} />
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#089464] border border-[#f1f1f1] shadow-sm flex items-center justify-center p-2 relative z-10">
            <img src="/images/gradment-logo.svg" alt="GradMent Logo" className="w-full h-full object-contain brightness-0 invert" />
          </div>
        </div>

        {/* Info Container */}
        <div className="min-w-0 flex-1 text-center sm:text-left z-10">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <h3 className="text-lg font-bold text-[#202020]">GradMent</h3>
            {token && (
              <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider bg-[#e8f7ef] text-[#089464] px-2 py-0.5 rounded-full">
                <CheckCircle2 size={12} />
                Integrado
              </span>
            )}
          </div>
          <p className="max-w-full break-words text-sm text-[#777] [overflow-wrap:anywhere]">
            {token 
              ? "Sua conta está vinculada. Você pode importar ícones e disciplinas do GradMent." 
              : "Vincule sua conta do GradMent para importar automaticamente suas conquistas."}
          </p>
        </div>

        {/* Action Button */}
        <div className="shrink-0 z-10">
          {token ? (
            <button
              onClick={() => setShowDetails(true)}
              className="px-5 py-2.5 rounded-xl border border-[#e8f7ef] bg-[#e8f7ef] text-sm font-semibold text-[#089464] hover:bg-[#d1f0e0] transition-colors"
            >
              Detalhes
            </button>
          ) : (
            <button
              onClick={onConnect}
              className="px-6 py-2.5 rounded-xl bg-[#089464] text-white text-sm font-bold hover:bg-[#067a52] transition-colors"
            >
              Conectar Conta
            </button>
          )}
        </div>
      </div>

      {/* Details Popup/Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-br from-[#089464] to-[#067a52] p-6 flex flex-col items-center text-center relative">
              <button 
                onClick={() => setShowDetails(false)}
                className="absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 p-3">
                <img src="/images/gradment-logo.svg" alt="GradMent Logo" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">GradMent</h3>
              <p className="text-sm text-white/80 font-medium">Histórico Acadêmico Vinculado</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-[#777] bg-[#f1f1f1] p-3 rounded-xl">
                <div className="bg-white p-2 rounded-lg shadow-sm text-[#343434]"><CalendarDays size={18} /></div>
                <div>
                  <p className="text-xs text-[#777] font-medium uppercase tracking-wide">Vinculado em</p>
                  <p className="font-semibold text-[#202020]">{integrationDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-[#777] bg-[#f1f1f1] p-3 rounded-xl">
                <div className="bg-white p-2 rounded-lg shadow-sm text-[#343434]"><ShieldCheck size={18} /></div>
                <div>
                  <p className="text-xs text-[#777] font-medium uppercase tracking-wide">Segurança</p>
                  <p className="font-semibold text-[#202020] text-xs">Token seguro de longa duração</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setShowDetails(false);
                    onDisconnect();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Unlink size={18} />
                  Desconectar GradMent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
