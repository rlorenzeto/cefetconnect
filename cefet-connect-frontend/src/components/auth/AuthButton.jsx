export default function AuthButton({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "border border-[#089464] bg-[#089464] text-white hover:bg-[#077f56]",
    outline:
      "border border-[#089464] bg-transparent text-[#089464] hover:bg-[#eefaf5]",
    text:
      "border border-transparent bg-transparent text-[#089464] hover:underline",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`h-[56px] w-full rounded-full text-[16px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}