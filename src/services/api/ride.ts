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

// search rides
export const searchRides = async (params: {
    origin?: string;
    destination?: string;
    origin_lat?: number;
    origin_lng?: number;
    destination_lat?: number;
    destination_lng?: number;
    date_from?: string;
    max_price?: number;
    ordering?: string;
}) => {
    const queryParams = new URLSearchParams();
    
    if (params.origin) queryParams.append('origin', params.origin);
    if (params.destination) queryParams.append('destination', params.destination);
    if (params.origin_lat !== undefined) queryParams.append('origin_lat', params.origin_lat.toString());
    if (params.origin_lng !== undefined) queryParams.append('origin_lng', params.origin_lng.toString());
    if (params.destination_lat !== undefined) queryParams.append('destination_lat', params.destination_lat.toString());
    if (params.destination_lng !== undefined) queryParams.append('destination_lng', params.destination_lng.toString());
    if (params.date_from) queryParams.append('date_from', params.date_from);
    if (params.max_price !== undefined) queryParams.append('max_price', params.max_price.toString());
    if (params.ordering) queryParams.append('ordering', params.ordering);
    
    const response = await apiClient.get(`/rides?${queryParams.toString()}&type=month`);
    return response.data;
};
