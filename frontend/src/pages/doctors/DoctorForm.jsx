import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../api/axios";


function DoctorForm() {

    const navigate = useNavigate();

    const { id } = useParams();

    const isEdit =
        Boolean(id);


    const [users, setUsers] =
        useState([]);

    const [departments, setDepartments] =
        useState([]);


    const [form, setForm] = useState({
        user: "",
        department: "",
        specialization: "",
        phone: "",
        experience: "",
        is_available: true,
    });


    const [loading, setLoading] =
        useState(false);

    const [pageLoading, setPageLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const loadData = async () => {

        setPageLoading(true);

        try {

            const [
                usersResponse,
                departmentsResponse
            ] = await Promise.all([

                api.get(
                    "/accounts/doctor-users/"
                ),

                api.get(
                    "/hospital/departments/"
                ),

            ]);


            setUsers(
                usersResponse.data
            );

            setDepartments(
                departmentsResponse.data
            );


            if (isEdit) {

                const doctorResponse =
                    await api.get(
                        `/hospital/doctors/${id}/`
                    );


                const doctor =
                    doctorResponse.data;


                setForm({
                    user:
                        doctor.user || "",

                    department:
                        doctor.department || "",

                    specialization:
                        doctor.specialization || "",

                    phone:
                        doctor.phone || "",

                    experience:
                        doctor.experience ?? "",

                    is_available:
                        doctor.is_available,
                });

            }

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load doctor information."
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
            value,
            type,
            checked
        } = e.target;


        setForm({
            ...form,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            const data = {
                user: Number(form.user),

                department:
                    form.department
                        ? Number(
                            form.department
                        )
                        : null,

                specialization:
                    form.specialization,

                phone:
                    form.phone,

                experience:
                    Number(
                        form.experience
                    ),

                is_available:
                    form.is_available,
            };


            if (isEdit) {

                await api.put(
                    `/hospital/doctors/${id}/`,
                    data
                );

            } else {

                await api.post(
                    "/hospital/doctors/",
                    data
                );

            }


            navigate("/doctors");

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
                    "Unable to save doctor."
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
                            ? "Edit Doctor"
                            : "Add Doctor"}
                    </h1>

                    <p>
                        {isEdit
                            ? "Update doctor information."
                            : "Create a doctor profile."}
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
                    onSubmit={handleSubmit}
                >

                    <div className="form-grid">


                        <div className="form-group">

                            <label>
                                Doctor User
                            </label>

                            <select
                                name="user"
                                value={form.user}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select doctor user
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

                                            {user.first_name}
                                            {" "}
                                            {user.last_name}
                                            {" - "}
                                            {user.username}

                                        </option>

                                    )
                                )}

                            </select>

                            <small>
                                Select a registered
                                user whose role is
                                doctor.
                            </small>

                        </div>


                        <div className="form-group">

                            <label>
                                Department
                            </label>

                            <select
                                name="department"
                                value={
                                    form.department
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="">
                                    Select department
                                </option>

                                {departments.map(
                                    department => (

                                        <option
                                            key={
                                                department.id
                                            }
                                            value={
                                                department.id
                                            }
                                        >
                                            {
                                                department.name
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div className="form-group">

                            <label>
                                Specialization
                            </label>

                            <input
                                type="text"
                                name="specialization"
                                placeholder="e.g. Cardiologist"
                                value={
                                    form.specialization
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

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
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Experience
                            </label>

                            <input
                                type="number"
                                name="experience"
                                min="0"
                                placeholder="Years"
                                value={
                                    form.experience
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </div>


                        <div className="form-group checkbox-group">

                            <label>

                                <input
                                    type="checkbox"
                                    name="is_available"
                                    checked={
                                        form.is_available
                                    }
                                    onChange={
                                        handleChange
                                    }
                                />

                                Doctor is available

                            </label>

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() =>
                                navigate(
                                    "/doctors"
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
                                    ? "Update Doctor"
                                    : "Create Doctor"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default DoctorForm;