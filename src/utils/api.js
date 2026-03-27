import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Simple in-memory cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (endpoint, method, body) => {
  return `${method}:${endpoint}:${body ? JSON.stringify(body) : ''}`;
};

const isCacheValid = (cacheEntry) => {
  if (!cacheEntry) return false;
  return Date.now() - cacheEntry.timestamp < CACHE_DURATION;
};

export const apiFetch = async (endpoint, options = {}) => {
  const { method = 'GET', body = null, headers = {}, useCache = true } = options;

  // Only cache GET requests
  if (useCache && method === 'GET') {
    const cacheKey = getCacheKey(endpoint, method, body);
    const cached = cache.get(cacheKey);
    
    if (isCacheValid(cached)) {
      return cached.data;
    }
  }

  // Create abort controller for timeout protection
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  // Check if body is FormData
  const isFormData = body instanceof FormData;
  
  const config = {
    method,
    url: `${API_URL}${endpoint}`,
    headers: {
      // Don't set Content-Type for FormData, let browser set it with boundary
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
    timeout: 8000, // 8 second timeout (reduced from 10s to fail faster)
    signal: controller.signal, // Abort signal for timeout
  };

  if (body) {
    config.data = body;
  }

  try {
    const response = await axios(config);
    clearTimeout(timeoutId); // Clear timeout on success
    const data = response.data;
    
    // Cache successful GET responses
    if (useCache && method === 'GET' && response.status === 200) {
      const cacheKey = getCacheKey(endpoint, method, body);
      cache.set(cacheKey, {
        data,
        timestamp: Date.now(),
      });
    }
    
    return data;
  } catch (error) {
    clearTimeout(timeoutId); // Clear timeout on error
    // Enhanced error handling
    if (error.name === 'AbortError' || error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      // Timeout error
      console.error('API Fetch Error: Request timeout');
      throw {
        message: 'Request timed out. Please try again.',
        isNetworkError: true,
        isTimeout: true,
      };
    }
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data || { message: 'Server error' };
      console.error(`API Fetch Error [${error.response.status}]:`, errorData);
      throw {
        ...errorData,
        status: error.response.status,
        isNetworkError: false,
      };
    } else if (error.request) {
      // Request made but no response
      console.error('API Fetch Error: No response from server', error.message);
      throw {
        message: 'Unable to connect to server. Please check your internet connection.',
        isNetworkError: true,
      };
    } else {
      // Error setting up request
      console.error('API Fetch Error:', error.message);
      throw {
        message: error.message || 'An unexpected error occurred',
        isNetworkError: false,
      };
    }
  }
};

// Clear cache function (useful for logout or after updates)
export const clearApiCache = () => {
  cache.clear();
};
