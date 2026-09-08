import styled from 'styled-components';

export const PreviewTabRow = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: flex-end;
  gap: var(--space-200);
`;

/**
 * The video project reads as the third tab, but its trailing menu trigger is a
 * real button — so it cannot live inside a `HorizontalTabItem` (nested buttons)
 * or inside the tablist (whose children must be tabs). This wrapper reproduces
 * the cake& tab shell instead: 48px tall, 16px radius, tonal wash and 4px
 * indicator when selected.
 */
export const VideoProjectSelect = styled.div<{ $active: boolean }>`
  display: flex;
  min-width: 0;
  height: var(--space-800);
  flex-direction: column;
  justify-content: center;
  padding-inline: var(--space-100);
  border-radius: var(--radius-300);
  background: ${({ $active }) =>
    $active ? 'var(--color-tonal-tonal-overlay)' : 'transparent'};
`;

export const VideoProjectTabContent = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-150) var(--space-200) var(--space-100);
`;

export const VideoProjectIndicatorRow = styled.div<{ $active: boolean }>`
  height: var(--stroke-200);
  margin-inline: var(--space-300);
  border-radius: var(--radius-1000);
  background: ${({ $active }) =>
    $active ? 'var(--color-primary-primary)' : 'transparent'};
`;

export const VideoProjectTabButton = styled.button<{ $active: boolean }>`
  min-width: 0;
  padding: 0;
  border: 0;
  background: none;
  color: ${({ $active }) =>
    $active
      ? 'var(--color-text-icon-on-tonal)'
      : 'var(--color-text-icon-primary)'};
  font: inherit;
  font-size: var(--type-size-body);
  font-weight: ${({ $active }) =>
    $active ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)'};
  letter-spacing: 0.1px;
  line-height: 1.35;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

/** Same slot as PreviewImage so an empty timeline doesn't collapse the player. */
export const EmptyPlayerPlaceholder = styled.div`
  display: flex;
  aspect-ratio: 672 / 379;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: var(--space-400);
  box-sizing: border-box;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
  text-align: center;
`;

export const VideoEditorShell = styled.div`
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--space-300);
  overflow: hidden;
`;

export const VideoEditorTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

export const VideoEditorTitle = styled.h2`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const VideoEditorStage = styled.div<{ $scroll?: boolean }>`
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--space-200);
  overflow-x: hidden;
  overflow-y: ${({ $scroll }) => ($scroll ? 'auto' : 'hidden')};
`;

/** Keeps all four video-mode labels readable in the narrow agent panel. */
export const VideoModeSwitcherFrame = styled.div`
  min-width: 0;

  && button {
    padding-inline: var(--space-100);
  }
`;

export const TimelineSection = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-100);
`;

export const TimelineHeading = styled.h3`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  letter-spacing: 0.1px;
`;

export const TimelineStrip = styled.div`
  display: flex;
  min-width: 0;
  align-items: stretch;
  gap: var(--space-200);
  padding-bottom: var(--space-050);
  overflow-x: auto;
`;

export const TimelineThumbButton = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  width: calc(var(--space-1000) + var(--space-400));
  height: var(--space-1000);
  flex: none;
  align-items: flex-end;
  padding: var(--space-050);
  border: var(--stroke-200) solid
    ${({ $active }) =>
      $active ? 'var(--color-primary-primary)' : 'transparent'};
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-low);
  cursor: pointer;
  overflow: hidden;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-050);
  }
`;

