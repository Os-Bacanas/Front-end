import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", //testando api
});

export default api;