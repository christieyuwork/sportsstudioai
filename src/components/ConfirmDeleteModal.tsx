import { Modal, ModalContent, ModalFooter } from '@cake-admin/cakeand';

export interface ConfirmDeleteModalProps {
  open: boolean;
  itemName: string;
  itemType: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

/** Shared destructive-action guard used by every delete entry point. */
export function ConfirmDeleteModal({
  open,
  itemName,
  itemType,
  onOpenChange,
  onConfirm,
}: ConfirmDeleteModalProps) {
  function confirmDelete() {
    onConfirm();
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Are you sure?"
      subtitle={`Delete this ${itemType}?`}
      footer={
        <ModalFooter
          checkbox={<span aria-hidden />}
          secondaryActionLabel="Cancel"
          onSecondaryAction={() => onOpenChange(false)}
          primaryActionLabel="Delete"
          onPrimaryAction={confirmDelete}
        />
      }
    >
      <ModalContent
        description={`“${itemName}” will be deleted. This action cannot be undone.`}
      />
    </Modal>
  );
}
