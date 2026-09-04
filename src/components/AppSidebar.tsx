import { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  Avatar,
  Button,
  IconButton,
  MenuContainer,
  MenuItem,
  Sidebar,
  SidebarBlock,
  SidebarDivider,
  SidebarItem,
  SidebarNav,
  SidebarSectionHeader,
  SidebarSubItem,
  TextInput,
} from '@cake-admin/cakeand';
import { DropdownMenu as RadixDropdownMenu } from 'radix-ui';
import type { Project } from '../types/project';
import type { SignInUser } from '../types/auth';
import { SPORTS_INDIGO_ALPHA_LIGHTER } from '../styles/sports-theme';
import { StudioIcon } from './StudioIcon';

export interface AppSidebarProps {
  user: SignInUser;
  projects: Project[];
  activeProjectId: string;
  activeChatId: string | null;
  activeAgentId?: 'detected' | 'clips' | null;
  onSelectProject: (projectId: string) => void;
  onSelectChat: (chatId: string | null) => void;
  onSelectAgent: (
    projectId: string,
    agentId: 'detected' | 'clips',
  ) => void;
  onNewProject: () => void;
  onSignOut: () => void;
}

const AGENT_ITEMS = [
  { id: 'detected', label: 'Detected events', icon: 'ai-detected' as const },
  { id: 'clips', label: 'Generated clips', icon: 'ai-clips' as const },
] as const;

/** Sample org label above the user name (Figma 174:26517 "Sports Team"). */
const SAMPLE_TEAM_NAME = 'My Sports Team';

/**
 * Sports rail on cake& Sidebar + SidebarNav + SidebarBlock (Figma 174:26426).
 *
 * cake& owns geometry: the rail's 24/12/12 padding, the 16/8 divider sections
 * and the 16/4 section header already match Figma. What is overridden here is
 * type scale (sports uses 12px rows, cake defaults to 14px), the sub-item's
 * 64px icon indent, and the tonal fills — all recolor / spacing tweaks inside
 * cake components, not replacements for them.
 */
