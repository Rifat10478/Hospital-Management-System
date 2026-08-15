import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function PrescriptionDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [prescription, setPrescription] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

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


            if (response.status === 401) {

                throw new Error(
                    "Your session has expired. Please login again."
                );

            }


            if (!response.ok) {

                throw new Error(
                    "Unable to load prescription."
                );

            }


            const data =
                await response.json();


            setPrescription(data);


        } catch (err) {

            setError(
                err.message ||
                "Unable to load prescription."
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="loading">
                Loading prescription...
            </div>
        );

    }


    if (error) {

        return (
            <div className="error-box">
                {error}
            </div>
        );

    }


    if (!prescription) {

        return (
            <div className="empty-state">
                Prescription not found.
            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Prescription #{prescription.id}
                    </h1>

                    <p>
                        Prescription details
                    </p>

                </div>


                <div className="header-actions">

                    <Link
                        to={`/prescriptions/${id}/edit`}
                        className="primary-button"
                    >
                        Edit
                    </Link>


                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/prescriptions"
                            )
                        }
                    >
                        Back
                    </button>

                </div>

            </div>


            <div className="doctor-profile-card">

                <div className="details-grid">

                    <div className="detail-item">

                        <span>
                            Prescription ID
                        </span>

                        <strong>
                            #{prescription.id}
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Appointment
                        </span>

                        <strong>
                            #{prescription.appointment}
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Diagnosis
                        </span>

                        <strong>
                            {prescription.diagnosis}
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Created
                        </span>

                        <strong>

                            {prescription.created_at
                                ? new Date(
                                    prescription.created_at
                                ).toLocaleString()
                                : "-"
                            }

                        </strong>

                    </div>

                </div>


                <div
                    style={{
                        marginTop: "25px"
                    }}
                >

                    <div className="detail-item">

                        <span>
                            Notes
                        </span>

                        <strong>
                            {
                                prescription.notes ||
                                "No notes"
                            }
                        </strong>

                    </div>

                </div>


                {/* MEDICINES */}

                <div
                    className="prescription-medicines"
                >

                    <h3>
                        Medicines
                    </h3>


                    {prescription.medicines &&
                    prescription.medicines.length > 0 ? (

                        prescription.medicines.map(
                            (medicine) => (

                                <div
                                    className="prescription-medicine-card"
                                    key={medicine.id}
                                >

                                    <strong>
                                        {
                                            medicine.medicine_name
                                        }
                                    </strong>

                                    <br />

                                    <span>
                                        Dosage:{" "}
                                        {
                                            medicine.dosage
                                        }
                                    </span>

                                    <br />

                                    <span>
                                        Duration:{" "}
                                        {
                                            medicine.duration
                                        }
                                    </span>

                                </div>

                            )
                        )

                    ) : (

                        <p>
                            No medicines added.
                        </p>

                    )}

                </div>

            </div>

        </div>

    );
}

export default PrescriptionDetails;