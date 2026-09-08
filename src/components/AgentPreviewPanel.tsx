import { useEffect, useState } from 'react';
import {
  HorizontalTabItem,
  HorizontalTabsContent,
  HorizontalTabsList,
  MenuItem,
} from '@cake-admin/cakeand';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { Project, ProjectVideoOutput } from '../types/project';
import { MOCK_AGENT_CLIPS } from '../data/mockAgentClips';
import type { FullClipPreviewItem } from './FullClipPreview';
import { ClipPreviewModal } from './ClipPreviewModal';
import { TooltipIconButton } from './TooltipIconButton';
import { GeneratedMediaLibrary } from './GeneratedMediaLibrary';
import { StudioIcon } from './StudioIcon';
import { UserUploadedMediaLibrary } from './UserUploadedMediaLibrary';
import { formatSelectedClipsPrompt } from '../lib/selectedClipsPrompt';
import {
  CREATE_VIDEO_VALUE,
  VideoEditorPanel,
  defaultVideoTitle,
} from './VideoEditorPanel';
import {
  AddMenuContainer,
  AddMenuContent,
  ExactIcon,
  PreviewHeader,
  PreviewPanelBody,
  PreviewSurface,
  PreviewTabsRoot,
  StudioContentSwitcher,
} from '../styles/agent-theme';
import {
  PreviewTabRow,
  VideoProjectIndicatorRow,
  VideoProjectSelect,
  VideoProjectTabButton,
  VideoProjectTabContent,
} from '../styles/video-editor-theme';

export interface AgentPreviewState {
  tab: string;
  setTab: (tab: string) => void;
  mediaView: string;
  setMediaView: (view: string) => void;
  selectedVideo: ProjectVideoOutput | null;
  selectedClip: FullClipPreviewItem | null;
  previewClip: (clipId: string | null) => void;
  createAndOpenVideo: (title: string, clipIds: string[]) => string;
  changeVideoProject: (value: string) => void;
}

export interface UseAgentPreviewStateOptions {
  project: Project;
  /** Landing panel; clip previews are always handled by the modal. */
  initialTab: string;
  /** A new agent has generated nothing yet, so it opens on uploaded media. */
  initialMediaView?: string;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onCreateVideo: (title: string, clipIds: string[]) => string;
  onNotify: (title: string, description: string) => void;
}

/**
 * Tab, media-view, and video-output state for the agent preview panel. The
 * conversation needs to drive these too (previewing a clip, opening a new
 * video output), so the state lives here and both sides share one instance.
 */
export function useAgentPreviewState({
  project,
  initialTab,
  initialMediaView = 'clips',
  selectedClipId,
  onSelectClip,
  onCreateVideo,
  onNotify,
}: UseAgentPreviewStateOptions): AgentPreviewState {
  const [tab, setTab] = useState(initialTab);
  const [mediaView, setMediaView] = useState(initialMediaView);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(
    project.videos[0]?.id ?? null,
  );

  const selectedGeneratedClip =
    project.generatedClips.find((clip) => clip.id === selectedClipId) ??
    MOCK_AGENT_CLIPS.find((clip) => clip.id === selectedClipId);
  const selectedDetectedEvent = project.events.find(
    (event) => event.id === selectedClipId,
  );
  const selectedClip =
    selectedGeneratedClip ??
    (selectedDetectedEvent
      ? {
          ...selectedDetectedEvent,
          duration: selectedDetectedEvent.timestamp,
          transcript: `"${selectedDetectedEvent.description}"`,
          denseCaption: `The broadcast shows ${selectedDetectedEvent.description.toLocaleLowerCase()} Players and officials react before play resumes.`,
        }
      : null);
  const selectedVideo =
    project.videos.find((video) => video.id === selectedVideoId) ??
    project.videos[0] ??
    null;

  useEffect(() => {
    if (
      selectedVideoId &&
      !project.videos.some((video) => video.id === selectedVideoId)
    ) {
      setSelectedVideoId(project.videos[0]?.id ?? null);
    }
  }, [project.videos, selectedVideoId]);

  function previewClip(clipId: string | null) {
    onSelectClip(clipId);
  }

  function openVideo(videoId: string) {
    setSelectedVideoId(videoId);
    setTab('editor');
  }

  function createAndOpenVideo(title: string, clipIds: string[]) {
    const videoId = onCreateVideo(title, clipIds);
    openVideo(videoId);
    return videoId;
  }

  function changeVideoProject(value: string) {
    if (value === CREATE_VIDEO_VALUE) {
      const title = defaultVideoTitle();
      createAndOpenVideo(title, []);
      onNotify('New video', `Created “${title}”.`);
      return;
    }
    openVideo(value);
  }

  return {
    tab,
    setTab,
    mediaView,
    setMediaView,
    selectedVideo,
    selectedClip,
    previewClip,
    createAndOpenVideo,
    changeVideoProject,
  };
}

