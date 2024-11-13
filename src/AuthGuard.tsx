import { Outlet } from "react-router-dom";

const AuthGuard: React.FC = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="))
    ?.split("=")[1];

  if (!token) {
    window.location.href = "http://localhost:8080/auth/login";
    return null;
  }

  localStorage.setItem("token", token);

  return <Outlet />;
};

export default AuthGuard;
