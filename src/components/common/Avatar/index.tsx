import React from 'react';
import { useAvatar } from '../../../utils/avatar';
import { cn } from '../../../utils/cn';

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  user: {
    username: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string | null;
  };
  size?: number;
  background?: string;
  color?: string;
  showStatus?: boolean;
  status?: 'online' | 'offline';
  className?: string;
}

export default function Avatar({
  user,
  size = 40,
  background = '6366F1',
  color = 'FFFFFF',  
  showStatus = false,
  status = 'offline',
  className,
  ...props
}: AvatarProps) {
  const { avatarUrl, handleError } = useAvatar(user, {
    size: size * 2,
    background,
    color,
    bold: true,
    rounded: true,
  });

  return (
    <div className="relative inline-block">
      <img
        src={avatarUrl}
        alt={user.username}
        onError={handleError}
        className={cn(
          'rounded-full object-cover',
          className
        )}
        style={{ 
          width: size,
          height: size,
        }}
        {...props}
      />
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full border-2 border-white',
            status === 'online' ? 'bg-green-500' : 'bg-gray-300',
          )}
          style={{
            width: size * 0.3,
            height: size * 0.3,
          }}
        />
      )}
    </div>
  );
} 