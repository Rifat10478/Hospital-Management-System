import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "patient",
        password: "",
        password2: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (formData.password !== formData.password2) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/accounts/register/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        first_name: formData.first_name,
                        last_name: formData.last_name,
                        role: formData.role,
                        password: formData.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.log("Registration error:", data);

                setError(
                    data.detail ||
                    data.message ||
                    JSON.stringify(data) ||
                    "Registration failed."
                );

                return;
            }

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error(error);

            setError(
                "Cannot connect to the Django server."
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
                    Create Account
                </h3>

                <p>
                    Register for the Hospital Management System
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* USERNAME */}

                    <div className="form-group">
                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            required
                        />
                    </div>


                    {/* EMAIL */}

                    <div className="form-group">
                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />
                    </div>


                    {/* FIRST NAME */}

                    <div className="form-group">
                        <label>
                            First Name
                        </label>

                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="Enter first name"
                        />
                    </div>


                    {/* LAST NAME */}

                    <div className="form-group">
                        <label>
                            Last Name
                        </label>

                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Enter last name"
                        />
                    </div>


                    {/* ROLE */}

                    <div className="form-group">

    <label>
        Register As
    </label>

    <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
    >

        <option value="patient">
            Patient
        </option>

        <option value="doctor">
            Doctor
        </option>


        <option value="doctors">
            Doctors
        </option>

        <option value="patients">
            Patients
        </option>

    </select>

</div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            required
                        />

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="password2"
                            value={formData.password2}
                            onChange={handleChange}
                            placeholder="Confirm password"
                            required
                        />

                    </div>


                    {/* BUTTON */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Register"
                        }

                    </button>

                </form>


                <p className="auth-footer">

                    Already have an account?{" "}

                    <Link to="/login">
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}

export default Register;