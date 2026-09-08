import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react';
import {
  Badge,
  Button,
  Radio,
  RadioGroup,
} from '@cake-admin/cakeand';
import {
  Info,
  Pencil,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import type { DetectedEvent, Project } from '../types/project';
import type { TimelineClip } from './VideoEditorPanel';
import { MOCK_AGENT_CLIPS } from '../data/mockAgentClips';
import { formatClock, parseClock } from '../lib/time';
import { RecordingBadge } from './RecordingBadge';
import { ClipPreviewFeatures } from './ClipPreviewFeatures';
import { TooltipIconButton } from './TooltipIconButton';
import { CountryFlag, PreviewMetadata, StudioContentSwitcher } from '../styles/agent-theme';
import {
  ClipEditorBody,
  ClipEditorHeader,
  ClipEditorHeading,
  ClipEditorMeta,
  ClipEditorPlayer,
  ClipEditorShell,
  ClipEditorTitle,
  EditableEventRow,
  EditorActions,
  FocusLabel,
  HelperText,
  InlineInput,
  MetadataCopy,
  MetadataDescription,
  MetadataRow,
  MetadataSummary,
  MetadataThumb,
  MetadataTitle,
  PlaybackRow,
  Section,
  SectionHeader,
  SectionTitle,
  SettingsCard,
  TranscriptCard,
  TranscriptHeading,
  TranscriptText,
  TranscriptTextarea,
  TrimFilmstrip,
  TrimActiveRange,
  TrimControl,
  TrimDim,
  TrimFrame,
  TrimHandle,
  TrimMarkers,
  TrimMeta,
  TrimPlayhead,
} from '../styles/clip-editor-theme';

type ClipEditorSection = 'preview' | 'edit' | 'metadata';

export interface ClipEditorEvent {
  id: string;
  timestamp: string;
  /** Canonical clip title the row belongs to. */
  title: string;
  /** Editable event type shown in the log's type column. */
  eventType: string;
  player: string;
  description: string;
}

export interface ClipEditorSavedState {
  events: ClipEditorEvent[];
  transcript: string;
}

export interface ClipEditorPanelProps {
  project: Project;
  clip: TimelineClip;
  player: ReactNode;
  initialState?: ClipEditorSavedState;
  onSaveState: (clipId: string, state: ClipEditorSavedState) => void;
  onNotify: (title: string, description: string) => void;
}

const FALLBACK_TRANSCRIPT =
  "Dual with Kai Havertz (Germany) successfully defending the ball from Norway.\n\nGoal! Germany 2, Norway 2. Kai Havertz (Germany) left footed shot from the center of the box to the bottom left corner following a set piece situation. Assisted by Joshua Kimmich with a cross.\n\n67′ — Substitution for Norway: Alexander Sørloth replaces Erling Haaland. The striker had a frustrating evening, missing two clear-cut chances in the first half.";

function toEditableEvents(events: DetectedEvent[]): ClipEditorEvent[] {
  return events.map((event) => ({
    id: event.id,
    timestamp: event.timestamp,
    title: event.title,
    eventType: event.eventType.toLocaleUpperCase(),
    player: event.player ?? 'Crowd',
    description: event.description,
  }));
}

/** Selected clip editor embedded directly inside the Edit clips mode. */
export function ClipEditorPanel({
  project,
  clip,
  player,
  initialState,
  onSaveState,
  onNotify,
}: ClipEditorPanelProps) {
  const [section, setSection] = useState<ClipEditorSection>('preview');
  const [showTranscript, setShowTranscript] = useState(false);
  const [captionFormat, setCaptionFormat] = useState<'dense' | 'transcript'>(
    'transcript',
  );
  const [selectedEventId, setSelectedEventId] = useState(
    project.events[1]?.id ?? project.events[0]?.id ?? '',
  );
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [trimRange, setTrimRange] = useState<[number, number]>([0, 10]);
  const [eventEditing, setEventEditing] = useState(false);
  const [captionEditing, setCaptionEditing] = useState(false);
  const [filterSelectedOnly, setFilterSelectedOnly] = useState(false);
  const [savedEvents, setSavedEvents] = useState<ClipEditorEvent[]>(() =>
    initialState?.events ?? toEditableEvents(project.events),
  );
  const [eventDrafts, setEventDrafts] =
    useState<ClipEditorEvent[]>(savedEvents);

  const sourceClip = useMemo(
    () =>
      project.generatedClips.find((item) => item.id === clip.id) ??
      MOCK_AGENT_CLIPS.find((item) => item.id === clip.id),
    [clip.id, project.generatedClips],
  );
  const [savedTranscript, setSavedTranscript] = useState(
    initialState?.transcript ?? sourceClip?.transcript ?? FALLBACK_TRANSCRIPT,
  );
  const [transcriptDraft, setTranscriptDraft] = useState(savedTranscript);
  const trimTimelineRef = useRef<HTMLDivElement>(null);
  const durationSeconds = Math.max(1, parseClock(clip.duration, 30));
  const trimStartPercent = (trimRange[0] / durationSeconds) * 100;
  const trimEndPercent = (trimRange[1] / durationSeconds) * 100;
  const trimPlayheadPercent =
    (((trimRange[0] + trimRange[1]) / 2) / durationSeconds) * 100;
  const visibleEvents = filterSelectedOnly
    ? savedEvents.filter((event) => event.id === selectedEventId)
    : savedEvents;

  useEffect(() => {
    const selectionLength = Math.min(10, durationSeconds);
    const start = Math.max(
      0,
      Math.round((durationSeconds - selectionLength) / 2),
    );
    setTrimRange([start, start + selectionLength]);
  }, [clip.id, durationSeconds]);

  useEffect(() => {
    const nextEvents = initialState?.events ?? toEditableEvents(project.events);
    const transcript =
      initialState?.transcript ??
      sourceClip?.transcript ??
      FALLBACK_TRANSCRIPT;
    setSavedEvents(nextEvents);
    setEventDrafts(nextEvents);
    setSavedTranscript(transcript);
    setTranscriptDraft(transcript);
    setEventEditing(false);
    setCaptionEditing(false);
  }, [
    clip.id,
    initialState,
    project.events,
    sourceClip?.transcript,
  ]);

  function setTrimPoint(
    side: 'start' | 'end',
    nextValue: number,
  ) {
    const value = Math.max(0, Math.min(durationSeconds, Math.round(nextValue)));
    setTrimRange(([start, end]) =>
      side === 'start'
        ? [Math.min(value, end - 1), end]
        : [start, Math.max(value, start + 1)],
    );
  }

  function moveTrimHandle(
    event: ReactPointerEvent<HTMLDivElement>,
    side: 'start' | 'end',
  ) {
    const bounds = trimTimelineRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const ratio = (event.clientX - bounds.left) / bounds.width;
    setTrimPoint(side, ratio * durationSeconds);
  }

  function handleTrimPointerDown(
    event: ReactPointerEvent<HTMLDivElement>,
    side: 'start' | 'end',
  ) {
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTrimHandle(event, side);
  }

  function handleTrimKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>,
    side: 'start' | 'end',
  ) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const current = side === 'start' ? trimRange[0] : trimRange[1];
    setTrimPoint(side, current + (event.key === 'ArrowLeft' ? -1 : 1));
  }

  function updateEvent(
    eventId: string,
    field: keyof Omit<ClipEditorEvent, 'id'>,
    value: string,
  ) {
    setEventDrafts((current) =>
      current.map((event) =>
        event.id === eventId ? { ...event, [field]: value } : event,
      ),
    );
  }

  function cancelEventEditing() {
    setEventDrafts(savedEvents);
    setEventEditing(false);
  }

  function saveEventEditing() {
    setSavedEvents(eventDrafts);
    onSaveState(clip.id, {
      events: eventDrafts,
      transcript: savedTranscript,
    });
    setEventEditing(false);
    onNotify('Match event log updated', 'Saved clip metadata changes.');
  }

  function cancelCaptionEditing() {
    setTranscriptDraft(savedTranscript);
    setCaptionEditing(false);
  }

  function saveCaptionEditing() {
    setSavedTranscript(transcriptDraft);
    onSaveState(clip.id, {
      events: savedEvents,
      transcript: transcriptDraft,
    });
    setCaptionEditing(false);
    onNotify('Captions updated', 'Saved the clip transcript.');
  }

  return (
    <ClipEditorShell aria-label={`Clip editor for ${clip.title}`}>
      <ClipEditorHeader>
        <ClipEditorHeading>
          <ClipEditorTitle>{clip.title}</ClipEditorTitle>
          <ClipEditorMeta>
            <Badge color="disabled" tone="subtle" dot={false}>
              BBC Broadcast
            </Badge>
            <RecordingBadge>{clip.duration}</RecordingBadge>
          </ClipEditorMeta>
        </ClipEditorHeading>
      </ClipEditorHeader>

      <StudioContentSwitcher
        aria-label="Clip editor section"
        size="sm"
        intent="secondary"
        options={[
          { value: 'preview', label: 'Preview' },
          { value: 'edit', label: 'Trim' },
          { value: 'metadata', label: 'Edit content' },
        ]}
        value={section}
        onValueChange={(value) => setSection(value as ClipEditorSection)}
      />

      <ClipEditorBody>
        {section === 'preview' ? (
          <>
            <ClipEditorPlayer>{player}</ClipEditorPlayer>
            <ClipPreviewFeatures
              showTranscript={showTranscript}
              onShowTranscriptChange={setShowTranscript}
              transcript={savedTranscript}
              denseTranscript={sourceClip?.denseCaption ?? clip.description}
              events={savedEvents}
            />
          </>
        ) : null}

        {section === 'edit' ? (
          <>
            <ClipEditorPlayer>{player}</ClipEditorPlayer>
            <Section>
              <SectionTitle>Trim</SectionTitle>
              <SettingsCard>
                <TrimControl>
                  <TrimFilmstrip ref={trimTimelineRef}>
                    {Array.from({ length: 8 }, (_, index) => (
                      <TrimFrame
                        key={index}
                        src={clip.thumbnailUrl}
                        alt=""
                      />
                    ))}
                    <TrimDim
                      $side="left"
                      $percent={trimStartPercent}
                      aria-hidden
                    />
                    <TrimDim
                      $side="right"
                      $percent={100 - trimEndPercent}
                      aria-hidden
                    />
                    <TrimActiveRange
                      $start={trimStartPercent}
                      $end={trimEndPercent}
                      aria-hidden
                    />
                    <TrimPlayhead
                      $percent={trimPlayheadPercent}
                      aria-hidden
                    />
                    <TrimHandle
                      role="slider"
                      tabIndex={0}
                      aria-label="Trim start"
                      aria-valuemin={0}
                      aria-valuemax={trimRange[1] - 1}
                      aria-valuenow={trimRange[0]}
                      $side="left"
                      $percent={trimStartPercent}
                      onPointerDown={(event) =>
                        handleTrimPointerDown(event, 'start')
                      }
                      onPointerMove={(event) => {
                        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                          moveTrimHandle(event, 'start');
                        }
                      }}
                      onKeyDown={(event) =>
                        handleTrimKeyDown(event, 'start')
                      }
                    />
                    <TrimHandle
                      role="slider"
                      tabIndex={0}
                      aria-label="Trim end"
                      aria-valuemin={trimRange[0] + 1}
                      aria-valuemax={durationSeconds}
                      aria-valuenow={trimRange[1]}
                      $side="right"
                      $percent={trimEndPercent}
                      onPointerDown={(event) =>
                        handleTrimPointerDown(event, 'end')
                      }
                      onPointerMove={(event) => {
                        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                          moveTrimHandle(event, 'end');
                        }
                      }}
                      onKeyDown={(event) =>
                        handleTrimKeyDown(event, 'end')
                      }
                    />
                  </TrimFilmstrip>
                  <TrimMarkers aria-hidden>
                    <span>0:00</span>
                    <span>{formatClock(durationSeconds / 3)}</span>
                    <span>{formatClock((durationSeconds * 2) / 3)}</span>
                    <span>{formatClock(durationSeconds)}</span>
                  </TrimMarkers>
                </TrimControl>
                <TrimMeta>
                  <RecordingBadge>
                    Duration: {formatClock(trimRange[1] - trimRange[0])}
                  </RecordingBadge>
                </TrimMeta>
              </SettingsCard>
            </Section>
            <Section>
              <SectionTitle>Playback</SectionTitle>
              <SettingsCard>
                <FocusLabel>Playback speed</FocusLabel>
                <RadioGroup
                  value={playbackSpeed}
                  onValueChange={setPlaybackSpeed}
                  orientation="horizontal"
                  aria-label="Playback speed"
                >
                  <PlaybackRow>
                    <Radio value="0.5" label="0.5x" />
                    <Radio value="1" label="1x" />
                    <Radio value="1.5" label="1.5x" />
                    <Radio value="2" label="2x" />
                  </PlaybackRow>
                </RadioGroup>
              </SettingsCard>
            </Section>
          </>
        ) : null}

        {section === 'metadata' ? (
          <>
            <ClipEditorPlayer>{player}</ClipEditorPlayer>
            <MetadataSummary>
              <MetadataThumb src={clip.thumbnailUrl} alt="" />
              <MetadataCopy>
                <Badge color="disabled" tone="subtle" dot={false}>
                  BBC Broadcast
                </Badge>
                <MetadataTitle>{clip.title}</MetadataTitle>
                <MetadataDescription>{clip.description}</MetadataDescription>
                <PreviewMetadata>
                  <RecordingBadge>{clip.duration}</RecordingBadge>
                  <CountryFlag src="/icons/country-germany.png" alt="" />
                  <Badge color="yellow" tone="subtle" dot={false}>
                    Germany
                  </Badge>
                </PreviewMetadata>
              </MetadataCopy>
            </MetadataSummary>

            <Section>
              <SectionHeader>
                <SectionTitle>Match event log</SectionTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  intent="secondary"
                  startIcon={<Pencil size={16} />}
                  disabled={eventEditing}
                  onClick={() => {
                    setEventDrafts(savedEvents);
                    setEventEditing(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  intent="secondary"
                  startIcon={<SlidersHorizontal size={16} />}
                  disabled={eventEditing}
                  onClick={() => setFilterSelectedOnly((filtered) => !filtered)}
                >
                  {filterSelectedOnly ? 'Show all' : 'Filter'}
                </Button>
              </SectionHeader>
              <SettingsCard>
                {eventEditing ? (
                  <>
                    <SectionHeader>
                      <FocusLabel>Edit match event log</FocusLabel>
                      <HelperText>fixture 2561913</HelperText>
                    </SectionHeader>
                    {eventDrafts.map((event) => (
                      <EditableEventRow
                        key={event.id}
                        $selected={event.id === selectedEventId}
                        onClick={() => setSelectedEventId(event.id)}
                      >
                        <InlineInput
                          aria-label={`Time for ${event.title}`}
                          value={event.timestamp}
                          onChange={(eventInput) =>
                            updateEvent(
                              event.id,
                              'timestamp',
                              eventInput.target.value,
                            )
                          }
                        />
                        <InlineInput
                          aria-label={`Type for ${event.title}`}
                          value={event.eventType}
                          onChange={(eventInput) =>
                            updateEvent(
                              event.id,
                              'eventType',
                              eventInput.target.value,
                            )
                          }
                        />
                        <InlineInput
                          aria-label={`Player for ${event.title}`}
                          value={event.player}
                          onChange={(eventInput) =>
                            updateEvent(
                              event.id,
                              'player',
                              eventInput.target.value,
                            )
                          }
                        />
                        <InlineInput
                          aria-label={`Description for ${event.title}`}
                          value={event.description}
                          onChange={(eventInput) =>
                            updateEvent(
                              event.id,
                              'description',
                              eventInput.target.value,
                            )
                          }
                        />
                        <TooltipIconButton
                          size="xs"
                          variant="ghost"
                          intent="secondary"
                          label={`Delete ${event.title}`}
                          icon={<Trash2 size={20} />}
                          onClick={() =>
                            setEventDrafts((current) =>
                              current.filter((item) => item.id !== event.id),
                            )
                          }
                        />
                      </EditableEventRow>
                    ))}
                    <HelperText>
                      <Info size={14} aria-hidden /> Click a field to edit.
                      Changes will sync with OPTA.
                    </HelperText>
                    <EditorActions>
                      <Button
                        size="sm"
                        variant="ghost"
                        intent="secondary"
                        onClick={cancelEventEditing}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        intent="primary"
                        onClick={saveEventEditing}
                      >
                        Save Changes
                      </Button>
                    </EditorActions>
                  </>
                ) : (
                  visibleEvents.map((event) => (
                    <MetadataRow
                      key={event.id}
                      type="button"
                      $selected={event.id === selectedEventId}
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      <span>{event.timestamp}</span>
                      <span>{event.eventType}</span>
                      <span>{event.player}</span>
                      <span>{event.description}</span>
                    </MetadataRow>
                  ))
                )}
              </SettingsCard>
            </Section>

            <Section>
              <SectionHeader>
                <SectionTitle>Subtitles and Captions</SectionTitle>
                <Button
                  size="sm"
                  variant="ghost"
                  intent="secondary"
                  startIcon={<Pencil size={16} />}
                  disabled={captionEditing}
                  onClick={() => {
                    setCaptionFormat('transcript');
                    setTranscriptDraft(savedTranscript);
                    setCaptionEditing(true);
                  }}
                >
                  Edit
                </Button>
              </SectionHeader>
              <TranscriptCard>
                <StudioContentSwitcher
                  aria-label="Caption format"
                  size="sm"
                  intent="primary"
                  options={[
                    { value: 'dense', label: 'Dense' },
                    { value: 'transcript', label: 'Transcript' },
                  ]}
                  value={captionFormat}
                  onValueChange={(value) =>
                    setCaptionFormat(value as 'dense' | 'transcript')
                  }
                />
                {captionEditing ? (
                  <>
                    <TranscriptTextarea
                      aria-label="Clip transcript"
                      value={transcriptDraft}
                      onChange={(event) => setTranscriptDraft(event.target.value)}
                    />
                    <HelperText>
                      <Info size={14} aria-hidden /> Press Enter for a new line.
                      Outlines represent OPTA-synced events.
                    </HelperText>
                    <EditorActions>
                      <Button
                        size="sm"
                        variant="ghost"
                        intent="secondary"
                        onClick={cancelCaptionEditing}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        intent="primary"
                        onClick={saveCaptionEditing}
                      >
                        Save Changes
                      </Button>
                    </EditorActions>
                  </>
                ) : (
                  <>
                    <TranscriptHeading>
                      <span>OPTA TRANSCRIPT</span>
                      <small>fixture 2561913 | structured feed</small>
                    </TranscriptHeading>
                    <TranscriptText>
                      {captionFormat === 'dense'
                        ? sourceClip?.denseCaption ?? clip.description
                        : savedTranscript}
                    </TranscriptText>
                  </>
                )}
              </TranscriptCard>
            </Section>
          </>
        ) : null}
      </ClipEditorBody>

    </ClipEditorShell>
  );
}
