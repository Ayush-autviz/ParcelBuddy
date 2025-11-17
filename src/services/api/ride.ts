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

// search rides - using fetch with POST request
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
    // Get token from store
    const { useAuthStore } = await import('../store');
    const token = useAuthStore.getState().token?.access_token;
    
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
    
    const baseUrl = 'http://13.233.74.72:8000';
    const url = `${baseUrl}/ride/search/`;
    
    console.log('🔍 [SEARCH RIDES] Fetch URL:', url);
    console.log('🔍 [SEARCH RIDES] Request body:', JSON.stringify(requestBody, null, 2));
    console.log('🔍 [SEARCH RIDES] Token present:', !!token);
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('🔍 [SEARCH RIDES] Fetch error:', response.status, errorData);
        throw {
            response: {
                status: response.status,
                data: errorData,
            },
            message: `Request failed with status ${response.status}`,
        };
    }
    
    const data = await response.json();
    console.log('🔍 [SEARCH RIDES] Fetch success, data:', data);
    return data;
};
