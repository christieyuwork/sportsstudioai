import { useState } from 'react';
import type { Project } from '../types/project';
import {
  AgentWorkspaceShell,
  EmptyAgentContent,
  EmptyAgentConversation,
  EmptyAgentText,
  EmptyAgentTitle,
  EmptyAgentTitleRow,
  EmptyAgentWelcome,
} from '../styles/agent-theme';
import { StudioIcon } from './StudioIcon';
import { AgentPreviewPanel, useAgentPreviewState } from './AgentPreviewPanel';
import { PromptComposer, PromptSuggestions } from './PromptControls';

export interface EmptyAgentWorkspaceProps {
  project: Project;
  selectedClipId: string | null;
  onSelectClip: (clipId: string | null) => void;
  uploading: boolean;
  progressPercent: number;
  uploadFileName: string | null;
  onSubmitPrompt: (prompt: string) => void;
  onUploadClick: () => void;
  onCreateVideo: (title: string, clipIds: string[]) => string;
  onAddClipToVideo: (videoId: string, clipId: string) => void;
  onChangeVideoClips: (videoId: string, clipIds: string[]) => void;
  onRenameVideo: (videoId: string, title: string) => void;
  onRenameGeneratedClip: (clipId: string, title: string) => void;
  onDeleteGeneratedClip: (clipId: string) => void;
  onRenameDetectedEvent: (eventId: string, title: string) => void;
  onDeleteDetectedEvent: (eventId: string) => void;
  onRenameMedia: (mediaId: string, title: string) => void;
  onDeleteMedia: (mediaId: string) => void;
  onNotify: (title: string, description: string) => void;
}

/** Newly composed agent before its first request, matching Figma 197:27048. */
export function EmptyAgentWorkspace({
  project,
  selectedClipId,
  onSelectClip,
  uploading,
  progressPercent,
  uploadFileName,
  onSubmitPrompt,
  onUploadClick,
  onCreateVideo,
  onAddClipToVideo,
  onChangeVideoClips,
  onRenameVideo,
  onRenameGeneratedClip,
  onDeleteGeneratedClip,
  onRenameDetectedEvent,
  onDeleteDetectedEvent,
  onRenameMedia,
  onDeleteMedia,
  onNotify,
}: EmptyAgentWorkspaceProps) {
  const [draft, setDraft] = useState('');
  /** A fresh agent has nothing to preview yet, so it opens on project media. */
  const preview = useAgentPreviewState({
    project,
    initialTab: 'media',
    initialMediaView: 'uploaded',
    selectedClipId,
    onSelectClip,
    onCreateVideo,
    onNotify,
  });

  function submitPrompt(prompt: string) {
    onSubmitPrompt(prompt);
    setDraft('');
  }

  return (
    <AgentWorkspaceShell data-empty-agent-workspace>
      <EmptyAgentConversation aria-label="New AI agent">
        <EmptyAgentContent>
          <EmptyAgentWelcome>
            <EmptyAgentTitleRow>
              <StudioIcon name="ai-stars" size={20} />
              <EmptyAgentTitle>Welcome to Sports AI Studio</EmptyAgentTitle>
            </EmptyAgentTitleRow>
            <EmptyAgentText>
              I can help you generate clips, analyze feeds, and edit any video
              projects.
            </EmptyAgentText>
          </EmptyAgentWelcome>

          <PromptSuggestions
            suggestions={project.promptSuggestions}
            limit={2}
            onSelect={onSubmitPrompt}
          />

          <PromptComposer
            value={draft}
            onChange={setDraft}
            onSubmit={submitPrompt}
            ariaLabel="Ask the new Sports AI agent"
            placeholder="e.g. Analyze yellow cards and provide clips..."
          />
        </EmptyAgentContent>
      </EmptyAgentConversation>

      <AgentPreviewPanel
        project={project}
        state={preview}
        label="New agent preview panel"
        onSubmitPrompt={onSubmitPrompt}
        onAddClipToVideo={onAddClipToVideo}
        onChangeVideoClips={onChangeVideoClips}
        onRenameVideo={onRenameVideo}
        onRenameGeneratedClip={onRenameGeneratedClip}
        onDeleteGeneratedClip={onDeleteGeneratedClip}
        onRenameDetectedEvent={onRenameDetectedEvent}
        onDeleteDetectedEvent={onDeleteDetectedEvent}
        uploading={uploading}
        progressPercent={progressPercent}
        uploadFileName={uploadFileName}
        onUploadClick={onUploadClick}
        onRenameMedia={onRenameMedia}
        onDeleteMedia={onDeleteMedia}
        onNotify={onNotify}
      />
    </AgentWorkspaceShell>
  );
}
