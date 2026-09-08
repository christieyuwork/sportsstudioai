import { useState } from 'react';
import {
  Badge,
  Modal,
  ModalContent,
  ModalFooter,
  TextInput,
} from '@cake-admin/cakeand';
import { Pencil, Trash2 } from 'lucide-react';
import type { ProjectMediaItem } from '../types/project';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { TooltipIconButton } from './TooltipIconButton';
import {
  DeleteMediaButton,
  ProjectMediaRowActions,
  ProjectMediaRowCard,
  ProjectMediaRowCopy,
  ProjectMediaRowThumb,
  ProjectMediaRowTitle,
} from '../styles/media-library-theme';

export interface ProjectMediaRowProps {
  item: ProjectMediaItem;
  onRename: (title: string) => void;
  onDelete: () => void;
}

/** Shared user-uploaded media row used in full-page and agent-panel libraries. */
export function ProjectMediaRow({
  item,
  onRename,
  onDelete,
}: ProjectMediaRowProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [nextTitle, setNextTitle] = useState(item.title);

  function submitRename() {
    const title = nextTitle.trim();
    if (!title) return;
    onRename(title);
    setRenameOpen(false);
  }

  return (
    <>
      <ProjectMediaRowCard role="listitem">
        <ProjectMediaRowThumb src={item.thumbnailUrl} alt="" />
        <ProjectMediaRowCopy>
          <ProjectMediaRowTitle>{item.title}</ProjectMediaRowTitle>
          <Badge color="indigo" tone="subtle" dot={false}>
            {item.durationLabel}
          </Badge>
        </ProjectMediaRowCopy>
        <ProjectMediaRowActions>
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label={`Rename ${item.title}`}
            icon={<Pencil size={20} />}
            onClick={() => {
              setNextTitle(item.title);
              setRenameOpen(true);
            }}
          />
          <DeleteMediaButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label={`Delete ${item.title}`}
            icon={<Trash2 size={20} />}
            onClick={() => setDeleteOpen(true)}
          />
        </ProjectMediaRowActions>
      </ProjectMediaRowCard>

      <Modal
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="Rename media"
        subtitle="Update the media title shown throughout this project."
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
            label="Media title"
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

      <ConfirmDeleteModal
        open={deleteOpen}
        itemName={item.title}
        itemType="media item"
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
      />
    </>
  );
}
