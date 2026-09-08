import { useEffect, useState } from 'react';
import { Badge, Button } from '@cake-admin/cakeand';
import type { Project } from '../types/project';
import type { ClipLibraryCardItem } from './ClipLibraryCard';
import { AddClipMenu } from './AddClipMenu';
import { MediaPlayer, useMediaPlayer } from './MediaPlayer';
import { RecordingBadge } from './RecordingBadge';
import {
  ButtonIconMask,
  ConsoleFooter,
  CountryFlag,
  PreviewActions,
  PreviewBrand,
  PreviewHeadingGroup,
  PreviewHint,
  PreviewMetadata,
  PreviewTitle,
  SelectedPreview,
  TranscriptBody,
  TranscriptLabel,
  TranscriptMeta,
  TranscriptPanel,
  TranscriptViewButtons,
} from '../styles/agent-theme';

export interface FullClipPreviewItem extends ClipLibraryCardItem {
  transcript?: string;
  denseCaption?: string;
}

export interface FullClipPreviewProps {
  clip: FullClipPreviewItem;
  project: Project;
  showTitle?: boolean;
  onCreateVideo: (title: string, clipIds: string[]) => void;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onNotify: (title: string, description: string) => void;
}

/**
 * Complete player, transcript, download, and add-to-video experience shared by
 * the agent panel and modal previews.
 */
export function FullClipPreview({
  clip,
  project,
  showTitle = true,
  onCreateVideo,
  onAddClipToVideo,
  onNotify,
}: FullClipPreviewProps) {
  const [transcriptView, setTranscriptView] = useState('transcript');
  const player = useMediaPlayer({
    durationSeconds: 30,
    resetKey: clip.id,
  });

  useEffect(() => {
    setTranscriptView('transcript');
  }, [clip.id]);

  return (
    <SelectedPreview>
      {showTitle ? (
        <PreviewHeadingGroup>
          <PreviewTitle>Clip preview: {clip.title}</PreviewTitle>
          <PreviewMetadata>
            <Badge color="disabled" tone="subtle" dot={false}>
              BBC Broadcast
            </Badge>
            <RecordingBadge>{clip.duration}</RecordingBadge>
            <CountryFlag src="/icons/country-germany.png" alt="" />
            <Badge color="yellow" tone="subtle" dot={false}>
              Germany
            </Badge>
          </PreviewMetadata>
        </PreviewHeadingGroup>
      ) : (
        <PreviewMetadata>
          <Badge color="disabled" tone="subtle" dot={false}>
            BBC Broadcast
          </Badge>
          <RecordingBadge>{clip.duration}</RecordingBadge>
          <CountryFlag src="/icons/country-germany.png" alt="" />
          <Badge color="yellow" tone="subtle" dot={false}>
            Germany
          </Badge>
        </PreviewMetadata>
      )}

      <PreviewHint>
        Once you are satisfied with this clip, add it to a video so you can edit
        and trim before exporting.
      </PreviewHint>

      <div>
        <MediaPlayer
          controller={player}
          imageSrc="/media/thumbs/agent-preview.png"
          imageAlt={`Preview for ${clip.title}`}
          timelineLabel="Clip position"
        />
        <ConsoleFooter>
          <span>Demo telemetry · no network connection</span>
          <span>Timestamp: 48:16.0</span>
        </ConsoleFooter>
      </div>

      <TranscriptPanel>
        <TranscriptViewButtons role="group" aria-label="Preview information">
          <Button
            size="xs"
            variant={transcriptView === 'dense' ? 'fill' : 'ghost'}
            intent={transcriptView === 'dense' ? 'primary' : 'secondary'}
            onClick={() => setTranscriptView('dense')}
          >
            Dense
          </Button>
          <Button
            size="xs"
            variant={transcriptView === 'transcript' ? 'fill' : 'ghost'}
            intent={transcriptView === 'transcript' ? 'primary' : 'secondary'}
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
              <p>{clip.transcript ?? `"${clip.description}"`}</p>
              <p>
                Free kick awarded. Play restarts from the spot of the foul with
                both sides reorganising.
              </p>
            </TranscriptBody>
          </>
        ) : (
          <>
            <TranscriptMeta>
              <TranscriptLabel>DENSE ACCESSIBLE TRANSCRIPT</TranscriptLabel>
              <span>descriptive broadcast view</span>
            </TranscriptMeta>
            <TranscriptBody>
              <p>
                Wide broadcast view of Germany in white attacking from left to
                right, with the score graphic in the upper-left corner.
              </p>
              <p>
                {clip.denseCaption ??
                  `The broadcast shows ${clip.description.toLocaleLowerCase()}`}
              </p>
              <p>
                Crowd noise rises briefly, then settles as both sides reset for
                the restart.
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
          startIcon={<ButtonIconMask $asset="/icons/player/download.svg" />}
          onClick={() =>
            onNotify(
              'Download ready',
              `Prepared “${clip.title}” for download.`,
            )
          }
        >
          Download
        </Button>
        <AddClipMenu
          size="sm"
          variant="fill"
          project={project}
          clipId={clip.id}
          onAction={(message) => onNotify('Video updated', message)}
          onCreateVideo={onCreateVideo}
          onAddClipToVideo={onAddClipToVideo}
        />
      </PreviewActions>
      <PreviewBrand src="/brand/nvidia-logo.svg" alt="NVIDIA" />
    </SelectedPreview>
  );
}
