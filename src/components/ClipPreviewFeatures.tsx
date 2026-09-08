import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Button, Chip } from '@cake-admin/cakeand';
import { Flag, Globe2, Plus, User } from 'lucide-react';
import { StudioIcon } from './StudioIcon';
import { TranscriptFocusSection } from './TranscriptFocusSection';
import {
  FocusChipRow,
  FocusDropdownIcon,
  FocusField,
  FocusLabel,
  FocusPanel,
  MetadataRow,
  PreviewEventList,
} from '../styles/clip-editor-theme';

type FocusKind = 'country' | 'player' | 'event';

const FOCUS_FILTERS: Array<{
  kind: FocusKind;
  label: string;
  value: string;
  icon: ReactNode;
}> = [
  {
    kind: 'country',
    label: 'Countries',
    value: 'Germany',
    icon: <Globe2 size={16} />,
  },
  {
    kind: 'player',
    label: 'Players',
    value: 'Kai Havertz',
    icon: <User size={16} />,
  },
  { kind: 'event', label: 'Events', value: 'Goal', icon: <Flag size={16} /> },
];

interface PreviewEvent {
  id: string;
  timestamp: string;
  eventType: string;
  player: string;
  description: string;
}

export interface ClipPreviewFeaturesProps {
  showTranscript: boolean;
  onShowTranscriptChange: (show: boolean) => void;
  transcript: string;
  denseTranscript: string;
  events: PreviewEvent[];
}

/** Shared transcript, focus filters, and event list for every preview surface. */
export function ClipPreviewFeatures({
  showTranscript,
  onShowTranscriptChange,
  transcript,
  denseTranscript,
  events,
}: ClipPreviewFeaturesProps) {
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusValues, setFocusValues] = useState<FocusKind[]>([]);
  const [selectedEventId, setSelectedEventId] = useState(
    events[1]?.id ?? events[0]?.id ?? '',
  );

  useEffect(() => {
    if (events.some((event) => event.id === selectedEventId)) return;
    setSelectedEventId(events[1]?.id ?? events[0]?.id ?? '');
  }, [events, selectedEventId]);

  return (
    <>
      <TranscriptFocusSection
        showTranscript={showTranscript}
        onShowTranscriptChange={onShowTranscriptChange}
        transcript={transcript}
        denseTranscript={denseTranscript}
        focusControl={
          <Button
            size="sm"
            variant="ghost"
            intent="secondary"
            endIcon={
              <FocusDropdownIcon data-focus-chevron $open={focusOpen}>
                <StudioIcon name="dropdown" size={16} />
              </FocusDropdownIcon>
            }
            aria-expanded={focusOpen}
            onClick={() => setFocusOpen((open) => !open)}
          >
            Set focus
          </Button>
        }
        focusDetail={
          <>
            {focusOpen ? (
              <FocusPanel>
                {FOCUS_FILTERS.map((option) => (
                  <FocusField key={option.kind}>
                    <FocusLabel>{option.label}</FocusLabel>
                    <Button
                      size="sm"
                      variant="outline"
                      intent="secondary"
                      startIcon={option.icon}
                      endIcon={<Plus size={16} />}
                      disabled={focusValues.includes(option.kind)}
                      onClick={() =>
                        setFocusValues((current) =>
                          current.includes(option.kind)
                            ? current
                            : [...current, option.kind],
                        )
                      }
                    >
                      Add
                    </Button>
                  </FocusField>
                ))}
              </FocusPanel>
            ) : null}
            {focusValues.length > 0 ? (
              <FocusChipRow aria-label="Clip focus filters">
                {FOCUS_FILTERS.filter((option) =>
                  focusValues.includes(option.kind),
                ).map((option) => (
                  <Chip
                    key={option.kind}
                    leadingIcon={option.icon}
                    onRemove={() =>
                      setFocusValues((current) =>
                        current.filter((kind) => kind !== option.kind),
                      )
                    }
                  >
                    {option.value}
                  </Chip>
                ))}
              </FocusChipRow>
            ) : null}
          </>
        }
      />

      <PreviewEventList aria-label="Detected events">
        {events.map((event) => (
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
        ))}
      </PreviewEventList>
    </>
  );
}
