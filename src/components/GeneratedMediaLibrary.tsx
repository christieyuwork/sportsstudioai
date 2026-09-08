import { useState } from 'react';
import { Button } from '@cake-admin/cakeand';
import type { Project } from '../types/project';
import type { MediaLibraryLayout } from '../styles/media-library-theme';
import {
  EmptyMediaMessage,
  MediaLibraryGrid,
  MediaLibraryHeader,
  MediaLibrarySection,
  MediaLibraryStack,
  MediaLibraryTitle,
} from '../styles/media-library-theme';
import { SelectionActions } from '../styles/detected-events-theme';
import { ButtonIconMask } from '../styles/agent-theme';
import { ClipLibraryCard } from './ClipLibraryCard';

export interface GeneratedMediaLibraryProps {
  project: Project;
  layout: MediaLibraryLayout;
  onPreview: (clipId: string) => void;
  onGenerateFromEvents: (eventIds: string[]) => void;
  onRenameGeneratedClip: (clipId: string, title: string) => void;
  onDeleteGeneratedClip: (clipId: string) => void;
  onRenameDetectedEvent: (eventId: string, title: string) => void;
  onDeleteDetectedEvent: (eventId: string) => void;
  onNotify: (title: string, description: string) => void;
}

/**
 * One generated-media library for both surfaces. Detected moments and
 * agent-created clips remain separate sections so users retain provenance.
 */
export function GeneratedMediaLibrary({
  project,
  layout,
  onPreview,
  onGenerateFromEvents,
  onRenameGeneratedClip,
  onDeleteGeneratedClip,
  onRenameDetectedEvent,
  onDeleteDetectedEvent,
  onNotify,
}: GeneratedMediaLibraryProps) {
  const [selectingEvents, setSelectingEvents] = useState(false);
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

  function toggleEvent(eventId: string, selected: boolean) {
    setSelectedEventIds((current) =>
      selected
        ? current.includes(eventId)
          ? current
          : [...current, eventId]
        : current.filter((id) => id !== eventId),
    );
  }

  function stopSelecting() {
    setSelectingEvents(false);
    setSelectedEventIds([]);
  }

  return (
    <MediaLibraryStack $layout={layout}>
      <MediaLibrarySection>
        <MediaLibraryHeader>
          <MediaLibraryTitle>
            Biggest football moments, detected by AI
          </MediaLibraryTitle>
          <SelectionActions>
            {selectingEvents ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  intent="secondary"
                  onClick={stopSelecting}
                >
                  Selecting ({selectedEventIds.length})
                </Button>
                <Button
                  size="sm"
                  variant="fill"
                  endIcon={<ButtonIconMask $asset="/icons/go-arrow.svg" />}
                  disabled={selectedEventIds.length === 0}
                  onClick={() => onGenerateFromEvents(selectedEventIds)}
                >
                  Generate video
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="tonal"
                intent="secondary"
                onClick={() => setSelectingEvents(true)}
              >
                Select
              </Button>
            )}
          </SelectionActions>
        </MediaLibraryHeader>
        {project.events.length > 0 ? (
          <MediaLibraryGrid $layout={layout}>
            {project.events.map((event) => (
              <ClipLibraryCard
                key={event.id}
                item={{ ...event, duration: event.timestamp }}
                selecting={selectingEvents}
                selected={selectedEventIds.includes(event.id)}
                onSelectedChange={(selected) => toggleEvent(event.id, selected)}
                onPreview={() => onPreview(event.id)}
                onRename={(title) => {
                  onRenameDetectedEvent(event.id, title);
                  onNotify('Clip renamed', `Renamed to “${title}”.`);
                }}
                onDelete={() => {
                  onDeleteDetectedEvent(event.id);
                  setSelectedEventIds((current) =>
                    current.filter((id) => id !== event.id),
                  );
                  onNotify('Clip deleted', `Removed “${event.title}”.`);
                }}
              />
            ))}
          </MediaLibraryGrid>
        ) : (
          <EmptyMediaMessage>No detected moments yet.</EmptyMediaMessage>
        )}
      </MediaLibrarySection>

      <MediaLibrarySection>
        <MediaLibraryHeader>
          <MediaLibraryTitle>
            Clips created with your AI agent
          </MediaLibraryTitle>
        </MediaLibraryHeader>
        {project.generatedClips.length > 0 ? (
          <MediaLibraryGrid $layout={layout}>
            {project.generatedClips.map((clip) => (
              <ClipLibraryCard
                key={clip.id}
                item={clip}
                onPreview={() => onPreview(clip.id)}
                onRename={(title) => {
                  onRenameGeneratedClip(clip.id, title);
                  onNotify('Clip renamed', `Renamed to “${title}”.`);
                }}
                onDelete={() => {
                  onDeleteGeneratedClip(clip.id);
                  onNotify('Clip deleted', `Removed “${clip.title}”.`);
                }}
              />
            ))}
          </MediaLibraryGrid>
        ) : (
          <EmptyMediaMessage>
            Ask the AI agent to create clips from this project.
          </EmptyMediaMessage>
        )}
      </MediaLibrarySection>
    </MediaLibraryStack>
  );
}
