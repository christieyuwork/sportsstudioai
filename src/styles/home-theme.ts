/**
 * Studio home layout styles (sidebar + main). Wave video sits behind;
 * surfaces use cake tokens with sports glass edges where needed.
 */

import { Button, Chip } from '@cake-admin/cakeand';
import styled from 'styled-components';
import {
  AI_SURFACE_GRADIENT,
  AI_TEXT_GRADIENT,
  SPORTS_GLASS_BACKGROUND,
} from './sports-tokens';

export const HomeShell = styled.div`
  position: relative;
  display: flex;
  min-height: 100vh;
  width: 100%;
  color: var(--color-text-icon-primary);
  font-family: var(--font-family);
  background: var(--color-surfaces-inverse-container);
  overflow: hidden;
`;

export const HomeBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

/**
 * Chat legibility layer over the moving wave. The conversation occupies the
 * first content third of the viewport, so the darkest point sits at 33% and
 * fades back to transparent before reaching either edge.
 *
 * Sports exception: a black alpha gradient over video; opaque cake& surface
 * tokens would hide the motion rather than damp it.
 */
export const ChatBackgroundScrim = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.42) 18%,
    rgba(0, 0, 0, 0.9) 33.333%,
    rgba(0, 0, 0, 0.42) 48%,
    rgba(0, 0, 0, 0) 66.667%,
    rgba(0, 0, 0, 0) 100%
  );
`;

export const HomeLayout = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex: 1;
  min-height: 100vh;
  min-width: 0;
  gap: var(--space-300);
  padding: var(--space-300);
  box-sizing: border-box;
`;

export const MainPane = styled.main`
  flex: 1;
  min-width: 0;
  overflow-y: auto;
  box-sizing: border-box;
`;

/**
 * Figma frame 59:23004 is 1528px: 1208px content + 160px on each side.
 * max-width includes padding because this element uses border-box.
 */
export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-800);
  width: 100%;
  max-width: 1528px;
  margin: 0 auto;
  padding:
    calc(var(--space-1000) + var(--space-700))
    calc(var(--space-1000) * 2);
  box-sizing: border-box;

  @media (max-width: 1500px) {
    padding-inline: var(--space-800);
  }

  @media (max-width: 900px) {
    padding-block: var(--space-800);
    padding-inline: var(--space-500);
  }
`;

/** The empty New project uploader alone is capped at the 800px Figma width. */
export const NewProjectUploadLimit = styled.div`
  width: 100%;
  max-width: calc(var(--space-1000) * 10);
`;

export const PageHeading = styled.h1`
  margin: 0;
  font-size: var(--type-size-hero);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  text-align: left;
`;

export const WorkspaceBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-900);
  width: 100%;
`;

export const EventsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-600);
  width: 100%;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-300);
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  text-align: left;
`;

export const AllEventsButton = styled(Button)`
  && {
    color: var(--color-surfaces-inverse-container);
    font-size: var(--type-size-caption);
    letter-spacing: 0.2px;
  }

  && img {
    filter: brightness(0) invert(1);
  }
`;

export const EventsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-300);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const LowerGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(400px, 680px) minmax(0, 480px);
  grid-template-rows: auto auto;
  gap: var(--space-900);
  width: 100%;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;

    & > * {
      grid-column: 1;
      grid-row: auto;
    }
  }
`;

export const PromptPanel = styled.div`
  display: flex;
  grid-column: 1;
  grid-row: 1;
  flex-direction: column;
  gap: var(--space-300);
  max-width: 680px;
  min-width: 0;
`;

export const PromptTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-100);
  width: 100%;
`;

export const PromptTitle = styled.p`
  margin: 0;
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  text-align: left;
  white-space: nowrap;
`;

/**
 * Figma prompt bar (59:26724): column layout — placeholder text on top,
 * + / send toolbar below; gradient/ai/surface + indigo/30 border + blur.
 */
export const PromptBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-500);
  width: 100%;
  max-width: 680px;
  min-width: min(100%, 400px);
  padding: var(--space-400) var(--space-400) var(--space-300);
  border-radius: var(--radius-400);
  border: var(--stroke-100) solid var(--color-primary-primary-hover);
  background-image: ${AI_SURFACE_GRADIENT};
  backdrop-filter: blur(45px);
  -webkit-backdrop-filter: blur(45px);
  box-shadow: var(--elevation-3);
  box-sizing: border-box;
  overflow: hidden;
`;

