import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function PrescriptionEdit() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [appointment, setAppointment] =
        useState("");

    const [diagnosis, setDiagnosis] =
        useState("");

    const [notes, setNotes] =
        useState("");


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    useEffect(() => {

        fetchPrescription();

    }, [id]);


    const fetchPrescription = async () => {

        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response = await fetch(
                `http://127.0.0.1:8000/api/hospital/prescriptions/${id}/`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load prescription."
                );

            }


            const data =
                await response.json();


            setAppointment(
                data.appointment
            );

            setDiagnosis(
                data.diagnosis || ""
            );

            setNotes(
                data.notes || ""
            );


        } catch (err) {

            setError(
                err.message ||
                "Unable to load prescription."
            );

        } finally {

            setLoading(false);

        }

    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);
        setError("");


        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response = await fetch(
                `http://127.0.0.1:8000/api/hospital/prescriptions/${id}/`,
                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,

                    },

                    body: JSON.stringify({

                        appointment:
                            appointment,

                        diagnosis:
                            diagnosis,

                        notes:
                            notes,

                    }),

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Unable to update prescription."
                );

            }


            navigate(
                `/prescriptions/${id}`
            );


        } catch (err) {

            setError(
                err.message ||
                "Unable to update prescription."
            );

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="loading">
                Loading prescription...
            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Edit Prescription
                    </h1>

                    <p>
                        Update prescription #{id}
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
                            Appointment ID
                        </label>

                        <input
                            type="number"
                            value={appointment}
                            disabled
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Diagnosis
                        </label>

                        <textarea
                            rows="5"
                            value={diagnosis}
                            onChange={(e) =>
                                setDiagnosis(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Notes
                        </label>

                        <textarea
                            rows="5"
                            value={notes}
                            onChange={(e) =>
                                setNotes(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    `/prescriptions/${id}`
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Updating..."
                                : "Update Prescription"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default PrescriptionEdit;