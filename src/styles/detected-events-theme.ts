import {
  Card,
  MenuContainer,
  MenuItem,
} from '@cake-admin/cakeand';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import styled from 'styled-components';
import { TooltipIconButton } from '../components/TooltipIconButton';

export const SelectionActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-100);
`;

export const SelectableEventCard = styled(Card)<{ $selected: boolean }>`
  && {
    position: relative;
    display: flex;
    flex-direction: column;
    border: var(--stroke-100) solid
      ${({ $selected }) =>
        $selected ? 'var(--color-primary-primary)' : 'var(--color-stroke-border)'};
    border-radius: var(--radius-400);
    background: var(--color-surfaces-canvas);
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
  height: calc(var(--space-1000) * 2);
  object-fit: cover;
`;

export const DetectedEventBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  padding: var(--space-500);
`;

export const DetectedEventMeta = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-050);
`;

export const DetectedEventTitle = styled.h3`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
`;

export const EventCardTitleRow = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-050);
  width: 100%;
`;

export const EventCardActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  flex: none;
`;

export const DetectedEventDescription = styled.span`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.2;
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

export const SuggestedClipCard = styled(Card)`
  && {
    display: flex;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    gap: var(--space-300);
    padding: var(--space-200);
    border: var(--stroke-100) solid var(--color-stroke-border);
    border-radius: var(--radius-300);
    background: var(--color-surfaces-container-blur);
    cursor: grab;
  }

  &&:active {
    cursor: grabbing;
  }
`;

export const SuggestedClipDragButton = styled(TooltipIconButton)`
  && {
    flex: none;
    cursor: grab;
  }
`;

export const SuggestedClipImage = styled.img`
  display: block;
  width: calc(var(--space-1000) + var(--space-800));
  height: calc(var(--space-1000) + var(--space-300));
  flex: none;
  border-radius: var(--radius-300);
  object-fit: cover;
`;

export const SuggestedClipBody = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--space-200);
`;

export const SuggestedClipCopy = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--space-050);
`;

export const SuggestedClipTitle = styled.h3`
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const SuggestedClipDescription = styled.p`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  line-height: 1.35;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const SuggestedClipMeta = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-050);
`;

export const SuggestedSourceLabel = styled.span`
  overflow: hidden;
  padding-inline: var(--space-050);
  border-radius: var(--radius-1000);
  background: var(--color-surfaces-on-container);
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompactClipCard = styled(Card)<{ $selected: boolean }>`
  && {
    display: flex;
    min-width: 0;
    flex-direction: row;
    align-items: center;
    gap: var(--space-300);
    padding: var(--space-200);
    border: var(--stroke-100) solid
      ${({ $selected }) =>
        $selected ? 'var(--color-primary-primary)' : 'var(--color-stroke-border)'};
    border-radius: var(--radius-300);
    background: var(--color-surfaces-container-blur);
  }
`;

export const CompactClipImage = styled.img`
  display: block;
  width: var(--space-900);
  height: var(--space-900);
  flex: none;
  border-radius: var(--radius-200);
  object-fit: cover;
`;

export const CompactClipBody = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: var(--space-050);
`;

export const CompactClipTitle = styled.h3`
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompactClipDescription = styled.p`
  margin: 0;
  overflow: hidden;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CompactClipMeta = styled.div`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: var(--space-100);
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-caption);
`;
