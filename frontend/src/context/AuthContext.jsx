import {
    createContext,
    useContext,
    useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "https://hospital-management-system-zjkw.onrender.com/api";

export function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            localStorage.removeItem("user");
            return null;
        }
    });

    const [loading, setLoading] = useState(false);


    // =========================================
    // LOGOUT
    // =========================================

    const logout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        setUser(null);
    };


    // =========================================
    // LOGIN
    // =========================================

    const login = async (username, password) => {

        setLoading(true);

        try {

            const response = await fetch(
                `${API_URL}/accounts/login/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        username,
                        password,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Login failed"
                );
            }


            // Save JWT tokens
            localStorage.setItem(
                "access_token",
                data.access
            );

            localStorage.setItem(
                "refresh_token",
                data.refresh
            );


            // =========================================
            // GET USER PROFILE
            // =========================================

            const profileResponse =
                await fetch(
                    `${API_URL}/accounts/profile/`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${data.access}`,
                        },
                    }
                );


            if (!profileResponse.ok) {

                logout();

                throw new Error(
                    "Unable to load user profile."
                );
            }


            const profile =
                await profileResponse.json();


            console.log(
                "Logged in user:",
                profile
            );


            localStorage.setItem(
                "user",
                JSON.stringify(profile)
            );

            setUser(profile);


            return profile;

        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            throw error;

        } finally {

            setLoading(false);

        }
    };


    // =========================================
    // AUTH FETCH
    // Automatically refresh expired token
    // =========================================

    const authFetch = async (
        url,
        options = {}
    ) => {

        let accessToken =
            localStorage.getItem(
                "access_token"
            );

        if (!accessToken) {

            logout();

            throw new Error(
                "No access token."
            );
        }


        const requestOptions = {
            ...options,

            headers: {
                ...(options.headers || {}),

                Authorization:
                    `Bearer ${accessToken}`,

                "Content-Type":
                    "application/json",
            },
        };


        let response =
            await fetch(
                url,
                requestOptions
            );


        // =========================================
        // TOKEN EXPIRED
        // =========================================

        if (response.status === 401) {

            const refreshToken =
                localStorage.getItem(
                    "refresh_token"
                );


            if (!refreshToken) {

                logout();

                throw new Error(
                    "Session expired. Please login again."
                );
            }


            // Try refresh
            const refreshResponse =
                await fetch(
                    `${API_URL}/accounts/token/refresh/`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            refresh:
                                refreshToken,
                        }),
                    }
                );


            if (!refreshResponse.ok) {

                logout();

                throw new Error(
                    "Session expired. Please login again."
                );
            }


            const refreshData =
                await refreshResponse.json();


            accessToken =
                refreshData.access;


            localStorage.setItem(
                "access_token",
                accessToken
            );


            // Retry original request
            response =
                await fetch(
                    url,
                    {
                        ...options,

                        headers: {
                            ...(options.headers || {}),

                            Authorization:
                                `Bearer ${accessToken}`,

                            "Content-Type":
                                "application/json",
                        },
                    }
                );
        }


        return response;
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                logout,
                authFetch,
            }}
        >

            {children}

        </AuthContext.Provider>
    );
}


export function useAuth() {

    return useContext(
        AuthContext
    );
}
