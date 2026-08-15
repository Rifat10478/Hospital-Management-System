import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


function AppointmentForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const { user } = useAuth();


    const isEdit =
        Boolean(id);


    const [doctors, setDoctors] =
        useState([]);

    const [patients, setPatients] =
        useState([]);


    const [doctor, setDoctor] =
        useState("");

    const [patient, setPatient] =
        useState("");

    const [appointmentDate, setAppointmentDate] =
        useState("");

    const [status, setStatus] =
        useState("pending");


    const [loading, setLoading] =
        useState(false);

    const [pageLoading, setPageLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const token =
        localStorage.getItem(
            "access_token"
        );


    // =========================
    // LOAD DOCTORS
    // =========================

    const fetchDoctors = async () => {

        const response =
            await fetch(
                "http://127.0.0.1:8000/api/hospital/doctors/",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            setDoctors(data);

        } else {

            console.error(
                "Doctors error:",
                data
            );

        }
    };


    // =========================
    // LOAD PATIENTS
    // =========================

    const fetchPatients = async () => {

        const response =
            await fetch(
                "http://127.0.0.1:8000/api/hospital/patients/",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            setPatients(data);

        } else {

            console.error(
                "Patients error:",
                data
            );

        }
    };


    // =========================
    // LOAD APPOINTMENT
    // =========================

    const fetchAppointment = async () => {

        if (!id) {

            setPageLoading(false);

            return;
        }


        try {

            const response =
                await fetch(
                    `http://127.0.0.1:8000/api/hospital/appointments/${id}/`,
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
                    "Failed to load appointment."
                );
            }


            setDoctor(
                String(data.doctor)
            );

            setPatient(
                String(data.patient)
            );

            setAppointmentDate(
                data.appointment_date
                    ? data.appointment_date.slice(
                        0,
                        16
                    )
                    : ""
            );

            setStatus(
                data.status
            );

        } catch (error) {

            setError(
                error.message
            );

        } finally {

            setPageLoading(false);

        }
    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        const loadData =
            async () => {

                try {

                    await Promise.all([
                        fetchDoctors(),
                        fetchPatients(),
                    ]);

                    await fetchAppointment();

                } catch (error) {

                    setError(
                        error.message
                    );

                    setPageLoading(false);

                }

            };


        loadData();

    }, [id]);


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            const url = isEdit

                ? `http://127.0.0.1:8000/api/hospital/appointments/${id}/`

                : "http://127.0.0.1:8000/api/hospital/appointments/";


            const method =
                isEdit
                    ? "PATCH"
                    : "POST";


            const body = {

                doctor: Number(
                    doctor
                ),

                patient: Number(
                    patient
                ),

                appointment_date:
                    appointmentDate,

                status,

            };


            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {

                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,

                        },

                        body:
                            JSON.stringify(
                                body
                            ),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                console.error(
                    "Appointment API error:",
                    data
                );

                throw new Error(
                    JSON.stringify(data)
                );
            }


            navigate(
                "/appointments"
            );

        } catch (error) {

            console.error(
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }
    };


    if (pageLoading) {

        return (

            <div className="appointment-loading">

                Loading...

            </div>

        );

    }


    return (

        <div className="appointment-form-page">

            <div className="appointment-form-header">

                <div>

                    <h1>

                        {isEdit
                            ? "Edit Appointment"
                            : "Book Appointment"
                        }

                    </h1>

                    <p>

                        {isEdit
                            ? "Update appointment information"
                            : "Create a new hospital appointment"
                        }

                    </p>

                </div>

            </div>


            {error && (

                <div className="appointment-error">

                    {error}

                </div>

            )}


            <form
                className="appointment-form"
                onSubmit={handleSubmit}
            >

                {/* DOCTOR */}

                <div className="form-group">

                    <label>
                        Doctor
                    </label>

                    <select
                        value={doctor}
                        onChange={(e) =>
                            setDoctor(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select Doctor
                        </option>


                        {doctors.map(
                            (item) => (

                                <option
                                    key={
                                        item.id
                                    }
                                    value={
                                        item.id
                                    }
                                >

                                    Dr.{" "}

                                    {
                                        item.user_name ||
                                        item.username ||
                                        `Doctor #${item.id}`
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* PATIENT */}

                <div className="form-group">

                    <label>
                        Patient
                    </label>

                    <select
                        value={patient}
                        onChange={(e) =>
                            setPatient(
                                e.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select Patient
                        </option>


                        {patients.map(
                            (item) => (

                                <option
                                    key={
                                        item.id
                                    }
                                    value={
                                        item.id
                                    }
                                >

                                    {
                                        item.user_name ||
                                        item.username ||
                                        `Patient #${item.id}`
                                    }

                                </option>

                            )
                        )}

                    </select>

                </div>


                {/* DATE & TIME */}

                <div className="form-group">

                    <label>
                        Appointment Date & Time
                    </label>

                    <input
                        type="datetime-local"
                        value={
                            appointmentDate
                        }
                        onChange={(e) =>
                            setAppointmentDate(
                                e.target.value
                            )
                        }
                        required
                    />

                </div>


                {/* STATUS */}

                <div className="form-group">

                    <label>
                        Status
                    </label>

                    <select
                        value={status}
                        onChange={(e) =>
                            setStatus(
                                e.target.value
                            )
                        }
                    >

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


                {/* BUTTONS */}

                <div className="appointment-form-actions">

                    <button
                        type="button"
                        className="appointment-back"
                        onClick={() =>
                            navigate(
                                "/appointments"
                            )
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="appointment-save"
                        disabled={loading}
                    >

                        {loading
                            ? "Saving..."
                            : isEdit
                                ? "Update Appointment"
                                : "Book Appointment"
                        }

                    </button>

                </div>

            </form>

        </div>

    );
}


export default AppointmentForm;