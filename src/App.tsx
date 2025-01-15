import { RouteHandle } from "./AuthGuard";

function App() {
  return <div className="text-red-600">Tesasddsat</div>;
}

export default App;

export const handle: RouteHandle = {
  roles: "*",
};
