import axios from "axios";


const api = axios.create({

    baseURL: "https://hospital-management-system-zjkw.onrender.com/api",

    headers: {
        "Content-Type": "application/json",
    },

});


// Attach access token only when it exists
api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "access_token"
            );


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


export default api;
