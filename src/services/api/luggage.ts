import apiClient from "../apiClient";

// get luggage request 
export const getLuggageRequests = async () => {
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