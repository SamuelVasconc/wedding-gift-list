/**
 * When SKIP_AUTH=true, the password screen is skipped and everyone
 * goes straight to /gifts (API routes also treat requests as authenticated).
 */
export function isAuthBypassed(): boolean {
  return process.env.SKIP_AUTH === 'true';
}
