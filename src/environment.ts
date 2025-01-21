export interface Environment {
    apiUrl: string;
    basename: string;
    ovirtEngineUrl: string;
}

function getConfigFromWindow(): Partial<Environment> {
  if (typeof window !== 'undefined') {
    //Do not allow basename from window 
    const { basename, ...rest } = (window as any).env || {};
    return rest;
  }
  return {}
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
