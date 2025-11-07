import apiClient from "../apiClient";

// get luggage requests for a ride
export const getLuggageRequestsForRide = async (rideId: string) => {
    const response = await apiClient.get(`/rides/${rideId}/requests/`);
    return response.data;
};