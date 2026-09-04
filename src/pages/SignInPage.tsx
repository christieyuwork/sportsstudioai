import { useState } from 'react';
import { signIn } from '../api/auth';
import { SignInCard } from '../components/SignInCard';
import { VideoBackground } from '../components/VideoBackground';
import { HomePage } from './HomePage';
import { PageContent, PageShell } from '../styles/sports-theme';
import type { SignInUser } from '../types/auth';

/**
 * Auth gate → studio home.
 *
 * Browser chrome from Figma is omitted. After mock sign-in, the wave-background
 * home experience loads (empty project until a mock upload completes).
 */
export function SignInPage() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<SignInUser | null>(null);

  async function handleLogin() {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const result = await signIn({
        acceptedTermsOfService: acceptedTerms,
        acceptedDataProtectionPolicy: acceptedPrivacy,
      });

      if (!result.ok) {
        setErrorMessage(result.message);
        return;
      }

      setUser(result.user);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleSignOut() {
    setUser(null);
    setAcceptedTerms(false);
    setAcceptedPrivacy(false);
    setErrorMessage(null);
  }

  if (user) {
    return <HomePage user={user} onSignOut={handleSignOut} />;
  }

  return (
    <PageShell>
      <VideoBackground
        webmSrc="/media/login/player-kick.webm"
        mp4Src="/media/login/player-kick.mp4"
        label="Decorative soccer ball particle animation"
      />

      <PageContent>
        <SignInCard
          acceptedTerms={acceptedTerms}
          acceptedPrivacy={acceptedPrivacy}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onAcceptedTermsChange={setAcceptedTerms}
          onAcceptedPrivacyChange={setAcceptedPrivacy}
          onLogin={() => {
            void handleLogin();
          }}
        />
      </PageContent>
    </PageShell>
  );
}
