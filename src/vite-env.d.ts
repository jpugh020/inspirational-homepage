/// <reference types="vite/client" />
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      UNSPLASH_ACCESS_KEY: string;
      
    }
  }
}