/**
 * Sports Studio AI visual overrides on top of cake& tokens.
 *
 * Prefer cake tokens everywhere. The values below exist only where the sports
 * login glass treatment sits on full-bleed video and cake& surface tokens
 * (designed for app chrome) do not match the Figma overlay.
 */

import styled from 'styled-components';
import { SPORTS_GLASS_BACKGROUND } from './sports-tokens';

/** Full-viewport shell behind the sign-in card. */
export const PageShell = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: var(--color-surfaces-inverse-container);
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
`;

/** Centers the glass card over the video. */
export const PageContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: var(--space-500);
  box-sizing: border-box;
`;

/**
 * Glass card surface from the Figma login (backdrop blur + 50% black fill).
 * Not a cake& Card — Card's opaque container would hide the video.
 */
export const GlassPanel = styled.div`
  width: min(100%, 654px);
  padding: var(--space-400);
  border-radius: var(--radius-400);
  /* Sports overlay: Figma black/50a over video — no exact cake& token match. */
  background: ${SPORTS_GLASS_BACKGROUND};
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  /*
    Figma card stroke: &color/stroke/border → #5e5e5e in dark.a
    (not border-container / border-container-os — those are 0-alpha or too faint).
  */
  border: var(--stroke-100) solid var(--color-stroke-border);
  box-sizing: border-box;
`;

export const HeroBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-600);
  padding: var(--space-600);
`;

export const BrandBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

export const LoginBrandIcon = styled.img`
  width: 72px;
  height: 72px;
  display: block;
  /* Keep aspect ratio — Figma MCP SVGs ship with preserveAspectRatio=none which
     stretches the play triangle if the img box is forced. */
  object-fit: contain;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  letter-spacing: -0.6px;
  color: var(--color-text-icon-primary);
`;

export const PoweredByRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--space-150);
`;

export const PoweredByText = styled.p`
  margin: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
`;

export const NvidiaLogo = styled.img`
  width: 129px;
  height: 24px;
  display: block;
  object-fit: contain;
`;

export const BodyCopy = styled.p`
  margin: 0;
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  letter-spacing: 0.4px;
  color: var(--color-text-icon-primary);
`;

export const ConsentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  width: 100%;
`;

export const ConsentRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-100);
  width: 100%;
`;

export const ConsentLabel = styled.p`
  margin: 0;
  padding-top: var(--space-025);
  flex: 1;
  min-width: 0;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  letter-spacing: 0.1px;
  color: var(--color-text-icon-primary);
`;

/**
 * Legal link styling. Placeholder hrefs until real policy pages exist.
 * Uses primary token so links stay theme-aware on dark sports chrome.
 */
export const PolicyLink = styled.a`
  color: var(--color-primary-primary);
  text-decoration: underline;
  text-underline-position: from-font;

  &:hover {
    color: var(--color-primary-primary-hover);
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: var(--space-300);
  align-items: flex-start;
`;

export const StatusMessage = styled.p`
  margin: 0;
  font-size: var(--type-size-body);
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
`;
