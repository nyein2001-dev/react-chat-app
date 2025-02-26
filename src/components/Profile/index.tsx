import React from 'react';
import { X } from 'lucide-react';
import { User } from '../../models/user/types';
import Avatar from '../common/Avatar';
import { formatDistanceToNow } from 'date-fns';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function Profile({ isOpen, onClose, user }: ProfileProps) {
  if (!isOpen || !user) return null;

  const formatLastSeen = (lastSeenAt: string | null) => {
    if (!lastSeenAt) return 'Never';
    
    try {
      return formatDistanceToNow(new Date(lastSeenAt), { addSuffix: true });
    } catch (error) {
      return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center">
          <Avatar
            user={user}
            size={80}
            showStatus
            status={user.status}
          />
          
          <h2 className="mt-4 text-xl font-semibold">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500">@{user.username}</p>
          
          <div className="mt-6 w-full space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Email</span>
              <span>{user.email}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Status</span>
              <span className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                {user.status === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Last seen</span>
              <span>
                {user.status === 'online' 
                  ? 'Now'
                  : formatLastSeen(user.last_seen_at)
                }
              </span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-500">Account status</span>
              <span className="flex items-center gap-2">
                {user.is_verified ? (
                  <span className="text-green-500">Verified</span>
                ) : (
                  <span className="text-yellow-500">Unverified</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 