export function AppSidebar({
  user,
  projects,
  activeProjectId,
  activeChatId,
  activeAgentId = null,
  onSelectProject,
  onSelectChat,
  onSelectAgent,
  onNewProject,
  onSignOut,
}: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /** Selected tab: the project row unless a chat thread under it is open. */
  const tabValue =
    activeChatId ??
    (activeAgentId ? `${activeProjectId}-${activeAgentId}` : activeProjectId);
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const visibleProjects = useMemo(() => {
    if (!normalizedQuery) return projects;

    return projects
      .map((project) => {
        const titleMatches = project.title.toLocaleLowerCase().includes(normalizedQuery);
        const matchingThreads = project.chatThreads.filter((thread) =>
          thread.label.toLocaleLowerCase().includes(normalizedQuery),
        );

        if (!titleMatches && matchingThreads.length === 0) return null;
        return {
          ...project,
          chatThreads: titleMatches ? project.chatThreads : matchingThreads,
        };
      })
      .filter((project): project is Project => project !== null);
  }, [normalizedQuery, projects]);

  function handleValueChange(next: string) {
    if (next === 'video-manager') return;

    if (next.endsWith('-detected') || next.endsWith('-clips')) {
      const projectId = next.replace(/-(detected|clips)$/, '');
      const agentId = next.endsWith('-detected') ? 'detected' : 'clips';
      onSelectProject(projectId);
      onSelectChat(null);
      onSelectAgent(projectId, agentId);
      return;
    }

    if (projects.some((project) => project.id === next)) {
      onSelectProject(next);
      onSelectChat(null);
      return;
    }

    const owner = projects.find((project) =>
      project.chatThreads.some((thread) => thread.id === next),
    );
    if (owner) {
      onSelectProject(owner.id);
      onSelectChat(next);
    }
  }

  function renderProjectActions() {
    return (
      <ProjectActions
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.preventDefault()}
      >
        <IconButton
          size="sm"
          variant="ghost"
          intent="secondary"
          label="Compose"
          icon={<StudioIcon name="compose" size={18} />}
        />
        <IconButton
          size="sm"
          variant="ghost"
          intent="secondary"
          label="More"
          icon={<StudioIcon name="more-vert" size={18} />}
        />
      </ProjectActions>
    );
  }

  return (
    <RailShell>
      <StyledSidebar value={tabValue} onValueChange={handleValueChange}>
        <StyledSidebarNav
          aria-label="Studio navigation"
          appName="Sports AI Studio"
          surface="translucent"
          collapsed={collapsed}
          logo={
            <IconButton
              size="sm"
              intent="secondary"
              variant="ghost"
              label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              icon={<StudioIcon name="sidebar" size={20} />}
              onClick={() => setCollapsed((value) => !value)}
            />
          }
        >
          {!collapsed ? (
            <>
              <SearchSlot>
                <TextInput
                  placeholder="Search chat history"
                  startIcon={<StudioIcon name="search" size={18} />}
                  aria-label="Search chat history"
                  size="sm"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </SearchSlot>

              <SidebarDivider />

              <NewProjectButton
                size="md"
                intent="primary"
                variant="tonal"
                startIcon={<StudioIcon name="add" size={18} />}
                onClick={onNewProject}
                fullWidth
              >
                New project
              </NewProjectButton>

              <SidebarDivider />
            </>
          ) : null}

          <ProjectSidebarItem
            value="video-manager"
            icon={<StudioIcon name="videocam" size={24} />}
          >
            Video manager
          </ProjectSidebarItem>

          <SidebarDivider />

          <SidebarSectionHeader>Projects</SidebarSectionHeader>

          {visibleProjects.length === 0 ? (
            <SidebarSectionHeader>No matching chats</SidebarSectionHeader>
          ) : null}

          {visibleProjects.map((project) => {
            const isActive = project.id === activeProjectId;
            const showActions = isActive || hoveredProjectId === project.id;

            return (
              <ProjectHost
                key={project.id}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                {isActive ? (
                  <ProjectBlock
                    surface="translucent"
                    item={
                      <ProjectSidebarItem
                        value={project.id}
                        data-project-active={isActive}
                      >
                        {project.title}
                      </ProjectSidebarItem>
                    }
                  >
                    {AGENT_ITEMS.map((agent) => (
                      <ProjectSubItem
                        key={agent.id}
                        value={`${project.id}-${agent.id}`}
                      >
                        <SubItemContent>
                          <StudioIcon name={agent.icon} size={20} />
                          <SubItemLabel>{agent.label}</SubItemLabel>
                        </SubItemContent>
                      </ProjectSubItem>
                    ))}

                    {project.chatThreads.length > 0 ? (
                      <>
                        <BlockDivider />
                        {project.chatThreads.map((thread) => (
                          <ProjectSubItem key={thread.id} value={thread.id}>
                            <SubItemLabel>{thread.label}</SubItemLabel>
                          </ProjectSubItem>
                        ))}
                      </>
                    ) : null}
                  </ProjectBlock>
                ) : (
                  <ProjectSidebarItem
                    value={project.id}
                    data-project-active={isActive}
                  >
                    {project.title}
                  </ProjectSidebarItem>
                )}

                {showActions && !collapsed ? renderProjectActions() : null}
              </ProjectHost>
            );
          })}
        </StyledSidebarNav>
      </StyledSidebar>

      {!collapsed ? (
        <>
          <FooterDivider />
          <UserRow>
            <Avatar
              size="sm"
              src="/brand/avatar-jane.png"
              alt={user.displayName}
              initials="JD"
            />
            <UserMeta>
              <TeamName>{SAMPLE_TEAM_NAME}</TeamName>
              <UserName>{user.displayName}</UserName>
            </UserMeta>
            <RadixDropdownMenu.Root>
              <RadixDropdownMenu.Trigger asChild>
                <IconButton
                  size="sm"
                  intent="secondary"
                  variant="ghost"
                  label="Account options"
                  icon={<StudioIcon name="dropdown" size={24} />}
                />
              </RadixDropdownMenu.Trigger>
              <RadixDropdownMenu.Portal>
                <AccountMenuContent side="top" align="end" sideOffset={8}>
                  <MenuContainer
                    role="menu"
                    aria-label="Account menu"
                    width="calc(var(--space-1000) + var(--space-1000))"
                  >
                    <RadixDropdownMenu.Item asChild>
                      <MenuItem
                        leftSlot={<StudioIcon name="logout" size={16} />}
                        showRightSlot={false}
                        onClick={onSignOut}
                      >
                        Log out
                      </MenuItem>
                    </RadixDropdownMenu.Item>
                  </MenuContainer>
                </AccountMenuContent>
              </RadixDropdownMenu.Portal>
            </RadixDropdownMenu.Root>
          </UserRow>
        </>
      ) : null}
    </RailShell>
  );
}

/**
 * Figma &sidebar surface: tonal secondary overlay + 12px blur, 24px radius.
 * cake&'s translucent rail paints nothing, so the wash lives on the shell.
 */
const RailShell = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 320px;
  flex-shrink: 0;
  min-height: calc(100vh - 2 * var(--space-300));
  align-self: stretch;
  padding-bottom: var(--space-200);
  border-radius: var(--radius-400);
  background: var(--color-tonal-tonal-secondary-overlay);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
`;

/** Tabs root is a plain flex box — pin its width so the rail can't overflow. */
const StyledSidebar = styled(Sidebar)`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  flex: 1;
  min-height: 0;
