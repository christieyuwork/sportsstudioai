import type { Project } from '../types/project';
import { PageHeading } from '../styles/home-theme';
import { MediaPageBody } from '../styles/media-library-theme';
import { UserUploadedMediaLibrary } from './UserUploadedMediaLibrary';

export interface UserUploadedMediaWorkspaceProps {
  project: Project;
  uploading: boolean;
  progressPercent: number;
  uploadFileName: string | null;
  onUploadClick: () => void;
  onRename: (mediaId: string, title: string) => void;
  onDelete: (mediaId: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function UserUploadedMediaWorkspace({
  project,
  uploading,
  progressPercent,
  uploadFileName,
  onUploadClick,
  onRename,
  onDelete,
  onNotify,
}: UserUploadedMediaWorkspaceProps) {
  return (
    <>
      <PageHeading>User-uploaded media</PageHeading>
      <MediaPageBody>
        <UserUploadedMediaLibrary
          items={project.media}
          layout="page"
          uploading={uploading}
          progressPercent={progressPercent}
          uploadFileName={uploadFileName}
          onUploadClick={onUploadClick}
          onRename={onRename}
          onDelete={onDelete}
          onNotify={onNotify}
        />
      </MediaPageBody>
    </>
  );
}
