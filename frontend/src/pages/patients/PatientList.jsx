import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import api from "../../api/axios";


function PatientList() {

    const [patients, setPatients] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const fetchPatients = async () => {

        setLoading(true);

        setError("");

        try {

            const response =
                await api.get(
                    "/hospital/patients/"
                );

            setPatients(
                response.data
            );

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load patients."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchPatients();

    }, []);


    const handleDelete = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this patient?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await api.delete(
                `/hospital/patients/${id}/`
            );


            setPatients(
                patients.filter(
                    patient =>
                        patient.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete patient."
            );

        }
    };


    const filteredPatients =
        patients.filter(
            patient => {

                const name =
                    patient.user_name ||
                    "";

                const email =
                    patient.user_email ||
                    "";

                const phone =
                    patient.phone ||
                    "";

                const bloodGroup =
                    patient.blood_group ||
                    "";


                const searchText =
                    search
                        .toLowerCase();


                return (

                    name
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    email
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    phone
                        .toLowerCase()
                        .includes(
                            searchText
                        ) ||

                    bloodGroup
                        .toLowerCase()
                        .includes(
                            searchText
                        )

                );

            }
        );


    if (loading) {

        return (
            <div className="page-container">

                <div className="loading">
                    Loading patients...
                </div>

            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Patients
                    </h1>

                    <p>
                        Manage hospital
                        patients.
                    </p>

                </div>


                <Link
                    to="/patients/add"
                    className="primary-button"
                >
                    + Add Patient
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
                        className="search-input"
                        placeholder="Search patients..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />


                    <span className="result-count">

                        {filteredPatients.length}

                        {" "}

                        patient(s)

                    </span>

                </div>


                {filteredPatients.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            🧑‍⚕️
                        </div>

                        <h3>
                            No patients found
                        </h3>

                        <p>
                            Add a patient
                            to get started.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        Patient
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Gender
                                    </th>

                                    <th>
                                        Date of Birth
                                    </th>

                                    <th>
                                        Blood Group
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredPatients.map(
                                    patient => (

                                        <tr
                                            key={
                                                patient.id
                                            }
                                        >

                                            <td>

                                                <div className="doctor-name">

                                                    <div className="doctor-avatar">

                                                        {(
                                                            patient.user_name ||
                                                            "P"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>

                                                    <strong>

                                                        {
                                                            patient.user_name ||
                                                            "Patient"
                                                        }

                                                    </strong>

                                                </div>

                                            </td>


                                            <td>
                                                {
                                                    patient.user_email
                                                }
                                            </td>


                                            <td>
                                                {
                                                    patient.gender ||
                                                    "-"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    patient.date_of_birth ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <span className="blood-group">

                                                    {
                                                        patient.blood_group ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            <td>
                                                {
                                                    patient.phone ||
                                                    "-"
                                                }
                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <Link
                                                        to={`/patients/${patient.id}`}
                                                        className="action-view"
                                                    >
                                                        View
                                                    </Link>


                                                    <Link
                                                        to={`/patients/${patient.id}/edit`}
                                                        className="action-edit"
                                                    >
                                                        Edit
                                                    </Link>


                                                    <button
                                                        className="action-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                patient.id
                                                            )
                                                        }
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


export default PatientList;