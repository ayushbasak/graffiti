import axios from "axios";
import { API_BASE_URL } from "../api";

function getUserInfo(access_token) {
    return new Promise(async (resolve, reject) => {
        await axios.get(`${API_BASE_URL}/auth/userinfo`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
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
export default getUserInfo;