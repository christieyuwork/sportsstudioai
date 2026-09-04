import {
  Card,
  Chip,
  IconButton,
  MenuContainer,
  MenuItem,
} from '@cake-admin/cakeand';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import styled from 'styled-components';

export const EventsPageBody = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-600);
`;

export const EventsPageHeader = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-300);
`;

export const SelectionActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

export const EventFilters = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  overflow-x: auto;
  padding-bottom: var(--space-050);
`;

export const EventFilterChip = styled(Chip)`
  flex: none;
`;

export const DetectedEventGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-200);

  @media (max-width: 1250px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SelectableEventCard = styled(Card)<{ $selected: boolean }>`
  && {
    position: relative;
    display: flex;
    flex-direction: column;
    border: var(--stroke-200) solid
      ${({ $selected }) =>
        $selected ? 'var(--color-primary-primary)' : 'var(--color-stroke-border)'};
    border-radius: var(--radius-300);
    background: var(--color-surfaces-container-blur);
    overflow: hidden;
  }
`;

export const EventSelectionControl = styled.div`
  position: absolute;
  z-index: 2;
  top: var(--space-100);
  right: var(--space-100);
  padding: var(--space-050);
  border-radius: var(--radius-100);
  background: var(--color-surfaces-container-blur);
`;

export const DetectedEventImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
`;

export const DetectedEventBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  padding: var(--space-300);
`;

export const DetectedEventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

export const DetectedEventTitle = styled.h3`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-subject);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const EventCardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-200);
  width: 100%;
`;

export const EventCardActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
  margin-left: auto;
  flex: none;
`;

export const EventPreviewButton = styled(IconButton)`
  && {
    background: var(--color-success-success-overlay);
    color: var(--color-success-success);
  }
`;

export const EventPreviewGlyph = styled.span`
  display: block;
  width: var(--space-300);
  height: var(--space-300);
  background: currentColor;
  mask: url('/icons/player/play_circle.svg') center / contain no-repeat;
  -webkit-mask: url('/icons/player/play_circle.svg') center / contain no-repeat;
`;

export const DetectedEventDescription = styled.span`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const EventDescriptionTooltip = styled.span`
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
`;

export const EventMenuContent = styled(RadixDropdownMenu.Content)`
  z-index: 130;
  outline: none;
`;

export const EventMenuContainer = styled(MenuContainer)`
  && {
    border-radius: var(--radius-300);
  }
`;

export const RenameMenuItem = styled(MenuItem)`
  && {
    color: var(--color-text-icon-primary);
  }
`;

export const DeleteMenuItem = styled(MenuItem)`
  && {
    color: var(--color-error-error);
  }
`;
