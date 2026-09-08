import { useEffect, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Popover as RadixPopover } from 'radix-ui';
import { formatClock } from '../lib/time';
import {
  PlayerControlGroup,
  PlayerControls,
  PlayerIcon,
  PlayerOverlay,
  PlayerTimeline,
  PreviewImage,
  PreviewMediaFrame,
  TimelineRow,
  VolumePopoverContent,
  VolumeSlider,
  VolumeValue,
} from '../styles/agent-theme';
import { TooltipIconButton } from './TooltipIconButton';

export interface MediaPlayerController {
  currentTime: number;
  durationSeconds: number;
  isPlaying: boolean;
  isSilent: boolean;
  muted: boolean;
  volume: number;
  isFullscreen: boolean;
  overlay: string | null;
  frameRef: RefObject<HTMLDivElement | null>;
  setCurrentTime: (value: number) => void;
  togglePlayback: () => void;
  seekTo: (value: number, message: string) => void;
  changeVolume: (value: number) => void;
  toggleMute: () => void;
  toggleFullscreen: () => Promise<void>;
}

interface UseMediaPlayerOptions {
  durationSeconds: number;
  /** Resets transient playback state when the selected clip/video changes. */
  resetKey: string;
  initialTime?: number;
}

/**
 * Shared simulated-player state.
 *
 * This remains a UI demo: it advances a clock over a thumbnail and does not
 * control an HTMLMediaElement. A backend/media integration can keep the
 * `MediaPlayer` chrome and replace this controller with real playback events.
 */
