import { useState } from "react";

export default function RegisterForm({ onGoToLogin }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    registration: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    registration: "",
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
      name: "",
      email: "",
      registration: "",
      password: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Digite um e-mail válido.";
    }

    if (!formData.registration.trim()) {
      newErrors.registration = "A matrícula é obrigatória.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "A senha é obrigatória.";
    }

    if (
      newErrors.name ||
      newErrors.email ||
      newErrors.registration ||
      newErrors.password
    ) {
      setErrors(newErrors);
      return;
    }

    console.log("Cadastro válido:", formData);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Digite seu nome"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Digite seu email"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          name="registration"
          value={formData.registration}
          onChange={handleChange}
          placeholder="Digite sua matrícula"
          required
          className="h-11 w-full rounded-md border border-[#bfbfbf] bg-white px-3 text-sm outline-none"
        />
        {errors.registration && (
          <p className="mt-1 text-sm text-red-500">{errors.registration}</p>
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
        className="mt-8 h-11 w-full rounded-full border border-[#8ad142] bg-transparent text-sm font-medium text-[#8ad142]"
      >
        Criar nova conta
      </button>

      <p className="mt-4 text-center text-sm text-[#777]">
        Já possui conta?{" "}
        <button
          type="button"
          onClick={onGoToLogin}
          className="font-medium text-[#8ad142]"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}