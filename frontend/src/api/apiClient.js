import axios from "axios";

export function resolveApiBaseUrl() {
  if (typeof window === "undefined") {
    return "http://localhost:8080";
  }

  const host = window.location.hostname || "localhost";
  return `http://${host}:8080`;
}

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
});

export default api;
