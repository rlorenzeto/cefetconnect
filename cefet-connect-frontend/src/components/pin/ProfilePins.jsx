import { useState } from "react";
import PinBadge from "../pin/PinBadge";
import PinDetailsModal from "../pin/PinDetailsModal";
import PinManagerModal from "../pin/PinManagerModal";

export default function ProfilePins({
  pins = [],
  isOwnProfile = false,
  onRefreshPins,
  onRemovePin,
}) {
  const [selectedPin, setSelectedPin] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isManagerOpen, setIsManagerOpen] = useState(false);

  function handleOpenPin(pin) {
    setSelectedPin(pin);
    setIsDetailsOpen(true);
  }

  return (
    <section className="mt-7 rounded-[28px] bg-[#f7f7f7] px-5 py-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#202020]">
            Pins acadêmicos
          </h3>

          <p className="mt-1 text-xs text-[#777]">
            {pins.length} pin(s) exibido(s) no perfil
          </p>
        </div>

        {isOwnProfile && (
          <button
            type="button"
            onClick={() => setIsManagerOpen(true)}
            className="rounded-full bg-[#089464] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#067f57]"
          >
            Adicionar pin
          </button>
        )}
      </div>

      {pins.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pins.map((pin) => (
            <PinBadge
              key={pin.idPin}
              pin={pin}
              onClick={handleOpenPin}
              onRemove={onRemovePin}
              canRemove={isOwnProfile}
            />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl bg-white px-4 py-3 text-sm text-[#777]">
          {isOwnProfile
            ? "Você ainda não adicionou pins ao seu perfil."
            : "Este usuário ainda não possui pins visíveis."}
        </p>
      )}

      <PinDetailsModal
        pin={selectedPin}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      <PinManagerModal
        isOpen={isManagerOpen}
        userPins={pins}
        onClose={() => setIsManagerOpen(false)}
        onPinAdded={onRefreshPins}
      />
    </section>
  );
}