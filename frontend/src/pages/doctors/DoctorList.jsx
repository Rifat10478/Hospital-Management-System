import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../../api/axios";


function DoctorList() {

    const [doctors, setDoctors] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    const fetchDoctors = async () => {

        setLoading(true);
        setError("");

        try {

            const response = await api.get(
                "/hospital/doctors/"
            );

            setDoctors(
                response.data
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load doctors."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchDoctors();

    }, []);


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this doctor?"
            );

        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/hospital/doctors/${id}/`
            );

            setDoctors(
                doctors.filter(
                    doctor =>
                        doctor.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete doctor."
            );

        }
    };


    const handleAvailability = async (
        id
    ) => {

        try {

            const response =
                await api.patch(
                    `/hospital/doctors/${id}/availability/`
                );


            setDoctors(
                doctors.map(
                    doctor => {

                        if (
                            doctor.id === id
                        ) {

                            return {
                                ...doctor,
                                is_available:
                                    response.data
                                        .is_available
                            };

                        }

                        return doctor;
                    }
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to update availability."
            );

        }
    };


    const filteredDoctors =
        doctors.filter(
            doctor => {

                const name =
                    doctor.user_name ||
                    "";

                const specialization =
                    doctor.specialization ||
                    "";

                const department =
                    doctor.department_name ||
                    "";


                const searchText =
                    search.toLowerCase();


                return (
                    name
                        .toLowerCase()
                        .includes(searchText) ||

                    specialization
                        .toLowerCase()
                        .includes(searchText) ||

                    department
                        .toLowerCase()
                        .includes(searchText)
                );
            }
        );


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading">
                    Loading doctors...
                </div>

            </div>
        );
    }


    return (
        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Doctors
                    </h1>

                    <p>
                        Manage hospital doctors
                        and their availability.
                    </p>

                </div>


                <Link
                    to="/doctors/add"
                    className="primary-button"
                >
                    + Add Doctor
                </Link>

            </div>


            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}


            <div className="table-card">

                <div className="table-toolbar">

                    <input
                        type="text"
                        placeholder="Search doctors..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        className="search-input"
                    />

                    <span className="result-count">
                        {filteredDoctors.length}
                        {" "}
                        doctor(s)
                    </span>

                </div>


                {filteredDoctors.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            👨‍⚕️
                        </div>

                        <h3>
                            No doctors found
                        </h3>

                        <p>
                            Add a doctor to
                            get started.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        Doctor
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Specialization
                                    </th>

                                    <th>
                                        Experience
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Availability
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredDoctors.map(
                                    doctor => (

                                        <tr
                                            key={
                                                doctor.id
                                            }
                                        >

                                            <td>

                                                <div className="doctor-name">

                                                    <div className="doctor-avatar">
                                                        {(
                                                            doctor.user_name ||
                                                            "D"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <strong>
                                                        {doctor.user_name ||
                                                            "Doctor"}
                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                {doctor.department_name ||
                                                    "Not assigned"}
                                            </td>


                                            <td>
                                                {doctor.specialization}
                                            </td>


                                            <td>
                                                {
                                                    doctor.experience
                                                }{" "}
                                                years
                                            </td>


                                            <td>
                                                {doctor.phone}
                                            </td>


                                            <td>

                                                <button
                                                    className={
                                                        doctor.is_available
                                                            ? "status-button available"
                                                            : "status-button unavailable"
                                                    }
                                                    onClick={() =>
                                                        handleAvailability(
                                                            doctor.id
                                                        )
                                                    }
                                                >

                                                    <span>
                                                        ●
                                                    </span>

                                                    {doctor.is_available
                                                        ? "Available"
                                                        : "Unavailable"}

                                                </button>

                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <Link
                                                        to={`/doctors/${doctor.id}`}
                                                        className="action-view"
                                                    >
                                                        View
                                                    </Link>

                                                    <Link
                                                        to={`/doctors/${doctor.id}/edit`}
                                                        className="action-edit"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                doctor.id
                                                            )
                                                        }
                                                        className="action-delete"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}


export default DoctorList;