import apiClient from "../apiClient";

// get places
export const getPlaces = async (query: string, is_domestic: boolean) => {
    const response = await apiClient.get(`/places-search/?query=${query}&is_domestic=${is_domestic}`);
    return response.data;
};