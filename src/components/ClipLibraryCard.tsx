import { useState } from 'react';
import {
  Badge,
  Checkbox,
  IconButton,
  Modal,
  ModalContent,
  ModalFooter,
  SimpleTooltip,
  TextInput,
} from '@cake-admin/cakeand';
import { Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import { StudioIcon } from './StudioIcon';
import {
  DeleteMenuItem,
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
  EventPreviewButton,
  EventPreviewGlyph,
  EventSelectionControl,
  RenameMenuItem,
  SelectableEventCard,
} from '../styles/detected-events-theme';

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
  onRename: (title: string) => void;
  onDelete: () => void;
}

export function ClipLibraryCard({
  item,
  selecting = false,
  selected = false,
  onSelectedChange,
  onPreview,
  onRename,
  onDelete,
}: ClipLibraryCardProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [nextTitle, setNextTitle] = useState(item.title);

  function submitRename() {
    const title = nextTitle.trim();
    if (!title) return;
    onRename(title);
    setRenameOpen(false);
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
            <Badge color="red" tone="subtle" dot>
              {item.duration}
            </Badge>
          </DetectedEventMeta>

          <div>
            <EventCardTitleRow>
              <DetectedEventTitle>{item.title}</DetectedEventTitle>
              <EventCardActions>
                <EventPreviewButton
                  size="sm"
                  variant="ghost"
                  intent="secondary"
                  label={`Preview ${item.title}`}
                  icon={<EventPreviewGlyph />}
                  onClick={onPreview}
                />
                <RadixDropdownMenu.Root>
                  <RadixDropdownMenu.Trigger asChild>
                    <IconButton
                      size="sm"
                      variant="ghost"
                      intent="secondary"
                      label={`More options for ${item.title}`}
                      icon={<StudioIcon name="more-vert" size={16} />}
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
                            onClick={onDelete}
                          >
                            Delete
                          </DeleteMenuItem>
                        </RadixDropdownMenu.Item>
                      </EventMenuContainer>
                    </EventMenuContent>
                  </RadixDropdownMenu.Portal>
                </RadixDropdownMenu.Root>
              </EventCardActions>
            </EventCardTitleRow>
            <EventDescriptionTooltip>
              <SimpleTooltip
                trigger={
                  <DetectedEventDescription>
                    {item.description}
                  </DetectedEventDescription>
                }
                side="top"
                align="start"
                maxWidth="calc(var(--space-1000) * 5)"
              >
                {item.description}
              </SimpleTooltip>
            </EventDescriptionTooltip>
          </div>
        </DetectedEventBody>
      </SelectableEventCard>

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
    </>
  );
}
