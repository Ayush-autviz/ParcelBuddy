import apiClient from "../apiClient";

//  get chat messages list
export const getChatMessagesList = async () => {
    const response = await apiClient.get('/api/chat-rooms/');
    return response.data;
};