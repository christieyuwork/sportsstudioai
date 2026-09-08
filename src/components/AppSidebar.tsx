import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import styled from 'styled-components';
import {
  Avatar,
  Button,
  MenuContainer,
  MenuItem,
  Modal,
  ModalContent,
  ModalFooter,
  Sidebar,
  SidebarBlock,
  SidebarDivider,
  SidebarItem,
  SidebarNav,
  SidebarSectionHeader,
  SidebarSubItem,
  TextInput,
} from '@cake-admin/cakeand';
import {
  DropdownMenu as RadixDropdownMenu,
  Tooltip as RadixTooltip,
} from 'radix-ui';
import { Pencil, Trash2 } from 'lucide-react';
import type { Project } from '../types/project';
import type { SignInUser } from '../types/auth';
import {
  AI_TEXT_GRADIENT,
  SPORTS_INDIGO_ALPHA_LIGHTER,
} from '../styles/sports-tokens';
import { SidebarToggleButton } from './SidebarToggleButton';
import { StudioIcon } from './StudioIcon';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { TooltipIconButton } from './TooltipIconButton';

export interface AppSidebarProps {
  user: SignInUser;
  projects: Project[];
  activeProjectId: string;
  activeChatId: string | null;
  activeProjectView?: 'uploaded' | 'clips' | null;
  onSelectProject: (projectId: string) => void;
  onSelectChat: (chatId: string | null) => void;
  onSelectProjectView: (
    projectId: string,
    view: 'uploaded' | 'clips',
  ) => void;
  onComposeAgent: (projectId: string) => void;
  onRenameProject: (projectId: string, title: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameChat: (projectId: string, chatId: string, title: string) => void;
  onDeleteChat: (projectId: string, chatId: string) => void;
  onNewProject: () => void;
  onCollapse: () => void;
  onSignOut: () => void;
}

const PROJECT_MEDIA_ITEMS = [
  { id: 'uploaded', label: 'User-uploaded media', icon: 'videocam' as const },
  { id: 'clips', label: 'Generated clips', icon: 'ai-clips' as const },
] as const;

/** Sample org label above the user name (Figma 174:26517 "Sports Team"). */
const SAMPLE_TEAM_NAME = 'My Sports Team';

function SidebarLabelTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <SidebarTooltipContent
          side="bottom"
          align="start"
          sideOffset={4}
          avoidCollisions
        >
          {label}
        </SidebarTooltipContent>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}

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
  activeProjectView = null,
  onSelectProject,
  onSelectChat,
  onSelectProjectView,
  onComposeAgent,
  onRenameProject,
  onDeleteProject,
  onRenameChat,
  onDeleteChat,
  onNewProject,
  onCollapse,
  onSignOut,
}: AppSidebarProps) {
  const [hoveredProjectId, setHoveredProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(
    activeProjectId,
  );
  const [renameTarget, setRenameTarget] = useState<
    | { type: 'project'; projectId: string; title: string }
    | { type: 'chat'; projectId: string; chatId: string; title: string }
    | null
  >(null);
  const [renameValue, setRenameValue] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'project'; projectId: string; title: string }
    | {
        type: 'agent';
        projectId: string;
        chatId: string;
        title: string;
      }
    | null
  >(null);

  useEffect(() => {
    setExpandedProjectId(activeProjectId);
  }, [activeProjectId]);

  /** Selected tab: the project row unless a chat thread under it is open. */
  const tabValue =
    activeChatId ??
    (activeProjectView
      ? `${activeProjectId}-${activeProjectView}`
      : activeProjectId);
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
    if (next.endsWith('-uploaded') || next.endsWith('-clips')) {
      const projectId = next.replace(/-(uploaded|clips)$/, '');
      const view = next.endsWith('-uploaded') ? 'uploaded' : 'clips';
      onSelectProject(projectId);
      onSelectChat(null);
      onSelectProjectView(projectId, view);
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

  function toggleProject(projectId: string) {
    setExpandedProjectId((current) =>
      current === projectId ? null : projectId,
    );
  }

  function openRename(
    target:
      | { type: 'project'; projectId: string; title: string }
      | { type: 'chat'; projectId: string; chatId: string; title: string },
  ) {
    setRenameTarget(target);
    setRenameValue(target.title);
  }

  function submitRename() {
    const title = renameValue.trim();
    if (!title || !renameTarget) return;
    if (renameTarget.type === 'project') {
      onRenameProject(renameTarget.projectId, title);
    } else {
      onRenameChat(renameTarget.projectId, renameTarget.chatId, title);
    }
    setRenameTarget(null);
  }

  function renderProjectActions(projectId: string) {
    return (
      <ProjectActions
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.preventDefault()}
      >
        <TooltipIconButton
          size="xs"
          variant="ghost"
          intent="secondary"
          label="Compose"
          icon={<StudioIcon name="compose" size={20} />}
          onClick={() => onComposeAgent(projectId)}
        />
        <RadixDropdownMenu.Root>
          <RadixDropdownMenu.Trigger asChild>
            <TooltipIconButton
              size="xs"
              variant="ghost"
              intent="secondary"
              label="Project options"
              icon={<StudioIcon name="more-vert" size={20} />}
            />
          </RadixDropdownMenu.Trigger>
          <RadixDropdownMenu.Portal>
            <SidebarMenuContent side="bottom" align="end" sideOffset={8}>
              <MenuContainer
                role="menu"
                aria-label="Project actions"
                width="calc(var(--space-1000) * 2)"
              >
                <RadixDropdownMenu.Item asChild>
                  <MenuItem
                    leftSlot={<Pencil size={16} />}
                    showRightSlot={false}
                    onClick={() => {
                      const project = projects.find(
                        (item) => item.id === projectId,
                      );
                      if (project) {
                        openRename({
                          type: 'project',
                          projectId,
                          title: project.title,
                        });
                      }
                    }}
                  >
                    Rename
                  </MenuItem>
                </RadixDropdownMenu.Item>
                <RadixDropdownMenu.Item asChild>
                  <DeleteSidebarMenuItem
                    leftSlot={<Trash2 size={16} />}
                    showRightSlot={false}
                    onClick={() => {
                      const project = projects.find(
                        (item) => item.id === projectId,
                      );
                      if (project) {
                        setDeleteTarget({
                          type: 'project',
                          projectId,
                          title: project.title,
                        });
                      }
                    }}
                  >
                    Delete
                  </DeleteSidebarMenuItem>
                </RadixDropdownMenu.Item>
              </MenuContainer>
            </SidebarMenuContent>
          </RadixDropdownMenu.Portal>
        </RadixDropdownMenu.Root>
      </ProjectActions>
    );
  }

  return (
    <>
      <RadixTooltip.Provider delayDuration={300}>
        <RailShell>
      <StyledSidebar value={tabValue} onValueChange={handleValueChange}>
        <StyledSidebarNav
          aria-label="Studio navigation"
          appName="Sports AI Studio"
          surface="translucent"
          logo={
            <SidebarToggleButton label="Collapse sidebar" onClick={onCollapse} />
          }
        >
          <SearchSlot>
            <TextInput
              placeholder="Search projects"
              startIcon={<StudioIcon name="search" size={18} />}
              aria-label="Search projects"
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

          <SidebarSectionHeader>Projects</SidebarSectionHeader>

          {visibleProjects.length === 0 ? (
            <SidebarSectionHeader>No matching chats</SidebarSectionHeader>
          ) : null}

          {visibleProjects.map((project) => {
            const isActive = project.id === activeProjectId;
            const isExpanded = expandedProjectId === project.id;
            const showActions = isActive || hoveredProjectId === project.id;
            const hasUploadedMedia = project.media.length > 0;
            const hasGeneratedMedia =
              project.events.length > 0 || project.generatedClips.length > 0;

            return (
              <ProjectHost
                key={project.id}
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                {isExpanded ? (
                  <ProjectBlock
                    surface="translucent"
                    item={
                      <SidebarLabelTooltip label={project.title}>
                        <ProjectSidebarItem
                          value={project.id}
                          data-project-active={isActive}
                          onClick={() => toggleProject(project.id)}
                        >
                          <ProjectItemLabel>{project.title}</ProjectItemLabel>
                        </ProjectSidebarItem>
                      </SidebarLabelTooltip>
                    }
                  >
                    {PROJECT_MEDIA_ITEMS.map((item) => (
                      <ProjectSubItem
                        key={item.id}
                        value={`${project.id}-${item.id}`}
                        disabled={
                          item.id === 'uploaded'
                            ? !hasUploadedMedia
                            : !hasGeneratedMedia
                        }
                      >
                        <SubItemContent>
                          <GradientMediaIcon
                            data-media-icon
                            $asset={`/icons/${item.icon}.svg`}
                            aria-hidden="true"
                          />
                          <SubItemLabel>{item.label}</SubItemLabel>
                        </SubItemContent>
                      </ProjectSubItem>
                    ))}

                    <BlockDivider />
                    {project.chatThreads.length > 0 ? (
                      project.chatThreads.map((thread) => {
                        const isThreadActive = activeChatId === thread.id;
                        return (
                          <ThreadHost
                            key={thread.id}
                            data-thread-active={isThreadActive}
                          >
                            <SidebarLabelTooltip label={thread.label}>
                              <ProjectSubItem value={thread.id}>
                                <ThreadLabel>{thread.label}</ThreadLabel>
                              </ProjectSubItem>
                            </SidebarLabelTooltip>
                            <ThreadActions
                              onClick={(event) => event.stopPropagation()}
                              onMouseDown={(event) => event.preventDefault()}
                            >
                              <RadixDropdownMenu.Root>
                                <RadixDropdownMenu.Trigger asChild>
                                  <TooltipIconButton
                                    size="xs"
                                    variant="ghost"
                                    intent="secondary"
                                    label={`Options for ${thread.label}`}
                                    icon={
                                      <StudioIcon name="more-vert" size={20} />
                                    }
                                  />
                                </RadixDropdownMenu.Trigger>
                                <RadixDropdownMenu.Portal>
                                  <SidebarMenuContent
                                    side="bottom"
                                    align="end"
                                    sideOffset={8}
                                  >
                                    <MenuContainer
                                      role="menu"
                                      aria-label={`Actions for ${thread.label}`}
                                      width="calc(var(--space-1000) * 2)"
                                    >
                                      <RadixDropdownMenu.Item asChild>
                                        <MenuItem
                                          leftSlot={<Pencil size={16} />}
                                          showRightSlot={false}
                                          onClick={() =>
                                            openRename({
                                              type: 'chat',
                                              projectId: project.id,
                                              chatId: thread.id,
                                              title: thread.label,
                                            })
                                          }
                                        >
                                          Rename
                                        </MenuItem>
                                      </RadixDropdownMenu.Item>
                                      <RadixDropdownMenu.Item asChild>
                                        <DeleteSidebarMenuItem
                                          leftSlot={<Trash2 size={16} />}
                                          showRightSlot={false}
                                          onClick={() =>
                                            setDeleteTarget({
                                              type: 'agent',
                                              projectId: project.id,
                                              chatId: thread.id,
                                              title: thread.label,
                                            })
                                          }
                                        >
                                          Delete
                                        </DeleteSidebarMenuItem>
                                      </RadixDropdownMenu.Item>
                                    </MenuContainer>
                                  </SidebarMenuContent>
                                </RadixDropdownMenu.Portal>
                              </RadixDropdownMenu.Root>
                            </ThreadActions>
                          </ThreadHost>
                        );
                      })
                    ) : (
                      <ProjectSubItem
                        value={`${project.id}-no-agents`}
                        disabled
                      >
                        <SubItemLabel>No agents yet</SubItemLabel>
                      </ProjectSubItem>
                    )}
                  </ProjectBlock>
                ) : (
                  <SidebarLabelTooltip label={project.title}>
                    <ProjectSidebarItem
                      value={project.id}
                      data-project-active={isActive}
                      onClick={() => toggleProject(project.id)}
                    >
                      <ProjectItemLabel>{project.title}</ProjectItemLabel>
                    </ProjectSidebarItem>
                  </SidebarLabelTooltip>
                )}

                {showActions ? renderProjectActions(project.id) : null}
              </ProjectHost>
            );
          })}
        </StyledSidebarNav>
      </StyledSidebar>

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
                <TooltipIconButton
                  size="sm"
                  intent="secondary"
                  variant="ghost"
                  label="Account options"
                  icon={<StudioIcon name="dropdown" size={20} />}
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
        </RailShell>
      </RadixTooltip.Provider>

      <Modal
        open={renameTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null);
        }}
        title={renameTarget?.type === 'project' ? 'Rename project' : 'Rename agent'}
        subtitle="Update the title shown in the sidebar."
        footer={
          <ModalFooter
            checkbox={<span aria-hidden />}
            secondaryActionLabel="Cancel"
            onSecondaryAction={() => setRenameTarget(null)}
            primaryActionLabel="Save"
            primaryActionDisabled={!renameValue.trim()}
            onPrimaryAction={submitRename}
          />
        }
      >
        <ModalContent descriptionAsDialogDescription={false}>
          <TextInput
            label={renameTarget?.type === 'project' ? 'Project title' : 'Agent title'}
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submitRename();
              }
            }}
            autoFocus
          />
        </ModalContent>
      </Modal>

      <ConfirmDeleteModal
        open={deleteTarget !== null}
        itemName={deleteTarget?.title ?? ''}
        itemType={deleteTarget?.type ?? 'item'}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        onConfirm={() => {
          if (!deleteTarget) return;
          if (deleteTarget.type === 'project') {
            onDeleteProject(deleteTarget.projectId);
          } else {
            onDeleteChat(deleteTarget.projectId, deleteTarget.chatId);
          }
        }}
      />
    </>
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
  width: calc(var(--space-1000) * 4);
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

  /* Radix wraps viewport content in a display:table box that grows to
     max-content, so one long project or agent label widened every row past the
     rail instead of letting the labels ellipsize. */
  [data-radix-scroll-area-viewport] > * {
    display: block !important;
    box-sizing: border-box;
    min-width: 0 !important;
    max-width: 100%;
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

  input:focus::placeholder {
    color: transparent;
  }
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
    position: relative;
    height: var(--space-700);
    min-height: var(--space-700);
    min-width: 0;
    overflow: hidden;
    padding-right: calc(var(--space-1000) + var(--space-100));
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
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: var(--space-050);
    height: var(--space-500);
    border-radius: var(--radius-1000);
    background: var(--color-text-icon-on-tonal);
    transform: translateY(-50%);
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
    min-height: var(--space-600);
    min-width: 0;
    overflow: hidden;
    padding: var(--space-050) var(--space-200);
    gap: var(--space-100);
    font-size: var(--type-size-caption);
    letter-spacing: 0.2px;
  }

  &&[data-state='active'] {
    background: var(--color-secondary-secondary-overlay);
  }

  &&:disabled,
  &&[data-disabled] {
    background: transparent;
    color: var(--color-disabled-disabled-inverse);
    opacity: 1;
  }

  &&:disabled [data-media-icon],
  &&[data-disabled] [data-media-icon] {
    background: var(--color-disabled-disabled-inverse);
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
  height: var(--space-700);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: var(--space-050);
`;

const ThreadHost = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;

  &:hover > div:last-child,
  &[data-thread-active='true'] > div:last-child {
    opacity: 1;
    pointer-events: auto;
  }
`;

const ThreadActions = styled.div`
  position: absolute;
  top: 50%;
  right: var(--space-100);
  z-index: 2;
  display: flex;
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%);
`;

const SubItemContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-100);
  min-width: 0;
