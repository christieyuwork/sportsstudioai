import { useState } from 'react';
import type { DragEvent, KeyboardEvent, ReactNode } from 'react';
import {
  Badge,
} from '@cake-admin/cakeand';
import { GripVertical, Trash2 } from 'lucide-react';
import type { TimelineClip } from './VideoEditorPanel';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { DeleteMediaButton } from '../styles/media-library-theme';
import {
  TimelineAddCell,
  TimelineCard,
  TimelineCardBottom,
  TimelineCardDuration,
  TimelineCardHandle,
  TimelineCardImage,
  TimelineCardMedia,
  TimelineCardScrim,
  TimelineCardSequence,
  TimelineCards,
  TimelineItemDescription,
} from '../styles/video-editor-theme';

export interface VideoTimelineManagerProps {
  clips: TimelineClip[];
  activeClipId: string | null;
  addClipControl: ReactNode;
  onSelectClip: (clipId: string) => void;
  onChangeClipIds: (clipIds: string[]) => void;
  onNotify: (title: string, description: string) => void;
}

/** Selectable, reorderable strip above the embedded per-clip editor. */
export function VideoTimelineManager({
  clips,
  activeClipId,
  addClipControl,
  onSelectClip,
  onChangeClipIds,
  onNotify,
}: VideoTimelineManagerProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [deleteClipTarget, setDeleteClipTarget] = useState<TimelineClip | null>(
    null,
  );
  function moveClip(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const nextIds = clips.map((clip) => clip.id);
    const sourceIndex = nextIds.indexOf(sourceId);
    const targetIndex = nextIds.indexOf(targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [moved] = nextIds.splice(sourceIndex, 1);
    nextIds.splice(targetIndex, 0, moved);
    onChangeClipIds(nextIds);
  }

  function moveByKeyboard(
    event: KeyboardEvent<HTMLSpanElement>,
    clipId: string,
  ) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowUp' &&
        event.key !== 'ArrowRight' && event.key !== 'ArrowDown') {
      return;
    }
    event.preventDefault();
    const currentIndex = clips.findIndex((clip) => clip.id === clipId);
    const offset =
      event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    const target = clips[currentIndex + offset];
    if (target) moveClip(clipId, target.id);
  }

  function deleteClip(clip: TimelineClip) {
    onChangeClipIds(clips.filter((item) => item.id !== clip.id).map((item) => item.id));
    onNotify('Timeline updated', `Removed “${clip.title}” from this video.`);
  }

  function dragHandleProps(clip: TimelineClip) {
    return {
      draggable: true,
      onDragStart: (event: DragEvent<HTMLElement>) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', clip.id);
        setDraggingId(clip.id);
      },
      onDragEnd: () => setDraggingId(null),
    };
  }

  function dropTargetProps(clip: TimelineClip) {
    return {
      onDragEnter: (event: DragEvent<HTMLElement>) => {
        event.preventDefault();
        const sourceId =
          event.dataTransfer.getData('text/plain') || draggingId;
        if (sourceId) moveClip(sourceId, clip.id);
      },
      onDragOver: (event: DragEvent<HTMLElement>) => event.preventDefault(),
    };
  }

  const empty = clips.length === 0 ? (
    <TimelineItemDescription>
      Add a clip to start building this timeline.
    </TimelineItemDescription>
  ) : null;

  return (
    <>
      <TimelineCards aria-label="Editable video clips">
        {clips.map((clip, index) => (
            <TimelineCard
              key={clip.id}
              $selected={activeClipId === clip.id}
              onClick={() => onSelectClip(clip.id)}
              {...dropTargetProps(clip)}
            >
              <TimelineCardMedia>
                <TimelineCardImage src={clip.thumbnailUrl} alt="" />
                <TimelineCardScrim
                  $selected={activeClipId === clip.id}
                  aria-hidden
                />
                <TimelineCardHandle
                  role="button"
                  tabIndex={0}
                  aria-label={`Reorder ${clip.title}`}
                  onClick={(event) => event.stopPropagation()}
                  onKeyDown={(event) => moveByKeyboard(event, clip.id)}
                  {...dragHandleProps(clip)}
                >
                  <GripVertical size={16} />
                </TimelineCardHandle>
                <DeleteMediaButton
                  size="xs"
                  variant="ghost"
                  intent="secondary"
                  label={`Delete ${clip.title}`}
                  icon={<Trash2 size={20} />}
                  onClick={(event) => {
                    event.stopPropagation();
                    setDeleteClipTarget(clip);
                  }}
                />
                <TimelineCardBottom>
                  <TimelineCardSequence>{index + 1}</TimelineCardSequence>
                  <TimelineCardDuration>
                    <Badge color="disabled" tone="subtle" dot={false}>
                      {clip.duration}
                    </Badge>
                  </TimelineCardDuration>
                </TimelineCardBottom>
              </TimelineCardMedia>
            </TimelineCard>
        ))}
        {empty}
        <TimelineAddCell>{addClipControl}</TimelineAddCell>
      </TimelineCards>

      <ConfirmDeleteModal
        open={deleteClipTarget !== null}
        itemName={deleteClipTarget?.title ?? ''}
        itemType="timeline clip"
        onOpenChange={(open) => {
          if (!open) setDeleteClipTarget(null);
        }}
        onConfirm={() => {
          if (deleteClipTarget) deleteClip(deleteClipTarget);
        }}
      />
    </>
  );
}
