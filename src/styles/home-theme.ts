/**
 * Studio home layout styles (sidebar + main). Wave video sits behind;
 * surfaces use cake tokens with sports glass edges where needed.
 */

import { Button, Card, Chip } from '@cake-admin/cakeand';
import styled from 'styled-components';

/**
 * Figma `gradient/ai/surface` — not exported in the current cake& token dump.
 * Values taken from the filled homescreen prompt node (indigo/30 → violet/60).
 */
export const AI_SURFACE_GRADIENT =
  'linear-gradient(9.46deg, rgba(32, 52, 183, 0.15) 0%, rgba(160, 120, 255, 0.15) 100%)';

/** Suggestion chip label gradient (indigo/70 → purple/70). */
export const AI_TEXT_GRADIENT =
  'linear-gradient(5.69deg, rgb(152, 164, 255) 0%, rgb(221, 138, 255) 100%)';

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

export const EventCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: var(--color-surfaces-canvas);
  overflow: hidden;
`;

export const EventThumbWrap = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  background: var(--color-surfaces-canvas);
`;

export const EventThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const EventBadgeSlot = styled.div`
  display: flex;
  align-items: center;
`;

export const EventBody = styled.div`
  padding: var(--space-300);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-200);
`;

export const EventText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--space-050);
  width: 100%;
`;

export const EventTitle = styled.h3`
  margin: 0;
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

export const EventDesc = styled.p`
  margin: 0;
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-icon-secondary);
  line-height: 1.35;
`;

export const LowerGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(400px, 680px) minmax(0, 480px);
  column-gap: var(--space-600);
  row-gap: var(--space-300);
  width: 100%;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

export const PromptPanel = styled.div`
  display: flex;
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
  border-radius: 24px;
  border: var(--stroke-100) solid #2034b7;
  background-image: ${AI_SURFACE_GRADIENT};
  backdrop-filter: blur(45px);
  -webkit-backdrop-filter: blur(45px);
  box-shadow:
    0 4px 12px 0 var(--color-elevation-drop-shadow-light),
    0 3px 24px 0 var(--color-elevation-drop-shadow-heavy);
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
  height: 32px;
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
    color: var(--color-text-icon-on-tonal);
    background-color: transparent;
  }

  && > button {
    color: var(--color-text-icon-on-tonal);
    font-weight: var(--font-weight-medium);
  }

  background-image: ${AI_SURFACE_GRADIENT};
  backdrop-filter: blur(45px);
  -webkit-backdrop-filter: blur(45px);
  box-shadow:
    0 4px 12px 0 var(--color-elevation-drop-shadow-light),
    0 3px 24px 0 var(--color-elevation-drop-shadow-heavy);
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
  flex-direction: column;
  gap: var(--space-300);
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
    min-height: 180px;
    padding: var(--space-800) var(--space-300);
    border: var(--stroke-100) solid var(--color-stroke-border);
    border-radius: var(--radius-400);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    width: 100%;
    box-sizing: border-box;
  }

  & [role='group'] > div:first-of-type {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
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
    width: 24px;
    height: 24px;
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
    min-height: 320px;
  }
`;

export const UploadBoundary = styled.div<{ $empty: boolean }>`
  position: relative;
  width: 100%;
  max-width: calc(var(--space-800) * 10);
  margin-inline: 0;
`;

export const UploadProgressWrap = styled.div`
  position: absolute;
  right: var(--space-500);
  bottom: var(--space-300);
  left: var(--space-500);
  z-index: 2;
  pointer-events: none;

  &,
  & * {
    font-size: var(--type-size-caption) !important;
  }
`;

export const MediaList = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

export const MediaRow = styled(Card)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-200);
  height: calc(var(--space-1000) + var(--space-100));
  min-height: calc(var(--space-1000) + var(--space-100));
  box-sizing: border-box;
  padding: var(--space-200);
  border-radius: var(--radius-300);
  border: var(--stroke-100) solid var(--color-stroke-border);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;

export const MediaThumb = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: var(--radius-300);
  flex-shrink: 0;
`;

export const MediaMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

export const MediaTitle = styled.p`
  margin: 0;
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  color: var(--color-text-icon-primary);
`;

export const MediaDuration = styled.p`
  margin: 0;
  display: inline-flex;
  width: fit-content;
  padding-inline: var(--space-050);
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary-overlay);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-icon-primary);
`;