`;

const GradientMediaIcon = styled.span<{ $asset: string }>`
  display: block;
  width: var(--space-400);
  height: var(--space-400);
  flex: none;
  background: ${AI_TEXT_GRADIENT};
  mask: ${({ $asset }) => `url('${$asset}') center / contain no-repeat`};
  -webkit-mask: ${({ $asset }) =>
    `url('${$asset}') center / contain no-repeat`};
`;

const SubItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProjectItemLabel = styled(SubItemLabel)`
  display: block;
  width: 100%;
`;

const ThreadLabel = styled(SubItemLabel)`
  display: block;
  width: 100%;
  padding-right: var(--space-800);
`;

const SidebarMenuContent = styled(RadixDropdownMenu.Content)`
  z-index: 120;
  outline: none;
`;

const SidebarTooltipContent = styled(RadixTooltip.Content)`
  z-index: 140;
  max-width: calc(var(--space-1000) * 3);
  padding: var(--space-100) var(--space-200);
  border-radius: var(--radius-200);
  background: var(--color-surfaces-inverse-container);
  color: var(--color-text-icon-inverse);
  box-shadow: var(--elevation-2);
  font-size: var(--type-size-caption);
  line-height: 1.35;
`;

const DeleteSidebarMenuItem = styled(MenuItem)`
  && {
    color: var(--color-error-error);
  }
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
