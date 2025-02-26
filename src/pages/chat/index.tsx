"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  ChevronDown,
  MessageCircle,
  MoreVertical,
  PaperclipIcon,
  Plus,
  Search,
  Smile,
  ImageIcon,
  ArrowLeft,
  ChevronRight,
  Users,
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useConversations } from "../../hooks/useConversations"
import type { Conversation, Participant } from "../../models/chat/types"
import { formatDistanceToNow } from "date-fns"
import { useConversationSearch } from "../../hooks/useConversationSearch"
import { useMessages } from "../../hooks/useMessages"
import { getAvatarUrl } from "../../utils/avatar"
import Avatar from "../../components/common/Avatar"
import Profile from "../../components/Profile"
import { useChat } from "../../store/chat/ChatContext"
import { useContacts } from '../../hooks/useContacts'
import { useToast } from '../../context/ToastContext';
import { User } from '../../models/user.types'
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../context/SocketContext';
import { debounce } from 'lodash';
import { eventEmitter } from '../../utils/eventEmitter';

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "a long time ago"

  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  } catch (error) {
    return "Unknown"
  }
}

export default function ChatHome() {
  const { t } = useTranslation('chat');
  const { user: currentUser } = useAuth()
  const { conversations, loading, error, hasMore, loadMore, refresh: refreshConversations } = useConversations()
  const [searchQuery, setSearchQuery] = useState("")
  const { searchResults, loading: searchLoading, searchConversations } = useConversationSearch()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    hasMore: hasMoreMessages,
    loadMore: loadMoreMessages,
    refreshMessages
  } = useMessages({
    conversationId: selectedConversation?.id,
  })
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { sendMessage, createOrFindDirectConversation } = useChat()
  const [messageInput, setMessageInput] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  const {
    contacts,
    totalContacts,
    loading: contactsLoading,
    error: contactsError,
    hasMore: hasMoreContacts,
    searchQuery: contactSearchQuery,
    setSearchQuery: setContactSearchQuery,
    loadMore: loadMoreContacts,
    isExpanded,
    toggleExpanded,
  } = useContacts()
  const { showToast } = useToast()
  const { socket, sendMessage: sendWebSocketMessage } = useSocket();
  const [typingUsers, setTypingUsers] = useState<{id: number; username: string}[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const handleSocketMessage = (data: any) => {
      console.log('Typing notification received:', data);
      // Handle typing notifications
      if (data.type === 'typing.notification' && data.conversation_id === selectedConversation?.id) {
        setTypingUsers(prev => {
          if (data.is_typing) {
            const exists = prev.some(u => u.id === data.user_id);
            if (!exists && data.user_id !== currentUser?.id) {
              const newUsers = [...prev, { id: data.user_id, username: data.username }];
              console.log('Adding typing user:', newUsers);
              return newUsers;
            }
          } else {
            const newUsers = prev.filter(u => u.id !== data.user_id);
            console.log('Removing typing user:', newUsers);
            return newUsers;
          }
          return prev;
        });
        console.log('Updated typing users:', typingUsers);
      }

      if (data.type === 'chat.message') {
        console.log('Chat message received refreshConversations:', data);
        refreshConversations();
      }

      if (data.type === 'chat.message' && data.message.conversation_id === selectedConversation?.id) {
        refreshMessages();
      }
    };

    eventEmitter.on('message', handleSocketMessage);
    return () => {
      eventEmitter.off('message', handleSocketMessage);
    };
  }, [selectedConversation?.id, currentUser?.id, refreshMessages, refreshConversations]);

  const getConversationDisplay = (conversation: Conversation) => {
    if (conversation.type === "direct") {
      const otherParticipant = conversation.participants.find((p: Participant) => p.user.id !== currentUser?.id)
      const user = otherParticipant?.user

      if (user) {
        return {
          name: `${user.first_name} ${user.last_name}`.trim() || user.username,
          avatar: getAvatarUrl({
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar_url: user.avatar_url,
          }),
        }
      }
    }

    const words = conversation.title.split(/\s+/)
    return {
      name: conversation.title,
      avatar: getAvatarUrl({
        username: conversation.title,
        first_name: words[0],
        last_name: words.slice(1).join(" "),
      }),
    }
  }

  const getOtherParticipant = (conversation: Conversation) => {
    return (
      conversation.participants.find((p) => p.user.id !== currentUser?.id)?.user || conversation.participants[0].user
    )
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedConversation) return;

    try {
      await sendMessage({
        conversationId: selectedConversation.id,
        content: messageInput,
        type: "text",
      });

      setMessageInput("");
      
      await refreshMessages();
      refreshConversations();

    } catch (error) {
      console.error("Failed to send message:", error);
      showToast('error', 'Failed to send message');
    }
  };

  const handleContactClick = async (contact: User) => {
    try {
      const conversation = await createOrFindDirectConversation(contact);
      setSelectedConversation(conversation as any);

      if (isMobile) {
        toggleExpanded();
      }
    } catch (error) {
      showToast('error', 'Failed to open conversation');
      console.error('Error handling contact click:', error);
    }
  }

  const sendTypingStatus = (isTyping: boolean) => {
    if (socket?.readyState === WebSocket.OPEN && selectedConversation?.id) {
      sendWebSocketMessage({
        type: 'typing',
        conversation_id: selectedConversation.id,
        is_typing: isTyping
      });
    }
  };

  const debouncedStopTyping = useCallback(
    debounce(() => {
      sendTypingStatus(false);
    }, 1000),
    [selectedConversation?.id]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(e.target.value);
    sendTypingStatus(true);
    debouncedStopTyping();
  };

  const renderConversationList = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">{t('chat.title')}</h1>
          <button
            className="flex items-center justify-center hover:bg-gray-100 rounded-full p-1"
            onClick={() => setIsProfileOpen(true)}
          >
            <Avatar user={currentUser || { username: "Guest" }} size={40} showStatus status={currentUser?.status} />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500">{t('chat.recentChats')}</span>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </div>
        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center">
          <Plus className="h-4 w-4 mr-2" />
          {t('chat.createNew')}
        </button>
        <div className="mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('chat.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                searchConversations(e.target.value)
              }}
              className="w-full px-8 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <Search className="h-4 w-4 text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-2">
          {error && <div className="p-4 text-red-600 text-center">{t('error.loadConversations')}</div>}

          {(searchQuery ? searchResults : conversations).map((conversation) => {
            const display = getConversationDisplay(conversation)
            const otherParticipant = getOtherParticipant(conversation)

            return (
              <button
                key={conversation.id}
                className={`w-full flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 ${selectedConversation?.id === conversation.id ? "bg-blue-50" : ""
                  }`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <Avatar
                  user={otherParticipant}
                  size={40}
                  showStatus
                  status={otherParticipant.status}
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{display.name}</span>
                    <span className="text-xs text-gray-500">
                      {formatDate(conversation.last_activity_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.last_message?.content || "No messages yet"}
                  </p>
                </div>
              </button>
            )
          })}

          {loading && (
            <div className="p-4 text-center">
              <span className="text-gray-500">{t('chat.loading')}</span>
            </div>
          )}

          {hasMore && !loading && (
            <button onClick={() => loadMore()} className="w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
              {t('chat.loadMore')}
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const renderContactsList = () => (
    <div className="border-t flex flex-col">
      <button
        onClick={toggleExpanded}
        className="p-4 flex items-center justify-between hover:bg-gray-50 flex-shrink-0"
      >
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Contacts</span>
          <span className="text-sm text-gray-500">({totalContacts})</span>
        </div>
        <ChevronRight
          className={`h-5 w-5 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-90' : ''
            }`}
        />
      </button>

      {isExpanded && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 pt-0">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search contacts..."
                value={contactSearchQuery}
                onChange={(e) => setContactSearchQuery(e.target.value)}
                className="w-full px-8 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <Search className="h-4 w-4 text-gray-500 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => handleContactClick(contact)}
                >
                  <Avatar
                    user={contact}
                    size={36}
                    showStatus
                    status={contact.status}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium">
                      {contact.first_name
                        ? `${contact.first_name} ${contact.last_name}`
                        : contact.username}
                    </div>
                    <div className="text-sm text-gray-500">{contact.email}</div>
                  </div>
                </button>
              ))}

              {contactsLoading && (
                <div className="p-4 text-center">
                  <span className="text-gray-500">Loading contacts...</span>
                </div>
              )}

              {hasMoreContacts && !contactsLoading && (
                <button
                  onClick={loadMoreContacts}
                  className="w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  Load More Contacts
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderChatArea = () => (
    <div className={`flex-1 flex flex-col h-full ${isMobile && !selectedConversation ? "hidden" : "flex"}`}>
      {selectedConversation ? (
        <>
          <div className="p-4 border-b flex items-center justify-between">
            {isMobile && (
              <button onClick={() => setSelectedConversation(null)} className="mr-2">
                <ArrowLeft className="h-6 w-6" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <Avatar
                user={getOtherParticipant(selectedConversation)}
                size={40}
                showStatus
                status={getOtherParticipant(selectedConversation).status}
              />
              <div>
                <h2 className="font-semibold">{getConversationDisplay(selectedConversation).name}</h2>
                <p className="text-sm text-gray-500">
                  {typingUsers.length > 0 ? (
                    <span className="text-blue-500 italic">
                      {typingUsers.map(u => u.username).join(', ')} is typing...
                    </span>
                  ) : (
                    <>
                      {getOtherParticipant(selectedConversation).status === "online" ? "Online" : "Last seen "}{" "}
                      {formatDate(getOtherParticipant(selectedConversation).last_seen_at)}
                    </>
                  )}
                </p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {messagesError && <div className="text-red-600 text-center p-4">{messagesError}</div>}

            {hasMoreMessages && (
              <button
                onClick={loadMoreMessages}
                className="w-full p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                disabled={messagesLoading}
              >
                {messagesLoading ? "Loading..." : "Load More"}
              </button>
            )}

            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender.id === currentUser?.id ? "justify-end" : ""}`}
                >
                  {message.sender.id !== currentUser?.id && (
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Avatar user={message.sender} size={40} showStatus status={message.sender.status} />
                    </div>
                  )}
                  <div className={`flex-1 ${message.sender.id === currentUser?.id ? "text-right" : ""}`}>
                    <div
                      className={`${message.sender.id === currentUser?.id
                          ? "bg-blue-500 text-white rounded-2xl rounded-tr-none ml-auto"
                          : "bg-gray-100 rounded-2xl rounded-tl-none"
                        } p-3 max-w-md inline-block`}
                    >
                      {message.reply_to && (
                        <div className="text-sm opacity-75 mb-2 border-l-2 pl-2">
                          {"Replying to: "} {message.reply_to}
                        </div>
                      )}
                      <p>{message.content}</p>
                      {message.is_edited && <span className="text-xs opacity-75">{t('chat.edited')}</span>}
                      {message.reactions?.reactions && message.reactions.reactions.length > 0 && (
                        <div className="mt-1 text-sm">{message.reactions?.reactions?.join(" ") || ""}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(message.created_at)}</div>
                  </div>
                  {message.sender.id === currentUser?.id && (
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Avatar user={message.sender} size={40} showStatus status={message.sender.status} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={handleInputChange}
                  onBlur={() => sendTypingStatus(false)}
                  placeholder={t('chat.messagePlaceholder')}
                  className="flex-1 bg-transparent border-none focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 rounded-full hover:bg-gray-200">
                    <PaperclipIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button type="button" className="p-2 rounded-full hover:bg-gray-200">
                    <ImageIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button type="button" className="p-2 rounded-full hover:bg-gray-200">
                    <Smile className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!messageInput.trim()}
              >
                <MessageCircle className="h-5 w-5" />
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">{t('chat.selectToStart')}</div>
      )}
    </div>
  )

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <div className={`w-80 border-r bg-white flex flex-col h-full ${isMobile && selectedConversation ? "hidden" : "flex"
          }`}>
          <div className="flex flex-col h-full overflow-hidden">
            {renderConversationList()}
            {renderContactsList()}
          </div>
        </div>
        {renderChatArea()}
      </div>

      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={currentUser} />
    </>
  )
}

