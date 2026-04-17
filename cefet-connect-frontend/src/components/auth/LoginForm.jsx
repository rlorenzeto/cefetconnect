import { useState } from "react";

export default function LoginForm({ onGoToRegister }) {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    login: "",
    password: "",
  });

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
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {
      login: "",
      password: "",
    };

    if (!formData.login.trim()) {
      newErrors.login = "O e-mail é obrigatório.";
    } else if (!validateEmail(formData.login)) {
      newErrors.login = "Digite um e-mail válido.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "A senha é obrigatória.";
    }

    if (newErrors.login || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    console.log("Login válido:", formData);
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
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <button
        type="submit"
        className="mt-3 h-12 w-full rounded-full bg-[#8ad142] text-sm font-semibold text-white"
      >
        Entrar
      </button>
      <button
        type="button"
        onClick={() => console.log("Ir para recuperação de senha")}
        className="mt-6 block w-full text-center text-sm text-[#666]"
      >
        Esqueceu a senha ?
      </button>

      <button
        type="button"
        onClick={onGoToRegister}
        className="mt-8 h-11 w-full rounded-full border border-[#8ad142] bg-transparent text-sm font-medium text-[#8ad142]"
      >
        Criar nova conta
      </button>
    </form>
  );
}