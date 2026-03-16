import axios from 'axios';

// The /api prefix is used for both local development (Vite proxy)
// and production (Nginx reverse proxy).
const API_BASE_URL = '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export default api;
export { API_BASE_URL };