export interface AgentPreviewPanelProps {
  project: Project;
  state: AgentPreviewState;
  label: string;
  onSubmitPrompt: (prompt: string, videoClipIds?: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onChangeVideoClips: (videoId: string, clipIds: string[]) => void;
  onRenameVideo: (videoId: string, title: string) => void;
  onRenameGeneratedClip: (clipId: string, title: string) => void;
  onDeleteGeneratedClip: (clipId: string) => void;
  onRenameDetectedEvent: (eventId: string, title: string) => void;
  onDeleteDetectedEvent: (eventId: string) => void;
  uploading: boolean;
  progressPercent: number;
  uploadFileName: string | null;
  onUploadClick: () => void;
  onRenameMedia: (mediaId: string, title: string) => void;
  onDeleteMedia: (mediaId: string) => void;
  onNotify: (title: string, description: string) => void;
}

/**
 * Right-hand agent panel: project media and video editor. Clip previews use the
 * shared modal instead of taking over this panel. Shared
 * by a newly composed agent and one that has already answered so both show the
 * same tabs and video-project control.
 */
export function AgentPreviewPanel({
  project,
  state,
  label,
  onSubmitPrompt,
  onAddClipToVideo,
  onChangeVideoClips,
  onRenameVideo,
  onRenameGeneratedClip,
  onDeleteGeneratedClip,
  onRenameDetectedEvent,
  onDeleteDetectedEvent,
  uploading,
  progressPercent,
  uploadFileName,
  onUploadClick,
  onRenameMedia,
  onDeleteMedia,
  onNotify,
}: AgentPreviewPanelProps) {
  const { selectedClip, selectedVideo } = state;

  return (
    <>
      <PreviewSurface aria-label={label}>
      <PreviewTabsRoot value={state.tab} onValueChange={state.setTab}>
        <PreviewHeader>
          <PreviewTabRow>
            <HorizontalTabsList
              aria-label="Preview panel sections"
              scrollButtons="never"
            >
              <HorizontalTabItem value="media">Project media</HorizontalTabItem>
            </HorizontalTabsList>
            <VideoProjectSelect $active={state.tab === 'editor'}>
              <VideoProjectTabContent>
                <VideoProjectTabButton
                  type="button"
                  $active={state.tab === 'editor'}
                  onClick={() => state.setTab('editor')}
                >
                  {selectedVideo?.title ?? 'New video'}
                </VideoProjectTabButton>
                <RadixDropdownMenu.Root>
                  <RadixDropdownMenu.Trigger asChild>
                    <TooltipIconButton
                      size="xs"
                      variant="tonal"
                      intent="secondary"
                      label="Choose video project"
                      icon={<StudioIcon name="dropdown" size={20} />}
                    />
                  </RadixDropdownMenu.Trigger>
                  <RadixDropdownMenu.Portal>
                    <AddMenuContent side="bottom" align="end" sideOffset={8}>
                      <AddMenuContainer
                        role="menu"
                        aria-label="Choose video project"
                        width="calc(var(--space-1000) * 4)"
                      >
                        {project.videos.map((video) => (
                          <RadixDropdownMenu.Item asChild key={video.id}>
                            <MenuItem
                              selected={video.id === selectedVideo?.id}
                              leftSlot={
                                <ExactIcon
                                  src="/icons/menu-video.svg"
                                  alt=""
                                />
                              }
                              showRightSlot={false}
                              onClick={() =>
                                state.changeVideoProject(video.id)
                              }
                            >
                              {video.title}
                            </MenuItem>
                          </RadixDropdownMenu.Item>
                        ))}
                        <RadixDropdownMenu.Item asChild>
                          <MenuItem
                            leftSlot={<StudioIcon name="add" size={16} />}
                            showRightSlot={false}
                            onClick={() =>
                              state.changeVideoProject(CREATE_VIDEO_VALUE)
                            }
                          >
                            Create a new video
                          </MenuItem>
                        </RadixDropdownMenu.Item>
                      </AddMenuContainer>
                    </AddMenuContent>
                  </RadixDropdownMenu.Portal>
                </RadixDropdownMenu.Root>
              </VideoProjectTabContent>
              <VideoProjectIndicatorRow $active={state.tab === 'editor'} />
            </VideoProjectSelect>
          </PreviewTabRow>
        </PreviewHeader>

        {/*
          The editor is driven by the video dropdown, not a tab trigger, so it
          renders as a plain region instead of a Tabs panel that would point
          aria-labelledby at a trigger that does not exist.
        */}
        {state.tab === 'editor' ? (
          <PreviewPanelBody as="section" aria-label="Video editor">
            <VideoEditorPanel
              project={project}
              video={selectedVideo}
              onAddClipToVideo={onAddClipToVideo}
              onChangeVideoClips={onChangeVideoClips}
              onRenameVideo={onRenameVideo}
              onCreateVideo={() =>
                state.changeVideoProject(CREATE_VIDEO_VALUE)
              }
              onNotify={onNotify}
            />
          </PreviewPanelBody>
        ) : null}

        <HorizontalTabsContent value="media">
          <PreviewPanelBody>
            <StudioContentSwitcher
              aria-label="Project media type"
              size="sm"
              intent="secondary"
              options={[
                { value: 'clips', label: 'Generated clips' },
                { value: 'uploaded', label: 'User-uploaded media' },
              ]}
              value={state.mediaView}
              onValueChange={state.setMediaView}
            />

            {state.mediaView === 'clips' ? (
              <GeneratedMediaLibrary
                project={project}
                layout="panel"
                onPreview={state.previewClip}
                onGenerateFromEvents={(eventIds) => {
                  const selectedEvents = eventIds
                    .map((eventId) =>
                      project.events.find((event) => event.id === eventId),
                    )
                    .filter(
                      (event): event is Project['events'][number] =>
                        Boolean(event),
                    );
                  onSubmitPrompt(
                    formatSelectedClipsPrompt(selectedEvents),
                    selectedEvents.map((event) => event.id),
                  );
                }}
                onRenameGeneratedClip={onRenameGeneratedClip}
                onDeleteGeneratedClip={onDeleteGeneratedClip}
                onRenameDetectedEvent={onRenameDetectedEvent}
                onDeleteDetectedEvent={onDeleteDetectedEvent}
                onNotify={onNotify}
              />
            ) : (
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
            )}
          </PreviewPanelBody>
        </HorizontalTabsContent>
      </PreviewTabsRoot>
      </PreviewSurface>

      <ClipPreviewModal
        item={selectedClip}
        project={project}
        onClose={() => state.previewClip(null)}
        onCreateVideo={state.createAndOpenVideo}
        onAddClipToVideo={onAddClipToVideo}
        onNotify={onNotify}
      />
    </>
  );
}
