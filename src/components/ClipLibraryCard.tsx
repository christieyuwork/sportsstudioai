import { useState } from 'react';
import type {
  DragEventHandler,
  KeyboardEventHandler,
  ReactNode,
} from 'react';
import {
  Checkbox,
  Modal,
  ModalContent,
  ModalFooter,
  SimpleTooltip,
  TextInput,
} from '@cake-admin/cakeand';
import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { StudioIcon } from './StudioIcon';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { RecordingBadge } from './RecordingBadge';
import {
  DeleteMenuItem,
  CompactClipBody,
  CompactClipCard,
  CompactClipDescription,
  CompactClipImage,
  CompactClipMeta,
  CompactClipTitle,
  DetectedEventBody,
  DetectedEventDescription,
  DetectedEventImage,
  DetectedEventMeta,
  DetectedEventTitle,
  EventCardActions,
  EventCardTitleRow,
  EventDescriptionTooltip,
  EventMenuContainer,
  EventMenuContent,
  EventSelectionControl,
  RenameMenuItem,
  SelectableEventCard,
  SuggestedClipBody,
  SuggestedClipCard,
  SuggestedClipCopy,
  SuggestedClipDescription,
  SuggestedClipDragButton,
  SuggestedClipImage,
  SuggestedClipMeta,
  SuggestedClipTitle,
  SuggestedSourceLabel,
} from '../styles/detected-events-theme';
import { ClipPreviewButton } from './ClipPreviewButton';
import { TooltipIconButton } from './TooltipIconButton';

export interface ClipLibraryCardItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
}

export interface ClipLibraryCardProps {
  item: ClipLibraryCardItem;
  selecting?: boolean;
  selected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  onPreview: () => void;
  onRename?: (title: string) => void;
  onDelete?: () => void;
  variant?: 'grid' | 'suggested' | 'compact';
  sourceLabel?: string;
  metadata?: ReactNode;
  trailingActions?: ReactNode;
  draggable?: boolean;
  onDragStart?: DragEventHandler<HTMLElement>;
  onDragEnter?: DragEventHandler<HTMLElement>;
  onDragOver?: DragEventHandler<HTMLElement>;
  onDrop?: DragEventHandler<HTMLElement>;
  onDragEnd?: DragEventHandler<HTMLElement>;
  onDragHandleKeyDown?: KeyboardEventHandler<HTMLButtonElement>;
}

