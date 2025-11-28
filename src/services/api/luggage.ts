import apiClient from "../apiClient";

// get luggage request 
export const getLuggageRequests = async (pageUrl?: string) => {
    if (pageUrl) {
        // Extract path and query from full URL
        // Find the path after the domain (e.g., /luggage-requests/?page=2)
        // BaseURL is http://13.233.74.72:8000, so we need to extract everything after that
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
    const response = await apiClient.get(`/luggage-requests/?ordering=-created_on`);
    return response.data;
};

// get luggage request by ID
export const getLuggageRequestById = async (requestId: string) => {
    // const response = await apiClient.get(`/luggage-requests/${requestId}`);
    const response = await apiClient.get(`/luggage-requests/get_by_id/?id=${requestId}`);
    return response.data;
};

// update luggage request
export const updateLuggageRequest = async (requestId: string, data: any) => {
    const response = await apiClient.patch(`/luggage-requests/${requestId}/`, data);
    return response.data;
};

// get luggage requests for a ride
export const getLuggageRequestsForRide = async (rideId: string) => {
    const response = await apiClient.get(`/rides/${rideId}/requests/`);
    return response.data;
};

// create a luggage request
export const createLuggageRequest = async (data: FormData) => {
    const response = await apiClient.post('/luggage-requests/', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// cancel a luggage request
export const cancelLuggageRequest = async (requestId: string) => {
    const response = await apiClient.delete(`/luggage-requests/${requestId}/`);
    return response.data;
};

// respond to a luggage request
export const respondToLuggageRequest = async (requestId: string, data: any) => {
    const response = await apiClient.post(`/luggage-requests/${requestId}/respond/`, data);
    return response.data;
};


// update luggage request weight
export const updateLuggageRequestWeight = async (requestId: string, data: any) => {
    const response = await apiClient.patch(`/luggage/${requestId}/update-weight/`, data);
    return response.data;
};

// get approved luggage requests for a ride
export const getApprovedLuggageRequestsForRide = async (rideId: string) => {
    const response = await apiClient.get(`/rides/${rideId}/approved_requests/`);
    return response.data;
};