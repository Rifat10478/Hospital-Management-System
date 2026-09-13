import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


function AppointmentList() {

    const { user } = useAuth();

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // Filters
    const [doctor, setDoctor] =
        useState("");

    const [patient, setPatient] =
        useState("");

    const [date, setDate] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");


    const fetchAppointments = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            let url =
                "https://hospital-management-system-zjkw.onrender.com/api/hospital/appointments/";


            const params = new URLSearchParams();


            if (doctor) {
                params.append(
                    "doctor",
                    doctor
                );
            }


            if (patient) {
                params.append(
                    "patient",
                    patient
                );
            }


            if (date) {
                params.append(
                    "date",
                    date
                );
            }


            if (statusFilter) {
                params.append(
                    "status",
                    statusFilter
                );
            }


            const query =
                params.toString();


            if (query) {
                url += `?${query}`;
            }


            const response =
                await fetch(
                    url,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to load appointments."
                );
            }


            setAppointments(data);

        } catch (error) {

            console.error(
                "Appointment error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchAppointments();

    }, [
        doctor,
        patient,
        date,
        statusFilter
    ]);


    const cancelAppointment = async (
        id
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to cancel this appointment?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response =
                await fetch(
                    `https://hospital-management-system-zjkw.onrender.com/api/hospital/appointments/${id}/cancel/`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.detail ||
                    "Failed to cancel appointment."
                );
            }


            fetchAppointments();

        } catch (error) {

            alert(
                error.message
            );

        }
    };


    const getStatusClass = (
        appointmentStatus
    ) => {

        return `appointment-status ${appointmentStatus}`;

    };


    return (

        <div className="appointment-page">

            <div className="appointment-header">

                <div>

                    <h1>
                        Appointments
                    </h1>

                    <p>
                        Manage hospital appointments
                    </p>

                </div>


                <Link
                    to="/appointments/add"
                    className="appointment-add-button"
                >
                    + Book Appointment
                </Link>

            </div>


            {/* FILTERS */}

            <div className="appointment-filters">

                <div className="filter-group">

                    <label>
                        Doctor ID
                    </label>

                    <input
                        type="number"
                        placeholder="Doctor ID"
                        value={doctor}
                        onChange={(e) =>
                            setDoctor(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-group">

                    <label>
                        Patient ID
                    </label>

                    <input
                        type="number"
                        placeholder="Patient ID"
                        value={patient}
                        onChange={(e) =>
                            setPatient(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-group">

                    <label>
                        Date
                    </label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) =>
                            setDate(
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="filter-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="pending">
                            Pending
                        </option>

                        <option value="approved">
                            Approved
                        </option>

                        <option value="completed">
                            Completed
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>

                    </select>

                </div>


                <button
                    className="filter-reset"
                    onClick={() => {

                        setDoctor("");
                        setPatient("");
                        setDate("");
                        setStatusFilter("");

                    }}
                >
                    Reset
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="appointment-error">

                    {error}

                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="appointment-loading">

                    Loading appointments...

                </div>

            ) : appointments.length === 0 ? (

                <div className="appointment-empty">

                    <h3>
                        No appointments found
                    </h3>

                    <p>
                        There are no appointments matching your filters.
                    </p>

                </div>

            ) : (

                <div className="appointment-table-container">

                    <table className="appointment-table">

                        <thead>

                            <tr>

                                <th>
                                    Patient
                                </th>

                                <th>
                                    Doctor
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Date & Time
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {appointments.map(
                                (appointment) => (

                                    <tr
                                        key={
                                            appointment.id
                                        }
                                    >

                                        <td>

                                            <strong>
                                                {
                                                    appointment.patient_name
                                                }
                                            </strong>

                                        </td>


                                        <td>

                                            Dr.{" "}

                                            {
                                                appointment.doctor_name
                                            }

                                        </td>


                                        <td>

                                            {
                                                appointment.department_name ||
                                                "N/A"
                                            }

                                        </td>


                                        <td>

                                            {
                                                new Date(
                                                    appointment.appointment_date
                                                ).toLocaleString()
                                            }

                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    getStatusClass(
                                                        appointment.status
                                                    )
                                                }
                                            >
                                                {
                                                    appointment.status
                                                }
                                            </span>

                                        </td>


                                        <td>

                                            <div className="appointment-actions">

                                                <Link
                                                    to={`/appointments/${appointment.id}/edit`}
                                                    className="appointment-edit"
                                                >
                                                    Edit
                                                </Link>


                                                {appointment.status !==
                                                    "cancelled" && (

                                                    <button
                                                        className="appointment-cancel"
                                                        onClick={() =>
                                                            cancelAppointment(
                                                                appointment.id
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                )}

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
    );
}


export default AppointmentList;
