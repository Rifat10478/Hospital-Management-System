import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Dashboard() {

    const { user } = useAuth();

    const [stats, setStats] = useState({
        doctors: 0,
        patients: 0,
        appointments: 0,
        bills: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getCount = (data) => {

        // Django REST Framework pagination
        if (data && typeof data.count === "number") {
            return data.count;
        }

        // Normal array response
        if (Array.isArray(data)) {
            return data.length;
        }

        return 0;
    };


    useEffect(() => {

        const loadDashboard = async () => {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("access_token");

            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }


            try {

                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };


                const [
                    doctorsResponse,
                    patientsResponse,
                    appointmentsResponse,
                    billsResponse,
                ] = await Promise.all([

                    fetch(
                        "http://127.0.0.1:8000/api/hospital/doctors/",
                        {
                            headers,
                        }
                    ),

                    fetch(
                        "http://127.0.0.1:8000/api/hospital/patients/",
                        {
                            headers,
                        }
                    ),

                    fetch(
                        "http://127.0.0.1:8000/api/hospital/appointments/",
                        {
                            headers,
                        }
                    ),

                    fetch(
                        "http://127.0.0.1:8000/api/billing/bills/",
                        {
                            headers,
                        }
                    ),

                ]);


                if (
                    doctorsResponse.status === 401 ||
                    patientsResponse.status === 401 ||
                    appointmentsResponse.status === 401 ||
                    billsResponse.status === 401
                ) {

                    throw new Error(
                        "Your login session has expired."
                    );
                }


                const doctors =
                    doctorsResponse.ok
                        ? await doctorsResponse.json()
                        : [];

                const patients =
                    patientsResponse.ok
                        ? await patientsResponse.json()
                        : [];

                const appointments =
                    appointmentsResponse.ok
                        ? await appointmentsResponse.json()
                        : [];

                const bills =
                    billsResponse.ok
                        ? await billsResponse.json()
                        : [];


                setStats({

                    doctors: getCount(doctors),

                    patients: getCount(patients),

                    appointments:
                        getCount(appointments),

                    bills:
                        getCount(bills),

                });


            } catch (err) {

                console.error(
                    "Dashboard error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load dashboard information."
                );

            } finally {

                setLoading(false);

            }
        };


        loadDashboard();

    }, []);


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Welcome back,{" "}
                        <strong>
                            {user?.first_name ||
                                user?.username ||
                                "User"}
                        </strong>
                    </p>

                </div>

            </div>


            {error && (

                <div className="error-box">
                    {error}
                </div>

            )}


            <div className="dashboard-cards">


                {/* DOCTORS */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        👨‍⚕️
                    </div>

                    <div>

                        <span>
                            Doctors
                        </span>

                        <h2>
                            {loading
                                ? "..."
                                : stats.doctors}
                        </h2>

                    </div>

                </div>


                {/* PATIENTS */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        🧑‍🤝‍🧑
                    </div>

                    <div>

                        <span>
                            Patients
                        </span>

                        <h2>
                            {loading
                                ? "..."
                                : stats.patients}
                        </h2>

                    </div>

                </div>


                {/* APPOINTMENTS */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        📅
                    </div>

                    <div>

                        <span>
                            Appointments
                        </span>

                        <h2>
                            {loading
                                ? "..."
                                : stats.appointments}
                        </h2>

                    </div>

                </div>


                {/* BILLS */}

                <div className="dashboard-card">

                    <div className="dashboard-card-icon">
                        💳
                    </div>

                    <div>

                        <span>
                            Bills
                        </span>

                        <h2>
                            {loading
                                ? "..."
                                : stats.bills}
                        </h2>

                    </div>

                </div>

            </div>


            <div className="welcome-panel">

                <div>

                    <h2>
                        Hospital Management System
                    </h2>

                    <p>
                        Manage doctors, patients,
                        appointments, prescriptions
                        and billing from one place.
                    </p>

                </div>

                <div className="welcome-icon">
                    🏥
                </div>

            </div>

        </div>

    );
}

export default Dashboard;