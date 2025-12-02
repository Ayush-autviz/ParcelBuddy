import apiClient from "../apiClient";


export const getMyRating = async (pageUrl?: string) => {
  if (pageUrl) {
    try {
      const baseUrl = 'https://api.parcelbuddys.com';
      if (pageUrl.startsWith(baseUrl)) {
        const pathWithQuery = pageUrl.substring(baseUrl.length);
        const response = await apiClient.get(pathWithQuery);
        return response.data;
      } else if (pageUrl.startsWith('/')) {
        const response = await apiClient.get(pageUrl);
        return response.data;
      } else {
        const urlMatch = pageUrl.match(/\/[^?]*(\?.*)?$/);
        if (urlMatch) {
          const pathWithQuery = urlMatch[0];
          const response = await apiClient.get(pathWithQuery);
          return response.data;
        }
        const response = await apiClient.get(pageUrl);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching paginated my ratings:', error);
      throw error;
    }
  }
  const response = await apiClient.get(`/ride-ratings/`);
  return response.data;
};

export const getRatingGivenByMe = async (pageUrl?: string) => {
  if (pageUrl) {
    try {
      const baseUrl = 'https://api.parcelbuddys.com';
      if (pageUrl.startsWith(baseUrl)) {
        const pathWithQuery = pageUrl.substring(baseUrl.length);
        const response = await apiClient.get(pathWithQuery);
        return response.data;
      } else if (pageUrl.startsWith('/')) {
        const response = await apiClient.get(pageUrl);
        return response.data;
      } else {
        const urlMatch = pageUrl.match(/\/[^?]*(\?.*)?$/);
        if (urlMatch) {
          const pathWithQuery = urlMatch[0];
          const response = await apiClient.get(pathWithQuery);
          return response.data;
        }
        const response = await apiClient.get(pageUrl);
        return response.data;
      }
    } catch (error) {
      console.error('Error fetching paginated ratings given by me:', error);
      throw error;
    }
  }
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