import { Scrollbar } from '@cake-admin/cakeand';
import styled, { createGlobalStyle } from 'styled-components';

/**
 * Studio-wide scrollbar treatment: 2px at rest and 8px while the owning
 * surface is hovered or focused. Native overflow regions use a transparent
 * border to preserve the 8px hit target while presenting a 2px thumb.
 */
export const StudioScrollbarGlobals = createGlobalStyle`
  * {
    scrollbar-color:
      var(--color-stroke-border-high)
      transparent;
    scrollbar-width: thin;
  }

  *::-webkit-scrollbar {
    width: var(--space-100);
    height: var(--space-100);
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  *::-webkit-scrollbar-thumb {
    border:
      calc((var(--space-100) - var(--stroke-200)) / 2)
      solid transparent;
    border-radius: var(--radius-1000);
    background:
      var(--color-stroke-border-high)
      padding-box;
  }

  *:hover::-webkit-scrollbar-thumb,
  *:focus-within::-webkit-scrollbar-thumb {
    border-width: 0;
  }
`;

/** cake& ScrollArea equivalent of the global native treatment. */
export const StudioScrollbar = styled(Scrollbar)`
  && [data-orientation='vertical'] {
    width: var(--stroke-200);
    padding: 0;
    transition: width 160ms ease;
  }

  && [data-orientation='horizontal'] {
    height: var(--stroke-200);
    padding: 0;
    transition: height 160ms ease;
  }

  &&:hover [data-orientation='vertical'],
  &&:focus-within [data-orientation='vertical'] {
    width: var(--space-100);
  }

  &&:hover [data-orientation='horizontal'],
  &&:focus-within [data-orientation='horizontal'] {
    height: var(--space-100);
  }
`;
