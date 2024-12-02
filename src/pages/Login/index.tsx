import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/edu_2.png";
import { Navigate } from "react-router";

const LoginPage: React.FC = () => {
  if (localStorage.getItem("token")) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <Card>
        <CardContent className="flex flex-col items-center">
          <img src={logo} className="w-60" />
          <Button
            onClick={() => {
              window.location.href = "http://localhost:8080/auth/login";
            }}
          >
            Login using oVirt SSO
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