export const PromptInput = styled.input`
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--color-text-icon-secondary);
  font-family: inherit;
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
  outline: none;

  &::placeholder {
    color: var(--color-text-icon-secondary);
  }

  &:focus::placeholder {
    color: transparent;
  }
`;

export const PromptToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--space-600);
  width: 100%;
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-100);
  padding-inline: var(--space-100);
  width: 100%;
  box-sizing: border-box;
`;

export const SuggestionChip = styled(Chip)`
  && {
    position: relative;
    isolation: isolate;
    color: var(--color-text-icon-on-tonal);
    background-color: transparent;
    box-sizing: border-box;
    background-image: ${AI_SURFACE_GRADIENT};
  }

  && > button {
    color: var(--color-text-icon-on-tonal);
    font-weight: var(--font-weight-medium);
  }

  &&::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    padding: var(--stroke-200);
    background: ${AI_TEXT_GRADIENT};
    pointer-events: none;
    opacity: 0;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
  }

  &&:hover::after,
  &&:focus-within::after {
    opacity: 1;
  }

  backdrop-filter: blur(45px);
  -webkit-backdrop-filter: blur(45px);
  box-shadow: var(--elevation-3);
`;

export const ChipLabel = styled.span`
  background-image: ${AI_TEXT_GRADIENT};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  font: inherit;
  line-height: inherit;
`;

export const MediaPanel = styled.div`
  display: flex;
  grid-column: 2;
  grid-row: 1 / span 2;
  flex-direction: column;
  gap: var(--space-300);
`;

export const SuggestedVideoSection = styled.section`
  display: flex;
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-300);
`;

export const SuggestedVideoHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
`;

export const SuggestedVideoTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

export const SuggestedVideoList = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-200);
`;

export const UploadZone = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;

  & [role='group'] {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--space-300);
    min-height: calc(var(--space-1000) * 2 + var(--space-500));
    padding: var(--space-800) var(--space-300);
    border: var(--stroke-100) solid var(--color-stroke-border);
    border-radius: var(--radius-400);
    background: ${SPORTS_GLASS_BACKGROUND};
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    width: 100%;
    box-sizing: border-box;
  }

  & [role='group'] > div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--space-800);
    height: var(--space-800);
    flex: none;
    border-radius: var(--radius-200);
    background: var(--color-tonal-tonal);
    color: var(--color-text-icon-on-tonal-inverse);
  }

  & [role='group'] > div:first-of-type svg {
    display: none;
  }

  & [role='group'] > div:first-of-type::after {
    content: '';
    width: var(--space-500);
    height: var(--space-500);
    background: url('/icons/video.svg') center / contain no-repeat;
  }

  /*
   * Keep cake&'s native browse Button as the keyboard/click target while the
   * sports upload-area treatment supplies the visible affordance.
   */
  & [role='group'] button {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  & [role='group'] p {
    margin: 0;
    color: var(--color-text-icon-secondary);
    font-size: var(--type-size-caption);
    font-weight: var(--font-weight-regular);
    letter-spacing: 0.2px;
  }

  & [role='group']:focus-within {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }

`;

export const EmptyUploadZone = styled(UploadZone)`
  & [role='group'] {
    min-height: calc(var(--space-1000) * 4);
  }
`;

/**
 * The new-project screen keeps the picker flush with the page heading; every
 * other surface centres it under the "Project media" title.
 */
export const UploadBoundary = styled.div<{
  $empty: boolean;
  $alignment: 'start' | 'center';
}>`
  position: relative;
  width: 100%;
  margin-inline: ${({ $empty, $alignment }) =>
    $empty || $alignment === 'start' ? '0' : 'auto'};

  /* cake& FileUpload's outer wrapper defaults to 480px. The project-media
     panel owns the available width, so let the upload target fill it. */
  & > * {
    width: 100%;
    max-width: none;
  }
`;