export function ClipLibraryCard({
  item,
  selecting = false,
  selected = false,
  onSelectedChange,
  onPreview,
  onRename,
  onDelete,
  variant = 'grid',
  sourceLabel = 'BBC Broadcast',
  metadata,
  trailingActions,
  draggable = false,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
  onDragHandleKeyDown,
}: ClipLibraryCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [nextTitle, setNextTitle] = useState(item.title);

  function submitRename() {
    const title = nextTitle.trim();
    if (!title) return;
    onRename?.(title);
    setRenameOpen(false);
  }

  if (variant === 'suggested') {
    return (
      <SuggestedClipCard
        role="article"
        draggable={draggable}
        onDragStart={onDragStart}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
      >
        <SuggestedClipDragButton
          size="xs"
          variant="ghost"
          intent="secondary"
          label={`Reorder ${item.title}`}
          icon={<GripVertical size={20} />}
          onKeyDown={onDragHandleKeyDown}
        />
        <SuggestedClipImage src={item.thumbnailUrl} alt="" />
        <SuggestedClipBody>
          <SuggestedClipCopy>
            <SuggestedClipTitle>{item.title}</SuggestedClipTitle>
            <SuggestedClipDescription>
              {item.description}
            </SuggestedClipDescription>
          </SuggestedClipCopy>
          <SuggestedClipMeta>
            <SuggestedSourceLabel>{sourceLabel}</SuggestedSourceLabel>
            <RecordingBadge>{item.duration}</RecordingBadge>
            <ClipPreviewButton title={item.title} onPreview={onPreview} />
          </SuggestedClipMeta>
        </SuggestedClipBody>
      </SuggestedClipCard>
    );
  }

  if (variant === 'compact') {
    return (
      <CompactClipCard $selected={selected} role="article">
        <CompactClipImage src={item.thumbnailUrl} alt="" />
        <CompactClipBody>
          <CompactClipTitle>{item.title}</CompactClipTitle>
          <CompactClipDescription>{item.description}</CompactClipDescription>
          {metadata ? <CompactClipMeta>{metadata}</CompactClipMeta> : null}
        </CompactClipBody>
        <ClipPreviewButton title={item.title} onPreview={onPreview} />
        {trailingActions}
      </CompactClipCard>
    );
  }

  return (
    <>
      <SelectableEventCard $selected={selected} role="article">
        {selecting ? (
          <EventSelectionControl>
            <Checkbox
              aria-label={`Select ${item.title}`}
              checked={selected}
              onCheckedChange={(checked) => onSelectedChange?.(checked === true)}
            />
          </EventSelectionControl>
        ) : null}

        <DetectedEventImage src={item.thumbnailUrl} alt="" />
        <DetectedEventBody>
          <DetectedEventMeta>
          <RecordingBadge>{item.duration}</RecordingBadge>
            <EventCardActions>
              <ClipPreviewButton title={item.title} onPreview={onPreview} />
              {onRename && onDelete ? (
                <RadixDropdownMenu.Root>
                  <RadixDropdownMenu.Trigger asChild>
                    <TooltipIconButton
                      size="xs"
                      variant="ghost"
                      intent="secondary"
                      label={`More options for ${item.title}`}
                      icon={<StudioIcon name="more-vert" size={20} />}
                    />
                  </RadixDropdownMenu.Trigger>
                  <RadixDropdownMenu.Portal>
                    <EventMenuContent side="bottom" align="end" sideOffset={8}>
                      <EventMenuContainer
                        role="menu"
                        aria-label={`Actions for ${item.title}`}
                        width="calc(var(--space-1000) * 2 + var(--space-500))"
                      >
                        <RadixDropdownMenu.Item asChild>
                          <RenameMenuItem
                            leftSlot={<Pencil size={16} />}
                            showRightSlot={false}
                            onClick={() => {
                              setNextTitle(item.title);
                              setRenameOpen(true);
                            }}
                          >
                            Rename
                          </RenameMenuItem>
                        </RadixDropdownMenu.Item>
                        <RadixDropdownMenu.Item asChild>
                          <DeleteMenuItem
                            leftSlot={<Trash2 size={16} />}
                            showRightSlot={false}
                            onClick={() => setDeleteOpen(true)}
                          >
                            Delete
                          </DeleteMenuItem>
                        </RadixDropdownMenu.Item>
                      </EventMenuContainer>
                    </EventMenuContent>
                  </RadixDropdownMenu.Portal>
                </RadixDropdownMenu.Root>
              ) : null}
            </EventCardActions>
          </DetectedEventMeta>

          <EventCardTitleRow>
            <DetectedEventTitle>{item.title}</DetectedEventTitle>
            <EventDescriptionTooltip>
              <SimpleTooltip
                trigger={
                  <DetectedEventDescription>
                    {item.description}
                  </DetectedEventDescription>
                }
                side="bottom"
                align="start"
                maxWidth="calc(var(--space-1000) * 5)"
              >
                {item.description}
              </SimpleTooltip>
            </EventDescriptionTooltip>
          </EventCardTitleRow>
        </DetectedEventBody>
      </SelectableEventCard>

      {onRename ? (
        <Modal
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="Rename clip"
        subtitle="Update the clip title shown throughout this project."
        footer={
          <ModalFooter
            checkbox={<span aria-hidden />}
            secondaryActionLabel="Cancel"
            onSecondaryAction={() => setRenameOpen(false)}
            primaryActionLabel="Save"
            primaryActionDisabled={!nextTitle.trim()}
            onPrimaryAction={submitRename}
          />
        }
      >
        <ModalContent descriptionAsDialogDescription={false}>
          <TextInput
            label="Clip title"
            value={nextTitle}
            onChange={(event) => setNextTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submitRename();
              }
            }}
            autoFocus
          />
        </ModalContent>
        </Modal>
      ) : null}

      {onDelete ? (
        <ConfirmDeleteModal
          open={deleteOpen}
          itemName={item.title}
          itemType="clip"
          onOpenChange={setDeleteOpen}
          onConfirm={onDelete}
        />
      ) : null}
    </>
  );
}
