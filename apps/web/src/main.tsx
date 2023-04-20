import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import axios from "axios";
import { BASE_API_URL } from "./utils/constants";

axios.defaults.baseURL = BASE_API_URL;
axios.defaults.withCredentials = true;

axios.interceptors.response.use(async function (response) {
  if (response.data.code !== 200) {
    return Promise.reject(response.data);
  }

  return response;
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
