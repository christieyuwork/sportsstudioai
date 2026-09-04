import type { SignInRequest, SignInResponse } from '../types/auth';

/** Simulated network latency so the UI can exercise loading states. */
const MOCK_LATENCY_MS = 600;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * Mock sign-in. UI components should call this — never `fetch` directly.
 *
 * To hand off to production: replace the body with a real HTTP call that still
 * returns `SignInResponse`. Keep the function signature stable.
 */
export async function signIn(request: SignInRequest): Promise<SignInResponse> {
  await wait(MOCK_LATENCY_MS);

  if (!request.acceptedTermsOfService || !request.acceptedDataProtectionPolicy) {
    return {
      ok: false,
      code: 'CONSENT_REQUIRED',
      message: 'Both consent checkboxes must be accepted before signing in.',
    };
  }

  return {
    ok: true,
    user: {
      id: 'mock-user-001',
      displayName: 'Jane Mary Doe',
    },
    signedInAt: new Date().toISOString(),
  };
}
