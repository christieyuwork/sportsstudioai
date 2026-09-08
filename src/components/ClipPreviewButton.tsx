import styled from 'styled-components';
import { TooltipIconButton } from './TooltipIconButton';

export interface ClipPreviewButtonProps {
  title: string;
  onPreview: () => void;
}

/** The single preview action used by every clip-card presentation. */
export function ClipPreviewButton({
  title,
  onPreview,
}: ClipPreviewButtonProps) {
  return (
    <PreviewButton
      size="xs"
      variant="ghost"
      intent="secondary"
      label={`Preview ${title}`}
      icon={<PreviewGlyph />}
      onClick={onPreview}
    />
  );
}

const PreviewButton = styled(TooltipIconButton)`
  && {
    background: var(--color-success-success-overlay);
    color: var(--color-success-success);
  }
`;

const PreviewGlyph = styled.span`
  display: block;
  width: var(--space-400);
  height: var(--space-400);
  background: currentColor;
  mask: url('/icons/player/play_circle.svg') center / contain no-repeat;
  -webkit-mask: url('/icons/player/play_circle.svg') center / contain no-repeat;
`;
