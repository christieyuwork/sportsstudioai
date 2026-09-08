import type { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

const RecordingBadgeRoot = styled.span`
  display: inline-flex;
  min-height: var(--space-400);
  align-items: center;
  gap: var(--space-050);
  padding-inline: var(--space-100);
  border-radius: var(--radius-1000);
  background: var(--color-badge-red-light);
  color: var(--color-badge-text-icon-on-red-light);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  white-space: nowrap;
`;

const RecordingIcon = styled.img`
  width: var(--space-200);
  height: var(--space-200);
  flex: none;
  object-fit: contain;
`;

export interface RecordingBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

/** Duration/status pill using the approved concentric recording glyph. */
export function RecordingBadge({
  children,
  ...props
}: RecordingBadgeProps) {
  return (
    <RecordingBadgeRoot {...props}>
      <RecordingIcon src="/icons/recording-status.png" alt="" aria-hidden />
      {children}
    </RecordingBadgeRoot>
  );
}
