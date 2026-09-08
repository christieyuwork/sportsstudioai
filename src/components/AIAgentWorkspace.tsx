import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge } from '@cake-admin/cakeand';
import type { Project } from '../types/project';
import { MOCK_AGENT_CLIPS } from '../data/mockAgentClips';
import { formatClock, parseClock } from '../lib/time';
import { StudioIcon } from './StudioIcon';
import { AddClipMenu } from './AddClipMenu';
import { AgentPreviewPanel, useAgentPreviewState } from './AgentPreviewPanel';
import { ClipLibraryCard } from './ClipLibraryCard';
import { PromptComposer, PromptSuggestions } from './PromptControls';
import { RecordingBadge } from './RecordingBadge';
import { TooltipIconButton } from './TooltipIconButton';
import {
  AgentComposer,
  AgentDisclaimer,
  AgentWorkspaceShell,
  AssistantResponse,
  AssistantText,
  ClipList,
  ConversationPane,
  ConversationScroll,
  ConversationScrollContent,
  CountryFlag,
  ExactIcon,
  FeedbackIcon,
  FeedbackRow,
  ResultMeta,
  ReasoningCaption,
  ReasoningCheck,
  ReasoningChevron,
  ReasoningDetails,
  ReasoningSummaryTrigger,
  ReasoningTrace,
  ReasoningTraceCard,
  ReasoningTraceHeader,
  ReasoningTraceMeta,
  ReasoningTraceTitle,
  StreamingLead,
  ThinkingCopy,
  ThinkingLine,
  ThinkingRow,
  ThinkingVideo,
  UserBubble,
  UserBubbleRow,
} from '../styles/agent-theme';

const RESPONSE_TEXT =
  'I’ll inspect the broadcast and cross-check each matching clip.';
const RESPONSE_WORDS = RESPONSE_TEXT.split(' ');

