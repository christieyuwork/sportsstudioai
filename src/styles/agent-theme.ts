import {
  Card,
  ContentSwitcher,
  HorizontalTabs,
  IconButton,
  MenuContainer,
  Scrollbar,
} from '@cake-admin/cakeand';
import {
  DropdownMenu as RadixDropdownMenu,
  Popover as RadixPopover,
} from 'radix-ui';
import styled, { css, keyframes } from 'styled-components';
import { AI_TEXT_GRADIENT, MainPane, PromptBox } from './home-theme';

const textShimmer = keyframes`
  from { background-position: 100% 50%; }
  to { background-position: -100% 50%; }
`;

const cardReveal = keyframes`
  from {
    opacity: 0;
    transform: translateY(var(--space-100));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const overlayReveal = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  20%, 75% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1); }
`;

export const AgentMainPane = styled(MainPane)`
  overflow: hidden;
`;

export const AgentWorkspaceShell = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: var(--space-300);
  height: calc(100vh - var(--space-800));
  min-height: 0;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    height: auto;
    overflow-y: auto;
  }
`;

export const ConversationPane = styled.section`
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  overflow: hidden;
`;

export const AgentTextShield = styled.img`
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export const ConversationScroll = styled(Scrollbar)`
  && {
    flex: 1;
    min-height: 0;
  }

  & [data-orientation='vertical'] {
    width: var(--stroke-200);
    padding: 0;
    transition: width 160ms ease;
  }

  &:hover [data-orientation='vertical'],
  &:focus-within [data-orientation='vertical'] {
    width: var(--space-100);
  }
`;

export const ConversationScrollContent = styled.div`
  position: relative;
  z-index: 1;
  padding: var(--space-500) var(--space-600) var(--space-400);
`;

export const UserBubbleRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const UserBubble = styled.p`
  max-width: 70%;
  margin: 0;
  padding: var(--space-200) var(--space-300);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-on-container);
  box-shadow: var(--elevation-3);
  backdrop-filter: blur(45px);
  -webkit-backdrop-filter: blur(45px);
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
`;

export const AssistantResponse = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  margin-top: var(--space-400);
`;

export const AssistantText = styled.p`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  line-height: 1.35;
`;

export const StreamingLead = styled(AssistantText)`
  min-height: calc(var(--type-size-body) * 1.35);
`;

export const ThinkingRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
`;

export const ThinkingVideo = styled.video`
  width: var(--space-800);
  height: var(--space-800);
  flex: none;
  object-fit: cover;
  border-radius: var(--radius-1000);
`;

export const ThinkingCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
`;

export const ThinkingLine = styled.span<{ $active: boolean }>`
  opacity: ${({ $active }) => ($active ? 1 : 0.72)};

  ${({ $active }) =>
    $active
      ? css`
        background-image: ${AI_TEXT_GRADIENT};
        background-size: 220% 100%;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        animation: ${textShimmer} 1.5s linear infinite;
      `
      : ''}
`;

export const ReasoningTrace = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

export const ReasoningTraceCard = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    gap: var(--space-100);
    padding: var(--space-300);
    border: var(--stroke-100) solid var(--color-stroke-border-low);
    border-radius: var(--radius-400);
    background: var(--color-surfaces-container-blur);
    animation: ${cardReveal} 320ms ease-out both;
  }
`;

export const ReasoningTraceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

export const ReasoningTraceTitle = styled.span`
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
`;

export const ReasoningTraceMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

export const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  padding-inline: var(--space-300);
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
`;

export const ClipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
`;

export const ClipCard = styled(Card)<{ $selected: boolean }>`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: var(--space-300);
    min-width: 0;
    padding: var(--space-200);
    border: var(--stroke-100) solid
      ${({ $selected }) =>
        $selected ? 'var(--color-primary-primary)' : 'var(--color-stroke-border)'};
    border-radius: var(--radius-300);
    background: var(--color-surfaces-container-blur);
    animation: ${cardReveal} 320ms ease-out both;
  }
`;

export const ClipThumb = styled.img`
  width: var(--space-900);
  height: var(--space-900);
  flex: none;
  border-radius: var(--radius-200);
  object-fit: cover;
`;

export const ClipCopy = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-050);
`;

export const ClipTitle = styled.h3`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const ClipDescription = styled.span`
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const DescriptionTooltipWrap = styled.span`
  display: block;
  min-width: 0;

  & > button {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: left;
    cursor: help;
  }

  & > button:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

export const ClipMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
`;

export const CountryMeta = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-050);
  padding-inline: var(--space-050);
  border-radius: var(--radius-1000);
  background: var(--color-badge-yellow-light);
  color: var(--color-badge-text-icon-on-yellow-light);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
`;

export const CountryFlag = styled.img`
  display: block;
  width: var(--space-300);
  height: var(--space-300);
  border-radius: var(--radius-1000);
  object-fit: cover;
`;

