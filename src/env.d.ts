/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Required environment variables
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_OPENROUTER_API_KEY: string;
  readonly VITE_DEFAULT_CONTENT_MODEL: string;
  
  // Optional environment variables that were missing in TypeScript errors
  readonly VITE_PLUGIN_PWA_DISABLED?: string;
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_API_KEY?: string;
  readonly VITE_MARKET_RESEARCH_MODEL?: string;
  readonly VITE_BOOK_STRUCTURE_MODEL?: string;
  readonly VITE_CONTENT_GENERATOR_MODEL?: string;
  readonly VITE_DEFAULT_CHAT_MODEL?: string;
  readonly VITE_DEFAULT_RESEARCH_MODEL?: string;
  readonly VITE_SITE_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}