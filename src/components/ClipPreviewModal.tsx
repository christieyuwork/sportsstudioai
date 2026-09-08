import { Modal, ModalContent } from '@cake-admin/cakeand';
import styled, { createGlobalStyle } from 'styled-components';
import type { Project } from '../types/project';
import type { ClipLibraryCardItem } from './ClipLibraryCard';
import { FullClipPreview } from './FullClipPreview';

export interface ClipPreviewModalProps {
  item: ClipLibraryCardItem | null;
  project: Project;
  onClose: () => void;
  onCreateVideo: (title: string, clipIds: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onNotify: (title: string, description: string) => void;
}

/** Figma 249:15421 full preview, excluding its top project/video navigation. */
export function ClipPreviewModal({
  item,
  project,
  onClose,
  onCreateVideo,
  onAddClipToVideo,
  onNotify,
}: ClipPreviewModalProps) {
  return (
    <>
      {item ? <FullPreviewModalGeometry /> : null}
      <Modal
        open={item !== null}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        title={item ? `Clip preview: ${item.title}` : 'Clip preview'}
      >
        {item ? (
          <FullPreviewModalContent
            data-full-clip-preview
            descriptionAsDialogDescription={false}
          >
            <FullClipPreview
              clip={item}
              project={project}
              showTitle={false}
              onCreateVideo={onCreateVideo}
              onAddClipToVideo={onAddClipToVideo}
              onNotify={onNotify}
            />
          </FullPreviewModalContent>
        ) : null}
      </Modal>
    </>
  );
}

const FullPreviewModalGeometry = createGlobalStyle`
  [role='dialog']:has([data-full-clip-preview]) {
    width: min(
      calc(
        var(--space-1000) * 8 + var(--space-800) + var(--space-300)
      ),
      calc(100vw - var(--space-1000))
    ) !important;
    max-width: calc(100vw - var(--space-1000)) !important;
  }
`;

const FullPreviewModalContent = styled(ModalContent)`
  && {
    width: 100%;
    box-sizing: border-box;
    max-height: calc(100vh - var(--space-1000) * 2);
    overflow-y: auto;
  }
`;
