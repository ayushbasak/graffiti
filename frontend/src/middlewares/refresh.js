import axios from 'axios';
import { API_BASE_URL } from '../api';

function refresh_token() {
    return new Promise((resolve, reject) => {
        // Read from cookie
        const match = document.cookie.match(new RegExp('(^| )refresh_token=([^;]+)'));
        const token = match ? match[2] : '';

        if (!token) {
            reject("No refresh token cookie found");
            return;
        }

        axios.get(`${API_BASE_URL}/auth/refresh`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export default refresh_token;