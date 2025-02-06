export interface Environment {
  apiUrl: string;
  basename: string;
  ovirtEngineUrl: string;
}

declare global {
  interface Window {
    env: Partial<Environment>;
  }
}

function getConfigFromWindow(): Partial<Environment> {
  if (typeof window !== "undefined" && import.meta.env.PROD) {
    //Do not allow basename from window
    const { ...rest } = window.env || {};
    delete rest.basename;
    return rest;
  }
  return {};
}

function getConfigFromEnv(): Environment {
  return {
    basename: import.meta.env.VITE_BASENAME as string,
    apiUrl: import.meta.env.VITE_API_URL as string,
    ovirtEngineUrl: import.meta.env.VITE_OVIRT_ENGINE_URL as string,
  };
}

export const appEnv: Environment = {
  ...getConfigFromEnv(),
  ...getConfigFromWindow(),
};
