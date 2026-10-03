import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function PrescriptionList() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPrescriptions = async () => {
        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("access_token");

            const response = await fetch(
                "https://hospital-management-system-zjkw.onrender.com/api/hospital/prescriptions/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                    "Unable to load prescriptions."
                );
            }

            const data = await response.json();

            setPrescriptions(
                Array.isArray(data)
                    ? data
                    : data.results || []
            );

        } catch (err) {
            setError(
                err.message ||
                "Unable to load prescriptions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    return (
        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">

                <div>
                    <h1>
                        Prescriptions
                    </h1>

                    <p>
                        Manage patient prescriptions
                    </p>
                </div>

                <Link
                    to="/prescriptions/add"
                    className="primary-button"
                >
                    + Add Prescription
                </Link>

            </div>


            {/* ERROR */}

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}


            {/* LOADING */}

            {loading ? (

                <div className="loading">
                    Loading prescriptions...
                </div>

            ) : prescriptions.length === 0 ? (

                <div className="empty-state">

                    <div>
                        📋
                    </div>

                    <h3>
                        No prescriptions found
                    </h3>

                    <p>
                        No prescriptions have been created yet.
                    </p>

                </div>

            ) : (

                <div className="table-card">

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Appointment
                                    </th>

                                    <th>
                                        Diagnosis
                                    </th>

                                    <th>
                                        Notes
                                    </th>

                                    <th>
                                        Medicines
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {prescriptions.map(
                                    (prescription) => (

                                        <tr
                                            key={
                                                prescription.id
                                            }
                                        >

                                            <td>
                                                #
                                                {
                                                    prescription.id
                                                }
                                            </td>


                                            <td>
                                                #
                                                {
                                                    prescription.appointment
                                                }
                                            </td>


                                            <td>
                                                {
                                                    prescription.diagnosis
                                                }
                                            </td>


                                            <td>
                                                {
                                                    prescription.notes ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    prescription
                                                        .medicines
                                                        ?.length || 0
                                                }
                                            </td>


                                            <td>

                                                {
                                                    prescription.created_at
                                                        ? new Date(
                                                            prescription.created_at
                                                        ).toLocaleDateString()
                                                        : "-"
                                                }

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-buttons">

                                                    <Link
                                                        to={`/prescriptions/${prescription.id}`}
                                                        className="action-view"
                                                    >
                                                        View
                                                    </Link>


                                                    <Link
                                                        to={`/prescriptions/${prescription.id}/edit`}
                                                        className="action-edit"
                                                    >
                                                        Edit
                                                    </Link>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
}

export default PrescriptionList;
