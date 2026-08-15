import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../api/axios";


function PatientForm() {

    const navigate =
        useNavigate();

    const { id } =
        useParams();

    const isEdit =
        Boolean(id);


    const [users, setUsers] =
        useState([]);


    const [form, setForm] =
        useState({

            user: "",

            date_of_birth: "",

            gender: "",

            blood_group: "",

            phone: "",

            address: "",

            emergency_contact: "",

            emergency_phone: "",

        });


    const [loading, setLoading] =
        useState(false);

    const [pageLoading, setPageLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadData = async () => {

        setPageLoading(true);

        setError("");


        try {

            const usersResponse =
                await api.get(
                    "/accounts/patient-users/"
                );


            setUsers(
                usersResponse.data
            );


            if (isEdit) {

                const response =
                    await api.get(
                        `/hospital/patients/${id}/`
                    );


                const patient =
                    response.data;


                setForm({

                    user:
                        patient.user ||
                        "",

                    date_of_birth:
                        patient.date_of_birth ||
                        "",

                    gender:
                        patient.gender ||
                        "",

                    blood_group:
                        patient.blood_group ||
                        "",

                    phone:
                        patient.phone ||
                        "",

                    address:
                        patient.address ||
                        "",

                    emergency_contact:
                        patient.emergency_contact ||
                        "",

                    emergency_phone:
                        patient.emergency_phone ||
                        "",

                });

            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load patient information."
            );

        } finally {

            setPageLoading(false);

        }
    };


    useEffect(() => {

        loadData();

    }, [id]);


    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm({
            ...form,

            [name]: value,

        });
    };


    const handleSubmit = async (
        e
    ) => {

        e.preventDefault();

        setLoading(true);

        setError("");


        try {

            const data = {

                user:
                    Number(form.user),

                date_of_birth:
                    form.date_of_birth ||
                    null,

                gender:
                    form.gender,

                blood_group:
                    form.blood_group,

                phone:
                    form.phone,

                address:
                    form.address,

                emergency_contact:
                    form.emergency_contact,

                emergency_phone:
                    form.emergency_phone,

            };


            if (isEdit) {

                await api.put(
                    `/hospital/patients/${id}/`,
                    data
                );

            } else {

                await api.post(
                    "/hospital/patients/",
                    data
                );

            }


            navigate(
                "/patients"
            );

        } catch (error) {

            console.error(error);


            const responseData =
                error.response?.data;


            if (responseData) {

                setError(
                    JSON.stringify(
                        responseData
                    )
                );

            } else {

                setError(
                    "Unable to save patient."
                );

            }

        } finally {

            setLoading(false);

        }
    };


    if (pageLoading) {

        return (
            <div className="page-container">

                <div className="loading">
                    Loading...
                </div>

            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>

                        {isEdit
                            ? "Edit Patient"
                            : "Add Patient"}

                    </h1>


                    <p>

                        {isEdit
                            ? "Update patient information."
                            : "Create a patient profile."}

                    </p>

                </div>

            </div>


            {error && (

                <div className="error-box">

                    {error}

                </div>

            )}


            <div className="form-card">

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="form-grid">


                        <div className="form-group">

                            <label>
                                Patient User
                            </label>


                            <select
                                name="user"
                                value={
                                    form.user
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            >

                                <option value="">
                                    Select patient user
                                </option>


                                {users.map(
                                    user => (

                                        <option
                                            key={
                                                user.id
                                            }
                                            value={
                                                user.id
                                            }
                                        >

                                            {
                                                user.first_name
                                            }

                                            {" "}

                                            {
                                                user.last_name
                                            }

                                            {" - "}

                                            {
                                                user.username
                                            }

                                        </option>

                                    )
                                )}

                            </select>


                            <small>
                                Select a registered
                                user whose role is
                                patient.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Date of Birth
                            </label>


                            <input
                                type="date"
                                name="date_of_birth"
                                value={
                                    form.date_of_birth
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Gender
                            </label>


                            <select
                                name="gender"
                                value={
                                    form.gender
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="">
                                    Select gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Blood Group
                            </label>


                            <select
                                name="blood_group"
                                value={
                                    form.blood_group
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="">
                                    Select blood group
                                </option>

                                <option value="A+">
                                    A+
                                </option>

                                <option value="A-">
                                    A-
                                </option>

                                <option value="B+">
                                    B+
                                </option>

                                <option value="B-">
                                    B-
                                </option>

                                <option value="AB+">
                                    AB+
                                </option>

                                <option value="AB-">
                                    AB-
                                </option>

                                <option value="O+">
                                    O+
                                </option>

                                <option value="O-">
                                    O-
                                </option>

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Phone
                            </label>


                            <input
                                type="text"
                                name="phone"
                                placeholder="01700000000"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Emergency Contact
                            </label>


                            <input
                                type="text"
                                name="emergency_contact"
                                placeholder="Emergency contact name"
                                value={
                                    form.emergency_contact
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Emergency Phone
                            </label>


                            <input
                                type="text"
                                name="emergency_phone"
                                placeholder="01800000000"
                                value={
                                    form.emergency_phone
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Address
                            </label>


                            <textarea
                                name="address"
                                rows="4"
                                placeholder="Patient address"
                                value={
                                    form.address
                                }
                                onChange={
                                    handleChange
                                }
                            />

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/patients"
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

                                : isEdit

                                    ? "Update Patient"

                                    : "Create Patient"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default PatientForm;