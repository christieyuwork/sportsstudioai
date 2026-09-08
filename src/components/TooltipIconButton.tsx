import { forwardRef } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { IconButton } from '@cake-admin/cakeand';
import { Tooltip as RadixTooltip } from 'radix-ui';
import styled from 'styled-components';

export interface TooltipIconButtonProps
  extends ComponentPropsWithoutRef<typeof IconButton> {
  /** Defaults to the button's accessible label. */
  tooltip?: ReactNode;
}

/**
 * The app-wide icon-button contract: cake& owns the button, while Radix's
 * asChild trigger adds a portalled tooltip without nesting another button.
 */
export const TooltipIconButton = forwardRef<
  HTMLButtonElement,
  TooltipIconButtonProps
>(function TooltipIconButton({ label, tooltip = label, ...props }, ref) {
  return (
    <RadixTooltip.Provider delayDuration={300}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <StudioIconButton ref={ref} label={label} {...props} />
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <TooltipContent side="bottom" align="center">
            {tooltip}
          </TooltipContent>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
});

const StudioIconButton = styled(IconButton)`
  && > span[aria-hidden='true'] {
    width: var(--space-400);
    height: var(--space-400);
  }

  && svg,
  && img {
    width: var(--space-400);
    height: var(--space-400);
  }
`;

const TooltipContent = styled(RadixTooltip.Content)`
  /* cake& modal layers sit at 1000; tooltips must remain visible above them. */
  z-index: 1200;
  max-width: calc(var(--space-1000) * 3 + var(--space-500));
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-inverse-container);
  box-shadow: var(--elevation-2);
  color: var(--color-text-icon-inverse);
  font-family: var(--font-family);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-regular);
  line-height: 1.35;
  pointer-events: none;
`;
