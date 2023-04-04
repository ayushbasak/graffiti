import axios from 'axios';
function refresh_token() {
    return new Promise((resolve, reject) => {
        axios.get('http://localhost:5000/auth/refresh', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
            }
        })
        .then((response) => {
            resolve(response.data);
        })
        .catch((error) => {
            reject(undefined);
        });
    });
}

export default refresh_token;