export const PreviewClipButton = styled(IconButton)`
  && {
    background: var(--color-badge-green-light);
    color: var(--color-badge-green);
  }
`;

export const PreviewPlayGlyph = styled.span`
  display: block;
  width: var(--space-350);
  height: var(--space-350);
  background: var(--color-badge-green);
  mask: url('/icons/player/play_circle.svg') center / contain no-repeat;
  -webkit-mask: url('/icons/player/play_circle.svg') center / contain no-repeat;
`;

export const ReasoningDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-075);
  padding-top: var(--space-100);
  border-top: var(--stroke-100) solid var(--color-stroke-border-low);
`;

export const ReasoningCheck = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  color: var(--color-badge-green);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
`;

export const ReasoningCaption = styled.p`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  line-height: 1.35;
`;

export const FeedbackRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

export const AgentComposer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  flex: none;
  padding-inline: var(--space-600);
  box-sizing: border-box;
`;

export const LibraryWelcome = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  min-height: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: var(--space-600);
`;

export const LibraryWelcomeContent = styled.div`
  display: flex;
  width: 100%;
  max-width: calc(var(--space-1000) * 7);
  flex-direction: column;
  gap: var(--space-300);
  text-align: center;
`;

export const LibraryWelcomeTitle = styled.h1`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
`;

export const LibraryWelcomeText = styled.p`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
`;

export const AgentPromptBox = styled(PromptBox)`
  max-width: none;
`;

export const AgentDisclaimer = styled.p`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  line-height: 1.35;
  text-align: center;
`;

export const PreviewSurface = styled(Card)`
  && {
    display: flex;
    min-width: 0;
    min-height: 0;
    flex-direction: column;
    border: var(--stroke-100) solid var(--color-stroke-border);
    border-radius: var(--radius-400);
    background: var(--color-surfaces-container-blur);
    box-shadow: var(--elevation-5);
    backdrop-filter: blur(var(--space-100));
    -webkit-backdrop-filter: blur(var(--space-100));
    overflow: hidden;
  }
`;

export const PreviewTabsRoot = styled(HorizontalTabs)`
  && {
    display: flex;
    min-height: 0;
    flex: 1;
    flex-direction: column;
  }

  & > [role='tabpanel'] {
    min-height: 0;
    flex: 1;
  }

  & > [role='tabpanel'][data-state='active'] {
    display: flex;
  }

  & > [role='tabpanel'][data-state='inactive'] {
    display: none;
  }
`;

export const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
  padding: var(--space-300);
`;

export const PreviewPanelBody = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  padding: 0 var(--space-500) var(--space-500);
`;

export const EmptyPreview = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
  text-align: center;
`;

export const SelectedPreview = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  gap: var(--space-300);
  overflow-y: auto;
`;

export const PreviewTitle = styled.h2`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const PreviewHeadingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-050);
`;

export const PreviewImage = styled.img`
  width: 100%;
  aspect-ratio: 672 / 379;
  display: block;
  object-fit: cover;
`;

export const PreviewHint = styled.p`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  line-height: 1.35;
`;

export const PreviewMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

export const PreviewMediaFrame = styled.div`
  position: relative;
  flex: none;
  overflow: hidden;
  border-radius: var(--radius-300);
  background: var(--color-surfaces-on-container-low);
`;

export const PlayerControls = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: var(--space-100);
  height: var(--space-700);
  padding: var(--space-050) var(--space-100);
  background: var(--color-surfaces-container-blur);
  box-sizing: border-box;
`;

export const PlayerControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  flex: none;
`;

export const PlayerIcon = styled.img`
  display: block;
  width: var(--space-400);
  height: var(--space-400);
  object-fit: contain;
  filter: brightness(0) invert(1);
`;

export const TimelineRow = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: var(--space-100);
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-caption);
`;

export const PlayerTimeline = styled.input<{ $progress: number }>`
  flex: 1;
  min-width: 0;
  height: var(--stroke-200);
  margin: 0;
  border: 0;
  border-radius: var(--radius-1000);
  appearance: none;
  background: linear-gradient(
    to right,
    var(--color-primary-primary) 0 ${({ $progress }) => `${$progress}%`},
    var(--color-stroke-border) ${({ $progress }) => `${$progress}%`} 100%
  );
  cursor: pointer;

  &::-webkit-slider-thumb {
    width: var(--space-200);
    height: var(--space-200);
    border: 0;
    border-radius: var(--radius-1000);
    appearance: none;
    background: var(--color-text-icon-primary);
  }

  &::-moz-range-thumb {
    width: var(--space-200);
    height: var(--space-200);
    border: 0;
    border-radius: var(--radius-1000);
    background: var(--color-text-icon-primary);
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-100);
  }
`;

export const VolumePopoverContent = styled(RadixPopover.Content)`
  z-index: 120;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-100) var(--space-200);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-on-container);
  box-shadow: var(--elevation-3);
  outline: none;