export const TimelineThumbImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-200);
`;

export const TimelineDuration = styled.span`
  position: relative;
  z-index: 1;
  padding: 1px var(--space-050);
  border-radius: var(--radius-100);
  background: var(--color-primary-primary);
  color: var(--color-text-icon-on-primary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.2px;
  line-height: 1.35;
`;

export const TimelineAddSlot = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  align-self: stretch;
`;

/**
 * Add glyph drawn as a mask so it takes the IconButton's own on-primary indigo
 * via currentColor; the shipped SVG is a flat white fill.
 */
export const TimelineAddIcon = styled.span`
  display: block;
  width: var(--space-500);
  height: var(--space-500);
  background: var(--color-text-icon-on-primary);
  mask: url('/icons/add.svg') center / contain no-repeat;
  -webkit-mask: url('/icons/add.svg') center / contain no-repeat;
`;

export const EditorModeHeading = styled.h3`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const TimelineCards = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-100);
  padding-bottom: var(--space-100);
  overflow-x: auto;
  overflow-y: hidden;
`;

/** Keeps the add control centred against the clip cards next to it. */
export const TimelineAddCell = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding-inline: var(--space-100);
`;

export const TimelineCard = styled.article<{ $selected?: boolean }>`
  display: flex;
  width: calc(var(--space-1000) + var(--space-300));
  flex: none;
  flex-direction: column;
  gap: var(--space-050);
  padding: var(--space-100);
  border: ${({ $selected }) =>
    $selected
      ? 'var(--stroke-200) solid var(--color-primary-primary)'
      : 'var(--stroke-100) solid var(--color-stroke-border)'};
  border-radius: var(--radius-300);
  background: var(--color-surfaces-container);
  box-sizing: border-box;
`;

export const TimelineCardMedia = styled.div`
  position: relative;
  display: flex;
  height: var(--space-1000);
  align-items: flex-start;
  justify-content: space-between;
  padding: var(--space-050);
  border-radius: var(--radius-200);
  overflow: hidden;

  > button {
    backdrop-filter: blur(var(--space-050));
    -webkit-backdrop-filter: blur(var(--space-050));
  }
`;

export const TimelineCardImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const TimelineCardScrim = styled.span<{ $selected: boolean }>`
  position: absolute;
  inset: 0;
  background: var(--color-surfaces-canvas);
  opacity: ${({ $selected }) => ($selected ? 0 : 0.3)};
`;

export const TimelineCardHandle = styled.span`
  position: relative;
  z-index: 1;
  display: flex;
  width: var(--space-400);
  height: var(--space-400);
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-1000);
  background: color-mix(
    in srgb,
    var(--color-surfaces-canvas) 62%,
    var(--color-primary-primary) 38%
  );
  color: var(--color-text-icon-primary);
  backdrop-filter: blur(var(--space-050));
  -webkit-backdrop-filter: blur(var(--space-050));
  cursor: grab;
`;

export const TimelineCardDuration = styled.span`
  position: relative;
  z-index: 1;
  align-self: flex-end;
`;

export const TimelineCardBottom = styled.div`
  position: absolute;
  right: var(--space-050);
  bottom: var(--space-050);
  left: var(--space-050);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-050);
`;

export const TimelineCardSequence = styled.span`
  display: inline-flex;
  min-width: var(--space-300);
  height: var(--space-300);
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-1000);
  background: var(--color-primary-primary);
  color: var(--color-text-icon-on-primary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
`;

export const TimelineItemDescription = styled.p`
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EditorSettingsSection = styled.section`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-200);
`;

export const EditorSettingsCard = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-500);
  border-radius: var(--radius-400);
  background: var(--color-surfaces-container);
  box-shadow: var(--elevation-0);
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-500);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const SettingGroup = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-100);
`;

export const SettingControl = styled.div`
  min-width: 0;

  & > * {
    width: 100%;
  }
`;

export const CaptionTypeGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
`;

export const SettingLabel = styled.h4`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

export const CaptionPreview = styled.span<{
  $fontSize: number;
  $colorScheme: string;
  $rows: number;
}>`
  position: absolute;
  right: var(--space-600);
  bottom: var(--space-800);
  left: var(--space-600);
  z-index: 2;
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  background: ${({ $colorScheme }) =>
    $colorScheme === 'black-white'
      ? 'var(--color-surfaces-inverse-container)'
      : 'var(--color-surfaces-container-blur)'};
  color: ${({ $colorScheme }) =>
    $colorScheme === 'black-white'
      ? 'var(--color-text-icon-inverse)'
      : $colorScheme === 'yellow-black'
        ? 'var(--color-badge-yellow)'
        : 'var(--color-text-icon-primary)'};
  display: -webkit-box;
  overflow: hidden;
  font-size: ${({ $fontSize }) => `${$fontSize / 16}rem`};
  line-height: 1.35;
  text-align: center;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ $rows }) => $rows};
`;

export const ExportStack = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-300);
`;

export const ExportChoiceRow = styled.div<{ $selected?: boolean }>`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-100);
  border: ${({ $selected }) =>
    $selected
      ? 'var(--stroke-100) solid var(--color-primary-primary)'
      : 'var(--stroke-100) solid transparent'};
  border-radius: var(--radius-1000);
  background: ${({ $selected }) =>
    $selected ? 'var(--color-surfaces-on-container-low)' : 'transparent'};
`;

export const ExportChoiceMeta = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-050);
`;

export const ExportFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: var(--space-100);
`;
