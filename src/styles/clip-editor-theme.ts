import styled from 'styled-components';

export const ClipEditorShell = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-300);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-on-container);
`;

export const ClipEditorHeader = styled.div`
  display: flex;
  min-width: 0;
  align-items: flex-start;
  gap: var(--space-100);
`;

export const ClipEditorHeading = styled.div`
  min-width: 0;
  flex: 1;
`;

export const ClipEditorTitle = styled.h2`
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ClipEditorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  margin-top: var(--space-050);
`;

export const ClipEditorBody = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-300);
`;

export const ClipEditorPlayer = styled.div`
  display: flex;
  width: 100%;
  max-width: calc(var(--space-1000) * 6);
  align-self: center;

  > * {
    width: 100%;
  }
`;

export const PreviewToolbar = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
`;

export const FocusPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-200);
  padding: var(--space-300);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-on-container);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

export const FocusField = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-100);
`;

export const FocusLabel = styled.span`
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
`;

export const FocusChipRow = styled.div`
  display: flex;
  min-width: 0;
  flex-wrap: wrap;
  gap: var(--space-200);
`;

export const FocusDropdownIcon = styled.span<{ $open: boolean }>`
  display: inline-flex;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 160ms ease;
`;

export const Section = styled.section`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-200);
`;

export const SectionHeader = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-100);
`;

export const SectionTitle = styled.h3`
  margin: 0;
  flex: 1;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const SettingsCard = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-300);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-container);
`;

export const TrimControl = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-075);
  padding: var(--space-200);
  border: var(--stroke-100) solid var(--color-primary-primary);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-low);
`;

export const TrimFilmstrip = styled.div`
  position: relative;
  display: flex;
  height: var(--space-1000);
  gap: var(--space-025);
  border-radius: var(--radius-100);
  overflow: hidden;
  touch-action: none;
`;

export const TrimFrame = styled.img`
  min-width: 0;
  height: 100%;
  flex: 1;
  object-fit: cover;
`;

export const TrimDim = styled.span<{
  $side: 'left' | 'right';
  $percent: number;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${({ $side }) => $side}: 0;
  width: ${({ $percent }) => `${$percent}%`};
  background: var(--color-surfaces-canvas);
  opacity: 0.6;
  pointer-events: none;
`;

export const TrimActiveRange = styled.span<{
  $start: number;
  $end: number;
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $start }) => `${$start}%`};
  width: ${({ $start, $end }) => `${$end - $start}%`};
  border-block: var(--stroke-200) solid var(--color-primary-primary);
  pointer-events: none;
`;

export const TrimHandle = styled.div<{
  $percent: number;
  $side: 'left' | 'right';
}>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $percent }) => `${$percent}%`};
  z-index: 2;
  width: var(--space-300);
  transform: translateX(-50%);
  border-radius: ${({ $side }) =>
    $side === 'left'
      ? 'var(--radius-50) 0 0 var(--radius-50)'
      : '0 var(--radius-50) var(--radius-50) 0'};
  background: var(--color-primary-primary);
  cursor: ew-resize;
  touch-action: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    width: var(--space-025);
    transform: translateX(-50%);
    border-radius: var(--radius-50);
    background: var(--color-text-icon-on-primary);
  }

  &::before {
    top: var(--space-250);
    height: var(--space-400);
  }

  &::after {
    bottom: var(--space-250);
    height: var(--space-075);
    opacity: 0.5;
  }

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-text-icon-primary);
    outline-offset: var(--space-025);
  }
`;

export const TrimPlayhead = styled.span<{ $percent: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $percent }) => `${$percent}%`};
  z-index: 1;
  width: var(--space-025);
  background: var(--color-text-icon-primary);
  opacity: 0.9;
  pointer-events: none;
`;

export const TrimMarkers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  opacity: 0.7;
`;

export const TrimMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

export const PlaybackRow = styled.div`
  display: flex;
  min-width: 0;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);

  > * {
    flex: 1 1 0;
  }
