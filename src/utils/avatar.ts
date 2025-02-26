import { useEffect, useState } from 'react';

interface AvatarOptions {
  background?: string;
  color?: string;
  size?: number;
  rounded?: boolean;
  bold?: boolean;
  length?: number;
}

const DEFAULT_OPTIONS: Required<AvatarOptions> = {
  background: '6366F1',
  color: 'FFFFFF',
  size: 128,
  rounded: true,
  bold: true,
  length: 2,
};

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '6366F1',
    '8B5CF6',
    'EC4899',
    'EF4444',
    'F97316',
    'EAB308',
    '22C55E',
    '06B6D4',
    '3B82F6',
  ];
  return colors[Math.abs(hash) % colors.length];
}

const avatarCache = new Map<string, string>();

const errorCache = new Map<string, boolean>();

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function getAvatarUrl(
  user: {
    username: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string | null
  },
  options: AvatarOptions = {}
): string {
  const opts: Required<AvatarOptions> = {
    ...DEFAULT_OPTIONS,
    ...options,
    background: options.background || stringToColor(user.username),
  };

  const cacheKey = `${user.username}-${JSON.stringify(opts)}`;

  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey)!;
  }

  if (user.avatar_url && !errorCache.has(user.avatar_url)) {
    return user.avatar_url;
  }

  const displayName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(' ') || user.username;

  const initials = getInitials(displayName);

  const url = new URL('https://ui-avatars.com/api/');
  url.searchParams.set('name', initials);
  url.searchParams.set('background', opts.background);
  url.searchParams.set('color', opts.color);
  url.searchParams.set('size', opts.size.toString());
  url.searchParams.set('rounded', opts.rounded.toString());
  url.searchParams.set('bold', opts.bold.toString());
  url.searchParams.set('length', '2');

  const finalUrl = url.toString();
  avatarCache.set(cacheKey, finalUrl);

  return finalUrl;
}

export function useAvatar(
  user: {
    username: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string | null
  },
  options: AvatarOptions = {}
) {
  const [avatarUrl, setAvatarUrl] = useState(() => getAvatarUrl(user, options));
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);

    setAvatarUrl(getAvatarUrl(user, options));
  }, [user, JSON.stringify(options)]);

  const handleError = () => {

    if (user.avatar_url) {
      errorCache.set(user.avatar_url, true);
      setAvatarUrl(getAvatarUrl({ ...user, avatar_url: null }, options));
    }
    setError(true);
  };

  return { avatarUrl, error, handleError };
}

export function clearAvatarCaches() {
  avatarCache.clear();
  errorCache.clear();
} 