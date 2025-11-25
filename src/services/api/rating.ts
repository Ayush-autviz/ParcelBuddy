import apiClient from "../apiClient";


export const getMyRating = async () => {
  const response = await apiClient.get(`/ride-ratings/`);
  return response.data;
};

export const getRatingGivenByMe = async () => {
  const response = await apiClient.get(`/ride-ratings/given/`);
  return response.data;
};

export const getRatingChart = async () => {
  const response = await apiClient.get(`/ride-ratings/charts/`);
  return response.data;
};

export const createRating = async (data: any) => {
  const response = await apiClient.post(`/ride-ratings/`, data);
  return response.data;
};