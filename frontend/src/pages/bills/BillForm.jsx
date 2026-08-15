import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";


function BillForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit =
        Boolean(id);


    const [patients, setPatients] =
        useState([]);

    const [appointments, setAppointments] =
        useState([]);


    const [formData, setFormData] = useState({
        patient: "",
        appointment: "",
        description: "",
        amount: "",
        status: "unpaid",
    });


    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    const token =
        localStorage.getItem(
            "access_token"
        );


    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            setLoading(true);

            const headers = {
                Authorization:
                    `Bearer ${token}`,
            };


            const patientsResponse =
                await fetch(
                    "http://127.0.0.1:8000/api/hospital/patients/",
                    {
                        headers
                    }
                );


            if (!patientsResponse.ok) {

                throw new Error(
                    "Unable to load patients."
                );
            }


            const patientsData =
                await patientsResponse.json();


            setPatients(
                patientsData
            );


            const appointmentsResponse =
                await fetch(
                    "http://127.0.0.1:8000/api/hospital/appointments/",
                    {
                        headers
                    }
                );


            if (appointmentsResponse.ok) {

                const appointmentsData =
                    await appointmentsResponse.json();

                setAppointments(
                    appointmentsData
                );
            }


            if (isEdit) {

                const billResponse =
                    await fetch(
                        `http://127.0.0.1:8000/api/billing/bills/${id}/`,
                        {
                            headers
                        }
                    );


                if (!billResponse.ok) {

                    throw new Error(
                        "Unable to load bill."
                    );
                }


                const bill =
                    await billResponse.json();


                setFormData({
                    patient: bill.patient || "",
                    appointment:
                        bill.appointment || "",
                    description:
                        bill.description || "",
                    amount:
                        bill.amount || "",
                    status:
                        bill.status || "unpaid",
                });
            }

        } catch (error) {

            setError(
                error.message ||
                "Unable to load data."
            );

        } finally {

            setLoading(false);
        }
    };


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSaving(true);


        try {

            const response =
                await fetch(
                    isEdit
                        ? `http://127.0.0.1:8000/api/billing/bills/${id}/`
                        : "http://127.0.0.1:8000/api/billing/bills/",
                    {
                        method:
                            isEdit
                                ? "PUT"
                                : "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: JSON.stringify({
                            patient:
                                Number(
                                    formData.patient
                                ),

                            appointment:
                                formData.appointment
                                    ? Number(
                                        formData.appointment
                                    )
                                    : null,

                            description:
                                formData.description,

                            amount:
                                formData.amount,

                            status:
                                formData.status,
                        }),
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    JSON.stringify(data)
                );
            }


            navigate("/bills");

        } catch (error) {

            setError(
                error.message ||
                "Unable to save bill."
            );

        } finally {

            setSaving(false);
        }
    };


    if (loading) {

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
                            ? "Edit Bill"
                            : "Create Bill"}
                    </h1>

                    <p>
                        {isEdit
                            ? "Update billing information"
                            : "Create a new patient bill"}
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

                <div className="form-group">

                    <label>
                        Patient
                    </label>

                    <select
                        name="patient"
                        value={formData.patient}
                        onChange={handleChange}
                        required
                    >

                        <option value="">
                            Select Patient
                        </option>

                        {patients.map(
                            (patient) => (

                                <option
                                    key={patient.id}
                                    value={patient.id}
                                >
                                    {patient.user_name ||
                                        patient.user_email ||
                                        `Patient #${patient.id}`}
                                </option>

                            )
                        )}

                    </select>

                </div>


                <div className="form-group">

                    <label>
                        Appointment
                    </label>

                    <select
                        name="appointment"
                        value={formData.appointment}
                        onChange={handleChange}
                    >

                        <option value="">
                            No Appointment
                        </option>

                        {appointments.map(
                            (appointment) => (

                                <option
                                    key={appointment.id}
                                    value={appointment.id}
                                >
                                    Appointment #{appointment.id}
                                </option>

                            )
                        )}

                    </select>

                </div>


                <div className="form-group">

                    <label>
                        Description
                    </label>

                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Consultation, medicine, test..."
                        required
                    />

                </div>


                <div className="form-group">

                    <label>
                        Amount
                    </label>

                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        min="0"
                        step="0.01"
                        required
                    />

                </div>


                <div className="form-group">

                    <label>
                        Status
                    </label>

                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                    >

                        <option value="unpaid">
                            Unpaid
                        </option>

                        <option value="paid">
                            Paid
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>

                    </select>

                </div>


                <div className="appointment-form-actions">

                    <Link
                        to="/bills"
                        className="appointment-back"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="appointment-save"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : isEdit
                                ? "Update Bill"
                                : "Create Bill"}
                    </button>

                </div>

            </form>

        </div>
    );
}


export default BillForm;