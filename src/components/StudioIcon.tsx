/**
 * Sports AI Studio icons from Figma library node 243:8374 /
 * dark-theme exports from the homescreen frame.
 * Assets live under /public/icons — never hand-authored SVGs.
 */

export type StudioIconName =
  | 'sidebar'
  | 'add'
  | 'prompt-add'
  | 'compose'
  | 'videocam'
  | 'search'
  | 'ai-clips'
  | 'ai-detected'
  | 'dropdown'
  | 'record'
  | 'ai-stars'
  | 'go-arrow'
  | 'send-arrow'
  | 'chip-arrow-more'
  | 'more-vert'
  | 'logout'
  | 'video';

const ICON_SRC: Record<StudioIconName, string> = {
  sidebar: '/icons/sidebar.svg',
  add: '/icons/add.svg',
  'prompt-add': '/icons/prompt-add.svg',
  compose: '/icons/compose.svg',
  videocam: '/icons/videocam.svg',
  search: '/icons/search.svg',
  'ai-clips': '/icons/ai-clips.svg',
  'ai-detected': '/icons/ai-detected.svg',
  dropdown: '/icons/dropdown.svg',
  record: '/icons/record.svg',
  'ai-stars': '/icons/ai-stars.svg',
  'go-arrow': '/icons/go-arrow.svg',
  'send-arrow': '/icons/send-arrow.svg',
  'chip-arrow-more': '/icons/chip-arrow-more.svg',
  'more-vert': '/icons/more-vert.svg',
  logout: '/icons/logout.png',
  video: '/icons/video.svg',
};

export interface StudioIconProps {
  name: StudioIconName;
  /** Explicit square size in px (Figma icons are fixed slots). */
  size?: number;
  className?: string;
  alt?: string;
}

export function StudioIcon({ name, size = 18, className, alt = '' }: StudioIconProps) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        flexShrink: 0,
        width: size,
        height: size,
        overflow: 'hidden',
        lineHeight: 0,
        verticalAlign: 'middle',
      }}
      aria-hidden={alt ? undefined : true}
    >
      <img
        src={ICON_SRC[name]}
        alt={alt}
        width={size}
        height={size}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        draggable={false}
      />
    </span>
  );
}
