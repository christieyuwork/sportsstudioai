/**
 * Project / media contracts for the studio home experience.
 * UI talks only to `src/api/*` — swap mocks for real services later.
 */

export interface DetectedEvent {
  id: string;
  timestamp: string;
  /** Match minute of the moment, e.g. `23` or `'45+2'`. */
  minute?: number | string;
  /** Event type behind the title, e.g. `'yellow card'`. */
  eventType: string;
  /** Player credited with the moment; absent for crowd or stadium shots. */
  player?: string;
  /** Team the player belongs to, used for the flag beside an event row. */
  country?: string;
  /** Canonical display title — compose it with `formatClipTitle`. */
  title: string;
  description: string;
  thumbnailUrl: string;
}

/** A clip explicitly requested from the AI agent. */
export interface GeneratedClip {
  id: string;
  /** Canonical display title — compose it with `formatClipTitle`. */
  title: string;
  description: string;
  duration: string;
  thumbnailUrl: string;
  transcript: string;
  denseCaption: string;
}

export interface ProjectMediaItem {
  id: string;
  title: string;
  durationLabel: string;
  thumbnailUrl: string;
}

/** User-created video output assembled from AI or manually selected clips. */
export interface ProjectVideoOutput {
  id: string;
  title: string;
  clipIds: string[];
  createdAtLabel: string;
}

interface ProjectChatThread {
  id: string;
  label: string;
  /** Undefined while a newly composed agent is still in its empty state. */
  request?: string;
}

export interface Project {
  id: string;
  title: string;
  /** Shown in the main heading, e.g. "Germany vs Netherlands on 11 July". */
  heading: string;
  /** Recent prompt/chat rows under the active project block. */
  chatThreads: ProjectChatThread[];
  events: DetectedEvent[];
  /** User-requested AI clips, distinct from upload-time detected events. */
  generatedClips: GeneratedClip[];
  media: ProjectMediaItem[];
  /** Editable/exportable videos produced by this project. */
  videos: ProjectVideoOutput[];
  promptSuggestions: string[];
}

export interface UploadProgress {
  percent: number;
  fileName: string;
}
