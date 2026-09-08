import { useEffect, useMemo, useState } from 'react';
import type { Project } from '../types/project';
import { StudioIcon } from './StudioIcon';
import { UploadDropzone } from './UploadDropzone';
import { UserUploadedMediaLibrary } from './UserUploadedMediaLibrary';
import { ClipLibraryCard } from './ClipLibraryCard';
import { ClipPreviewModal } from './ClipPreviewModal';
import { PromptComposer, PromptSuggestions } from './PromptControls';
import { formatSelectedClipsPrompt } from '../lib/selectedClipsPrompt';
import {
  AllEventsButton,
  EventsSection,
  EventsRow,
  LowerGrid,
  MediaPanel,
  NewProjectUploadLimit,
  PageHeading,
  PromptPanel,
  PromptTitle,
  PromptTitleRow,
  SectionHeader,
  SectionTitle,
  SuggestedVideoHeader,
  SuggestedVideoList,
  SuggestedVideoSection,
  SuggestedVideoTitleRow,
  WorkspaceBody,
} from '../styles/home-theme';

export interface ProjectWorkspaceProps {
  project: Project;
  uploading: boolean;
  progressPercent: number;
  uploadFileName: string | null;
  onUploadClick: () => void;
  onSubmitPrompt: (prompt: string, videoClipIds?: string[]) => void;
  onOpenDetectedEvents: () => void;
  onRenameMedia: (mediaId: string, title: string) => void;
  onDeleteMedia: (mediaId: string) => void;
  onRenameDetectedEvent: (eventId: string, title: string) => void;
  onDeleteDetectedEvent: (eventId: string) => void;
  onCreateVideo: (title: string, clipIds: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function ProjectWorkspace({
  project,
  uploading,
  progressPercent,
  uploadFileName,
  onUploadClick,
  onSubmitPrompt,
  onOpenDetectedEvents,
  onRenameMedia,
  onDeleteMedia,
  onRenameDetectedEvent,
  onDeleteDetectedEvent,
  onCreateVideo,
  onAddClipToVideo,
  onNotify,
}: ProjectWorkspaceProps) {
  const [prompt, setPrompt] = useState('');
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragTargetId, setDragTargetId] = useState<string | null>(null);
  const [orderedEventIds, setOrderedEventIds] = useState<string[]>(() =>
    project.events.map((event) => event.id),
  );
  const hasMedia = project.media.length > 0;
  const orderedEvents = useMemo(
    () =>
      orderedEventIds
        .map((eventId) =>
          project.events.find((event) => event.id === eventId),
        )
        .filter((event): event is Project['events'][number] => Boolean(event)),
    [orderedEventIds, project.events],
  );
  const previewEvent =
    project.events.find((event) => event.id === previewId) ?? null;

  useEffect(() => {
    setOrderedEventIds((current) => [
      ...current.filter((eventId) =>
        project.events.some((event) => event.id === eventId),
      ),
      ...project.events
        .map((event) => event.id)
        .filter((eventId) => !current.includes(eventId)),
    ]);
  }, [project.events]);

  function submitPrompt(value: string) {
    const request = value.trim();
    if (!request) return;
    onSubmitPrompt(request);
  }

  function moveEvent(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    setOrderedEventIds((current) => {
      const next = [...current];
      const sourceIndex = next.indexOf(sourceId);
      const targetIndex = next.indexOf(targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, sourceId);
      return next;
    });
  }

  function moveEventByOffset(eventId: string, offset: -1 | 1) {
    setOrderedEventIds((current) => {
      const currentIndex = current.indexOf(eventId);
      const nextIndex = currentIndex + offset;
      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }
      const next = [...current];
      [next[currentIndex], next[nextIndex]] = [
        next[nextIndex],
        next[currentIndex],
      ];
      return next;
    });
  }

  if (!hasMedia) {
    return (
      <>
        <PageHeading>
          {project.title === 'Germany vs Netherlands' ? 'New project' : project.title}
        </PageHeading>
        <SectionTitle>Project media</SectionTitle>
        <NewProjectUploadLimit data-new-project-upload-limit>
          <UploadDropzone
            variant="empty"
            uploading={uploading}
            progressPercent={progressPercent}
            fileName={uploadFileName}
            onUploadClick={onUploadClick}
          />
        </NewProjectUploadLimit>
      </>
    );
  }

