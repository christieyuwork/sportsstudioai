import { formatClipTitle } from '../lib/clipTitle';
import type { GeneratedClip } from '../types/project';

/** Staged yellow-card clips shown during the mocked agent reasoning run. */
export const MOCK_AGENT_CLIPS: GeneratedClip[] = [
  {
    id: 'yellow-1',
    title: formatClipTitle({
      minute: 23,
      eventType: 'yellow card',
      player: 'Alex Rivera',
    }),
    description: 'A late midfield challenge stops a Netherlands counterattack.',
    duration: '0:21',
    thumbnailUrl: '/media/thumbs/event-1.png',
    transcript:
      'Booking. Alex Rivera (Germany) is shown the yellow card for a bad foul on Daan Visser (Netherlands) in the center of the pitch.',
    denseCaption:
      'A Germany player in white slides across an opponent’s path in midfield and clips his lower leg. The referee jogs in, raises a yellow card overhead, and the fouled player stays down briefly before play restarts with a free kick.',
  },
  {
    id: 'yellow-2',
    title: formatClipTitle({
      minute: 41,
      eventType: 'yellow card',
      player: 'Jordan Lee',
    }),
    description: 'The referee cautions Lee after a mistimed tackle near the box.',
    duration: '0:18',
    thumbnailUrl: '/media/thumbs/event-2.png',
    transcript:
      'Booking. Jordan Lee (Germany) is shown the yellow card for a mistimed tackle just outside the penalty area.',
    denseCaption:
      'A defender lunges at the ball near the edge of the box and catches the attacker instead. The attacker falls forward onto the grass. The referee points to the spot of the foul and holds a yellow card toward the defender.',
  },
  {
    id: 'yellow-3',
    title: formatClipTitle({
      minute: 68,
      eventType: 'yellow card',
      player: 'Sam Okoye',
    }),
    description: 'Okoye receives a booking for delaying the restart.',
    duration: '0:16',
    thumbnailUrl: '/media/thumbs/event-1.png',
    transcript:
      'Booking. Sam Okoye (Germany) is shown the yellow card for time-wasting at a throw-in.',
    denseCaption:
      'A player holds the ball on his hip at the touchline while the opposition gestures for a quick restart. The referee walks over, taps his wrist, and produces a yellow card before the throw is finally taken.',
  },
  {
    id: 'yellow-4',
    title: formatClipTitle({
      minute: 84,
      eventType: 'yellow card',
      player: 'Luca Meyer',
    }),
    description: 'A tactical foul breaks up a late attacking move.',
    duration: '0:24',
    thumbnailUrl: '/media/thumbs/event-2.png',
    transcript:
      'Booking. Luca Meyer (Germany) is shown the yellow card for pulling back a Netherlands attacker on the break.',
    denseCaption:
      'With space opening ahead, a white-shirted player reaches out and tugs the shirt of a counter-attacking opponent, stopping the run. The referee immediately signals the foul and shows a yellow card as both benches react.',
  },
];
