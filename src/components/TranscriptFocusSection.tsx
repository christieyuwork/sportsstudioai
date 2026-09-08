import { useState } from 'react';
import type { ReactNode } from 'react';
import { Switch } from '@cake-admin/cakeand';
import {
  PreviewToolbar,
  TranscriptCard,
  TranscriptHeading,
  TranscriptText,
} from '../styles/clip-editor-theme';
import { StudioContentSwitcher } from '../styles/agent-theme';

export interface TranscriptFocusSectionProps {
  showTranscript: boolean;
  onShowTranscriptChange: (show: boolean) => void;
  transcript: string;
  denseTranscript: string;
  /** Focus control rendered beside the transcript switch. */
  focusControl?: ReactNode;
  /** Focus UI that expands under the toolbar row. */
  focusDetail?: ReactNode;
}

/**
 * Transcript toggle and contained transcript readout shared by the video
 * preview and the per-clip preview so both stay in step.
 */
export function TranscriptFocusSection({
  showTranscript,
  onShowTranscriptChange,
  transcript,
  denseTranscript,
  focusControl,
  focusDetail,
}: TranscriptFocusSectionProps) {
  const [transcriptFormat, setTranscriptFormat] = useState<
    'dense' | 'transcript'
  >('transcript');

  return (
    <>
      <PreviewToolbar>
        <Switch
          label="Show transcript"
          checked={showTranscript}
          onCheckedChange={onShowTranscriptChange}
        />
        {focusControl}
      </PreviewToolbar>

      {focusDetail}

      {showTranscript ? (
        <TranscriptCard>
          <StudioContentSwitcher
            aria-label="Transcript density"
            size="sm"
            intent="primary"
            options={[
              { value: 'dense', label: 'Dense' },
              { value: 'transcript', label: 'Transcript' },
            ]}
            value={transcriptFormat}
            onValueChange={(value) =>
              setTranscriptFormat(value as 'dense' | 'transcript')
            }
          />
          <TranscriptHeading>
            <span>
              {transcriptFormat === 'dense'
                ? 'DENSE ACCESSIBLE TRANSCRIPT'
                : 'OPTA TRANSCRIPT'}
            </span>
            <small>fixture 2561913 | structured feed</small>
          </TranscriptHeading>
          <TranscriptText>
            {transcriptFormat === 'dense' ? denseTranscript : transcript}
          </TranscriptText>
        </TranscriptCard>
      ) : null}
    </>
  );
}
