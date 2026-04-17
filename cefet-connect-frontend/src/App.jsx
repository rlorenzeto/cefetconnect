import { useState } from "react";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState("login");

  return currentScreen === "register" ? (
    <RegisterPage onGoToLogin={() => setCurrentScreen("login")} />
  ) : (
    <LoginPage onGoToRegister={() => setCurrentScreen("register")} />
  );
}