`;

const StyledSidebarNav = styled(SidebarNav)`
  && {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    height: 100%;
    background: transparent;
    padding-bottom: 0;
  }

  /* Figma rows run the full width inside the rail's 12px padding; cake reserves
     an extra scrollbar gutter that clipped the rows on the right. */
  [data-radix-scroll-area-viewport] {
    width: 100% !important;
  }

  /* Title left, collapse right (Figma 174:26428). cake's own collapse control
     lives in the footer, so the brand row is reordered and the logo slot holds
     the toggle. */
  & > div:first-child > div:first-child {
    flex-direction: row-reverse;
    justify-content: space-between;
    padding-right: 0;
  }

  /* Footer is composed below the rail (team + user relationship row). */
  & > div:last-child {
    display: none;
  }
`;

/**
 * Figma search fill is surfaces/on-container-low; cake TextInput defaults to
 * tonal-tonal. Remap the fill token inside this slot only.
 */
const SearchSlot = styled.div`
  width: 100%;
  --color-tonal-tonal: var(--color-surfaces-on-container-low);
`;

/**
 * Figma New project (174:26443): tonal-lightest fill, text-icon-primary label
 * and icon, 12px bold. cake's primary tonal uses the on-tonal pair.
 */
const NewProjectButton = styled(Button)`
  && {
    background: var(--color-tonal-tonal-lightest);
    color: var(--color-text-icon-primary);
    font-size: var(--type-size-caption);
    font-weight: var(--font-weight-bold);
    letter-spacing: 0.1px;

    &:hover:not(:disabled) {
      background: var(--color-tonal-tonal-overlay-hover);
      color: var(--color-text-icon-primary);
    }

    &:active:not(:disabled) {
      background: var(--color-tonal-tonal-overlay-press);
      color: var(--color-text-icon-primary);
    }
  }
`;

/**
 * Sports rows are 12px (Figma medium.12 / bold.12) against cake's 14px body,
 * 40px tall rather than 48px to fit more projects, and the selected row is
 * tonal/tonalOverlay — cake's own selected fill (tonal-lightest) is 38% indigo
 * in dark.a and glares on top of the block wash.
 */
const ProjectSidebarItem = styled(SidebarItem)`
  && {
    height: 40px;
    min-height: 40px;
    padding-right: var(--space-100);
    font-size: var(--type-size-caption);
    letter-spacing: 0.2px;
  }

  &&[data-state='active'] {
    background: var(--color-tonal-tonal-overlay);
  }

  &&[data-project-active='true'] {
    background: var(--color-tonal-tonal-overlay);
    font-weight: var(--font-weight-bold);
    color: var(--color-text-icon-on-tonal);
  }

  &&[data-state='active']:not(:disabled)::before,
  &&[data-project-active='true']:not(:disabled)::before {
    height: 20px;
  }
`;

/** Lighter 12% indigo wash requested for the project block on video. */
const ProjectBlock = styled(SidebarBlock)`
  && {
    background: ${SPORTS_INDIGO_ALPHA_LIGHTER};
  }
`;

/**
 * Figma sub-item (174:26470): 32px tall, 8px radius, 12px inline padding.
 * cake indents sub-items by 64px to align under a parent icon; the sports rail
 * has no parent icon, so the indent is removed.
 */
const ProjectSubItem = styled(SidebarSubItem)`
  && {
    min-height: 32px;
    padding: var(--space-050) var(--space-200);
    gap: var(--space-100);
    font-size: var(--type-size-caption);
    letter-spacing: 0.2px;
  }

  &&[data-state='active'] {
    background: var(--color-secondary-secondary-overlay);
  }
`;

/** Tighter divider between agents and chat threads (Figma 174:26486: 8px). */
const BlockDivider = styled(SidebarDivider)`
  && {
    padding: var(--space-100);
  }
`;

const ProjectHost = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
`;

/** Compose + more sit in the 40px parent row, not centred on the whole block. */
const ProjectActions = styled.div`
  position: absolute;
  top: 0;
  right: var(--space-100);
  height: 40px;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

const SubItemContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const SubItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const FooterDivider = styled(SidebarDivider)`
  && {
    padding: var(--space-300) var(--space-200);
  }
`;

/** Figma 174:26513 — 16px inline, 12px block, 16px gap. */
const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-300);
  box-sizing: border-box;
  width: 100%;
  padding: var(--space-200) var(--space-300);
  flex-shrink: 0;
`;

const UserMeta = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
`;

const TeamName = styled.p`
  margin: 0;
  font-size: var(--type-size-caption);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/** Figma medium.10 — there is no 10px type token in the cake scale. */
const UserName = styled.p`
  margin: 0;
  font-size: 10px;
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.2px;
  line-height: 1.35;
  color: var(--color-text-icon-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AccountMenuContent = styled(RadixDropdownMenu.Content)`
  z-index: 100;
  outline: none;
`;
