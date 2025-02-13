import axios, { type AxiosInstance } from "axios"; //importanto o axios

//passando a url da api
const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8080"
});

export default api;