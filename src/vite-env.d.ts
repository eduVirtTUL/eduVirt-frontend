/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASENAME: string,
    readonly VITE_API_LOCATION: string,
    readonly VITE_OVIRT_ENGINE_LOCATION: string,
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }