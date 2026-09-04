import { useMemo, useState } from 'react';
import { Button, Modal, ModalContent } from '@cake-admin/cakeand';
import type { Project } from '../types/project';
import { StudioIcon } from './StudioIcon';
import { ClipLibraryCard } from './ClipLibraryCard';
import { PageHeading, SectionTitle } from '../styles/home-theme';
import {
  DetectedEventGrid,
  DetectedEventImage,
  EventFilterChip,
  EventFilters,
  EventsPageBody,
  EventsPageHeader,
  SelectionActions,
} from '../styles/detected-events-theme';

export interface DetectedEventsWorkspaceProps {
  project: Project;
  onGenerateVideo: (eventIds: string[]) => void;
  onRenameEvent: (eventId: string, title: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onNotify: (title: string, description: string) => void;
}

export function DetectedEventsWorkspace({
  project,
  onGenerateVideo,
  onRenameEvent,
  onDeleteEvent,
  onNotify,
}: DetectedEventsWorkspaceProps) {
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewEventId, setPreviewEventId] = useState<string | null>(null);
  const visibleEvents = useMemo(() => project.events, [project.events]);
  const previewEvent =
    project.events.find((event) => event.id === previewEventId) ?? null;

  function toggleEvent(eventId: string) {
    setSelectedIds((current) =>
      current.includes(eventId)
        ? current.filter((id) => id !== eventId)
        : [...current, eventId],
    );
  }

  return (
    <>
      <PageHeading>{project.heading}</PageHeading>
      <EventsPageBody>
        <EventsPageHeader>
          <SectionTitle>Biggest football moments, detected by AI</SectionTitle>
          <SelectionActions>
            {selecting ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  intent="secondary"
                  onClick={() => {
                    setSelecting(false);
                    setSelectedIds([]);
                  }}
                >
                  Selecting ({selectedIds.length})
                </Button>
                <Button
                  size="sm"
                  variant="fill"
                  endIcon={<StudioIcon name="go-arrow" size={16} />}
                  disabled={selectedIds.length === 0}
                  onClick={() => onGenerateVideo(selectedIds)}
                >
                  Generate video with selected clips
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="tonal"
                intent="secondary"
                onClick={() => setSelecting(true)}
              >
                Select
              </Button>
            )}
          </SelectionActions>
        </EventsPageHeader>

        <EventFilters aria-label="Detected event filters">
          {visibleEvents.slice(0, 6).map((event) => (
            <EventFilterChip key={event.id} size="sm" type="primary">
              {event.timestamp} · {event.title}
            </EventFilterChip>
          ))}
        </EventFilters>

        <DetectedEventGrid>
          {visibleEvents.map((event) => {
            const selected = selectedIds.includes(event.id);
            return (
              <ClipLibraryCard
                key={event.id}
                item={{ ...event, duration: event.timestamp }}
                selecting={selecting}
                selected={selected}
                onSelectedChange={() => toggleEvent(event.id)}
                onPreview={() => setPreviewEventId(event.id)}
                onRename={(title) => {
                  onRenameEvent(event.id, title);
                  onNotify('Clip renamed', `Renamed to “${title}”.`);
                }}
                onDelete={() => {
                  onDeleteEvent(event.id);
                  setSelectedIds((current) =>
                    current.filter((id) => id !== event.id),
                  );
                  onNotify('Clip deleted', `Removed “${event.title}”.`);
                }}
              />
            );
          })}
        </DetectedEventGrid>
      </EventsPageBody>

      <Modal
        open={previewEvent !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewEventId(null);
        }}
        title={previewEvent?.title ?? 'Clip preview'}
        subtitle={previewEvent?.description}
      >
        {previewEvent ? (
          <ModalContent descriptionAsDialogDescription={false}>
            <DetectedEventImage src={previewEvent.thumbnailUrl} alt="" />
          </ModalContent>
        ) : null}
      </Modal>
    </>
  );
}
