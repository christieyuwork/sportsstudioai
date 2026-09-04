import { FileUpload, ProgressBar } from '@cake-admin/cakeand';
import styled from 'styled-components';
import type { MouseEvent } from 'react';
import {
  EmptyUploadZone,
  UploadBoundary,
  UploadProgressWrap,
  UploadZone,
} from '../styles/home-theme';

export interface UploadDropzoneProps {
  variant?: 'empty' | 'compact';
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
        <UploadBoundary $empty={variant === 'empty'}>
          <FileUpload
            aria-label="Upload video to this project"
            accept="video/*"
            loading={uploading}
            status={uploading ? 'loading' : 'default'}
            prompt={
              uploading
                ? `Uploading ${fileName ?? 'video'}…`
                : 'Upload videos to this project'
            }
            uploadLabel="Select video"
            restrictions={false}
            maxSize={Number.MAX_SAFE_INTEGER}
            onFileChange={handleRealFileSelection}
          />
          {uploading ? (
            <UploadProgressWrap>
              <ProgressBar
                color="primary"
                width="thin"
                value={progressPercent}
                max={100}
                label="Upload progress"
                labelValue={`${progressPercent}%`}
                showLabelIcon={false}
                showHelper={false}
                showValue={false}
              />
            </UploadProgressWrap>
          ) : null}
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
