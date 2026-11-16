/**
 * Central place to read and validate build-time env vars. Import this
 * instead of `import.meta.env` directly so a missing/misconfigured var
 * fails fast with a clear message instead of surfacing as a cryptic
 * network error deep in a component.
 */
function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
} as const;
