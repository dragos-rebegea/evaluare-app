import axios from "axios";

const api = axios.create({
    baseURL: "http://104.248.247.124",
});

export default api;
