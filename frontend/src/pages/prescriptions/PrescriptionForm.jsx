import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function PrescriptionForm() {

    const navigate = useNavigate();


    const [appointments, setAppointments] =
        useState([]);

    const [medicines, setMedicines] =
        useState([]);


    const [appointment, setAppointment] =
        useState("");

    const [diagnosis, setDiagnosis] =
        useState("");

    const [notes, setNotes] =
        useState("");


    const [selectedMedicines, setSelectedMedicines] =
        useState([
            {
                medicine: "",
                dosage: "",
                duration: "",
            }
        ]);


    const [loading, setLoading] =
        useState(false);

    const [loadingData, setLoadingData] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        loadData();

    }, []);


    const loadData = async () => {

        setLoadingData(true);

        setError("");


        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const headers = {
                Authorization:
                    `Bearer ${token}`,
            };


            const [
                appointmentsResponse,
                medicinesResponse
            ] = await Promise.all([

                fetch(
                    "http://127.0.0.1:8000/api/hospital/appointments/",
                    {
                        headers,
                    }
                ),

                fetch(
                    "http://127.0.0.1:8000/api/hospital/medicines/",
                    {
                        headers,
                    }
                ),

            ]);


            if (
                appointmentsResponse.status === 401 ||
                medicinesResponse.status === 401
            ) {

                throw new Error(
                    "Your session has expired. Please login again."
                );

            }


            if (!appointmentsResponse.ok) {

                throw new Error(
                    "Unable to load appointments."
                );

            }


            if (!medicinesResponse.ok) {

                throw new Error(
                    "Unable to load medicines."
                );

            }


            const appointmentsData =
                await appointmentsResponse.json();

            const medicinesData =
                await medicinesResponse.json();


            setAppointments(
                Array.isArray(appointmentsData)
                    ? appointmentsData
                    : appointmentsData.results || []
            );


            setMedicines(
                Array.isArray(medicinesData)
                    ? medicinesData
                    : medicinesData.results || []
            );


        } catch (err) {

            setError(
                err.message ||
                "Unable to load data."
            );

        } finally {

            setLoadingData(false);

        }

    };


    // =========================================
    // MEDICINE ROW
    // =========================================

    const addMedicine = () => {

        setSelectedMedicines([
            ...selectedMedicines,
            {
                medicine: "",
                dosage: "",
                duration: "",
            }
        ]);

    };


    const removeMedicine = (index) => {

        if (selectedMedicines.length === 1) {
            return;
        }


        setSelectedMedicines(
            selectedMedicines.filter(
                (_, i) => i !== index
            )
        );

    };


    const updateMedicine = (
        index,
        field,
        value
    ) => {

        const updated =
            [...selectedMedicines];


        updated[index][field] =
            value;


        setSelectedMedicines(
            updated
        );

    };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!appointment) {

            setError(
                "Please select an appointment."
            );

            return;

        }


        if (!diagnosis.trim()) {

            setError(
                "Please enter diagnosis."
            );

            return;

        }


        // Validate medicines

        for (
            let i = 0;
            i < selectedMedicines.length;
            i++
        ) {

            const item =
                selectedMedicines[i];


            if (!item.medicine) {

                setError(
                    `Please select medicine for row ${i + 1}.`
                );

                return;

            }


            if (!item.dosage.trim()) {

                setError(
                    `Please enter dosage for medicine ${i + 1}.`
                );

                return;

            }


            if (!item.duration.trim()) {

                setError(
                    `Please enter duration for medicine ${i + 1}.`
                );

                return;

            }

        }


        setLoading(true);


        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const headers = {

                "Content-Type":
                    "application/json",

                Authorization:
                    `Bearer ${token}`,

            };


            // =================================
            // CREATE PRESCRIPTION
            // =================================

            const prescriptionResponse =
                await fetch(
                    "http://127.0.0.1:8000/api/hospital/prescriptions/",
                    {
                        method: "POST",

                        headers,

                        body: JSON.stringify({

                            appointment:
                                Number(appointment),

                            diagnosis:
                                diagnosis.trim(),

                            notes:
                                notes.trim(),

                        }),

                    }
                );


            const prescriptionData =
                await prescriptionResponse.json();


            if (
                prescriptionResponse.status === 401
            ) {

                throw new Error(
                    "Your session has expired. Please login again."
                );

            }


            if (!prescriptionResponse.ok) {

                throw new Error(
                    prescriptionData.detail ||
                    "Unable to create prescription."
                );

            }


            const prescriptionId =
                prescriptionData.id;


            // =================================
            // CREATE MEDICINES
            // =================================

            for (
                const item of selectedMedicines
            ) {

                const medicineResponse =
                    await fetch(
                        "http://127.0.0.1:8000/api/hospital/prescription-medicines/",
                        {
                            method: "POST",

                            headers,

                            body: JSON.stringify({

                                prescription:
                                    prescriptionId,

                                medicine:
                                    Number(
                                        item.medicine
                                    ),

                                dosage:
                                    item.dosage.trim(),

                                duration:
                                    item.duration.trim(),

                            }),

                        }
                    );


                const medicineData =
                    await medicineResponse.json();


                if (
                    !medicineResponse.ok
                ) {

                    throw new Error(
                        medicineData.detail ||
                        "Unable to add medicine."
                    );

                }

            }


            navigate(
                `/prescriptions/${prescriptionId}`
            );


        } catch (err) {

            setError(
                err.message ||
                "Unable to create prescription."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loadingData) {

        return (

            <div className="loading">
                Loading appointments and medicines...
            </div>

        );

    }


    return (

        <div className="page-container">

            {/* HEADER */}

            <div className="page-header">

                <div>

                    <h1>
                        Add Prescription
                    </h1>

                    <p>
                        Create prescription with medicines
                    </p>

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="error-box">
                    {error}
                </div>

            )}


            {/* FORM */}

            <div className="form-card">

                <form
                    onSubmit={handleSubmit}
                >

                    {/* APPOINTMENT */}

                    <div className="form-group">

                        <label>
                            Appointment
                        </label>


                        <select
                            value={appointment}
                            onChange={(e) =>
                                setAppointment(
                                    e.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select appointment
                            </option>


                            {appointments.map(
                                (item) => (

                                    <option
                                        key={item.id}
                                        value={item.id}
                                    >
                                        Appointment #
                                        {item.id}

                                        {" - "}

                                        {
                                            item.appointment_date
                                                ? new Date(
                                                    item.appointment_date
                                                ).toLocaleString()
                                                : ""
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* DIAGNOSIS */}

                    <div className="form-group">

                        <label>
                            Diagnosis
                        </label>


                        <textarea
                            rows="4"
                            value={diagnosis}
                            onChange={(e) =>
                                setDiagnosis(
                                    e.target.value
                                )
                            }
                            placeholder="Enter diagnosis"
                            required
                        />

                    </div>


                    {/* NOTES */}

                    <div className="form-group">

                        <label>
                            Notes
                        </label>


                        <textarea
                            rows="4"
                            value={notes}
                            onChange={(e) =>
                                setNotes(
                                    e.target.value
                                )
                            }
                            placeholder="Enter notes"
                        />

                    </div>


                    {/* MEDICINES */}

                    <div className="prescription-medicines">

                        <div
                            className="prescription-medicine-header"
                        >

                            <h3>
                                Medicines
                            </h3>


                            <button
                                type="button"
                                className="primary-button"
                                onClick={
                                    addMedicine
                                }
                            >
                                + Add Medicine
                            </button>

                        </div>


                        {selectedMedicines.map(
                            (item, index) => (

                                <div
                                    className="prescription-medicine-form"
                                    key={index}
                                >

                                    <div className="form-group">

                                        <label>
                                            Medicine
                                        </label>


                                        <select
                                            value={
                                                item.medicine
                                            }
                                            onChange={
                                                (e) =>
                                                    updateMedicine(
                                                        index,
                                                        "medicine",
                                                        e.target.value
                                                    )
                                            }
                                        >

                                            <option value="">
                                                Select medicine
                                            </option>


                                            {medicines.map(
                                                (medicine) => (

                                                    <option
                                                        key={
                                                            medicine.id
                                                        }
                                                        value={
                                                            medicine.id
                                                        }
                                                    >
                                                        {
                                                            medicine.name
                                                        }

                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Dosage
                                        </label>


                                        <input
                                            type="text"
                                            value={
                                                item.dosage
                                            }
                                            onChange={
                                                (e) =>
                                                    updateMedicine(
                                                        index,
                                                        "dosage",
                                                        e.target.value
                                                    )
                                            }
                                            placeholder="e.g. 500mg"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Duration
                                        </label>


                                        <input
                                            type="text"
                                            value={
                                                item.duration
                                            }
                                            onChange={
                                                (e) =>
                                                    updateMedicine(
                                                        index,
                                                        "duration",
                                                        e.target.value
                                                    )
                                            }
                                            placeholder="e.g. 5 days"
                                        />

                                    </div>


                                    {selectedMedicines.length >
                                        1 && (

                                        <button
                                            type="button"
                                            className="medicine-remove-button"
                                            onClick={() =>
                                                removeMedicine(
                                                    index
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    )}

                                </div>

                            )
                        )}

                    </div>


                    {/* BUTTONS */}

                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/prescriptions"
                                )
                            }
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Save Prescription"
                            }
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}


export default PrescriptionForm;