export function useMediaPlayer({
  durationSeconds,
  resetKey,
  initialTime = 13,
}: UseMediaPlayerOptions): MediaPlayerController {
  const [currentTime, setCurrentTimeState] = useState(() =>
    Math.min(initialTime, durationSeconds),
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [overlay, setOverlay] = useState<string | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const overlayTimerRef = useRef<number | null>(null);
  const isSilent = muted || volume === 0;

  useEffect(() => {
    setCurrentTimeState(Math.min(initialTime, durationSeconds));
    setIsPlaying(false);
  }, [durationSeconds, initialTime, resetKey]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentTimeState((value) => {
        if (value >= durationSeconds) {
          setIsPlaying(false);
          return durationSeconds;
        }
        return Math.min(durationSeconds, value + 1);
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [durationSeconds, isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullscreen(document.fullscreenElement === frameRef.current);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(
    () => () => {
      if (overlayTimerRef.current !== null) {
        window.clearTimeout(overlayTimerRef.current);
      }
    },
    [],
  );

  function showOverlay(message: string) {
    setOverlay(message);
    if (overlayTimerRef.current !== null) {
      window.clearTimeout(overlayTimerRef.current);
    }
    overlayTimerRef.current = window.setTimeout(() => setOverlay(null), 900);
  }

  function setCurrentTime(value: number) {
    setCurrentTimeState(Math.min(durationSeconds, Math.max(0, value)));
  }

  function seekTo(value: number, message: string) {
    setCurrentTime(value);
    showOverlay(message);
  }

  function togglePlayback() {
    setIsPlaying((value) => !value);
    showOverlay(isPlaying ? 'Paused' : 'Playing');
  }

  function changeVolume(value: number) {
    setVolume(value);
    setMuted(value === 0);
    showOverlay(value === 0 ? 'Muted' : `Volume ${value}%`);
  }

  function toggleMute() {
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (!nextMuted && volume === 0) setVolume(70);
    showOverlay(nextMuted ? 'Muted' : 'Sound on');
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await frameRef.current?.requestFullscreen();
  }

  return {
    currentTime,
    durationSeconds,
    isPlaying,
    isSilent,
    muted,
    volume,
    isFullscreen,
    overlay,
    frameRef,
    setCurrentTime,
    togglePlayback,
    seekTo,
    changeVolume,
    toggleMute,
    toggleFullscreen,
  };
}

export interface MediaPlayerProps {
  controller: MediaPlayerController;
  imageSrc: string;
  imageAlt: string;
  timelineLabel: string;
  children?: ReactNode;
}

/** Shared player chrome for clip previews and the video editor. */
export function MediaPlayer({
  controller,
  imageSrc,
  imageAlt,
  timelineLabel,
  children,
}: MediaPlayerProps) {
  const {
    currentTime,
    durationSeconds,
    isPlaying,
    isSilent,
    muted,
    volume,
    isFullscreen,
    overlay,
  } = controller;

  return (
    <PreviewMediaFrame ref={controller.frameRef}>
      <PreviewImage src={imageSrc} alt={imageAlt} />
      {overlay ? <PlayerOverlay key={overlay}>{overlay}</PlayerOverlay> : null}
      {children}
      <PlayerControls>
        <PlayerControlGroup>
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label="Jump to start"
            icon={<PlayerIcon src="/icons/player/fast_rewind.svg" alt="" />}
            onClick={() => controller.seekTo(0, 'Start')}
          />
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label="Back 5 seconds"
            icon={<PlayerIcon src="/icons/player/replay_5.svg" alt="" />}
            onClick={() => controller.seekTo(currentTime - 5, '−5s')}
          />
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label={isPlaying ? 'Pause preview' : 'Play preview'}
            icon={<PlayerIcon src="/icons/player/play_arrow.svg" alt="" />}
            onClick={controller.togglePlayback}
          />
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label="Forward 5 seconds"
            icon={<PlayerIcon src="/icons/player/forward_5.svg" alt="" />}
            onClick={() => controller.seekTo(currentTime + 5, '+5s')}
          />
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label="Jump to end"
            icon={<PlayerIcon src="/icons/player/fast_forward.svg" alt="" />}
            onClick={() => controller.seekTo(durationSeconds, 'End')}
          />
        </PlayerControlGroup>

        <TimelineRow>
          <span>{formatClock(currentTime)}</span>
          <PlayerTimeline
            type="range"
            aria-label={timelineLabel}
            min={0}
            max={durationSeconds}
            step={1}
            value={currentTime}
            $progress={
              durationSeconds === 0 ? 0 : (currentTime / durationSeconds) * 100
            }
            onChange={(event) =>
              controller.setCurrentTime(Number(event.target.value))
            }
          />
          <span>{formatClock(durationSeconds)}</span>
        </TimelineRow>

        <PlayerControlGroup>
          <RadixPopover.Root>
            <RadixPopover.Trigger asChild>
              <TooltipIconButton
                size="xs"
                variant="ghost"
                intent="secondary"
                label="Volume"
                icon={
                  <PlayerIcon
                    src={
                      isSilent
                        ? '/icons/player/volume_off.svg'
                        : '/icons/player/volume_up.svg'
                    }
                    alt=""
                  />
                }
              />
            </RadixPopover.Trigger>
            <RadixPopover.Portal>
              <VolumePopoverContent side="top" align="center" sideOffset={8}>
                <TooltipIconButton
                  size="xs"
                  variant="ghost"
                  intent="secondary"
                  label={muted ? 'Unmute preview' : 'Mute preview'}
                  aria-pressed={muted}
                  icon={
                    <PlayerIcon
                      src={
                        isSilent
                          ? '/icons/player/volume_off.svg'
                          : '/icons/player/volume_up.svg'
                      }
                      alt=""
                    />
                  }
                  onClick={controller.toggleMute}
                />
                <VolumeSlider
                  type="range"
                  aria-label="Preview volume"
                  min={0}
                  max={100}
                  step={1}
                  value={isSilent ? 0 : volume}
                  $progress={isSilent ? 0 : volume}
                  onChange={(event) =>
                    controller.changeVolume(Number(event.target.value))
                  }
                />
                <VolumeValue>{isSilent ? 0 : volume}%</VolumeValue>
              </VolumePopoverContent>
            </RadixPopover.Portal>
          </RadixPopover.Root>
          <TooltipIconButton
            size="xs"
            variant="ghost"
            intent="secondary"
            label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
            icon={
              <PlayerIcon
                src={
                  isFullscreen
                    ? '/icons/player/fullscreen_exit.svg'
                    : '/icons/player/fullscreen.svg'
                }
                alt=""
              />
            }
            onClick={() => void controller.toggleFullscreen()}
          />
        </PlayerControlGroup>
      </PlayerControls>
    </PreviewMediaFrame>
  );
}
