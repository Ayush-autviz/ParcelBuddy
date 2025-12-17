import apiClient from "../apiClient";

//  get chat messages list
export const getChatMessagesList = async (pageUrl?: string, searchQuery?: string) => {
    if (pageUrl) {
        // Extract the path and query from the full URL
        // pageUrl format: "http://13.233.74.72:8000/api/chat-rooms/?page=2"
        // We need to extract "/api/chat-rooms/?page=2"
        const urlMatch = pageUrl.match(/\/api\/[^?]*(\?.*)?$/);
        if (urlMatch) {
            const path = urlMatch[0];
            const response = await apiClient.get(path);
            return response.data;
        }
    }
    
    // Build query parameters - only add search if it's not empty
    const params = new URLSearchParams();
    if (searchQuery && searchQuery.trim()) {
        params.append('search', searchQuery.trim());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/api/chat-rooms/?${queryString}` : '/api/chat-rooms/';
    const response = await apiClient.get(url);
    return response.data;
};

// create chat room
export const createChatRoom = async (data: any) => {
    const response = await apiClient.post('/api/chat-rooms/get_or_create/', data);
    return response.data;
};

//  get conversation messages
export const getConversationMessages = async (conversation_id: string) => {
    const response = await apiClient.get(`/api/chat-rooms/${conversation_id}/messages/`);
    return response.data;
};

// mark message as read
export const markMessageAsRead = async (chat_id: string) => {
    const response = await apiClient.post(`/api/chat-rooms/${chat_id}/mark_read/`);
    return response.data;
};


export const unreadChatMessagesCount = async () => {
    const response = await apiClient.get(`/api/chat-rooms/unread_count/`);
    return response.data;
};