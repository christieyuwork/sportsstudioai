import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Button,
  MenuItem,
  Modal,
  ModalContent,
  ModalFooter,
} from '@cake-admin/cakeand';
import { Pencil } from 'lucide-react';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { Project, ProjectVideoOutput } from '../types/project';
import { MOCK_AGENT_CLIPS } from '../data/mockAgentClips';
import { formatClock, parseClock } from '../lib/time';
import { MediaPlayer, useMediaPlayer } from './MediaPlayer';
import { RecordingBadge } from './RecordingBadge';
import { TooltipIconButton } from './TooltipIconButton';
import { ClipPreviewFeatures } from './ClipPreviewFeatures';
import { VideoCaptionSettings } from './VideoCaptionSettings';
import {
  ClipEditorPanel,
  type ClipEditorSavedState,
} from './ClipEditorPanel';
import { VideoExportSettings } from './VideoExportSettings';
import { VideoTimelineManager } from './VideoTimelineManager';
import {
  AddMenuContainer,
  AddMenuContent,
  ButtonIconMask,
  ClipGroupHeader,
  EmptyPreview,
  ExactIcon,
  ExampleTextInput,
  PreviewBrand,
  PreviewMediaFrame,
  PreviewMetadata,
  StudioContentSwitcher,
} from '../styles/agent-theme';
import {
  CaptionPreview,
  EmptyPlayerPlaceholder,
  TimelineAddIcon,
  TimelineAddSlot,
  TimelineDuration,
  TimelineHeading,
  TimelineSection,
  TimelineStrip,
  TimelineThumbButton,
  TimelineThumbImage,
  VideoEditorShell,
  VideoEditorStage,
  VideoEditorTitle,
  VideoEditorTitleRow,
  VideoModeSwitcherFrame,
} from '../styles/video-editor-theme';

export const CREATE_VIDEO_VALUE = 'create-video';

export interface TimelineClip {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
}

export function defaultVideoTitle(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `New video project ${month}-${day}-${year}`;
}

function resolveTimelineClip(
  project: Project,
  clipId: string,
): TimelineClip | undefined {
  const generated = project.generatedClips.find((clip) => clip.id === clipId);
  if (generated) {
    return {
      id: generated.id,
      title: generated.title,
      description: generated.description,
      duration: generated.duration,
      thumbnailUrl: generated.thumbnailUrl,
    };
  }

  const agentClip = MOCK_AGENT_CLIPS.find((clip) => clip.id === clipId);
  if (agentClip) {
    return {
      id: agentClip.id,
      title: agentClip.title,
      description: agentClip.description,
      duration: agentClip.duration,
      thumbnailUrl: agentClip.thumbnailUrl,
    };
  }

  const event = project.events.find((item) => item.id === clipId);
  if (!event) return undefined;
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    duration: event.timestamp,
    thumbnailUrl: event.thumbnailUrl,
  };
}

interface TimelineClipGroup {
  label: string;
  clips: TimelineClip[];
}

/**
 * Addable clips keep their provenance: upload-time detections first, then the
 * clips a user asked the agent for.
 */
function listAvailableTimelineClipGroups(
  project: Project,
): TimelineClipGroup[] {
  const fromEvents = project.events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    duration: event.timestamp,
    thumbnailUrl: event.thumbnailUrl,
  }));
  const fromGenerated = project.generatedClips.map((clip) => ({
    id: clip.id,
    title: clip.title,
    description: clip.description,
    duration: clip.duration,
    thumbnailUrl: clip.thumbnailUrl,
  }));
  const fromAgent = MOCK_AGENT_CLIPS.filter(
    (clip) => !fromGenerated.some((item) => item.id === clip.id),
  ).map((clip) => ({
    id: clip.id,
    title: clip.title,
    description: clip.description,
    duration: clip.duration,
    thumbnailUrl: clip.thumbnailUrl,
  }));

  return [
    { label: 'Detected events', clips: fromEvents },
    { label: 'User-generated clips', clips: [...fromGenerated, ...fromAgent] },
  ];
}

export interface VideoEditorPanelProps {
  project: Project;
  video: ProjectVideoOutput | null;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onChangeVideoClips: (videoId: string, clipIds: string[]) => void;
  onRenameVideo: (videoId: string, title: string) => void;
  onCreateVideo: () => void;
  onNotify: (title: string, description: string) => void;
}

export function VideoEditorPanel({
  project,
  video,
  onAddClipToVideo,
  onChangeVideoClips,
  onRenameVideo,
  onCreateVideo,
  onNotify,
}: VideoEditorPanelProps) {
  const [editorMode, setEditorMode] = useState('preview');
  const [clipEditorSaves, setClipEditorSaves] = useState<
    Record<string, ClipEditorSavedState>
  >({});
  const [activeClipId, setActiveClipId] = useState<string | null>(
    video?.clipIds[0] ?? null,
  );
  const [showTranscript, setShowTranscript] = useState(false);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [captionType, setCaptionType] = useState('transcript');
  const [captionLanguage, setCaptionLanguage] = useState('english');
  const [captionFontSize, setCaptionFontSize] = useState(12);
  const [captionColorScheme, setCaptionColorScheme] = useState('white-black');
  const [captionRows, setCaptionRows] = useState('1');
  const [exportFileTypes, setExportFileTypes] = useState(['1080p']);
  const [exportSpeed, setExportSpeed] = useState('1');
  const [exportAspectRatios, setExportAspectRatios] = useState(['original']);
  const [includeAudio, setIncludeAudio] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [nextTitle, setNextTitle] = useState(video?.title ?? '');

  const timelineClips = useMemo(
    () =>
      (video?.clipIds ?? [])
        .map((clipId) => resolveTimelineClip(project, clipId))
        .filter((clip): clip is TimelineClip => Boolean(clip)),
    [project, video],
  );
  const activeClip =
    timelineClips.find((clip) => clip.id === activeClipId) ??
    timelineClips[0] ??
    null;
  const activeSourceClip = activeClip
    ? project.generatedClips.find((item) => item.id === activeClip.id) ??
      MOCK_AGENT_CLIPS.find((item) => item.id === activeClip.id)
    : undefined;
  const activeTranscript =
    (activeClip ? clipEditorSaves[activeClip.id]?.transcript : undefined) ??
    activeSourceClip?.transcript ??
    activeClip?.description ??
    'No transcript is available for this clip yet.';
  const activeDenseTranscript =
    activeSourceClip?.denseCaption ??
    activeClip?.description ??
    'No dense transcript is available for this clip yet.';
  const activePreviewEvents =
    (activeClip ? clipEditorSaves[activeClip.id]?.events : undefined) ??
    project.events.map((event) => ({
      id: event.id,
      timestamp: event.timestamp,
      eventType: event.eventType.toLocaleUpperCase(),
      player: event.player ?? 'Crowd',
      description: event.description,
    }));
  const durationSeconds = activeClip ? parseClock(activeClip.duration) || 30 : 30;
  const playerController = useMediaPlayer({
    durationSeconds,
    resetKey: `${video?.id ?? 'no-video'}:${activeClip?.id ?? 'no-clip'}`,
  });
  const totalDuration = formatClock(
    timelineClips.reduce((sum, clip) => sum + parseClock(clip.duration), 0),
  );
  const addableGroups = listAvailableTimelineClipGroups(project)
    .map((group) => ({
      ...group,
      clips: group.clips.filter((clip) => !video?.clipIds.includes(clip.id)),
    }))
    .filter((group) => group.clips.length > 0);
  useEffect(() => {
    setEditorMode('preview');
    setActiveClipId(video?.clipIds[0] ?? null);
    setNextTitle(video?.title ?? '');
  }, [video?.id]);

  useEffect(() => {
    if (
      activeClipId &&
      video?.clipIds.some((clipId) => clipId === activeClipId)
    ) {
      return;
    }
    setActiveClipId(video?.clipIds[0] ?? null);
  }, [activeClipId, video?.clipIds]);

  if (!video) {
    return (
      <EmptyPreview>
        Create a video to start editing
        <Button
          size="sm"
          intent="primary"
          startIcon={<ButtonIconMask $asset="/icons/add.svg" />}
          onClick={onCreateVideo}
        >
          Create a new video
        </Button>
      </EmptyPreview>
    );
  }

  const editorVideo = video;

  function submitRename() {
    const title = nextTitle.trim();
    if (!title) return;
    onRenameVideo(editorVideo.id, title);
    onNotify('Video renamed', `Renamed to “${title}”.`);
    setRenameOpen(false);
  }

  const player = (
    <MediaPlayer
      controller={playerController}
      imageSrc={activeClip?.thumbnailUrl ?? '/media/thumbs/agent-preview.png'}
      imageAlt={
          activeClip
            ? `Preview for ${activeClip.title}`
            : `Preview for ${editorVideo.title}`
      }
      timelineLabel="Video position"
    >
      {captionsOn ? (
        <CaptionPreview
          $fontSize={captionFontSize}
          $colorScheme={captionColorScheme}
          $rows={Number(captionRows)}
        >
          {captionType === 'rich'
            ? '[Crowd cheers] Left-footed shot from the center of the box.'
            : 'Left-footed shot from the center of the box to the bottom-left corner.'}
        </CaptionPreview>
      ) : null}
    </MediaPlayer>
  );

  const playerStage =
    timelineClips.length === 0 ? (
      <PreviewMediaFrame>
        <EmptyPlayerPlaceholder>
          Add clips to this video project
        </EmptyPlayerPlaceholder>
      </PreviewMediaFrame>
    ) : (
      player
    );

  const addClipControl = (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>
        <TooltipIconButton
          size="lg"
          intent="primary"
          label="Add clip to timeline"
          icon={<TimelineAddIcon />}
        />
      </RadixDropdownMenu.Trigger>
      <RadixDropdownMenu.Portal>
        <AddMenuContent side="bottom" align="start" sideOffset={8}>
          <AddMenuContainer
            role="menu"
            aria-label="Add clip to timeline"
            width="calc(var(--space-1000) * 5)"
          >
            {addableGroups.length === 0 ? (
              <MenuItem showLeftSlot={false} showRightSlot={false} disabled>
                No more clips to add
              </MenuItem>
            ) : (
              addableGroups.map((group) => (
                <Fragment key={group.label}>
                  <ClipGroupHeader>{group.label}</ClipGroupHeader>
                  {group.clips.map((clip) => (
                    <RadixDropdownMenu.Item asChild key={clip.id}>
                      <MenuItem
                        leftSlot={
                          <ExactIcon src="/icons/menu-video.svg" alt="" />
                        }
                        showRightSlot={false}
                        onClick={() => {
                          onAddClipToVideo(editorVideo.id, clip.id);
                          setActiveClipId(clip.id);
                          onNotify(
                            'Video updated',
                            `Added “${clip.title}” to the timeline.`,
                          );
                        }}
                      >
                        {clip.title}
                      </MenuItem>
                    </RadixDropdownMenu.Item>
                  ))}
                </Fragment>
              ))
            )}
          </AddMenuContainer>
        </AddMenuContent>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );

  const timeline = (
    <TimelineSection>
      <TimelineHeading>Timeline Clips</TimelineHeading>
      <TimelineStrip>
        {timelineClips.map((clip) => (
          <TimelineThumbButton
            key={clip.id}
            type="button"
            $active={clip.id === activeClip?.id}
            onClick={() => setActiveClipId(clip.id)}
            aria-pressed={clip.id === activeClip?.id}
            aria-label={clip.title}
          >
            <TimelineThumbImage src={clip.thumbnailUrl} alt="" />
            <TimelineDuration>{clip.duration}</TimelineDuration>
          </TimelineThumbButton>
        ))}
        <TimelineAddSlot>{addClipControl}</TimelineAddSlot>
      </TimelineStrip>
    </TimelineSection>
  );

  const transcriptSection = (
    <ClipPreviewFeatures
      showTranscript={showTranscript}
      onShowTranscriptChange={setShowTranscript}
      transcript={activeTranscript}
      denseTranscript={activeDenseTranscript}
      events={activePreviewEvents}
    />
  );

  return (
    <VideoEditorShell>
      <div>
        <VideoEditorTitleRow>
          <VideoEditorTitle>{editorVideo.title}</VideoEditorTitle>
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label="Rename video"
            icon={<Pencil size={20} />}
            onClick={() => {
              setNextTitle(editorVideo.title);
              setRenameOpen(true);
            }}
          />
        </VideoEditorTitleRow>
        <PreviewMetadata>
          <Badge color="disabled" tone="subtle" dot={false}>
            {timelineClips.length === 1
              ? '1 clip'
              : `${timelineClips.length} clips`}
          </Badge>
          <RecordingBadge>{totalDuration} total duration</RecordingBadge>
        </PreviewMetadata>
      </div>

      <VideoModeSwitcherFrame>
        <StudioContentSwitcher
          aria-label="Video editor mode"
          size="sm"
          intent="secondary"
          options={[
            { value: 'preview', label: 'Preview' },
            { value: 'clips', label: 'Edit clips' },
            { value: 'captions', label: 'Captions' },
            { value: 'export', label: 'Export' },
          ]}
          value={editorMode}
          onValueChange={setEditorMode}
        />
      </VideoModeSwitcherFrame>

      <VideoEditorStage $scroll>
        {editorMode === 'preview' ? (
          <>
            {playerStage}
            {timeline}
            {transcriptSection}
          </>
        ) : null}

        {editorMode === 'clips' ? (
          <>
            <VideoTimelineManager
              clips={timelineClips}
              activeClipId={activeClip?.id ?? null}
              addClipControl={addClipControl}
              onSelectClip={setActiveClipId}
              onChangeClipIds={(clipIds) =>
                onChangeVideoClips(editorVideo.id, clipIds)
              }
              onNotify={onNotify}
            />
            {activeClip ? (
              <ClipEditorPanel
                project={project}
                clip={activeClip}
                player={player}
                initialState={clipEditorSaves[activeClip.id]}
                onSaveState={(clipId, state) =>
                  setClipEditorSaves((current) => ({
                    ...current,
                    [clipId]: state,
                  }))
                }
                onNotify={onNotify}
              />
            ) : null}
          </>
        ) : null}

        {editorMode === 'captions' ? (
          <>
            {playerStage}
            <VideoCaptionSettings
              enabled={captionsOn}
              type={captionType}
              language={captionLanguage}
              fontSize={captionFontSize}
              colorScheme={captionColorScheme}
              rows={captionRows}
              onEnabledChange={setCaptionsOn}
              onTypeChange={setCaptionType}
              onLanguageChange={setCaptionLanguage}
              onFontSizeChange={setCaptionFontSize}
              onColorSchemeChange={setCaptionColorScheme}
              onRowsChange={setCaptionRows}
            />
          </>
        ) : null}

        {editorMode === 'export' ? (
          <>
            {playerStage}
            <VideoExportSettings
              fileTypes={exportFileTypes}
              speed={exportSpeed}
              aspectRatios={exportAspectRatios}
              includeAudio={includeAudio}
              onFileTypesChange={setExportFileTypes}
              onSpeedChange={setExportSpeed}
              onAspectRatiosChange={setExportAspectRatios}
              onIncludeAudioChange={setIncludeAudio}
              onExport={() =>
                onNotify(
                  'Export started',
                  `Queued “${editorVideo.title}” for export.`,
                )
              }
            />
          </>
        ) : null}
      </VideoEditorStage>

      <PreviewBrand src="/brand/nvidia-logo.svg" alt="NVIDIA" />

      <Modal
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="Rename video"
        subtitle="Update the title shown on this video project."
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
          <ExampleTextInput
            label="Video title"
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
    </VideoEditorShell>
  );
}
