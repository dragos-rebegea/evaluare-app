import axios from "axios";

const api = axios.create({
    baseURL: "https://api.evaluarebob.com",
});

export default api;
