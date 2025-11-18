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