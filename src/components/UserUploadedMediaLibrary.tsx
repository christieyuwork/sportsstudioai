import type { ProjectMediaItem } from '../types/project';
import type { MediaLibraryLayout } from '../styles/media-library-theme';
import {
  EmptyMediaMessage,
  MediaLibraryHeader,
  MediaLibraryTitle,
  UploadedMediaLibraryBody,
  UploadedMediaList,
} from '../styles/media-library-theme';
import { ProjectMediaRow } from './ProjectMediaRow';
import { UploadDropzone } from './UploadDropzone';

export interface UserUploadedMediaLibraryProps {
  items: ProjectMediaItem[];
  layout: MediaLibraryLayout;
  uploading: boolean;
  progressPercent: number;
  uploadFileName: string | null;
  onUploadClick: () => void;
  onRename: (mediaId: string, title: string) => void;
  onDelete: (mediaId: string) => void;
  onNotify: (title: string, description: string) => void;
}

/**
 * Project-scoped uploads. The page and agent panel share this exact component;
 * only outer density changes with the available width.
 */
export function UserUploadedMediaLibrary({
  items,
  layout,
  uploading,
  progressPercent,
  uploadFileName,
  onUploadClick,
  onRename,
  onDelete,
  onNotify,
}: UserUploadedMediaLibraryProps) {
  return (
    <UploadedMediaLibraryBody $layout={layout}>
      <MediaLibraryHeader>
        <MediaLibraryTitle>Project media</MediaLibraryTitle>
      </MediaLibraryHeader>
      <UploadDropzone
        variant="compact"
        alignment={layout === 'page' ? 'start' : 'center'}
        uploading={uploading}
        progressPercent={progressPercent}
        fileName={uploadFileName}
        onUploadClick={onUploadClick}
      />
      {items.length > 0 ? (
        <UploadedMediaList role="list">
          {items.map((item) => (
            <ProjectMediaRow
              key={item.id}
              item={item}
              onRename={(title) => {
                onRename(item.id, title);
                onNotify('Media renamed', `Renamed to “${title}”.`);
              }}
              onDelete={() => {
                onDelete(item.id);
                onNotify('Media deleted', `Removed “${item.title}”.`);
              }}
            />
          ))}
        </UploadedMediaList>
      ) : uploading ? null : (
        <EmptyMediaMessage>No uploaded media yet.</EmptyMediaMessage>
      )}
    </UploadedMediaLibraryBody>
  );
}
