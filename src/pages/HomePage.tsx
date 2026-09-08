import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { Toast } from '@cake-admin/cakeand';
import { Toast as RadixToast } from 'radix-ui';
import { uploadProjectVideo } from '../api/projects';
import { DEMO_PROJECT, DEMO_PROJECT_ID } from '../data/demoProjects';
import type { Project } from '../types/project';
import type { SignInUser } from '../types/auth';
import { AppSidebar } from '../components/AppSidebar';
import { SidebarToggleButton } from '../components/SidebarToggleButton';
import { AIAgentWorkspace } from '../components/AIAgentWorkspace';
import { MOCK_AGENT_CLIPS } from '../data/mockAgentClips';
import { EmptyAgentWorkspace } from '../components/EmptyAgentWorkspace';
import { GeneratedClipsWorkspace } from '../components/GeneratedClipsWorkspace';
import { ProjectWorkspace } from '../components/ProjectWorkspace';
import { UserUploadedMediaWorkspace } from '../components/UserUploadedMediaWorkspace';
import { VideoBackground } from '../components/VideoBackground';
import { formatSelectedClipsPrompt } from '../lib/selectedClipsPrompt';
import {
  ChatBackgroundScrim,
  HomeBackground,
  HomeLayout,
  HomeShell,
  MainContent,
  MainPane,
} from '../styles/home-theme';
import { AgentMainPane } from '../styles/agent-theme';

function createEmptyProject(id: string): Project {
  return {
    ...DEMO_PROJECT,
    id,
    title: 'New project',
    heading: 'New project',
    chatThreads: [],
    events: [],
    generatedClips: [],
    media: [],
    videos: [],
  };
}

/** All that is left of the rail once it collapses: the toggle, top left. */
const CollapsedSidebarSlot = styled.div`
  display: flex;
  flex-shrink: 0;
  align-self: flex-start;
`;

