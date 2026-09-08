import { FileUpload, ProgressBar } from '@cake-admin/cakeand';
import styled, { keyframes } from 'styled-components';
import type { MouseEvent } from 'react';
import {
  EmptyUploadZone,
  UploadBoundary,
  UploadZone,
} from '../styles/home-theme';
import {
  AI_TEXT_GRADIENT,
  SPORTS_GLASS_BACKGROUND,
} from '../styles/sports-tokens';

export interface UploadDropzoneProps {
  variant?: 'empty' | 'compact';
  alignment?: 'start' | 'center';
  uploading: boolean;
  progressPercent: number;
  fileName: string | null;
  onUploadClick: () => void;
}

/**
 * Demo handoff switch:
 * - true: activating cake& FileUpload immediately runs the mocked upload
 * - false: the native picker/drop path remains fully wired for production work
 */
const DEMO_UPLOAD_BYPASS = true;

/**
 * Video picker based on cake& FileUpload. Selecting or dropping a file starts
 * the mocked upload; no bytes leave the browser.
 */
export function UploadDropzone({
  variant = 'compact',
  alignment = variant === 'empty' ? 'start' : 'center',
  uploading,
  progressPercent,
  fileName,
  onUploadClick,
}: UploadDropzoneProps) {
  const Zone = variant === 'empty' ? EmptyUploadZone : UploadZone;

  function handleDemoActivation(event: MouseEvent<HTMLDivElement>) {
    if (!DEMO_UPLOAD_BYPASS || uploading) return;

    event.preventDefault();
    event.stopPropagation();
    onUploadClick();
  }

  /** Production picker path retained behind DEMO_UPLOAD_BYPASS. */
  function handleRealFileSelection() {
    onUploadClick();
  }

  return (
    <UploadContainer>
      <Zone onClickCapture={handleDemoActivation}>
        <UploadBoundary
          $empty={variant === 'empty'}
          $alignment={alignment}
        >
          {uploading ? (
            <UploadingState
              $empty={variant === 'empty'}
              role="status"
              aria-live="polite"
              aria-label={`Uploading ${fileName ?? 'video'}, ${progressPercent}% complete`}
            >
              <UploadingTitle>Uploading your video</UploadingTitle>
              <UploadThinkingImage
                src="/media/thinking/upload-ball.png"
                alt=""
                aria-hidden="true"
              />
              <UploadProgressContent>
                <UploadStatusRow>
                  <span>{progressPercent}% complete...</span>
                  <DetectingStatus>Detecting clips...</DetectingStatus>
                </UploadStatusRow>
                <UploadProgressBar
                  color="primary"
                  width="thin"
                  value={progressPercent}
                  max={100}
                  label={null}
                  aria-label="Upload progress"
                  showLabelIcon={false}
                  showHelper={false}
                  showValue={false}
                />
              </UploadProgressContent>
            </UploadingState>
          ) : (
            <FileUpload
              aria-label="Upload video to this project"
              accept="video/*"
              loading={false}
              status="default"
              prompt="Upload videos to this project"
              uploadLabel="Select video"
              restrictions={false}
              maxSize={Number.MAX_SAFE_INTEGER}
              onFileChange={handleRealFileSelection}
            />
          )}
        </UploadBoundary>
      </Zone>
    </UploadContainer>
  );
}

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
`;

const uploadOrbit = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const UploadingState = styled.div<{ $empty: boolean }>`
  display: flex;
  min-height: ${({ $empty }) =>
    $empty
      ? 'calc(var(--space-1000) * 4)'
      : 'calc(var(--space-1000) * 2 + var(--space-500))'};
  width: 100%;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-500);
  padding: var(--space-800) var(--space-300);
  border: var(--stroke-100) solid var(--color-stroke-border);
  border-radius: var(--radius-400);
  /* Sports upload overlay: Figma black/50a keeps the wave visible behind it. */
  background: ${SPORTS_GLASS_BACKGROUND};
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
`;

const UploadingTitle = styled.p`
  margin: 0;
  color: var(--color-text-icon-primary);
  font-size: var(--type-size-body);
  font-weight: var(--font-weight-medium);
  line-height: 1.35;
`;

const UploadThinkingImage = styled.img`
  display: block;
  width: var(--space-900);
  height: var(--space-900);
  object-fit: contain;
  animation: ${uploadOrbit} 3s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const UploadProgressContent = styled.div`
  display: flex;
  width: min(100%, calc(var(--space-1000) * 4 + var(--space-600)));
  flex-direction: column;
  gap: var(--space-050);
`;

/** cake&'s thinnest track is 12px; the sports upload bar is 8px. */
const UploadProgressBar = styled(ProgressBar)`
  &[role='progressbar'],
  & [role='progressbar'] {
    height: var(--space-100);
  }

  &[role='progressbar'] > *,
  & [role='progressbar'] > * {
    height: 100%;
  }
`;

const UploadStatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-300);
  color: var(--color-disabled-disabled-inverse);
  font-size: var(--type-size-body);
  line-height: 1.35;
`;

const DetectingStatus = styled.span`
  background-image: ${AI_TEXT_GRADIENT};
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
`;
