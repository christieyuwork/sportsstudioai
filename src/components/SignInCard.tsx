import { ArrowRight } from 'lucide-react';
import { Button, Checkbox } from '@cake-admin/cakeand';
import {
  ActionsRow,
  BodyCopy,
  BrandBlock,
  ConsentLabel,
  ConsentList,
  ConsentRow,
  GlassPanel,
  HeroBlock,
  NvidiaLogo,
  PolicyLink,
  PoweredByRow,
  PoweredByText,
  StatusMessage,
  StudioIcon,
  Title,
} from '../styles/sports-theme';

export interface SignInCardProps {
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  isSubmitting: boolean;
  errorMessage: string | null;
  onAcceptedTermsChange: (checked: boolean) => void;
  onAcceptedPrivacyChange: (checked: boolean) => void;
  onLogin: () => void;
}

/**
 * Consent-gated login card from the Sports AI Studio Figma (node 16:20290).
 *
 * Built with cake& Button/Checkbox plus sports glass overrides — not HeroCard —
 * because the NVIDIA attribution row and glass overlay are sports-specific.
 */
export function SignInCard({
  acceptedTerms,
  acceptedPrivacy,
  isSubmitting,
  errorMessage,
  onAcceptedTermsChange,
  onAcceptedPrivacyChange,
  onLogin,
}: SignInCardProps) {
  const canSubmit = acceptedTerms && acceptedPrivacy && !isSubmitting;

  return (
    <GlassPanel>
      <HeroBlock>
        <BrandBlock>
          <StudioIcon
            src="/brand/studio-icon.svg"
            width={72}
            height={72}
            alt=""
          />
          <Title>Sports AI Studio</Title>
          <PoweredByRow>
            <PoweredByText>With technology powered by</PoweredByText>
            <NvidiaLogo
              src="/brand/nvidia-logo.svg"
              width={129}
              height={24}
              alt="NVIDIA"
            />
          </PoweredByRow>
        </BrandBlock>

        <BodyCopy>
          Transform every match into standout content with Lenovo Sports AI Studio.
          AI-powered intelligence finds the moments that matter, so you can create and
          publish polished highlights in minutes.
        </BodyCopy>

        <ConsentList>
          <ConsentRow>
            {/*
              Checkbox label prop is a plain string; legal links need custom markup,
              so we use aria-label on the control and a separate visible label.
            */}
            <Checkbox
              checked={acceptedTerms}
              onCheckedChange={(value) => onAcceptedTermsChange(value === true)}
              aria-label="I agree to terms of service"
            />
            <ConsentLabel>
              I agree to{' '}
              {/* Placeholder until real legal pages ship. */}
              <PolicyLink href="/legal/terms-of-service">terms of service</PolicyLink>
            </ConsentLabel>
          </ConsentRow>

          <ConsentRow>
            <Checkbox
              checked={acceptedPrivacy}
              onCheckedChange={(value) => onAcceptedPrivacyChange(value === true)}
              aria-label="I agree to data protection policy"
            />
            <ConsentLabel>
              I agree to{' '}
              <PolicyLink href="/legal/data-protection-policy">
                data protection policy
              </PolicyLink>
            </ConsentLabel>
          </ConsentRow>
        </ConsentList>

        <ActionsRow>
          <Button
            size="lg"
            intent="primary"
            variant="fill"
            endIcon={<ArrowRight size={16} aria-hidden />}
            disabled={!canSubmit}
            onClick={onLogin}
          >
            {isSubmitting ? 'Signing in…' : 'Login'}
          </Button>
        </ActionsRow>

        {errorMessage ? <StatusMessage role="alert">{errorMessage}</StatusMessage> : null}
      </HeroBlock>
    </GlassPanel>
  );
}
