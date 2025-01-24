import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ThemeProvider } from "./components/ThemeProvider";
import "./index.css";
import "@/i18n";
import i18next, { t } from "i18next";
import { AxiosError } from "axios";
import { ErrorResponse } from "./data/privateAxios";
import { toast } from "sonner";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <script
          src={`${import.meta.env.VITE_BASENAME.replace(/\/$/, "")}/env-config.js`}
        />
        <link
          rel="icon"
          type="image/x-icon"
          href={`${import.meta.env.VITE_BASENAME.replace(/\/$/, "")}/favicon.ico`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
};

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);

      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorKey = axiosError.response?.data.key;
        if (errorKey) {
          if (i18next.exists(`errorKeys.${errorKey}`)) {
            toast.error(t(`errorKeys.${errorKey}`));
            return;
          }
        }

        toast.error(t("genericError"));
      }
    },
  }),
});

const Root: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <Outlet />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Root;
