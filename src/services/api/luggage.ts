import apiClient from "../apiClient";

// get luggage request 
export const getLuggageRequests = async () => {
    const response = await apiClient.get(`/luggage-requests/?ordering=-created_on`);
    return response.data;
};

// get luggage request by ID
export const getLuggageRequestById = async (requestId: string) => {
    const response = await apiClient.get(`/luggage-requests/${requestId}`);
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