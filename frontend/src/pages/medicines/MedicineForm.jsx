import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";


function MedicineForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit = Boolean(id);


    const [formData, setFormData] = useState({

        name: "",

        description: "",

        unit: "",

    });


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        if (isEdit) {

            loadMedicine();

        }

    }, [id]);


    const loadMedicine = async () => {

        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response = await fetch(
                `https://hospital-management-system-zjkw.onrender.com/api/hospital/medicines/${id}/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load medicine."
                );
            }


            const data =
                await response.json();


            setFormData({

                name: data.name || "",

                description:
                    data.description || "",

                unit: data.unit || "",

            });

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load medicine."
            );
        }
    };


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value,

        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setLoading(true);


        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response = await fetch(

                isEdit
                    ? `https://hospital-management-system-zjkw.onrender.com/api/hospital/medicines/${id}/`
                    : "https://hospital-management-system-zjkw.onrender.com/api/hospital/medicines/",

                {

                    method:
                        isEdit
                            ? "PUT"
                            : "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,

                    },

                    body:
                        JSON.stringify(
                            formData
                        ),

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to save medicine."
                );
            }


            navigate("/medicines");

        } catch (error) {

            console.error(error);

            setError(
                error.message ||
                "Unable to save medicine."
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
                            ? "Edit Medicine"
                            : "Add Medicine"}
                    </h1>

                    <p>
                        {isEdit
                            ? "Update medicine information"
                            : "Add a new medicine"}
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

                    <div className="form-grid">


                        <div className="form-group">

                            <label>
                                Medicine Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter medicine name"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Unit
                            </label>

                            <input
                                type="text"
                                name="unit"
                                value={
                                    formData.unit
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. tablet, bottle, capsule"
                                required
                            />

                        </div>


                        <div
                            className="form-group"
                            style={{
                                gridColumn:
                                    "1 / -1"
                            }}
                        >

                            <label>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter medicine description"
                                rows="5"
                            />

                        </div>


                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/medicines"
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
                                ? "Update Medicine"
                                : "Save Medicine"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default MedicineForm;
