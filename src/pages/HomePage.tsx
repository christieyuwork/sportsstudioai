import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Toast } from '@cake-admin/cakeand';
import { Toast as RadixToast } from 'radix-ui';
import { uploadProjectVideo } from '../api/projects';
import { DEMO_PROJECT_ID, demoProjects } from '../data/demoProjects';
import type { Project } from '../types/project';
import type { SignInUser } from '../types/auth';
import { AppSidebar } from '../components/AppSidebar';
import {
  AIAgentWorkspace,
  MOCK_AGENT_CLIPS,
} from '../components/AIAgentWorkspace';
import { DetectedEventsWorkspace } from '../components/DetectedEventsWorkspace';
import { ProjectWorkspace } from '../components/ProjectWorkspace';
import { VideoBackground } from '../components/VideoBackground';
import {
  HomeBackground,
  HomeLayout,
  HomeShell,
  MainContent,
  MainPane,
} from '../styles/home-theme';
import { AgentMainPane } from '../styles/agent-theme';

const AGENT_CHAT_ID = 'chat-ai-yellow-cards';

const ToastViewport = styled(RadixToast.Viewport)`
  position: fixed;
  bottom: var(--space-400);
  right: var(--space-400);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: min(100vw - 32px, 380px);
  outline: none;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export interface HomePageProps {
  user: SignInUser;
  onSignOut: () => void;
}

/**
 * Post-login studio home.
 *
 * Starts on an empty "New project" shell. Mock upload (~3s progress) populates
 * media and reveals the filled Germany vs Netherlands homescreen.
 */
export function HomePage({ user, onSignOut }: HomePageProps) {
  const [projects, setProjects] = useState<Project[]>(() =>
    demoProjects.map((p) => ({
      ...p,
      media: p.id === DEMO_PROJECT_ID ? [] : p.media,
      title: p.id === DEMO_PROJECT_ID ? 'New project' : p.title,
    })),
  );
  const [activeProjectId, setActiveProjectId] = useState(DEMO_PROJECT_ID);
  /** Null so the project row itself is the selected sidebar tab on load. */
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);
  const [agentRequest, setAgentRequest] = useState<string | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<
    'detected' | 'clips' | null
  >(null);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId) ?? projects[0],
    [projects, activeProjectId],
  );

  function showToast(title: string, description: string) {
    setToastNotice({ id: Date.now(), title, description });
  }

  async function handleUploadClick() {
    if (uploading) return;

    const fileName = 'germany-netherlands-broadcast.mp4';
    setUploadFileName(fileName);
    setUploading(true);
    setProgressPercent(0);

    try {
      const media = await uploadProjectVideo(fileName, ({ percent }) => {
        setProgressPercent(percent);
      });

      setProjects((prev) =>
        prev.map((project) =>
          project.id === activeProjectId
            ? {
                ...project,
                title: 'Germany vs Netherlands',
                media,
              }
            : project,
        ),
      );
      setActiveChatId(null);
      showToast(
        'Upload complete',
        'Match video is ready. AI moments are available for Germany vs Netherlands.',
      );
    } finally {
      setUploading(false);
      setUploadFileName(null);
      setProgressPercent(0);
    }
  }

  function handleNewProject() {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === DEMO_PROJECT_ID
          ? {
              ...project,
              title: 'New project',
              media: [],
              generatedClips: [],
              videos: [],
            }
          : project,
      ),
    );
    setActiveProjectId(DEMO_PROJECT_ID);
    setActiveChatId(null);
    setActiveAgentId(null);
  }

  function handleAgentPrompt(prompt: string) {
    setAgentRequest(prompt);
    setSelectedClipId(null);
    setActiveAgentId(null);
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== activeProjectId) return project;
        const generatedClips =
          project.generatedClips.length > 0
            ? project.generatedClips
            : MOCK_AGENT_CLIPS;
        if (project.chatThreads.some((thread) => thread.id === AGENT_CHAT_ID)) {
          return { ...project, generatedClips };
        }

        return {
          ...project,
          generatedClips,
          chatThreads: [
            {
              id: AGENT_CHAT_ID,
              label: 'Analyze yellow cards and provide clips',
            },
            ...project.chatThreads,
          ],
        };
      }),
    );
    setActiveChatId(AGENT_CHAT_ID);
  }

  function handleSelectProject(projectId: string) {
    setActiveProjectId(projectId);
    setActiveAgentId(null);
  }

  function handleSelectChat(chatId: string | null) {
    setActiveChatId(chatId);
    if (chatId) setActiveAgentId(null);
  }

  function handleSelectAgent(
    projectId: string,
    agentId: 'detected' | 'clips',
  ) {
    setActiveProjectId(projectId);
    setActiveAgentId(agentId);
  }

  function handleCreateVideo(title: string, clipIds: string[]) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              videos: [
                ...project.videos,
                {
                  id: `video-${Date.now()}`,
                  title,
                  clipIds,
                  createdAtLabel: 'Just now',
                },
              ],
            }
          : project,
      ),
    );
  }

  function handleAddClipToVideo(videoId: string, clipId: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              videos: project.videos.map((video) =>
                video.id === videoId && !video.clipIds.includes(clipId)
                  ? { ...video, clipIds: [...video.clipIds, clipId] }
                  : video,
              ),
            }
          : project,
      ),
    );
  }

  function handleRenameGeneratedClip(clipId: string, title: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              generatedClips: project.generatedClips.map((clip) =>
                clip.id === clipId ? { ...clip, title } : clip,
              ),
            }
          : project,
      ),
    );
  }

  function handleDeleteGeneratedClip(clipId: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              generatedClips: project.generatedClips.filter(
                (clip) => clip.id !== clipId,
              ),
            }
          : project,
      ),
    );
    if (selectedClipId === clipId) setSelectedClipId(null);
  }

  function handleRenameDetectedEvent(eventId: string, title: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              events: project.events.map((event) =>
                event.id === eventId ? { ...event, title } : event,
              ),
            }
          : project,
      ),
    );
  }

  function handleDeleteDetectedEvent(eventId: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              events: project.events.filter((event) => event.id !== eventId),
            }
          : project,
      ),
    );
    if (selectedClipId === eventId) setSelectedClipId(null);
  }

  const showingLibrary = activeAgentId === 'clips';
  const showingAgent =
    (activeChatId === AGENT_CHAT_ID || showingLibrary) &&
    (agentRequest !== null || showingLibrary);
  const showingDetectedEvents = !showingAgent && activeAgentId === 'detected';

  return (
    <RadixToast.Provider swipeDirection="right">
      <HomeShell>
        <HomeBackground>
          <VideoBackground
            webmSrc="/media/wave/looping-wave.webm"
            mp4Src="/media/wave/looping-wave.mp4"
            label="Decorative particle wave background"
          />
        </HomeBackground>

        <HomeLayout>
          <AppSidebar
            user={user}
            projects={projects}
            activeProjectId={activeProjectId}
            activeChatId={activeChatId}
            activeAgentId={activeAgentId}
            onSelectProject={handleSelectProject}
            onSelectChat={handleSelectChat}
            onSelectAgent={handleSelectAgent}
            onNewProject={handleNewProject}
            onSignOut={onSignOut}
          />

          {showingAgent ? (
            <AgentMainPane>
              <AIAgentWorkspace
                project={activeProject}
                request={agentRequest ?? ''}
                libraryOnly={showingLibrary}
                selectedClipId={selectedClipId}
                onSelectClip={setSelectedClipId}
                onSubmitPrompt={handleAgentPrompt}
                onCreateVideo={handleCreateVideo}
                onAddClipToVideo={handleAddClipToVideo}
                onRenameGeneratedClip={handleRenameGeneratedClip}
                onDeleteGeneratedClip={handleDeleteGeneratedClip}
                onRenameDetectedEvent={handleRenameDetectedEvent}
                onDeleteDetectedEvent={handleDeleteDetectedEvent}
                onNotify={showToast}
              />
            </AgentMainPane>
          ) : showingDetectedEvents ? (
            <MainPane>
              <MainContent>
                <DetectedEventsWorkspace
                  project={activeProject}
                  onGenerateVideo={(eventIds) =>
                    handleAgentPrompt(
                      `Create a highlight video using ${eventIds.length} selected detected events.`,
                    )
                  }
                  onRenameEvent={handleRenameDetectedEvent}
                  onDeleteEvent={handleDeleteDetectedEvent}
                  onNotify={showToast}
                />
              </MainContent>
            </MainPane>
          ) : (
            <MainPane>
              <MainContent>
                <ProjectWorkspace
                  project={activeProject}
                  uploading={uploading}
                  progressPercent={progressPercent}
                  uploadFileName={uploadFileName}
                  onUploadClick={() => {
                    void handleUploadClick();
                  }}
                  onSubmitPrompt={handleAgentPrompt}
                  onOpenDetectedEvents={() => setActiveAgentId('detected')}
                />
              </MainContent>
            </MainPane>
          )}
        </HomeLayout>

        {toastNotice ? (
          <Toast
            key={toastNotice.id}
            status="success"
            title={toastNotice.title}
            description={toastNotice.description}
            open
            onOpenChange={(open) => {
              if (!open) setToastNotice(null);
            }}
            onDismiss={() => setToastNotice(null)}
            duration={4000}
          />
        ) : null}

        <ToastViewport />
      </HomeShell>
    </RadixToast.Provider>
  );
}
