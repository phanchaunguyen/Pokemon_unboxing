import axios from 'axios';

// This pulls the localhost:8080 URL from the .env file we made earlier
const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosClient;