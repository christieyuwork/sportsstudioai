import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Badge,
  Button,
  Divider,
  HorizontalTabItem,
  HorizontalTabsContent,
  HorizontalTabsList,
  IconButton,
  MenuItem,
  Modal,
  ModalContent,
  ModalFooter,
  SimpleTooltip,
  TextInput,
} from '@cake-admin/cakeand';
import {
  DropdownMenu as RadixDropdownMenu,
  Popover as RadixPopover,
} from 'radix-ui';
import type { GeneratedClip, Project } from '../types/project';
import { StudioIcon } from './StudioIcon';
import { ClipLibraryCard } from './ClipLibraryCard';
import {
  ChipLabel,
  ChipRow,
  PromptInput,
  PromptToolbar,
  SuggestionChip,
} from '../styles/home-theme';
import { SelectionActions } from '../styles/detected-events-theme';
import {
  AddMenuContainer,
  AddMenuContent,
  AgentComposer,
  AgentDisclaimer,
  AgentPromptBox,
  AgentTextShield,
  AgentWorkspaceShell,
  AssistantResponse,
  AssistantText,
  ClipCard,
  ClipCopy,
  ClipDescription,
  ClipList,
  ClipMeta,
  ClipThumb,
  ClipTitle,
  ConsoleFooter,
  ConversationPane,
  ConversationScroll,
  ConversationScrollContent,
  CountryFlag,
  DescriptionTooltipWrap,
  EmptyPreview,
  ExactIcon,
  FeedbackIcon,
  FeedbackRow,
  PlayerControlGroup,
  PlayerControls,
  PlayerIcon,
  PlayerOverlay,
  PlayerTimeline,
  PreviewHeadingGroup,
  PreviewActions,
  PreviewBrand,
  PreviewHeader,
  PreviewClipButton,
  PreviewHint,
  PreviewImage,
  PreviewMediaFrame,
  PreviewMetadata,
  PreviewPlayGlyph,
  PreviewPanelBody,
  PreviewSurface,
  PreviewTabsRoot,
  PreviewTitle,
  ProjectMediaGrid,
  ProjectMediaSwitcher,
  ProjectMediaTile,
  ProjectMediaTileImage,
  ProjectMediaTileLabel,
  MediaLibrary,
  MediaLibraryHeader,
  MediaLibrarySection,
  MediaLibraryTitle,
  LibraryWelcome,
  LibraryWelcomeContent,
  LibraryWelcomeText,
  LibraryWelcomeTitle,
  ResultMeta,
  ReasoningCaption,
  ReasoningCheck,
  ReasoningDetails,
  ReasoningTrace,
  ReasoningTraceCard,
  ReasoningTraceHeader,
  ReasoningTraceMeta,
  ReasoningTraceTitle,
  SelectedPreview,
  StreamingLead,
  ThinkingCopy,
  ThinkingLine,
  ThinkingRow,
  ThinkingVideo,
  TimelineRow,
  TranscriptBody,
  TranscriptLabel,
  TranscriptMeta,
  TranscriptPanel,
  TranscriptViewButtons,
  UploadedMediaCopy,
  UploadedMediaDuration,
  UploadedMediaList,
  UploadedMediaRow,
  UploadedMediaTitle,
  UserBubble,
  UserBubbleRow,
  VolumePopoverContent,
  VolumeSlider,
  VolumeValue,
  ButtonIconMask,
} from '../styles/agent-theme';

export const MOCK_AGENT_CLIPS: GeneratedClip[] = [
  {
    id: 'yellow-1',
    title: "23′ · YELLOW CARD · Alex Rivera",
    description: 'A late midfield challenge stops a Netherlands counterattack.',
    duration: '0:21',
    thumbnailUrl: '/media/thumbs/event-1.png',
    transcript:
      'Booking. Alex Rivera (Germany) is shown the yellow card for a bad foul on Daan Visser (Netherlands) in the center of the pitch.',
    denseCaption:
      'A Germany player in white slides across an opponent’s path in midfield and clips his lower leg. The referee jogs in, raises a yellow card overhead, and the fouled player stays down briefly before play restarts with a free kick.',
  },
  {
    id: 'yellow-2',
    title: "41′ · YELLOW CARD · Jordan Lee",
    description: 'The referee cautions Lee after a mistimed tackle near the box.',
    duration: '0:18',
    thumbnailUrl: '/media/thumbs/event-2.png',
    transcript:
      'Booking. Jordan Lee (Germany) is shown the yellow card for a mistimed tackle just outside the penalty area.',
    denseCaption:
      'A defender lunges at the ball near the edge of the box and catches the attacker instead. The attacker falls forward onto the grass. The referee points to the spot of the foul and holds a yellow card toward the defender.',
  },
  {
    id: 'yellow-3',
    title: "68′ · YELLOW CARD · Sam Okoye",
    description: 'Okoye receives a booking for delaying the restart.',
    duration: '0:16',
    thumbnailUrl: '/media/thumbs/event-1.png',
    transcript:
      'Booking. Sam Okoye (Germany) is shown the yellow card for time-wasting at a throw-in.',
    denseCaption:
      'A player holds the ball on his hip at the touchline while the opposition gestures for a quick restart. The referee walks over, taps his wrist, and produces a yellow card before the throw is finally taken.',
  },
  {
    id: 'yellow-4',
    title: "84′ · YELLOW CARD · Luca Meyer",
    description: 'A tactical foul breaks up a late attacking move.',
    duration: '0:24',
    thumbnailUrl: '/media/thumbs/event-2.png',
    transcript:
      'Booking. Luca Meyer (Germany) is shown the yellow card for pulling back a Netherlands attacker on the break.',
    denseCaption:
      'With space opening ahead, a white-shirted player reaches out and tugs the shirt of a counter-attacking opponent, stopping the run. The referee immediately signals the foul and shows a yellow card as both benches react.',
  },
];

const RESPONSE_TEXT =
  'I’ll inspect the broadcast and cross-check each matching clip.';
const RESPONSE_WORDS = RESPONSE_TEXT.split(' ');
const FINAL_RESPONSE_TEXT =
  'I found 4 verified yellow card clips in the uploaded broadcast.';
const AGENT_SUGGESTIONS = [
  'Create a highlight reel using all of these clips',
  'Reorder clips for me...',
] as const;

export interface AIAgentWorkspaceProps {
  project: Project;
  request: string;
  selectedClipId: string | null;
  onSelectClip: (clipId: string) => void;
  onSubmitPrompt: (prompt: string) => void;
  onCreateVideo: (title: string, clipIds: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onRenameGeneratedClip: (clipId: string, title: string) => void;
  onDeleteGeneratedClip: (clipId: string) => void;
  onRenameDetectedEvent: (eventId: string, title: string) => void;
  onDeleteDetectedEvent: (eventId: string) => void;
  onNotify: (title: string, description: string) => void;
  libraryOnly?: boolean;
}

interface AddClipMenuProps {
  size?: 'xs' | 'sm';
  variant?: 'outline' | 'fill';
  project: Project;
  clipId: string;
  onAction: (message: string) => void;
  onCreateVideo: (title: string, clipIds: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
}

function AddClipMenu({
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
            Add clip to video
          </Button>
        </RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Portal>
          <AddMenuContent side="top" align="end" sideOffset={8}>
            <AddMenuContainer
              role="menu"
              aria-label="Add clip to video"
              width="calc(var(--space-1000) * 3 + var(--space-600))"
            >
              {project.videos.map((video) => (
                <RadixDropdownMenu.Item asChild key={video.id}>
                  <MenuItem
                    leftSlot={
                      <ExactIcon src="/icons/menu-video.svg" alt="" />
                    }
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
                  leftSlot={
                    <ExactIcon src="/icons/menu-folder.svg" alt="" />
                  }
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
          <TextInput
            label="Video title"
            placeholder="Yellow Card Highlights"
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

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  return `${Math.floor(safeSeconds / 60)}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

export function AIAgentWorkspace({
  project,
  request,
  selectedClipId,
  onSelectClip,
  onSubmitPrompt,
  onCreateVideo,
  onAddClipToVideo,
  onRenameGeneratedClip,
  onDeleteGeneratedClip,
  onRenameDetectedEvent,
  onDeleteDetectedEvent,
  onNotify,
  libraryOnly = false,
}: AIAgentWorkspaceProps) {
  const [draft, setDraft] = useState('');
  const [sequenceRun, setSequenceRun] = useState(0);
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [resultsReady, setResultsReady] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(13);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playerOverlay, setPlayerOverlay] = useState<string | null>(null);
  const [transcriptView, setTranscriptView] = useState('transcript');
  const [previewTab, setPreviewTab] = useState('video');
  const [mediaView, setMediaView] = useState('clips');
  const [selectingMediaSection, setSelectingMediaSection] = useState<
    'generated' | 'detected' | null
  >(null);
  const [selectedMediaClipIds, setSelectedMediaClipIds] = useState<string[]>([]);
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<string[]>([]);
  const [feedbackRating, setFeedbackRating] = useState<
    'helpful' | 'not-helpful' | null
  >(null);
  const previewFrameRef = useRef<HTMLDivElement>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const overlayTimerRef = useRef<number | null>(null);
  const isSilent = muted || volume === 0;
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

  useEffect(() => {
    setVisibleWordCount(0);
    setThinkingStep(0);
    setResultsReady(false);
    setVisibleCardCount(0);
    setExpandedReasoningIds([]);
    setFeedbackRating(null);

    if (libraryOnly) return;

    const timers: number[] = [];
    RESPONSE_WORDS.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => setVisibleWordCount(index + 1), index * 75),
      );
    });

    const textDuration = RESPONSE_WORDS.length * 75;
    const collectionStart = textDuration + 250;
    timers.push(window.setTimeout(() => setThinkingStep(1), collectionStart));
    MOCK_AGENT_CLIPS.forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => {
            setVisibleCardCount(index + 1);
            setThinkingStep(index + 2);
          },
          collectionStart + (index + 1) * 5000,
        ),
      );
    });
    timers.push(
      window.setTimeout(() => {
        setThinkingStep(0);
        setResultsReady(true);
      }, collectionStart + MOCK_AGENT_CLIPS.length * 5000 + 1000),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [libraryOnly, request, sequenceRun]);

  useEffect(() => {
    if (libraryOnly) setPreviewTab('media');
  }, [libraryOnly]);

  useEffect(() => {
    if (visibleCardCount === 0 && !resultsReady) return;
    conversationEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [visibleCardCount, resultsReady]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentTime((value) => {
        if (value >= 30) {
          setIsPlaying(false);
          return 30;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(document.fullscreenElement === previewFrameRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(
    () => () => {
      if (overlayTimerRef.current !== null) {
        window.clearTimeout(overlayTimerRef.current);
      }
    },
    [],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextPrompt = draft.trim();
    if (!nextPrompt) return;
    onSubmitPrompt(nextPrompt);
    setDraft('');
  }

  function showPlayerOverlay(message: string) {
    setPlayerOverlay(message);
    if (overlayTimerRef.current !== null) {
      window.clearTimeout(overlayTimerRef.current);
    }
    overlayTimerRef.current = window.setTimeout(
      () => setPlayerOverlay(null),
      900,
    );
  }

  function seekTo(nextTime: number, message: string) {
    setCurrentTime(Math.min(30, Math.max(0, nextTime)));
    showPlayerOverlay(message);
  }

  function changeVolume(nextVolume: number) {
    setVolume(nextVolume);
    setMuted(nextVolume === 0);
    showPlayerOverlay(nextVolume === 0 ? 'Muted' : `Volume ${nextVolume}%`);
  }

  function toggleMute() {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (!nextMuted && volume === 0) setVolume(70);
    showPlayerOverlay(nextMuted ? 'Muted' : 'Sound on');
  }

  function toggleReasoning(clipId: string) {
    setExpandedReasoningIds((current) =>
      current.includes(clipId)
        ? current.filter((id) => id !== clipId)
        : [...current, clipId],
    );
  }

  function previewClip(clipId: string) {
    onSelectClip(clipId);
    setPreviewTab('video');
  }

  function toggleMediaSelection(clipId: string, selected: boolean) {
    setSelectedMediaClipIds((current) =>
      selected
        ? current.includes(clipId)
          ? current
          : [...current, clipId]
        : current.filter((id) => id !== clipId),
    );
  }

  function toggleSelectingSection(section: 'generated' | 'detected') {
    setSelectingMediaSection((current) =>
      current === section ? null : section,
    );
    setSelectedMediaClipIds([]);
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await previewFrameRef.current?.requestFullscreen();
  }

  return (
    <AgentWorkspaceShell data-agent-workspace>
      <ConversationPane aria-label="AI agent conversation">
        <AgentTextShield
          src="/media/thinking/text-shield.png"
          alt=""
          aria-hidden="true"
        />
        {libraryOnly ? (
          <LibraryWelcome>
            <LibraryWelcomeContent>
              <div>
                <LibraryWelcomeTitle>
                  Welcome to Sports AI Studio
                </LibraryWelcomeTitle>
                <LibraryWelcomeText>
                  Generate clips, analyze feeds, and edit video projects.
                </LibraryWelcomeText>
              </div>
              <AgentPromptBox as="form" onSubmit={handleSubmit}>
                <PromptInput
                  aria-label="Ask the Sports AI agent"
                  placeholder="e.g., Focus more on defensive plays and keeper saves..."
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
                <PromptToolbar>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    intent="secondary"
                    label="Add attachment"
                    icon={<StudioIcon name="prompt-add" size={18} />}
                  />
                  <IconButton
                    size="sm"
                    variant="fill"
                    intent="secondary"
                    label="Send prompt"
                    type="submit"
                    disabled={!draft.trim()}
                    icon={<StudioIcon name="send-arrow" size={16} />}
                  />
                </PromptToolbar>
              </AgentPromptBox>
            </LibraryWelcomeContent>
          </LibraryWelcome>
        ) : (
          <>
        <ConversationScroll
          orientation="vertical"
          maxHeight="100%"
          viewportProps={{ 'aria-live': 'polite' }}
        >
          <ConversationScrollContent>
          <UserBubbleRow>
            <UserBubble>{request}</UserBubble>
          </UserBubbleRow>

          <AssistantResponse>
            <StreamingLead>
              {RESPONSE_WORDS.slice(0, visibleWordCount).join(' ')}
            </StreamingLead>

            {thinkingStep > 0 && !resultsReady ? (
              <ThinkingRow>
                <ThinkingVideo
                  src="/media/thinking/thinking-small.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden="true"
                />
                <ThinkingCopy>
                  <ThinkingLine $active>
                    Finding and verifying clip{' '}
                    {Math.min(visibleCardCount + 1, MOCK_AGENT_CLIPS.length)} of{' '}
                    {MOCK_AGENT_CLIPS.length}...
                  </ThinkingLine>
                  {visibleCardCount > 0 ? (
                    <ThinkingLine $active={false}>
                      {visibleCardCount} clip
                      {visibleCardCount === 1 ? '' : 's'} cross-checked
                    </ThinkingLine>
                  ) : null}
                </ThinkingCopy>
              </ThinkingRow>
            ) : null}

            {visibleCardCount > 0 ? (
              <ReasoningTrace aria-label="Agent reasoning">
                {MOCK_AGENT_CLIPS.slice(0, visibleCardCount).map((clip) => {
                  const expanded = expandedReasoningIds.includes(clip.id);
                  return (
                    <ReasoningTraceCard key={`reasoning-${clip.id}`}>
                      <ReasoningTraceHeader>
                        <ReasoningTraceTitle>Clip found</ReasoningTraceTitle>
                        <ReasoningTraceMeta>
                          <Badge color="disabled" tone="subtle" dot={false}>
                            BBC Broadcast
                          </Badge>
                          <Badge color="red" tone="subtle" dot>
                            {clip.duration}
                          </Badge>
                          <IconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label={
                              expanded
                                ? `Collapse reasoning for ${clip.title}`
                                : `Expand reasoning for ${clip.title}`
                            }
                            aria-expanded={expanded}
                            icon={<StudioIcon name="dropdown" size={16} />}
                            onClick={() => toggleReasoning(clip.id)}
                          />
                        </ReasoningTraceMeta>
                      </ReasoningTraceHeader>
                      {expanded ? (
                        <ReasoningDetails>
                          <ReasoningCaption>
                            “...{clip.transcript}...”
                          </ReasoningCaption>
                          <ReasoningCheck>
                            <ExactIcon
                              src="/icons/reasoning-verified.png"
                              alt=""
                            />
                            Cross-checked against the dense caption before using
                            it — genuinely matches
                          </ReasoningCheck>
                          <ReasoningCaption>
                            {clip.denseCaption}
                          </ReasoningCaption>
                        </ReasoningDetails>
                      ) : null}
                    </ReasoningTraceCard>
                  );
                })}
              </ReasoningTrace>
            ) : null}

            {resultsReady ? (
              <>
                <AssistantText>{FINAL_RESPONSE_TEXT}</AssistantText>
                <ResultMeta>
                  <Badge color="indigo" tone="subtle" dot={false}>
                    4 clips generated
                  </Badge>
                  <span>Total duration · 1:19</span>
                </ResultMeta>
              </>
            ) : null}

            <ClipList>
              {resultsReady
                ? MOCK_AGENT_CLIPS.map((clip) => (
                <ClipCard
                  key={clip.id}
                  $selected={clip.id === selectedClipId}
                  role="article"
                >
                  <ClipThumb src={clip.thumbnailUrl} alt="" />
                  <ClipCopy>
                    <ClipTitle>{clip.title}</ClipTitle>
                    <DescriptionTooltipWrap>
                      <SimpleTooltip
                        trigger={
                          <ClipDescription>{clip.description}</ClipDescription>
                        }
                        side="top"
                        align="start"
                        maxWidth="calc(var(--space-1000) * 5)"
                      >
                        {clip.description}
                      </SimpleTooltip>
                    </DescriptionTooltipWrap>
                    <ClipMeta>
                      <span>Broadcast feed</span>
                      <Badge color="red" tone="subtle" dot>
                        {clip.duration}
                      </Badge>
                      <CountryFlag src="/icons/country-germany.png" alt="" />
                      <Badge color="yellow" tone="subtle" dot={false}>
                        Germany
                      </Badge>
                    </ClipMeta>
                  </ClipCopy>
                  <PreviewClipButton
                    size="sm"
                    variant="ghost"
                    intent="secondary"
                    label={`Preview ${clip.title}`}
                    icon={<PreviewPlayGlyph />}
                    onClick={() => previewClip(clip.id)}
                  />
                  <AddClipMenu
                    project={project}
                    clipId={clip.id}
                    onAction={(message) => onNotify('Video updated', message)}
                    onCreateVideo={onCreateVideo}
                    onAddClipToVideo={onAddClipToVideo}
                  />
                </ClipCard>
                  ))
                : null}
            </ClipList>

            {resultsReady ? (
              <>
                <AssistantText>
                  You can preview any clip in the side panel. Once you’re
                  satisfied, add the clips to a new or existing video to trim,
                  reorder, and caption them.
                </AssistantText>
                <FeedbackRow aria-label="Rate this response">
                  <IconButton
                    size="xs"
                    variant="ghost"
                    intent="secondary"
                    label="Regenerate response"
                    icon={
                      <FeedbackIcon src="/icons/agent-regenerate.png" alt="" />
                    }
                    onClick={() => setSequenceRun((value) => value + 1)}
                  />
                  <IconButton
                    size="xs"
                    variant="ghost"
                    intent="secondary"
                    label="Helpful response"
                    aria-pressed={feedbackRating === 'helpful'}
                    icon={
                      <FeedbackIcon
                        src={
                          feedbackRating === 'helpful'
                            ? '/icons/player/thumb_upfill.svg'
                            : '/icons/player/thumb_up.svg'
                        }
                        alt=""
                      />
                    }
                    onClick={() =>
                      setFeedbackRating((value) =>
                        value === 'helpful' ? null : 'helpful',
                      )
                    }
                  />
                  <IconButton
                    size="xs"
                    variant="ghost"
                    intent="secondary"
                    label="Not helpful"
                    aria-pressed={feedbackRating === 'not-helpful'}
                    icon={
                      <FeedbackIcon
                        src={
                          feedbackRating === 'not-helpful'
                            ? '/icons/player/thumb_downfill.svg'
                            : '/icons/player/thumb_down.svg'
                        }
                        alt=""
                      />
                    }
                    onClick={() =>
                      setFeedbackRating((value) =>
                        value === 'not-helpful' ? null : 'not-helpful',
                      )
                    }
                  />
                </FeedbackRow>
              </>
            ) : null}
            <div ref={conversationEndRef} />
          </AssistantResponse>
          </ConversationScrollContent>
        </ConversationScroll>

        <AgentComposer>
          <ChipRow>
            {AGENT_SUGGESTIONS.map((suggestion) => (
              <SuggestionChip
                key={suggestion}
                size="sm"
                type="primary"
                leadingIcon={<StudioIcon name="go-arrow" size={16} />}
                onClick={() => onSubmitPrompt(suggestion)}
              >
                <ChipLabel>{suggestion}</ChipLabel>
              </SuggestionChip>
            ))}
            <SuggestionChip
              size="sm"
              type="secondary"
              leadingIcon={<StudioIcon name="chip-arrow-more" size={16} />}
            >
              More
            </SuggestionChip>
          </ChipRow>

          <AgentPromptBox as="form" onSubmit={handleSubmit}>
            <PromptInput
              aria-label="Ask the Sports AI agent"
              placeholder="Generate me a 10 second clip of highlights in 1:1 aspect ratio..."
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <PromptToolbar>
              <IconButton
                size="sm"
                variant="ghost"
                intent="secondary"
                label="Add attachment"
                icon={<StudioIcon name="prompt-add" size={18} />}
              />
              <IconButton
                size="sm"
                variant="fill"
                intent="secondary"
                label="Send prompt"
                type="submit"
                disabled={!draft.trim()}
                icon={<StudioIcon name="send-arrow" size={16} />}
              />
            </PromptToolbar>
          </AgentPromptBox>
          <AgentDisclaimer>
            Sports Studio AI is an AI tool. Please double-check AI output.
          </AgentDisclaimer>
        </AgentComposer>
          </>
        )}
      </ConversationPane>

      <PreviewSurface aria-label="Clip preview panel">
        <PreviewTabsRoot value={previewTab} onValueChange={setPreviewTab}>
          <PreviewHeader>
            <HorizontalTabsList
              aria-label="Preview panel sections"
              scrollButtons="never"
            >
              <HorizontalTabItem value="media">Project media</HorizontalTabItem>
              <HorizontalTabItem value="video">Clip preview</HorizontalTabItem>
            </HorizontalTabsList>
            <Button
              size="sm"
              variant="outline"
              intent="secondary"
              endIcon={<StudioIcon name="add" size={20} />}
              onClick={() =>
                onNotify('New video', 'A new video draft was created.')
              }
            >
              New video
            </Button>
          </PreviewHeader>

          <HorizontalTabsContent value="video">
            <PreviewPanelBody>
              {selectedClip ? (
                <SelectedPreview>
                  <PreviewHeadingGroup>
                    <PreviewTitle>Clip preview: {selectedClip.title}</PreviewTitle>
                    <PreviewMetadata>
                      <Badge color="disabled" tone="subtle" dot={false}>
                        BBC Broadcast
                      </Badge>
                      <Badge color="red" tone="subtle" dot>
                        {selectedClip.duration}
                      </Badge>
                      <CountryFlag src="/icons/country-germany.png" alt="" />
                      <Badge color="yellow" tone="subtle" dot={false}>
                        Germany
                      </Badge>
                    </PreviewMetadata>
                  </PreviewHeadingGroup>
                  <PreviewHint>
                    Once you are satisfied with this clip, add it to a video so
                    you can edit and trim before exporting.
                  </PreviewHint>

                  <div>
                    <PreviewMediaFrame ref={previewFrameRef}>
                      <PreviewImage
                        src="/media/thumbs/agent-preview.png"
                        alt={`Preview for ${selectedClip.title}`}
                      />
                      {playerOverlay ? (
                        <PlayerOverlay key={playerOverlay}>
                          {playerOverlay}
                        </PlayerOverlay>
                      ) : null}
                      <PlayerControls>
                        <PlayerControlGroup>
                          <IconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label="Jump to start"
                            icon={
                              <PlayerIcon
                                src="/icons/player/fast_rewind.svg"
                                alt=""
                              />
                            }
                            onClick={() => seekTo(0, 'Start')}
                          />
                          <IconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label="Back 5 seconds"
                            icon={
                              <PlayerIcon
                                src="/icons/player/replay_5.svg"
                                alt=""
                              />
                            }
                            onClick={() => seekTo(currentTime - 5, '−5s')}
                          />
                          <IconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label={isPlaying ? 'Pause preview' : 'Play preview'}
                            icon={
                              <PlayerIcon
                                src="/icons/player/play_arrow.svg"
                                alt=""
                              />
                            }
                            onClick={() => {
                              setIsPlaying((value) => !value);
                              showPlayerOverlay(isPlaying ? 'Paused' : 'Playing');
                            }}
                          />
                          <IconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label="Forward 5 seconds"
                            icon={
                              <PlayerIcon
                                src="/icons/player/forward_5.svg"
                                alt=""
                              />
                            }
                            onClick={() => seekTo(currentTime + 5, '+5s')}
                          />
                          <IconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label="Jump to end"
                            icon={
                              <PlayerIcon
                                src="/icons/player/fast_forward.svg"
                                alt=""
                              />
                            }
                            onClick={() => seekTo(30, 'End')}
                          />
                        </PlayerControlGroup>

                        <TimelineRow>
                          <span>{formatTime(currentTime)}</span>
                          <PlayerTimeline
                            type="range"
                            aria-label="Clip position"
                            min={0}
                            max={30}
                            step={1}
                            value={currentTime}
                            $progress={(currentTime / 30) * 100}
                            onChange={(event) =>
                              setCurrentTime(Number(event.target.value))
                            }
                          />
                          <span>0:30</span>
                        </TimelineRow>

                        <PlayerControlGroup>
                          <RadixPopover.Root>
                            <RadixPopover.Trigger asChild>
                              <IconButton
                                size="xs"
                                variant="ghost"
                                intent="secondary"
                                label="Volume"
                                icon={
                                  <PlayerIcon
                                    src={
                                      isSilent
                                        ? '/icons/player/volume_off.svg'
                                        : '/icons/player/volume_up.svg'
                                    }
                                    alt=""
                                  />
                                }
                              />
                            </RadixPopover.Trigger>
                            <RadixPopover.Portal>
                              <VolumePopoverContent
                                side="top"
                                align="center"
                                sideOffset={8}
                              >
                                <IconButton
                                  size="xs"
                                  variant="ghost"
                                  intent="secondary"
                                  label={
                                    muted ? 'Unmute preview' : 'Mute preview'
                                  }
                                  aria-pressed={muted}
                                  icon={
                                    <PlayerIcon
                                      src={
                                        isSilent
                                          ? '/icons/player/volume_off.svg'
                                          : '/icons/player/volume_up.svg'
                                      }
                                      alt=""
                                    />
                                  }
                                  onClick={toggleMute}
                                />
                                <VolumeSlider
                                  type="range"
                                  aria-label="Preview volume"
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={isSilent ? 0 : volume}
                                  $progress={isSilent ? 0 : volume}
                                  onChange={(event) =>
                                    changeVolume(Number(event.target.value))
                                  }
                                />
                                <VolumeValue>
                                  {isSilent ? 0 : volume}%
                                </VolumeValue>
                              </VolumePopoverContent>
                            </RadixPopover.Portal>
                          </RadixPopover.Root>
                          <IconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label={
                              isFullscreen
                                ? 'Exit full screen'
                                : 'Enter full screen'
                            }
                            icon={
                              <PlayerIcon
                                src={
                                  isFullscreen
                                    ? '/icons/player/fullscreen_exit.svg'
                                    : '/icons/player/fullscreen.svg'
                                }
                                alt=""
                              />
                            }
                            onClick={() => void toggleFullscreen()}
                          />
                        </PlayerControlGroup>
                      </PlayerControls>
                    </PreviewMediaFrame>
                    <ConsoleFooter>
                      <span>ws://telemetry.fifa-ai.internal:8080/events</span>
                      <span>Timestamp: 48:16.0</span>
                    </ConsoleFooter>
                  </div>

                  <TranscriptPanel>
                    <TranscriptViewButtons
                      role="group"
                      aria-label="Preview information"
                    >
                      <Button
                        size="xs"
                        variant={transcriptView === 'dense' ? 'fill' : 'ghost'}
                        intent={
                          transcriptView === 'dense' ? 'primary' : 'secondary'
                        }
                        onClick={() => setTranscriptView('dense')}
                      >
                        Dense
                      </Button>
                      <Button
                        size="xs"
                        variant={
                          transcriptView === 'transcript' ? 'fill' : 'ghost'
                        }
                        intent={
                          transcriptView === 'transcript'
                            ? 'primary'
                            : 'secondary'
                        }
                        onClick={() => setTranscriptView('transcript')}
                      >
                        Transcript
                      </Button>
                    </TranscriptViewButtons>
                    {transcriptView === 'transcript' ? (
                      <>
                        <TranscriptMeta>
                          <TranscriptLabel>OPTA TRANSCRIPT</TranscriptLabel>
                          <span>fixture 2561913 | structured feed</span>
                        </TranscriptMeta>
                        <TranscriptBody>
                          <p>{selectedClip.transcript}</p>
                          <p>
                            Free kick awarded. Play restarts from the spot of the
                            foul with both sides reorganising.
                          </p>
                        </TranscriptBody>
                      </>
                    ) : (
                      <>
                        <TranscriptMeta>
                          <TranscriptLabel>
                            DENSE ACCESSIBLE TRANSCRIPT
                          </TranscriptLabel>
                          <span>descriptive broadcast view</span>
                        </TranscriptMeta>
                        <TranscriptBody>
                          <p>
                            Wide broadcast view of Germany in white attacking
                            from left to right, with the score graphic in the
                            upper-left corner.
                          </p>
                          <p>{selectedClip.denseCaption}</p>
                          <p>
                            Crowd noise rises briefly, then settles as both
                            sides reset for the restart.
                          </p>
                        </TranscriptBody>
                      </>
                    )}
                  </TranscriptPanel>

                  <PreviewActions>
                    <Button
                      size="sm"
                      variant="ghost"
                      intent="secondary"
                      underline
                      startIcon={
                        <ButtonIconMask $asset="/icons/player/download.svg" />
                      }
                      onClick={() =>
                        onNotify(
                          'Download ready',
                          `Prepared “${selectedClip.title}” for download.`,
                        )
                      }
                    >
                      Download
                    </Button>
                    <AddClipMenu
                      size="sm"
                      variant="fill"
                      project={project}
                      clipId={selectedClip.id}
                      onAction={(message) =>
                        onNotify('Video updated', message)
                      }
                      onCreateVideo={onCreateVideo}
                      onAddClipToVideo={onAddClipToVideo}
                    />
                  </PreviewActions>
                  <PreviewBrand src="/brand/nvidia-logo.svg" alt="NVIDIA" />
                </SelectedPreview>
              ) : (
                <EmptyPreview>Select a clip to preview</EmptyPreview>
              )}
            </PreviewPanelBody>
          </HorizontalTabsContent>

          <HorizontalTabsContent value="media">
            <PreviewPanelBody>
              <ProjectMediaSwitcher
                aria-label="Project media type"
                size="sm"
                intent="secondary"
                options={[
                  { value: 'clips', label: 'Clips' },
                  { value: 'uploaded', label: 'User-uploaded media' },
                ]}
                value={mediaView}
                onValueChange={setMediaView}
              />

              {mediaView === 'clips' ? (
                <MediaLibrary>
                  {project.videos.length > 0 ? (
                    <MediaLibrarySection>
                      <MediaLibraryHeader>
                        <MediaLibraryTitle>Video outputs</MediaLibraryTitle>
                      </MediaLibraryHeader>
                      <ProjectMediaGrid>
                        {project.videos.map((video) => (
                          <ProjectMediaTile key={video.id}>
                            <ProjectMediaTileImage
                              src="/media/thumbs/agent-preview.png"
                              alt=""
                            />
                            <ProjectMediaTileLabel>
                              {video.title}
                            </ProjectMediaTileLabel>
                            <ClipMeta>
                              {video.clipIds.length} clip
                              {video.clipIds.length === 1 ? '' : 's'} ·{' '}
                              {video.createdAtLabel}
                            </ClipMeta>
                          </ProjectMediaTile>
                        ))}
                      </ProjectMediaGrid>
                    </MediaLibrarySection>
                  ) : null}

                  <MediaLibrarySection>
                    <MediaLibraryHeader>
                      <MediaLibraryTitle>Generated clips</MediaLibraryTitle>
                      <SelectionActions>
                        {selectingMediaSection === 'generated' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              intent="secondary"
                              onClick={() =>
                                toggleSelectingSection('generated')
                              }
                            >
                              Selecting ({selectedMediaClipIds.length})
                            </Button>
                            <Button
                              size="sm"
                              variant="fill"
                              disabled={selectedMediaClipIds.length === 0}
                              onClick={() =>
                                onNotify(
                                  'Clips selected',
                                  `${selectedMediaClipIds.length} generated clips are ready to add to a video.`,
                                )
                              }
                            >
                              Add selected clips to video
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="tonal"
                            intent="secondary"
                            onClick={() =>
                              toggleSelectingSection('generated')
                            }
                          >
                            Select
                          </Button>
                        )}
                      </SelectionActions>
                    </MediaLibraryHeader>
                    <ProjectMediaGrid>
                      {project.generatedClips.map((clip) => (
                        <ClipLibraryCard
                          key={clip.id}
                          item={clip}
                          selecting={selectingMediaSection === 'generated'}
                          selected={selectedMediaClipIds.includes(clip.id)}
                          onSelectedChange={(selected) =>
                            toggleMediaSelection(clip.id, selected)
                          }
                          onPreview={() => previewClip(clip.id)}
                          onRename={(title) => {
                            onRenameGeneratedClip(clip.id, title);
                            onNotify(
                              'Clip renamed',
                              `Renamed to “${title}”.`,
                            );
                          }}
                          onDelete={() => {
                            onDeleteGeneratedClip(clip.id);
                            setSelectedMediaClipIds((current) =>
                              current.filter((id) => id !== clip.id),
                            );
                            onNotify(
                              'Clip deleted',
                              `Removed “${clip.title}”.`,
                            );
                          }}
                        />
                      ))}
                    </ProjectMediaGrid>
                  </MediaLibrarySection>

                  <MediaLibrarySection>
                    <MediaLibraryHeader>
                      <MediaLibraryTitle>Detected events</MediaLibraryTitle>
                      <SelectionActions>
                        {selectingMediaSection === 'detected' ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              intent="secondary"
                              onClick={() =>
                                toggleSelectingSection('detected')
                              }
                            >
                              Selecting ({selectedMediaClipIds.length})
                            </Button>
                            <Button
                              size="sm"
                              variant="fill"
                              disabled={selectedMediaClipIds.length === 0}
                              onClick={() =>
                                onNotify(
                                  'Events selected',
                                  `${selectedMediaClipIds.length} detected events are ready to generate.`,
                                )
                              }
                            >
                              Generate video
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="tonal"
                            intent="secondary"
                            onClick={() =>
                              toggleSelectingSection('detected')
                            }
                          >
                            Select
                          </Button>
                        )}
                      </SelectionActions>
                    </MediaLibraryHeader>
                    <ProjectMediaGrid>
                      {project.events.map((event) => (
                        <ClipLibraryCard
                          key={event.id}
                          item={{ ...event, duration: event.timestamp }}
                          selecting={selectingMediaSection === 'detected'}
                          selected={selectedMediaClipIds.includes(event.id)}
                          onSelectedChange={(selected) =>
                            toggleMediaSelection(event.id, selected)
                          }
                          onPreview={() => previewClip(event.id)}
                          onRename={(title) => {
                            onRenameDetectedEvent(event.id, title);
                            onNotify(
                              'Clip renamed',
                              `Renamed to “${title}”.`,
                            );
                          }}
                          onDelete={() => {
                            onDeleteDetectedEvent(event.id);
                            setSelectedMediaClipIds((current) =>
                              current.filter((id) => id !== event.id),
                            );
                            onNotify(
                              'Clip deleted',
                              `Removed “${event.title}”.`,
                            );
                          }}
                        />
                      ))}
                    </ProjectMediaGrid>
                  </MediaLibrarySection>
                </MediaLibrary>
              ) : (
                <UploadedMediaList>
                  {project.media.map((item) => (
                    <UploadedMediaRow key={item.id}>
                      <ClipThumb src={item.thumbnailUrl} alt="" />
                      <UploadedMediaCopy>
                        <UploadedMediaTitle>{item.title}</UploadedMediaTitle>
                        <UploadedMediaDuration>
                          {item.durationLabel}
                        </UploadedMediaDuration>
                      </UploadedMediaCopy>
                    </UploadedMediaRow>
                  ))}
                </UploadedMediaList>
              )}
            </PreviewPanelBody>
          </HorizontalTabsContent>
        </PreviewTabsRoot>
      </PreviewSurface>
    </AgentWorkspaceShell>
  );
}