const ToastViewport = styled(RadixToast.Viewport)`
  position: fixed;
  bottom: var(--space-400);
  right: var(--space-400);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: var(--space-200);
  width: min(
    calc(100vw - var(--space-600)),
    calc(var(--space-1000) * 5 - var(--space-400))
  );
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
  const [projects, setProjects] = useState<Project[]>(() => {
    return [createEmptyProject(DEMO_PROJECT_ID)];
  });
  const [activeProjectId, setActiveProjectId] = useState(DEMO_PROJECT_ID);
  /** Null so the project row itself is the selected sidebar tab on load. */
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [toastNotice, setToastNotice] = useState<{
    id: number;
    title: string;
    description: string;
  } | null>(null);
  const [agentRequest, setAgentRequest] = useState<string | null>(null);
  const [videoRequest, setVideoRequest] = useState<{
    id: string;
    clipIds: string[];
  } | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [activeProjectView, setActiveProjectView] = useState<
    'uploaded' | 'clips' | null
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
                heading: 'Germany vs Netherlands on 11 July',
                media,
                events: DEMO_PROJECT.events,
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
    const projectId = `project-${crypto.randomUUID()}`;
    setProjects((prev) => [createEmptyProject(projectId), ...prev]);
    setActiveProjectId(projectId);
    setActiveChatId(null);
    setActiveProjectView(null);
    setAgentRequest(null);
    setVideoRequest(null);
    setSelectedClipId(null);
  }

  function handleAgentPrompt(prompt: string, videoClipIds?: string[]) {
    const chatId =
      activeChatId ?? `${activeProjectId}-agent-${crypto.randomUUID()}`;
    const threadLabel = prompt.split('\n', 1)[0];
    setAgentRequest(prompt);
    setVideoRequest(
      videoClipIds
        ? { id: crypto.randomUUID(), clipIds: [...videoClipIds] }
        : null,
    );
    setSelectedClipId(null);
    setActiveProjectView(null);
    setProjects((prev) =>
      prev.map((project) => {
        if (project.id !== activeProjectId) return project;
        const generatedClips =
          project.generatedClips.length > 0
            ? project.generatedClips
            : MOCK_AGENT_CLIPS;
        if (project.chatThreads.some((thread) => thread.id === chatId)) {
          return {
            ...project,
            generatedClips,
            chatThreads: project.chatThreads.map((thread) =>
              thread.id === chatId
                ? { ...thread, label: threadLabel, request: prompt }
                : thread,
            ),
          };
        }

        return {
          ...project,
          generatedClips,
          chatThreads: [
            {
              id: chatId,
              label: threadLabel,
              request: prompt,
            },
            ...project.chatThreads,
          ],
        };
      }),
    );
    setActiveChatId(chatId);
  }

  function handleSelectProject(projectId: string) {
    setActiveProjectId(projectId);
    setActiveProjectView(null);
  }

  function handleSelectChat(chatId: string | null) {
    setActiveChatId(chatId);
    setVideoRequest(null);
    if (chatId) {
      setActiveProjectView(null);
      const thread = projects
        .flatMap((project) => project.chatThreads)
        .find((item) => item.id === chatId);
      setAgentRequest(thread?.request ?? null);
    } else {
      setAgentRequest(null);
    }
  }

  function handleComposeAgent(projectId: string) {
    const chatId = `${projectId}-agent-${crypto.randomUUID()}`;
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              chatThreads: [
                { id: chatId, label: 'New agent' },
                ...project.chatThreads,
              ],
            }
          : project,
      ),
    );
    setActiveProjectId(projectId);
    setActiveProjectView(null);
    setActiveChatId(chatId);
    setAgentRequest(null);
    setVideoRequest(null);
    setSelectedClipId(null);
  }

  function handleRenameProject(projectId: string, title: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              title,
              heading: title,
            }
          : project,
      ),
    );
  }

  function handleDeleteProject(projectId: string) {
    const remaining = projects.filter((project) => project.id !== projectId);
    const nextProjects =
      remaining.length > 0
        ? remaining
        : [createEmptyProject(`project-${crypto.randomUUID()}`)];
    setProjects(nextProjects);

    if (activeProjectId === projectId) {
      setActiveProjectId(nextProjects[0].id);
      setActiveChatId(null);
      setActiveProjectView(null);
      setAgentRequest(null);
      setVideoRequest(null);
      setSelectedClipId(null);
    }
  }

  function handleRenameChat(
    projectId: string,
    chatId: string,
    title: string,
  ) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              chatThreads: project.chatThreads.map((thread) =>
                thread.id === chatId ? { ...thread, label: title } : thread,
              ),
            }
          : project,
      ),
    );
  }

  function handleDeleteChat(projectId: string, chatId: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              chatThreads: project.chatThreads.filter(
                (thread) => thread.id !== chatId,
              ),
            }
          : project,
      ),
    );

    if (activeChatId === chatId) {
      setActiveChatId(null);
      setAgentRequest(null);
      setVideoRequest(null);
      setSelectedClipId(null);
    }
  }

  function handleSelectProjectView(
    projectId: string,
    view: 'uploaded' | 'clips',
  ) {
    setActiveProjectId(projectId);
    setActiveProjectView(view);
  }

  function handleCreateVideo(title: string, clipIds: string[]) {
    const id = `video-${Date.now()}`;
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              videos: [
                ...project.videos,
                {
                  id,
                  title,
                  clipIds,
                  createdAtLabel: 'Just now',
                },
              ],
            }
          : project,
      ),
    );
    return id;
  }

  function handleRenameVideo(videoId: string, title: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              videos: project.videos.map((video) =>
                video.id === videoId ? { ...video, title } : video,
              ),
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

  function handleChangeVideoClips(videoId: string, clipIds: string[]) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              videos: project.videos.map((video) =>
                video.id === videoId ? { ...video, clipIds } : video,
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

  function handleRenameMedia(mediaId: string, title: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              media: project.media.map((item) =>
                item.id === mediaId ? { ...item, title } : item,
              ),
            }
          : project,
      ),
    );
  }

  function handleDeleteMedia(mediaId: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === activeProjectId
          ? {
              ...project,
              media: project.media.filter((item) => item.id !== mediaId),
            }
          : project,
      ),
    );
  }

  const showingAgent = activeChatId !== null && agentRequest !== null;
  const showingEmptyAgent = activeChatId !== null && agentRequest === null;
  const showingUploadedMedia =
    !showingAgent && !showingEmptyAgent && activeProjectView === 'uploaded';
  const showingGeneratedClips =
    !showingAgent && !showingEmptyAgent && activeProjectView === 'clips';

  return (
    <RadixToast.Provider swipeDirection="right">
      <HomeShell>
        <HomeBackground>
          <VideoBackground
            webmSrc="/media/wave/looping-wave.webm"
            mp4Src="/media/wave/looping-wave.mp4"
            label="Decorative particle wave background"
          />
          {showingAgent ? (
            <ChatBackgroundScrim
              data-chat-background-scrim
              aria-hidden="true"
            />
          ) : null}
        </HomeBackground>

        <HomeLayout>
          {sidebarCollapsed ? (
            <CollapsedSidebarSlot>
              <SidebarToggleButton
                label="Expand sidebar"
                flipped
                onClick={() => setSidebarCollapsed(false)}
              />
            </CollapsedSidebarSlot>
          ) : (
            <AppSidebar
              user={user}
              projects={projects}
              activeProjectId={activeProjectId}
              activeChatId={activeChatId}
              activeProjectView={activeProjectView}
              onSelectProject={handleSelectProject}
              onSelectChat={handleSelectChat}
              onSelectProjectView={handleSelectProjectView}
              onComposeAgent={handleComposeAgent}
              onRenameProject={handleRenameProject}
              onDeleteProject={handleDeleteProject}
              onRenameChat={handleRenameChat}
              onDeleteChat={handleDeleteChat}
              onNewProject={handleNewProject}
              onCollapse={() => setSidebarCollapsed(true)}
              onSignOut={onSignOut}
            />
          )}

          {showingEmptyAgent ? (
            <AgentMainPane>
              <EmptyAgentWorkspace
                project={activeProject}
                selectedClipId={selectedClipId}
                onSelectClip={setSelectedClipId}
                uploading={uploading}
                progressPercent={progressPercent}
                uploadFileName={uploadFileName}
                onSubmitPrompt={handleAgentPrompt}
                onUploadClick={() => {
                  void handleUploadClick();
                }}
                onCreateVideo={handleCreateVideo}
                onAddClipToVideo={handleAddClipToVideo}
                onChangeVideoClips={handleChangeVideoClips}
                onRenameVideo={handleRenameVideo}
                onRenameGeneratedClip={handleRenameGeneratedClip}
                onDeleteGeneratedClip={handleDeleteGeneratedClip}
                onRenameDetectedEvent={handleRenameDetectedEvent}
                onDeleteDetectedEvent={handleDeleteDetectedEvent}
                onRenameMedia={handleRenameMedia}
                onDeleteMedia={handleDeleteMedia}
                onNotify={showToast}
              />
            </AgentMainPane>
          ) : showingAgent ? (
            <AgentMainPane>
              <AIAgentWorkspace
                project={activeProject}
                request={agentRequest ?? ''}
                videoRequest={videoRequest}
                selectedClipId={selectedClipId}
                onSelectClip={setSelectedClipId}
                onSubmitPrompt={handleAgentPrompt}
                onCreateVideo={handleCreateVideo}
                onAddClipToVideo={handleAddClipToVideo}
                onChangeVideoClips={handleChangeVideoClips}
                onRenameVideo={handleRenameVideo}
                onRenameGeneratedClip={handleRenameGeneratedClip}
                onDeleteGeneratedClip={handleDeleteGeneratedClip}
                onRenameDetectedEvent={handleRenameDetectedEvent}
                onDeleteDetectedEvent={handleDeleteDetectedEvent}
                uploading={uploading}
                progressPercent={progressPercent}
                uploadFileName={uploadFileName}
                onUploadClick={() => {
                  void handleUploadClick();
                }}
                onRenameMedia={handleRenameMedia}
                onDeleteMedia={handleDeleteMedia}
                onNotify={showToast}
              />
            </AgentMainPane>
          ) : showingUploadedMedia ? (
            <MainPane>
              <MainContent>
                <UserUploadedMediaWorkspace
                  project={activeProject}
                  uploading={uploading}
                  progressPercent={progressPercent}
                  uploadFileName={uploadFileName}
                  onUploadClick={() => {
                    void handleUploadClick();
                  }}
                  onRename={handleRenameMedia}
                  onDelete={handleDeleteMedia}
                  onNotify={showToast}
                />
              </MainContent>
            </MainPane>
          ) : showingGeneratedClips ? (
            <MainPane>
              <MainContent>
                <GeneratedClipsWorkspace
                  project={activeProject}
                  onGenerateFromEvents={(eventIds) => {
                    const selectedEvents = eventIds
                      .map((eventId) =>
                        activeProject.events.find(
                          (event) => event.id === eventId,
                        ),
                      )
                      .filter(
                        (event): event is Project['events'][number] =>
                          Boolean(event),
                      );
                    handleAgentPrompt(
                      formatSelectedClipsPrompt(selectedEvents),
                      selectedEvents.map((event) => event.id),
                    );
                  }}
                  onRenameGeneratedClip={handleRenameGeneratedClip}
                  onDeleteGeneratedClip={handleDeleteGeneratedClip}
                  onRenameDetectedEvent={handleRenameDetectedEvent}
                  onDeleteDetectedEvent={handleDeleteDetectedEvent}
                  onCreateVideo={handleCreateVideo}
                  onAddClipToVideo={handleAddClipToVideo}
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
                  onOpenDetectedEvents={() => setActiveProjectView('clips')}
                  onRenameMedia={handleRenameMedia}
                  onDeleteMedia={handleDeleteMedia}
                  onRenameDetectedEvent={handleRenameDetectedEvent}
                  onDeleteDetectedEvent={handleDeleteDetectedEvent}
                  onCreateVideo={handleCreateVideo}
                  onAddClipToVideo={handleAddClipToVideo}
                  onNotify={showToast}
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
