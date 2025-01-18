/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASENAME: string,
    readonly VITE_API_LOCATION: string,
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }