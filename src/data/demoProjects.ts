import type { Project, ProjectMediaItem } from '../types/project';

/**
 * Demo scenario: Germany vs Netherlands with generic player names
 * (avoids club/brand copyright from the Figma placeholders).
 */
export const DEMO_PROJECT_ID = 'germany-netherlands';

const EVENT_THUMB = '/media/thumbs/event-1.png';
const EVENT_THUMB_ALT = '/media/thumbs/event-2.png';

export const demoProjects: Project[] = [
  {
    id: DEMO_PROJECT_ID,
    title: 'Germany vs Netherlands',
    heading: 'Germany vs Netherlands on 11 July',
    navItems: ['Detected events', 'Generated clips'],
    chatThreads: [
      { id: 'chat-1', label: 'Equalizer sequence highlights' },
      { id: 'chat-2', label: 'Late pressure package' },
      { id: 'chat-3', label: 'Crowd atmosphere cuts' },
      { id: 'chat-4', label: 'Post-match reactions' },
    ],
    events: [
      {
        id: 'evt-1',
        timestamp: '1:23',
        title: 'Goal!',
        description:
          'Alex Rivera of Germany strikes the top of the net to equalize.',
        thumbnailUrl: EVENT_THUMB,
      },
      {
        id: 'evt-2',
        timestamp: '0:42',
        title: 'Shot on goal',
        description:
          'Jordan Lee of Netherlands tests the keeper from the edge of the box.',
        thumbnailUrl: EVENT_THUMB_ALT,
      },
      {
        id: 'evt-3',
        timestamp: '0:38',
        title: 'Penalty kick',
        description:
          'Sam Okoye of Germany converts from the spot after a late challenge.',
        thumbnailUrl: EVENT_THUMB,
      },
      {
        id: 'evt-4',
        timestamp: '1:05',
        title: 'Crowd at halftime',
        description:
          'Supporters fill the stands as both sides reset for the second half.',
        thumbnailUrl: EVENT_THUMB_ALT,
      },
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
  },
  {
    id: 'friendlies-archive',
    title: 'Summer friendlies archive',
    heading: 'Summer friendlies archive',
    navItems: [],
    chatThreads: [],
    events: [],
    generatedClips: [],
    media: [],
    videos: [],
    promptSuggestions: [],
  },
  {
    id: 'youth-showcase',
    title: 'Youth showcase day',
    heading: 'Youth showcase day',
    navItems: [],
    chatThreads: [],
    events: [],
    generatedClips: [],
    media: [],
    videos: [],
    promptSuggestions: [],
  },
  {
    id: 'training-clips',
    title: 'Training ground clips',
    heading: 'Training ground clips',
    navItems: [],
    chatThreads: [],
    events: [],
    generatedClips: [],
    media: [],
    videos: [],
    promptSuggestions: [],
  },
  {
    id: 'academy-day',
    title: 'Academy match day',
    heading: 'Academy match day',
    navItems: [],
    chatThreads: [],
    events: [],
    generatedClips: [],
    media: [],
    videos: [],
    promptSuggestions: [],
  },
];

/** Media items added after a successful mock upload. */
export const demoUploadedMedia: ProjectMediaItem[] = [
  {
    id: 'media-broadcast',
    title: 'Broadcast feed',
    durationLabel: '72 mins',
    thumbnailUrl: '/media/thumbs/media-broadcast.png',
  },
  {
    id: 'media-interview',
    title: 'Interview with fans',
    durationLabel: '12 mins',
    thumbnailUrl: '/media/thumbs/media-interview.png',
  },
];
