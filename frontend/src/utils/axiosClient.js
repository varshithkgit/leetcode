import axios from "axios"

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    withCredentials: true, //by making true we are allowing browser to attach token for every user req to server
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;