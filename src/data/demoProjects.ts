import { formatClipTitle } from '../lib/clipTitle';
import type { DetectedEvent, Project, ProjectMediaItem } from '../types/project';

/**
 * Demo scenario: Germany vs Netherlands with generic player names
 * (avoids club/brand copyright from the Figma placeholders).
 */
export const DEMO_PROJECT_ID = 'germany-netherlands';

const EVENT_THUMB = '/media/thumbs/event-1.png';
const EVENT_THUMB_ALT = '/media/thumbs/event-2.png';

/** Keeps every detected event on the canonical title shape. */
function detectedEvent(event: Omit<DetectedEvent, 'title'>): DetectedEvent {
  return { ...event, title: formatClipTitle(event) };
}

export const DEMO_PROJECT: Project = {
    id: DEMO_PROJECT_ID,
    title: 'Germany vs Netherlands',
    heading: 'Germany vs Netherlands on 11 July',
    chatThreads: [
      { id: 'chat-1', label: 'Equalizer sequence highlights' },
      { id: 'chat-2', label: 'Late pressure package' },
      { id: 'chat-3', label: 'Crowd atmosphere cuts' },
      { id: 'chat-4', label: 'Post-match reactions' },
    ],
    events: [
      detectedEvent({
        id: 'evt-1',
        timestamp: '1:23',
        minute: 62,
        eventType: 'goal',
        player: 'Alex Rivera',
        country: 'Germany',
        description:
          'Alex Rivera of Germany strikes the top of the net to equalize.',
        thumbnailUrl: EVENT_THUMB,
      }),
      detectedEvent({
        id: 'evt-2',
        timestamp: '0:42',
        minute: 18,
        eventType: 'shot on goal',
        player: 'Jordan Lee',
        country: 'Netherlands',
        description:
          'Jordan Lee of Netherlands tests the keeper from the edge of the box.',
        thumbnailUrl: EVENT_THUMB_ALT,
      }),
      detectedEvent({
        id: 'evt-3',
        timestamp: '0:38',
        minute: 77,
        eventType: 'penalty kick',
        player: 'Sam Okoye',
        country: 'Germany',
        description:
          'Sam Okoye of Germany converts from the spot after a late challenge.',
        thumbnailUrl: EVENT_THUMB,
      }),
      detectedEvent({
        id: 'evt-4',
        timestamp: '1:05',
        minute: 45,
        eventType: 'crowd at halftime',
        description:
          'Supporters fill the stands as both sides reset for the second half.',
        thumbnailUrl: EVENT_THUMB_ALT,
      }),
    ],
    generatedClips: [],
    media: [],
    videos: [],
    promptSuggestions: [
      'Create a 60s clip with all goals',
      'Generate a 20s video of Alex Rivera highlights',
      'Analyze yellow cards and provide clips',
      'Give me a celebration Instagram reel',
    ],
};

/** Media items added after a successful mock upload. */
export const demoUploadedMedia: ProjectMediaItem[] = [
  {
    id: 'media-broadcast',
    title: 'Broadcast: BBC',
    durationLabel: '72 mins',
    thumbnailUrl: '/media/thumbs/media-broadcast.png',
  },
  {
    id: 'media-interview',
    title: 'Interview with fans',
    durationLabel: '72 mins',
    thumbnailUrl: '/media/thumbs/media-interview.png',
  },
  {
    id: 'media-press-conference',
    title: 'Official press conference',
    durationLabel: '72 mins',
    thumbnailUrl: '/media/thumbs/media-broadcast.png',
  },
  {
    id: 'media-broadcast-alt',
    title: 'Broadcast: BBC',
    durationLabel: '72 mins',
    thumbnailUrl: '/media/thumbs/media-interview.png',
  },
  {
    id: 'media-broadcast-backup',
    title: 'Broadcast: BBC',
    durationLabel: '72 mins',
    thumbnailUrl: '/media/thumbs/media-broadcast.png',
  },
];
