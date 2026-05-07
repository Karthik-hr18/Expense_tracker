import axios from "axios";

const api = axios.create({
    baseURL: "https://expense-tracker-j7wu.onrender.com/api",
});

// Automatically attach the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// If a 401 is returned, clear the token and redirect to login
// But skip redirect for auth routes (login/register)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || "";
        const isAuthRoute = url.includes("/login") || url.includes("/register");

        if (error.response && error.response.status === 401 && !isAuthRoute) {
            localStorage.removeItem("token");
            window.location.href = "/UserLogin";
        }
        return Promise.reject(error);
    }
);

export default api;
