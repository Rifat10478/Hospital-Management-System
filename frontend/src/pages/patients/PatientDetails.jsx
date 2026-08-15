import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../api/axios";


function PatientDetails() {

    const { id } =
        useParams();

    const navigate =
        useNavigate();


    const [patient, setPatient] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const fetchPatient =
            async () => {

                try {

                    const response =
                        await api.get(
                            `/hospital/patients/${id}/`
                        );


                    setPatient(
                        response.data
                    );

                } catch (error) {

                    console.error(error);

                    setError(
                        "Unable to load patient."
                    );

                } finally {

                    setLoading(false);

                }

            };


        fetchPatient();

    }, [id]);


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading">
                    Loading patient...
                </div>

            </div>
        );

    }


    if (error) {

        return (
            <div className="page-container">

                <div className="error-box">
                    {error}
                </div>

            </div>
        );

    }


    if (!patient) {

        return (
            <div className="page-container">
                Patient not found.
            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Patient Details
                    </h1>

                    <p>
                        View patient
                        information.
                    </p>

                </div>


                <div className="header-actions">

                    <Link
                        to={`/patients/${id}/edit`}
                        className="primary-button"
                    >
                        Edit Patient
                    </Link>


                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/patients"
                            )
                        }
                    >
                        Back
                    </button>

                </div>

            </div>


            <div className="doctor-profile-card">

                <div className="profile-top">

                    <div className="large-doctor-avatar">

                        {(
                            patient.user_name ||
                            "P"
                        )
                            .charAt(0)
                            .toUpperCase()}

                    </div>


                    <div>

                        <h2>
                            {
                                patient.user_name ||
                                "Patient"
                            }
                        </h2>


                        <p>
                            {
                                patient.user_email ||
                                ""
                            }
                        </p>


                        <span className="profile-status available">

                            Patient

                        </span>

                    </div>

                </div>


                <div className="details-grid">

                    <div className="detail-item">

                        <span>
                            Date of Birth
                        </span>

                        <strong>
                            {
                                patient.date_of_birth ||
                                "-"
                            }
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Gender
                        </span>

                        <strong>
                            {
                                patient.gender ||
                                "-"
                            }
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Blood Group
                        </span>

                        <strong>
                            {
                                patient.blood_group ||
                                "-"
                            }
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {
                                patient.phone ||
                                "-"
                            }
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Emergency Contact
                        </span>

                        <strong>
                            {
                                patient.emergency_contact ||
                                "-"
                            }
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Emergency Phone
                        </span>

                        <strong>
                            {
                                patient.emergency_phone ||
                                "-"
                            }
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Address
                        </span>

                        <strong>
                            {
                                patient.address ||
                                "-"
                            }
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default PatientDetails;