import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../api/axios";


function DoctorDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [doctor, setDoctor] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const fetchDoctor = async () => {

            try {

                const response =
                    await api.get(
                        `/hospital/doctors/${id}/`
                    );

                setDoctor(
                    response.data
                );

            } catch (error) {

                console.error(error);

                setError(
                    "Unable to load doctor."
                );

            } finally {

                setLoading(false);

            }
        };


        fetchDoctor();

    }, [id]);


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading">
                    Loading doctor...
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


    if (!doctor) {

        return (
            <div className="page-container">

                Doctor not found.

            </div>
        );
    }


    return (
        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Doctor Details
                    </h1>

                    <p>
                        View doctor profile
                        information.
                    </p>

                </div>


                <div className="header-actions">

                    <Link
                        to={`/doctors/${id}/edit`}
                        className="primary-button"
                    >
                        Edit Doctor
                    </Link>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/doctors"
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
                            doctor.user_name ||
                            "D"
                        )
                            .charAt(0)
                            .toUpperCase()}
                    </div>


                    <div>

                        <h2>
                            Dr.{" "}
                            {doctor.user_name ||
                                "Doctor"}
                        </h2>

                        <p>
                            {
                                doctor.specialization
                            }
                        </p>


                        <span
                            className={
                                doctor.is_available
                                    ? "profile-status available"
                                    : "profile-status unavailable"
                            }
                        >

                            ●{" "}

                            {doctor.is_available
                                ? "Available"
                                : "Unavailable"}

                        </span>

                    </div>

                </div>


                <div className="details-grid">

                    <div className="detail-item">

                        <span>
                            Department
                        </span>

                        <strong>
                            {doctor.department_name ||
                                "Not assigned"}
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Specialization
                        </span>

                        <strong>
                            {
                                doctor.specialization
                            }
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Experience
                        </span>

                        <strong>
                            {
                                doctor.experience
                            }{" "}
                            years
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Phone
                        </span>

                        <strong>
                            {doctor.phone}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default DoctorDetails;