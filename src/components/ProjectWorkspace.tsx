import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge, IconButton } from '@cake-admin/cakeand';
import type { Project } from '../types/project';
import { StudioIcon } from './StudioIcon';
import { UploadDropzone } from './UploadDropzone';
import {
  AllEventsButton,
  ChipLabel,
  ChipRow,
  EventBadgeSlot,
  EventBody,
  EventCard,
  EventDesc,
  EventText,
  EventThumb,
  EventThumbWrap,
  EventTitle,
  EventsSection,
  EventsRow,
  LowerGrid,
  MediaDuration,
  MediaList,
  MediaMeta,
  MediaPanel,
  MediaRow,
  MediaThumb,
  MediaTitle,
  PageHeading,
  PromptBox,
  PromptInput,
  PromptPanel,
  PromptTitle,
  PromptTitleRow,
  PromptToolbar,
  SectionHeader,
  SectionTitle,
  SuggestionChip,
  WorkspaceBody,
} from '../styles/home-theme';

export interface ProjectWorkspaceProps {
  project: Project;
  uploading: boolean;
  progressPercent: number;
  uploadFileName: string | null;
  onUploadClick: () => void;
  onSubmitPrompt: (prompt: string) => void;
  onOpenDetectedEvents: () => void;
}

export function ProjectWorkspace({
  project,
  uploading,
  progressPercent,
  uploadFileName,
  onUploadClick,
  onSubmitPrompt,
  onOpenDetectedEvents,
}: ProjectWorkspaceProps) {
  const [prompt, setPrompt] = useState('');
  const hasMedia = project.media.length > 0;

  function submitPrompt(value: string) {
    const request = value.trim();
    if (!request) return;
    onSubmitPrompt(request);
  }

  function handlePromptSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitPrompt(prompt);
  }

  if (!hasMedia) {
    return (
      <>
        <PageHeading>
          {project.title === 'Germany vs Netherlands' ? 'New project' : project.title}
        </PageHeading>
        <SectionTitle>Project media</SectionTitle>
        <UploadDropzone
          variant="empty"
          uploading={uploading}
          progressPercent={progressPercent}
          fileName={uploadFileName}
          onUploadClick={onUploadClick}
        />
      </>
    );
  }

  return (
    <>
      <PageHeading>{project.heading}</PageHeading>

      <WorkspaceBody>
        <EventsSection>
          <SectionHeader>
            <SectionTitle>Biggest football moments, detected by AI</SectionTitle>
            <AllEventsButton
              size="sm"
              variant="ghost"
              intent="secondary"
              underline
              endIcon={<StudioIcon name="go-arrow" size={16} />}
              onClick={onOpenDetectedEvents}
            >
              All events
            </AllEventsButton>
          </SectionHeader>

          <EventsRow>
            {project.events.map((event) => (
              <EventCard key={event.id} role="article">
                <EventThumbWrap>
                  <EventThumb src={event.thumbnailUrl} alt="" />
                </EventThumbWrap>
                <EventBody>
                  <EventBadgeSlot>
                    <Badge color="red" tone="subtle" dot>
                      {event.timestamp}
                    </Badge>
                  </EventBadgeSlot>
                  <EventText>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDesc>{event.description}</EventDesc>
                  </EventText>
                </EventBody>
              </EventCard>
            ))}
          </EventsRow>
        </EventsSection>

        <LowerGrid>
          <PromptPanel>
            <PromptTitleRow>
              <StudioIcon name="ai-stars" size={24} />
              <PromptTitle>Create highlights with natural language</PromptTitle>
            </PromptTitleRow>

            <PromptBox as="form" onSubmit={handlePromptSubmit}>
              <PromptInput
                placeholder="Generate me a 10 second clip of highlights in 1:1 aspect ratio..."
                aria-label="Highlight prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
              />
              <PromptToolbar>
                <IconButton
                  size="sm"
                  variant="ghost"
                  intent="secondary"
                  label="Add attachment"
                  icon={<StudioIcon name="prompt-add" size={18} />}
                />
                <IconButton
                  size="sm"
                  variant="fill"
                  intent="secondary"
                  label="Send prompt"
                  icon={<StudioIcon name="send-arrow" size={16} />}
                  type="submit"
                  disabled={!prompt.trim()}
                />
              </PromptToolbar>
            </PromptBox>

            <ChipRow>
              {project.promptSuggestions.map((suggestion) => (
                <SuggestionChip
                  key={suggestion}
                  size="sm"
                  type="primary"
                  leadingIcon={<StudioIcon name="go-arrow" size={16} />}
                  onClick={() => submitPrompt(suggestion)}
                >
                  <ChipLabel>{suggestion}</ChipLabel>
                </SuggestionChip>
              ))}
              <SuggestionChip
                size="sm"
                type="secondary"
                leadingIcon={<StudioIcon name="chip-arrow-more" size={16} />}
                onClick={() => undefined}
              >
                More
              </SuggestionChip>
            </ChipRow>
          </PromptPanel>

          <MediaPanel>
            <SectionTitle>Project media</SectionTitle>
            <UploadDropzone
              variant="compact"
              uploading={uploading}
              progressPercent={progressPercent}
              fileName={uploadFileName}
              onUploadClick={onUploadClick}
            />
            <MediaList role="list">
              {project.media.map((item) => (
                <MediaRow key={item.id} role="listitem">
                  <MediaThumb src={item.thumbnailUrl} alt="" />
                  <MediaMeta>
                    <MediaTitle>{item.title}</MediaTitle>
                    <MediaDuration>{item.durationLabel}</MediaDuration>
                  </MediaMeta>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    intent="secondary"
                    label="Media options"
                    icon={<StudioIcon name="more-vert" size={18} />}
                  />
                </MediaRow>
              ))}
            </MediaList>
          </MediaPanel>
        </LowerGrid>
      </WorkspaceBody>
    </>
  );
}
