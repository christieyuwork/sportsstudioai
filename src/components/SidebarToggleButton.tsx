import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TooltipIconButton } from './TooltipIconButton';

export interface SidebarToggleButtonProps {
  label: string;
  onClick: () => void;
  /** Mirror the glyph so the chevron reads as "expand" once the rail is gone. */
  flipped?: boolean;
}

/**
 * Collapse / expand control for the studio rail. Shared so the control inside
 * the rail and the one left behind when the rail collapses stay identical.
 */
export function SidebarToggleButton({
  label,
  onClick,
  flipped = false,
}: SidebarToggleButtonProps) {
  const slotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    /*
      Figma puts this control in the rail's brand row, which is cake&'s
      SidebarNav `logo` slot — and cake& marks that slot aria-hidden because it
      expects a decorative mark there. That would hide a real button from
      assistive tech, so un-hide the wrapper we were dropped into.
    */
    const slot = slotRef.current?.parentElement;
    if (slot?.getAttribute('aria-hidden') === 'true') {
      slot.removeAttribute('aria-hidden');
    }
  }, []);

  return (
    <ToggleSlot ref={slotRef}>
      <TooltipIconButton
        size="sm"
        intent="secondary"
        variant="ghost"
        label={label}
        aria-label={label}
        icon={<SidebarGlyph $flipped={flipped} />}
        onClick={onClick}
      />
    </ToggleSlot>
  );
}

const ToggleSlot = styled.span`
  display: contents;
`;

/**
 * Masked so the glyph takes the IconButton's secondary color via currentColor;
 * the Figma export is a dark stroke that would otherwise stay #25262D.
 */
const SidebarGlyph = styled.span<{ $flipped: boolean }>`
  display: block;
  width: var(--space-400);
  height: var(--space-400);
  background: var(--color-text-icon-secondary);
  mask: url('/icons/sidebar.svg') center / contain no-repeat;
  -webkit-mask: url('/icons/sidebar.svg') center / contain no-repeat;
  transform: ${({ $flipped }) => ($flipped ? 'scaleX(-1)' : 'none')};
`;
