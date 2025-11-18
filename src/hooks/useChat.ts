import { useQuery, UseQueryResult, useMutation, UseMutationResult } from '@tanstack/react-query';
import { getChatMessagesList, createChatRoom } from '../services/api/chat';

export interface ChatListResponse {
  count: number;
  total_unread: number;
  results: ChatRoom[];
}

export interface ChatRoom {
  id: string;
  created_on?: string;
  is_active?: boolean;
  last_message?: string;
  last_message_at?: string | null;
  luggage_request_id?: string;
  other_user?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    date_of_birth?: string;
    user_type?: string;
    profile?: {
      id?: string;
      profile_photo?: string | null;
      bio?: string;
      average_rating?: number;
      address_line1?: string;
      address_line2?: string;
      city?: string;
      state?: string;
      country?: string;
      pin_code?: string;
      preferred_language?: string;
      user?: string;
      date_of_birth?: string;
      [key: string]: any;
    };
    [key: string]: any;
  };
  unread_count?: number;
  location_info?: {
    origin?: string;
    destination?: string;
    [key: string]: any;
  };
  ride?: {
    origin_name?: string;
    destination_name?: string;
    [key: string]: any;
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

// Hook to create or get a chat room
export const useCreateChatRoom = (): UseMutationResult<any, Error, { luggage_request_id: string }, unknown> => {
  return useMutation({
    mutationFn: ({ luggage_request_id }) => {
      return createChatRoom({ luggage_request_id });
    },
  });
};