  return (
    <>
      <PageHeading>{project.heading}</PageHeading>

      <WorkspaceBody>
        <EventsSection>
          <SectionHeader>
            <SectionTitle>Biggest football moments, detected by AI</SectionTitle>
            <AllEventsButton
              size="sm"
              variant="ghost"
              intent="secondary"
              underline
              endIcon={<StudioIcon name="go-arrow" size={16} />}
              onClick={onOpenDetectedEvents}
            >
              All detected events
            </AllEventsButton>
          </SectionHeader>

          <EventsRow>
            {project.events.map((event) => (
              <ClipLibraryCard
                key={event.id}
                item={{ ...event, duration: event.timestamp }}
                onPreview={() => setPreviewId(event.id)}
                onRename={(title) => {
                  onRenameDetectedEvent(event.id, title);
                  onNotify('Clip renamed', `Renamed to “${title}”.`);
                }}
                onDelete={() => {
                  onDeleteDetectedEvent(event.id);
                  onNotify('Clip deleted', `Removed “${event.title}”.`);
                }}
              />
            ))}
          </EventsRow>
        </EventsSection>

        <LowerGrid>
          <PromptPanel>
            <PromptTitleRow>
              <StudioIcon name="ai-stars" size={24} />
              <PromptTitle>Create highlights with natural language</PromptTitle>
            </PromptTitleRow>

            <PromptComposer
              value={prompt}
              onChange={setPrompt}
              onSubmit={submitPrompt}
              ariaLabel="Highlight prompt"
              placeholder="e.g. Generate a 10 second highlight clip in 1:1 aspect ratio..."
            />

            <PromptSuggestions
              suggestions={project.promptSuggestions}
              onSelect={submitPrompt}
            />
          </PromptPanel>

          <MediaPanel>
            <UserUploadedMediaLibrary
              items={project.media}
              layout="panel"
              uploading={uploading}
              progressPercent={progressPercent}
              uploadFileName={uploadFileName}
              onUploadClick={onUploadClick}
              onRename={onRenameMedia}
              onDelete={onDeleteMedia}
              onNotify={onNotify}
            />
          </MediaPanel>

          <SuggestedVideoSection>
            <SuggestedVideoHeader>
              <SuggestedVideoTitleRow>
                <StudioIcon name="ai-clips" size={24} />
                <SectionTitle>Suggested video</SectionTitle>
              </SuggestedVideoTitleRow>
              <AllEventsButton
                size="sm"
                variant="ghost"
                intent="secondary"
                underline
                endIcon={<StudioIcon name="go-arrow" size={16} />}
                disabled={orderedEvents.length === 0}
                onClick={() => {
                  onSubmitPrompt(
                    formatSelectedClipsPrompt(orderedEvents),
                    orderedEvents.map((event) => event.id),
                  );
                }}
              >
                Edit in video editor
              </AllEventsButton>
            </SuggestedVideoHeader>

            <SuggestedVideoList aria-label="Suggested video clips">
              {orderedEvents.map((event) => (
                <ClipLibraryCard
                  key={event.id}
                  variant="suggested"
                  item={{ ...event, duration: event.timestamp }}
                  draggable
                  onPreview={() => setPreviewId(event.id)}
                  onDragStart={(dragEvent) => {
                    dragEvent.dataTransfer.effectAllowed = 'move';
                    dragEvent.dataTransfer.setData('text/plain', event.id);
                    setDraggingId(event.id);
                    setDragTargetId(null);
                  }}
                  onDragEnter={(dragEvent) => {
                    dragEvent.preventDefault();
                    const sourceId =
                      dragEvent.dataTransfer.getData('text/plain') || draggingId;
                    if (sourceId && dragTargetId !== event.id) {
                      moveEvent(sourceId, event.id);
                      setDragTargetId(event.id);
                    }
                  }}
                  onDragOver={(dragEvent) => dragEvent.preventDefault()}
                  onDrop={(dragEvent) => {
                    dragEvent.preventDefault();
                    setDraggingId(null);
                    setDragTargetId(null);
                  }}
                  onDragEnd={() => {
                    setDraggingId(null);
                    setDragTargetId(null);
                  }}
                  onDragHandleKeyDown={(keyboardEvent) => {
                    if (keyboardEvent.key === 'ArrowUp') {
                      keyboardEvent.preventDefault();
                      moveEventByOffset(event.id, -1);
                    }
                    if (keyboardEvent.key === 'ArrowDown') {
                      keyboardEvent.preventDefault();
                      moveEventByOffset(event.id, 1);
                    }
                  }}
                />
              ))}
            </SuggestedVideoList>
          </SuggestedVideoSection>
        </LowerGrid>
      </WorkspaceBody>

      <ClipPreviewModal
        item={
          previewEvent
            ? { ...previewEvent, duration: previewEvent.timestamp }
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