`;

export const VolumeSlider = styled.input<{ $progress: number }>`
  width: var(--stroke-200);
  height: calc(var(--space-1000) + var(--space-400));
  flex: none;
  margin: 0;
  border: 0;
  border-radius: var(--radius-1000);
  appearance: none;
  writing-mode: vertical-lr;
  direction: rtl;
  background: linear-gradient(
    to top,
    var(--color-primary-primary) 0 ${({ $progress }) => `${$progress}%`},
    var(--color-stroke-border) ${({ $progress }) => `${$progress}%`} 100%
  );
  cursor: pointer;

  &::-webkit-slider-thumb {
    width: var(--space-200);
    height: var(--space-200);
    border: 0;
    border-radius: var(--radius-1000);
    appearance: none;
    background: var(--color-text-icon-primary);
  }

  &::-moz-range-thumb {
    width: var(--space-200);
    height: var(--space-200);
    border: 0;
    border-radius: var(--radius-1000);
    background: var(--color-text-icon-primary);
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-100);
  }
`;

export const VolumeValue = styled.span`
  min-width: var(--space-500);
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-caption);
  font-variant-numeric: tabular-nums;
  text-align: right;
`;

export const PlayerOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-container-blur);
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: ${overlayReveal} 900ms ease-out both;
`;

export const ConsoleFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  padding-top: var(--space-100);
  color: var(--color-text-icon-secondary);
  font-size: 10px;
  line-height: 1.35;
`;

export const TranscriptPanel = styled(Card)`
  && {
    display: flex;
    flex: none;
    height: calc(var(--space-1000) * 3 + var(--space-700));
    min-height: 0;
    flex-direction: column;
    gap: var(--space-200);
    padding: var(--space-200);
    border-radius: var(--radius-400);
    background: var(--color-surfaces-on-container);
  }
`;

export const TranscriptViewButtons = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

export const TranscriptBody = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  line-height: 1.35;

  p {
    margin: 0 0 var(--space-200);
  }
`;

export const TranscriptMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
`;

export const TranscriptLabel = styled.span`
  color: var(--color-info-info);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
`;

export const DensePanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-200);
`;

export const DenseStat = styled(Card)`
  && {
    display: flex;
    flex-direction: column;
    gap: var(--space-050);
    padding: var(--space-200);
    border-radius: var(--radius-200);
    background: var(--color-tonal-tonal-secondary-overlay);
  }

  strong {
    color: var(--color-text-icon-primary);
    font-size: var(--type-size-subject);
  }

  span {
    color: var(--color-text-icon-secondary);
    font-size: var(--type-size-caption);
  }
`;

export const PreviewActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-500);
  padding: var(--space-300) var(--space-500);
`;

export const PreviewBrand = styled.img`
  display: block;
  width: 129px;
  height: var(--space-500);
  margin-top: auto;
  object-fit: contain;
`;

export const ActionStatus = styled.span`
  color: var(--color-success-success);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
`;

export const ExactIcon = styled.img`
  display: block;
  width: var(--space-350);
  height: var(--space-350);
  object-fit: contain;
`;

export const FeedbackIcon = styled(ExactIcon)`
  filter: brightness(0) invert(1);
`;

export const AddMenuContent = styled(RadixDropdownMenu.Content)`
  z-index: 120;
  outline: none;
`;

export const AddMenuContainer = styled(MenuContainer)`
  && {
    border-radius: var(--radius-300);
  }
`;

export const ProjectMediaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-200);
`;

export const ProjectMediaSwitcher = styled(ContentSwitcher)`
  width: 100%;
  flex: none;
`;

export const MediaLibrary = styled.div`
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--space-500);
  overflow-y: auto;
  padding-top: var(--space-500);
`;

export const MediaLibrarySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
`;

export const MediaLibraryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

export const MediaLibraryTitle = styled.h2`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
`;

export const UploadedMediaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding-top: var(--space-500);
`;

export const UploadedMediaRow = styled(Card)`
  && {
    display: flex;
    align-items: center;
    gap: var(--space-200);
    padding: var(--space-100);
    border: var(--stroke-100) solid var(--color-stroke-border);
    border-radius: var(--radius-300);
    background: var(--color-surfaces-canvas);
  }
`;

export const UploadedMediaCopy = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--space-025);
`;

export const UploadedMediaTitle = styled.span`
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UploadedMediaDuration = styled.span`
  color: var(--color-text-icon-on-tonal);
  font-size: var(--type-size-caption);
`;

export const ButtonIconMask = styled.span<{ $asset: string }>`
  display: block;
  width: var(--space-300);
  height: var(--space-300);
  background: currentColor;
  mask: ${({ $asset }) => `url('${$asset}') center / contain no-repeat`};
  -webkit-mask: ${({ $asset }) =>
    `url('${$asset}') center / contain no-repeat`};
`;

export const ProjectMediaTile = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-200);
  border-radius: var(--radius-300);
`;

export const ProjectMediaTileImage = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-200);
  object-fit: cover;
`;

export const ProjectMediaTileLabel = styled.p`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
`;
