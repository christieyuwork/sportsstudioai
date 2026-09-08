import { Card } from '@cake-admin/cakeand';
import styled from 'styled-components';
import { TooltipIconButton } from '../components/TooltipIconButton';

export type MediaLibraryLayout = 'page' | 'panel';

export const MediaPageBody = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-600);
  width: 100%;
`;

export const MediaLibraryStack = styled.div<{ $layout: MediaLibraryLayout }>`
  display: flex;
  min-height: 0;
  flex: ${({ $layout }) => ($layout === 'panel' ? '1' : 'none')};
  flex-direction: column;
  gap: ${({ $layout }) =>
    $layout === 'page' ? 'var(--space-800)' : 'var(--space-600)'};
  width: 100%;
  overflow-y: ${({ $layout }) => ($layout === 'panel' ? 'auto' : 'visible')};
`;

export const MediaLibrarySection = styled.section`
  display: flex;
  flex-direction: column;
  gap: var(--space-300);
  width: 100%;
`;

export const MediaLibraryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
`;

export const MediaLibraryTitle = styled.h2`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-title);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

export const MediaLibraryGrid = styled.div<{ $layout: MediaLibraryLayout }>`
  display: grid;
  grid-template-columns: ${({ $layout }) =>
    $layout === 'page'
      ? 'repeat(4, minmax(0, 1fr))'
      : 'repeat(2, minmax(0, 1fr))'};
  gap: var(--space-200);
  width: 100%;

  @media (max-width: 1250px) {
    grid-template-columns: ${({ $layout }) =>
      $layout === 'page'
        ? 'repeat(3, minmax(0, 1fr))'
        : 'repeat(2, minmax(0, 1fr))'};
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const UploadedMediaLibraryBody = styled.div<{
  $layout: MediaLibraryLayout;
}>`
  display: flex;
  min-height: 0;
  flex: ${({ $layout }) => ($layout === 'panel' ? '1' : 'none')};
  flex-direction: column;
  gap: ${({ $layout }) =>
    $layout === 'page' ? 'var(--space-300)' : 'var(--space-500)'};
  width: 100%;
  overflow-y: ${({ $layout }) => ($layout === 'panel' ? 'auto' : 'visible')};
  box-sizing: border-box;
`;

export const UploadedMediaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-100);
  width: 100%;
`;

export const ProjectMediaRowCard = styled(Card)`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: var(--space-200);
    min-height: calc(var(--space-1000) + var(--space-100));
    padding: var(--space-100);
    border: var(--stroke-100) solid var(--color-stroke-border);
    border-radius: var(--radius-300);
    background: var(--color-surfaces-container-blur);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
`;

export const ProjectMediaRowThumb = styled.img`
  width: var(--space-800);
  height: var(--space-800);
  flex: none;
  border-radius: var(--radius-300);
  object-fit: cover;
`;

export const ProjectMediaRowCopy = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-050);
`;

export const ProjectMediaRowTitle = styled.span`
  max-width: 100%;
  overflow: hidden;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-bold);
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ProjectMediaRowActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-050);
  flex: none;
`;

export const DeleteMediaButton = styled(TooltipIconButton)`
  && {
    background: color-mix(
      in srgb,
      var(--color-surfaces-canvas) 62%,
      var(--color-error-error) 38%
    );
    background-image: none;
    color: var(--color-error-error);
  }
`;

export const EmptyMediaMessage = styled.p`
  margin: 0;
  color: var(--color-text-icon-secondary);
  font-size: var(--type-size-body);
  line-height: 1.35;
`;
