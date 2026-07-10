import axios from "axios";

export const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure cookies are passed with the request
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request wasn't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Request token refresh
        await axios.post("/api/admin/refresh", {}, { withCredentials: true });
        
        // Refresh succeeded
        processQueue(null);
        isRefreshing = false;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (refresh token expired/invalid)
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // We can force a redirection or let the application catch it
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("admin-unauthorized"));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
