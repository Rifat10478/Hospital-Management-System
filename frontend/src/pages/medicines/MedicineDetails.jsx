import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";


function MedicineDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [medicine, setMedicine] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadMedicine();

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


            setMedicine(data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load medicine."
            );

        } finally {

            setLoading(false);

        }
    };


    if (loading) {

        return (
            <div className="loading">
                Loading medicine...
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


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Medicine Details
                    </h1>

                    <p>
                        View medicine information
                    </p>

                </div>


                <div className="header-actions">

                    <Link
                        to={`/medicines/${id}/edit`}
                        className="primary-button"
                    >
                        Edit
                    </Link>


                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(
                                "/medicines"
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
                        💊
                    </div>

                    <div>

                        <h2>
                            {medicine.name}
                        </h2>

                        <p>
                            Medicine #{medicine.id}
                        </p>

                    </div>

                </div>


                <div className="details-grid">

                    <div className="detail-item">

                        <span>
                            Medicine Name
                        </span>

                        <strong>
                            {medicine.name}
                        </strong>

                    </div>


                    <div className="detail-item">

                        <span>
                            Unit
                        </span>

                        <strong>
                            {medicine.unit}
                        </strong>

                    </div>


                    <div
                        className="detail-item"
                        style={{
                            gridColumn:
                                "1 / -1"
                        }}
                    >

                        <span>
                            Description
                        </span>

                        <strong>
                            {medicine.description ||
                                "No description available"}
                        </strong>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default MedicineDetails;
