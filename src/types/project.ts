/**
 * Project / media contracts for the studio home experience.
 * UI talks only to `src/api/*` — swap mocks for real services later.
 */

export interface DetectedEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

/** A clip explicitly requested from the AI agent. */
export interface GeneratedClip {
  id: string;
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

export interface ProjectChatThread {
  id: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  /** Shown in the main heading, e.g. "Germany vs Netherlands on 11 July". */
  heading: string;
  /** Nested sidebar labels when the project has media (Detected events, etc.). */
  navItems: string[];
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

export type UploadPhase = 'idle' | 'uploading' | 'complete';
