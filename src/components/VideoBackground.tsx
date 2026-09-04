import styled from 'styled-components';

export interface VideoBackgroundProps {
  /** WebM source — preferred for size/quality in Chromium and Firefox. */
  webmSrc: string;
  /** MP4 fallback for Safari / older browsers. */
  mp4Src: string;
  /** Accessible description of the decorative background. */
  label: string;
}

const Frame = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
`;

const Video = styled.video`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/**
 * Full-bleed looping background video.
 *
 * WebM is primary (much smaller than GIF/MP4). MP4 is listed second so Safari
 * can fall back. muted + playsInline are required for autoplay policies.
 */
export function VideoBackground({ webmSrc, mp4Src, label }: VideoBackgroundProps) {
  return (
    // Decorative looping background — hidden from AT; label documents intent for maintainers.
    <Frame aria-hidden="true" data-background-label={label}>
      <Video autoPlay muted loop playsInline preload="metadata">
        <source src={webmSrc} type="video/webm" />
        <source src={mp4Src} type="video/mp4" />
      </Video>
    </Frame>
  );
}
