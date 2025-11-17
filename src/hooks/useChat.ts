import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getChatMessagesList } from '../services/api/chat';

export interface ChatListResponse {
  count: number;
  total_unread: number;
  results: ChatRoom[];
}

export interface ChatRoom {
  id: string;
  other_user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    profile?: {
      profile_photo?: string;
    };
  };
  last_message?: {
    content?: string;
    created_at?: string;
  };
  unread_count?: number;
  ride?: {
    origin_name?: string;
    destination_name?: string;
  };
  [key: string]: any;
}

export const useChatList = (): UseQueryResult<ChatListResponse, Error> => {
  return useQuery({
    queryKey: ['chatList'],
    queryFn: async () => {
      const response = await getChatMessagesList();
      return response;
    },
    staleTime: 30000, // Cache for 30 seconds
    retry: 1,
  });
};

