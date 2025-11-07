import apiClient from "../apiClient";

// create ride
export const createRide = async (data: any) => {
    const response = await apiClient.post('/rides/', data);
    return response.data;
};

// get ride
export const getAllRides = async () => {
    const response = await apiClient.get(`/rides/`);
    return response.data;
};

// get ride by id
export const getPublishedRideById = async (id: string) => {
    const response = await apiClient.get(`/rides/${id}/`);
    return response.data;
};

// get my rides
export const getPublishedRides = async () => {
    const response = await apiClient.get(`/rides/my_rides/`);
    return response.data;
};

// update ride
export const updateRide = async (id: string, data: any) => {
    const response = await apiClient.put(`/rides/${id}/`, data);
    return response.data;
};

// delete ride
export const deleteRide = async (id: string) => {
    const response = await apiClient.delete(`/rides/${id}/`);
    return response.data;
};

// ride search history
export const getRideSearchHistory = async () => {
    const response = await apiClient.get(`/ride-search-history/`);
    return response.data;
};
