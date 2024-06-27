// env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
        GRAPHQL_ENDPOINT: string;
        NEXT_PUBLIC_FILE_DOMAIN: string;
    }
  }