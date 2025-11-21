import apiClient from "../apiClient";

//  get chat messages list
export const getChatMessagesList = async () => {
    const response = await apiClient.get('/api/chat-rooms/');
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