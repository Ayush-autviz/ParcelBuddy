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
export const getPublishedRides = async (pageUrl?: string) => {
    if (pageUrl) {
        // Extract path and query from full URL
        // Find the path after the domain (e.g., /rides/my_rides/?page=2)
        try {
            const baseUrl = 'http://13.233.74.72:8000';
            if (pageUrl.startsWith(baseUrl)) {
                const pathWithQuery = pageUrl.substring(baseUrl.length);
                const response = await apiClient.get(pathWithQuery);
                return response.data;
            } else if (pageUrl.startsWith('/')) {
                // Already a relative path
                const response = await apiClient.get(pageUrl);
                return response.data;
            } else {
                // Try to extract path from any URL format
                const urlMatch = pageUrl.match(/\/[^?]*(\?.*)?$/);
                if (urlMatch) {
                    const pathWithQuery = urlMatch[0];
                    const response = await apiClient.get(pathWithQuery);
                    return response.data;
                }
                // Fallback: try using it as a relative path
                const response = await apiClient.get(pageUrl);
                return response.data;
            }
        } catch (error) {
            console.error('Error parsing page URL:', error);
            throw error;
        }
    }
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

// search rides - POST request with JSON body
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
    // Prepare request body
    const requestBody: any = {
        type: 'month',
    };
    
    if (params.origin) requestBody.origin = params.origin;
    if (params.destination) requestBody.destination = params.destination;
    if (params.origin_lat !== undefined) requestBody.origin_lat = params.origin_lat;
    if (params.origin_lng !== undefined) requestBody.origin_lng = params.origin_lng;
    if (params.destination_lat !== undefined) requestBody.destination_lat = params.destination_lat;
    if (params.destination_lng !== undefined) requestBody.destination_lng = params.destination_lng;
    if (params.date_from) requestBody.date_from = params.date_from;
    if (params.max_price !== undefined) requestBody.max_price = params.max_price;
    if (params.ordering) requestBody.ordering = params.ordering;
    
    
    const response = await apiClient.post('/ride/search/', requestBody);
    return response.data;
};
