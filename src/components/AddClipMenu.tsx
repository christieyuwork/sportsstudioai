import { useState } from 'react';
import {
  Button,
  Divider,
  MenuItem,
  Modal,
  ModalContent,
  ModalFooter,
} from '@cake-admin/cakeand';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { Project } from '../types/project';
import {
  AddMenuContainer,
  AddMenuContent,
  ButtonIconMask,
  ExactIcon,
  ExampleTextInput,
} from '../styles/agent-theme';

export interface AddClipMenuProps {
  size?: 'xs' | 'sm';
  variant?: 'outline' | 'fill';
  project: Project;
  clipId: string;
  onAction: (message: string) => void;
  onCreateVideo: (title: string, clipIds: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
}

/** Shared add-to-video menu used by card and full-preview surfaces. */
export function AddClipMenu({
  size = 'xs',
  variant = 'outline',
  project,
  clipId,
  onAction,
  onCreateVideo,
  onAddClipToVideo,
}: AddClipMenuProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');

  function createVideo() {
    const title = videoTitle.trim();
    if (!title) return;
    onCreateVideo(title, [clipId]);
    onAction(`Created “${title}” with this clip.`);
    setVideoTitle('');
    setModalOpen(false);
  }

  return (
    <>
      <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger asChild>
          <Button
            size={size}
            variant={variant}
            intent={variant === 'fill' ? 'primary' : 'secondary'}
            endIcon={<ButtonIconMask $asset="/icons/dropdown.svg" />}
          >
            Add to video
          </Button>
        </RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Portal>
          <AddMenuContent side="bottom" align="end" sideOffset={8}>
            <AddMenuContainer
              role="menu"
              aria-label="Add clip to video"
              width="calc(var(--space-1000) * 5)"
            >
              {project.videos.map((video) => (
                <RadixDropdownMenu.Item asChild key={video.id}>
                  <MenuItem
                    leftSlot={<ExactIcon src="/icons/menu-video.svg" alt="" />}
                    showRightSlot={false}
                    onClick={() => {
                      onAddClipToVideo(video.id, clipId);
                      onAction(`Clip added to “${video.title}”.`);
                    }}
                  >
                    {video.title}
                  </MenuItem>
                </RadixDropdownMenu.Item>
              ))}
              {project.videos.length > 0 ? <Divider /> : null}
              <RadixDropdownMenu.Item asChild>
                <MenuItem
                  leftSlot={<ExactIcon src="/icons/menu-folder.svg" alt="" />}
                  showRightSlot={false}
                  onClick={() =>
                    onAction('Clip added to Project media > Generated clips.')
                  }
                >
                  {'Add to project media > Generated clips'}
                </MenuItem>
              </RadixDropdownMenu.Item>
              <Divider />
              <RadixDropdownMenu.Item
                onSelect={() => setModalOpen(true)}
                asChild
              >
                <MenuItem
                  leftSlot={<ExactIcon src="/icons/menu-add.svg" alt="" />}
                  showRightSlot={false}
                >
                  Create a new video
                </MenuItem>
              </RadixDropdownMenu.Item>
            </AddMenuContainer>
          </AddMenuContent>
        </RadixDropdownMenu.Portal>
      </RadixDropdownMenu.Root>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Create a new video"
        subtitle={`Add this clip to a new ${project.title} video output.`}
        footer={
          <ModalFooter
            checkbox={<span aria-hidden />}
            secondaryActionLabel="Cancel"
            onSecondaryAction={() => setModalOpen(false)}
            primaryActionLabel="Create video"
            primaryActionDisabled={!videoTitle.trim()}
            onPrimaryAction={createVideo}
          />
        }
      >
        <ModalContent descriptionAsDialogDescription={false}>
          <ExampleTextInput
            label="Video title"
            placeholder="e.g. Yellow Card Highlights"
            value={videoTitle}
            onChange={(event) => setVideoTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                createVideo();
              }
            }}
            autoFocus
          />
        </ModalContent>
      </Modal>
    </>
  );
}
