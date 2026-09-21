/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL de base de l'API. Par défaut « /api » (proxy Vite en développement). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
