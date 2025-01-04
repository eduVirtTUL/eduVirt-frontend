import { Loader2Icon } from "lucide-react";
import { Button } from "./ui/button";

type LoadingButtonProps = {
  loading: boolean;
} & React.ComponentProps<typeof Button>;

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading,
  children,
  disabled,
  ...rest
}) => {
  const newDisabled = disabled || loading;
  return (
    <Button {...rest} disabled={newDisabled}>
      {loading && <Loader2Icon className=" w-6 h-6 animate-spin" />}
      {children}
    </Button>
  );
};

export default LoadingButton;
