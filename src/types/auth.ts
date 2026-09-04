/**
 * Auth contracts shared by the UI and the API layer.
 *
 * Keep request/response shapes here so production can swap `src/api/auth.ts`
 * for a real backend client without touching pages or components.
 */

/** Consent-gated entry — the Figma sign-in has no username/password fields. */
export interface SignInRequest {
  acceptedTermsOfService: boolean;
  acceptedDataProtectionPolicy: boolean;
}

export interface SignInUser {
  id: string;
  displayName: string;
}

export interface SignInResult {
  ok: true;
  user: SignInUser;
  /** ISO timestamp — useful when wiring real session expiry later. */
  signedInAt: string;
}

export interface SignInError {
  ok: false;
  code: 'CONSENT_REQUIRED' | 'MOCK_FAILURE';
  message: string;
}

export type SignInResponse = SignInResult | SignInError;
