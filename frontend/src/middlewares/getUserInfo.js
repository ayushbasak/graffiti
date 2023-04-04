import axios from "axios";
// import { userStore } from "../store/store";
// async function getUserInfo(access_token) {
//     // const setUserId = userStore(state => state.setUserId);
//     console.log('Access Token: ', access_token);
//     await axios.get('http://localhost:5000/auth/userinfo', {
//         headers: {
//             'Authorization': `Bearer ${access_token}`
//         }
//     })
//     .then((response) => {
//         return response.data;
//     })
//     .catch((error) => {
//         return undefined;
//     });
// }

function getUserInfo(access_token) {
    return new Promise(async (resolve, reject) => {
        await axios.get('http://localhost:5000/auth/userinfo', {
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