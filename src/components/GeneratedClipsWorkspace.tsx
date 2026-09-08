import { useState } from 'react';
import type { Project } from '../types/project';
import { PageHeading } from '../styles/home-theme';
import { MediaPageBody } from '../styles/media-library-theme';
import { GeneratedMediaLibrary } from './GeneratedMediaLibrary';
import { ClipPreviewModal } from './ClipPreviewModal';

export interface GeneratedClipsWorkspaceProps {
  project: Project;
  onGenerateFromEvents: (eventIds: string[]) => void;
  onRenameGeneratedClip: (clipId: string, title: string) => void;
  onDeleteGeneratedClip: (clipId: string) => void;
  onRenameDetectedEvent: (eventId: string, title: string) => void;
  onDeleteDetectedEvent: (eventId: string) => void;
  onCreateVideo: (title: string, clipIds: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function GeneratedClipsWorkspace({
  project,
  onGenerateFromEvents,
  onRenameGeneratedClip,
  onDeleteGeneratedClip,
  onRenameDetectedEvent,
  onDeleteDetectedEvent,
  onCreateVideo,
  onAddClipToVideo,
  onNotify,
}: GeneratedClipsWorkspaceProps) {
  const [previewId, setPreviewId] = useState<string | null>(null);
  const detected = project.events.find((item) => item.id === previewId);
  const generated = project.generatedClips.find((item) => item.id === previewId);
  const previewItem = detected ?? generated ?? null;

  return (
    <>
      <PageHeading>{project.heading}</PageHeading>
      <MediaPageBody>
        <GeneratedMediaLibrary
          project={project}
          layout="page"
          onPreview={setPreviewId}
          onGenerateFromEvents={onGenerateFromEvents}
          onRenameGeneratedClip={onRenameGeneratedClip}
          onDeleteGeneratedClip={onDeleteGeneratedClip}
          onRenameDetectedEvent={onRenameDetectedEvent}
          onDeleteDetectedEvent={onDeleteDetectedEvent}
          onNotify={onNotify}
        />
      </MediaPageBody>

      <ClipPreviewModal
        item={
          previewItem
            ? {
                ...previewItem,
                duration:
                  'duration' in previewItem
                    ? previewItem.duration
                    : previewItem.timestamp,
              }
            : null
        }
        project={project}
        onClose={() => setPreviewId(null)}
        onCreateVideo={onCreateVideo}
        onAddClipToVideo={onAddClipToVideo}
        onNotify={onNotify}
      />
    </>
  );
}
