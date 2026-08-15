import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            await login(
                username,
                password
            );

            navigate("/dashboard");

        } catch (error) {

            setError(
                "Invalid username or password."
            );

        } finally {

            setLoading(false);

        }
    };


    return (
        <div className="auth-container">

            <div className="auth-card">

                <h2>
                    Hospital Management System
                </h2>

                <h3>
                    Login
                </h3>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
}


export default Login;