`;

export const MetadataSummary = styled.article`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-200);
  padding: var(--space-200);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-container);
`;

export const MetadataThumb = styled.img`
  width: var(--space-900);
  height: var(--space-900);
  flex: none;
  border-radius: var(--radius-200);
  object-fit: cover;
`;

export const MetadataCopy = styled.div`
  min-width: 0;
  flex: 1;
`;

export const MetadataTitle = styled.h4`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-subtitle);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const MetadataDescription = styled.p`
  margin: var(--space-050) 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-body);
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const MetadataRow = styled.button<{ $selected?: boolean }>`
  display: grid;
  min-width: 0;
  grid-template-columns:
    auto minmax(calc(var(--space-1000) * 2), 1.2fr)
    minmax(var(--space-1000), 1fr) minmax(var(--space-1000), 1.6fr);
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-100) var(--space-200);
  border: ${({ $selected }) =>
    $selected
      ? 'var(--stroke-200) solid var(--color-primary-primary)'
      : 'var(--stroke-100) solid transparent'};
  border-radius: var(--radius-1000);
  background: ${({ $selected }) =>
    $selected
      ? 'var(--color-tonal-tonal-overlay)'
      : 'var(--color-surfaces-on-container)'};
  color: var(--color-text-icon-primary);
  font: inherit;
  font-size: var(--type-size-caption);
  text-align: left;
  cursor: pointer;

  > span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > span:last-child {
    display: -webkit-box;
    white-space: normal;
    word-break: break-word;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`;

export const PreviewEventList = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-050);
`;

export const EditableEventRow = styled.div<{ $selected?: boolean }>`
  display: grid;
  min-width: 0;
  grid-template-columns:
    minmax(var(--space-900), 0.6fr) minmax(var(--space-1000), 0.9fr)
    minmax(var(--space-1000), 1fr) minmax(var(--space-1000), 1.5fr) auto;
  align-items: center;
  gap: var(--space-100);
  padding: var(--space-100);
  border: ${({ $selected }) =>
    $selected
      ? 'var(--stroke-200) solid var(--color-primary-primary)'
      : 'var(--stroke-100) solid transparent'};
  border-radius: var(--radius-150);
  background: ${({ $selected }) =>
    $selected
      ? 'var(--color-tonal-tonal-overlay)'
      : 'var(--color-surfaces-on-container-low)'};
`;

export const InlineInput = styled.input`
  min-width: 0;
  width: 100%;
  padding: var(--space-075) var(--space-100);
  border: 0;
  border-radius: var(--radius-100);
  background: var(--color-surfaces-container);
  color: var(--color-text-icon-primary);
  font: inherit;
  font-size: var(--type-size-caption);

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
  }
`;

export const TranscriptCard = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-100);
  max-height: calc(var(--space-1000) * 3);
  padding: var(--space-200);
  border: var(--stroke-100) solid var(--color-stroke-border-low);
  border-radius: var(--radius-300);
  background: var(--color-surfaces-on-container-low);
  color: var(--color-text-icon-primary);
  overflow-y: auto;
`;

export const TranscriptHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-200);
  color: var(--color-info-info);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
`;

export const TranscriptText = styled.p`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  line-height: 1.45;
  white-space: pre-line;
`;

export const TranscriptTextarea = styled.textarea`
  min-height: calc(var(--space-1000) * 2);
  padding: var(--space-200);
  border: var(--stroke-100) solid var(--color-primary-primary);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-on-container-low);
  color: var(--color-text-icon-primary);
  font: inherit;
  font-size: var(--type-size-body);
  line-height: 1.45;
  resize: vertical;

  &:focus-visible {
    outline: var(--stroke-200) solid var(--color-primary-primary);
    outline-offset: var(--space-025);
  }
`;

export const HelperText = styled.p`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
`;

export const EditorActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--space-100);
`;

