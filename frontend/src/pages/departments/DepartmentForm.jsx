import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

function DepartmentForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);


    const [name, setName] =
        useState("");

    const [description, setDescription] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (isEdit) {
            fetchDepartment();
        }

    }, [id]);


    const fetchDepartment = async () => {

        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response = await fetch(
                `https://hospital-management-system-zjkw.onrender.com/api/hospital/departments/${id}/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load department."
                );

            }


            const data =
                await response.json();


            setName(
                data.name || ""
            );

            setDescription(
                data.description || ""
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load department."
            );

        }

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");


        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response = await fetch(
                isEdit
                    ? `https://hospital-management-system-zjkw.onrender.com/api/hospital/departments/${id}/`
                    : "https://hospital-management-system-zjkw.onrender.com/api/hospital/departments/",
                {
                    method: isEdit
                        ? "PUT"
                        : "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        name,
                        description,
                    }),
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(data);

                throw new Error(
                    "Unable to save department."
                );

            }


            navigate(
                "/departments"
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to save department."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        {isEdit
                            ? "Edit Department"
                            : "Add Department"
                        }
                    </h1>

                    <p>
                        {isEdit
                            ? "Update department information"
                            : "Create a new hospital department"
                        }
                    </p>

                </div>

            </div>


            {error && (

                <div className="error-box">
                    {error}
                </div>

            )}


            <div className="form-card">

                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>
                            Department Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. Cardiology"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Enter department description"
                            rows="5"
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/departments"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : isEdit
                                ? "Update Department"
                                : "Create Department"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default DepartmentForm;
