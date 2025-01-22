/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASENAME: string,
    readonly VITE_API_URL: string,
    readonly VITE_OVIRT_ENGINE_URL: string,
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }