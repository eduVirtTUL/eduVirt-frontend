import { Navigate } from "react-router";
import { RouteHandle } from "./AuthGuard";
import { useUser } from "./stores/userStore";

const App: React.FC = () => {
  const { activeRole } = useUser();

  if (activeRole === "administrator" || activeRole === "teacher") {
    return <Navigate to="/courses" />;
  }

  if (activeRole === "student") {
    return <Navigate to="/reservations" />;
  }

  return <div className="text-red-600">Upsss you shouldn't be here :)</div>;
};

export default App;

export const handle: RouteHandle = {
  roles: "*",
};