function totalClipDuration(durations: string[]) {
  return formatClock(
    durations.reduce((total, duration) => total + parseClock(duration), 0),
  );
}
export interface AIAgentWorkspaceProps {
  project: Project;
  request: string;
  videoRequest: { id: string; clipIds: string[] } | null;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  onSubmitPrompt: (prompt: string, videoClipIds?: string[]) => void;
  onCreateVideo: (title: string, clipIds: string[]) => string;
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

export function AIAgentWorkspace({
  project,
  request,
  videoRequest,
  selectedClipId,
  onSelectClip,
  onSubmitPrompt,
  onCreateVideo,
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
}: AIAgentWorkspaceProps) {
  const [draft, setDraft] = useState('');
  const [sequenceRun, setSequenceRun] = useState(0);
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [resultsReady, setResultsReady] = useState(false);
  const [visibleCardCount, setVisibleCardCount] = useState(0);
  const [expandedReasoningIds, setExpandedReasoningIds] = useState<string[]>([]);
  const [reasoningTraceOpen, setReasoningTraceOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState<
    'helpful' | 'not-helpful' | null
  >(null);
  const agentClips = useMemo(() => {
    if (!videoRequest) return MOCK_AGENT_CLIPS;

    return videoRequest.clipIds
      .map((clipId) => {
        const generatedClip = project.generatedClips.find(
          (clip) => clip.id === clipId,
        );
        if (generatedClip) return generatedClip;

        const detectedEvent = project.events.find(
          (event) => event.id === clipId,
        );
        return detectedEvent
          ? {
              id: detectedEvent.id,
              title: detectedEvent.title,
              description: detectedEvent.description,
              duration: detectedEvent.timestamp,
              thumbnailUrl: detectedEvent.thumbnailUrl,
              transcript: detectedEvent.description,
              denseCaption: detectedEvent.description,
            }
          : null;
      })
      .filter((clip): clip is Project['generatedClips'][number] => Boolean(clip));
  }, [project.events, project.generatedClips, videoRequest]);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const openedVideoRequestRef = useRef<string | null>(null);
  const preview = useAgentPreviewState({
    project,
    initialTab: 'media',
    selectedClipId,
    onSelectClip,
    onCreateVideo,
    onNotify,
  });

  useEffect(() => {
    setVisibleWordCount(0);
    setThinkingStep(0);
    setResultsReady(false);
    setVisibleCardCount(0);
    setExpandedReasoningIds([]);
    setReasoningTraceOpen(false);
    setFeedbackRating(null);

    const timers: number[] = [];
    RESPONSE_WORDS.forEach((_, index) => {
      timers.push(
        window.setTimeout(() => setVisibleWordCount(index + 1), index * 75),
      );
    });

    const textDuration = RESPONSE_WORDS.length * 75;
    const collectionStart = textDuration + 250;
    timers.push(window.setTimeout(() => setThinkingStep(1), collectionStart));
    agentClips.forEach((_, index) => {
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
      }, collectionStart + agentClips.length * 5000 + 1000),
    );

    return () => timers.forEach(window.clearTimeout);
  }, [agentClips, request, sequenceRun]);

  useEffect(() => {
    if (visibleCardCount === 0 && !resultsReady) return;
    conversationEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }, [visibleCardCount, resultsReady]);

  useEffect(() => {
    if (
      !resultsReady ||
      !videoRequest ||
      openedVideoRequestRef.current === videoRequest.id
    ) {
      return;
    }

    openedVideoRequestRef.current = videoRequest.id;
    preview.createAndOpenVideo('Suggested video', videoRequest.clipIds);
    onNotify(
      'Video project created',
      `Added ${videoRequest.clipIds.length} selected clips in order.`,
    );
  }, [onNotify, preview, resultsReady, videoRequest]);

  function submitPrompt(prompt: string) {
    onSubmitPrompt(prompt);
    setDraft('');
  }

  function toggleReasoning(clipId: string) {
    setExpandedReasoningIds((current) =>
      current.includes(clipId)
        ? current.filter((id) => id !== clipId)
        : [...current, clipId],
    );
  }

  return (
    <AgentWorkspaceShell data-agent-workspace>
      <ConversationPane aria-label="AI agent conversation">
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
                    {Math.min(visibleCardCount + 1, agentClips.length)} of{' '}
                    {agentClips.length}...
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

            {resultsReady ? (
              <ReasoningSummaryTrigger
                type="button"
                size="xs"
                variant="ghost"
                intent="secondary"
                underline={false}
                aria-expanded={reasoningTraceOpen}
                aria-controls="agent-reasoning-trace"
                endIcon={
                  <ReasoningChevron $open={reasoningTraceOpen}>
                    <StudioIcon name="dropdown" size={16} />
                  </ReasoningChevron>
                }
                onClick={() => setReasoningTraceOpen((open) => !open)}
              >
                {`Finding and verifying ${agentClips.length} clips`}
              </ReasoningSummaryTrigger>
            ) : null}

            {visibleCardCount > 0 && (!resultsReady || reasoningTraceOpen) ? (
              <ReasoningTrace
                id="agent-reasoning-trace"
                aria-label="Agent reasoning"
              >
                {agentClips.slice(0, visibleCardCount).map((clip) => {
                  const expanded = expandedReasoningIds.includes(clip.id);
                  return (
                    <ReasoningTraceCard key={`reasoning-${clip.id}`}>
                      <ReasoningTraceHeader>
                        <ReasoningTraceTitle>Clip found</ReasoningTraceTitle>
                        <ReasoningTraceMeta>
                          <Badge color="disabled" tone="subtle" dot={false}>
                            BBC Broadcast
                          </Badge>
                          <RecordingBadge>{clip.duration}</RecordingBadge>
                          <TooltipIconButton
                            size="xs"
                            variant="ghost"
                            intent="secondary"
                            label={
                              expanded
                                ? `Collapse reasoning for ${clip.title}`
                                : `Expand reasoning for ${clip.title}`
                            }
                            aria-expanded={expanded}
                            icon={<StudioIcon name="dropdown" size={20} />}
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
                <AssistantText>
                  {videoRequest
                    ? `I verified the ${agentClips.length} selected clips and kept them in your chosen order.`
                    : `I found ${agentClips.length} verified yellow card clips in the uploaded broadcast.`}
                </AssistantText>
                <ResultMeta>
                  <Badge color="indigo" tone="subtle" dot={false}>
                    {agentClips.length} clips {videoRequest ? 'ready' : 'generated'}
                  </Badge>
                  <span>
                    Total duration ·{' '}
                    {totalClipDuration(agentClips.map((clip) => clip.duration))}
                  </span>
                </ResultMeta>
              </>
            ) : null}

            <ClipList>
              {resultsReady
                ? agentClips.map((clip) => (
                <ClipLibraryCard
                  key={clip.id}
                  variant="compact"
                  item={clip}
                  selected={clip.id === selectedClipId}
                  onPreview={() => preview.previewClip(clip.id)}
                  metadata={
                    <>
                      <span>Broadcast feed</span>
                      <RecordingBadge>{clip.duration}</RecordingBadge>
                      <CountryFlag src="/icons/country-germany.png" alt="" />
                      <Badge color="yellow" tone="subtle" dot={false}>
                        Germany
                      </Badge>
                    </>
                  }
                  trailingActions={
                    <AddClipMenu
                      project={project}
                      clipId={clip.id}
                      onAction={(message) =>
                        onNotify('Video updated', message)
                      }
                      onCreateVideo={preview.createAndOpenVideo}
                      onAddClipToVideo={onAddClipToVideo}
                    />
                  }
                />
                  ))
                : null}
            </ClipList>

            {resultsReady ? (
              <>
                <AssistantText>
                  You can preview any clip in a modal. Once you’re
                  satisfied, add the clips to a new or existing video to trim,
                  reorder, and caption them.
                </AssistantText>
                <FeedbackRow aria-label="Rate this response">
                  <TooltipIconButton
                    size="xs"
                    variant="ghost"
                    intent="secondary"
                    label="Regenerate response"
                    icon={
                      <FeedbackIcon src="/icons/agent-regenerate.png" alt="" />
                    }
                    onClick={() => setSequenceRun((value) => value + 1)}
                  />
                  <TooltipIconButton
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
                  <TooltipIconButton
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
          <PromptSuggestions
            suggestions={project.promptSuggestions}
            limit={2}
            onSelect={onSubmitPrompt}
          />

          <PromptComposer
            value={draft}
            onChange={setDraft}
            onSubmit={submitPrompt}
            ariaLabel="Ask the Sports AI agent"
            placeholder="e.g. Generate a 10 second highlight clip in 1:1 aspect ratio..."
            variant="agent"
          />
          <AgentDisclaimer>
            Sports Studio AI is an AI tool. Please double-check AI output.
          </AgentDisclaimer>
        </AgentComposer>
      </ConversationPane>

      <AgentPreviewPanel
        project={project}
        state={preview}
        label="Agent project media panel"
        onSubmitPrompt={onSubmitPrompt}
        onAddClipToVideo={onAddClipToVideo}
        onChangeVideoClips={onChangeVideoClips}
        onRenameVideo={onRenameVideo}
        onRenameGeneratedClip={onRenameGeneratedClip}
        onDeleteGeneratedClip={onDeleteGeneratedClip}
        onRenameDetectedEvent={onRenameDetectedEvent}
        onDeleteDetectedEvent={onDeleteDetectedEvent}
        uploading={uploading}
        progressPercent={progressPercent}
        uploadFileName={uploadFileName}
        onUploadClick={onUploadClick}
        onRenameMedia={onRenameMedia}
        onDeleteMedia={onDeleteMedia}
        onNotify={onNotify}
      />
    </AgentWorkspaceShell>
  );
}
