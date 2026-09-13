import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DepartmentList() {

    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    const fetchDepartments = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );

            const response = await fetch(
                "https://hospital-management-system-zjkw.onrender.com/api/hospital/departments/",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load departments."
                );

            }


            const data =
                await response.json();


            setDepartments(data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load departments."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchDepartments();

    }, []);


    const filteredDepartments =
        departments.filter(
            (department) => {

                const name =
                    department.name
                        ?.toLowerCase() || "";

                const description =
                    department.description
                        ?.toLowerCase() || "";

                const query =
                    search.toLowerCase();

                return (
                    name.includes(query) ||
                    description.includes(query)
                );

            }
        );


    const deleteDepartment = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this department?"
            );


        if (!confirmDelete) {
            return;
        }


        try {

            const token =
                localStorage.getItem(
                    "access_token"
                );


            const response = await fetch(
                `https://hospital-management-system-zjkw.onrender.com/api/hospital/departments/${id}/`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Delete failed"
                );

            }


            setDepartments(
                departments.filter(
                    (department) =>
                        department.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete department."
            );

        }
    };


    if (loading) {

        return (
            <div className="appointment-loading">
                Loading departments...
            </div>
        );

    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Departments
                    </h1>

                    <p>
                        Manage hospital departments
                    </p>

                </div>


                <Link
                    to="/departments/add"
                    className="primary-button"
                >
                    + Add Department
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
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <span className="result-count">
                        {filteredDepartments.length}
                        {" "}
                        department(s)
                    </span>

                </div>


                {filteredDepartments.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            🏥
                        </div>

                        <h3>
                            No Departments Found
                        </h3>

                        <p>
                            Add a department to get started.
                        </p>

                    </div>

                ) : (

                    <div className="table-wrapper">

                        <table className="data-table">

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Department
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredDepartments.map(
                                    (department) => (

                                        <tr
                                            key={
                                                department.id
                                            }
                                        >

                                            <td>
                                                #
                                                {department.id}
                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        department.name
                                                    }
                                                </strong>

                                            </td>

                                            <td>
                                                {
                                                    department.description ||
                                                    "No description"
                                                }
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <Link
                                                        to={`/departments/${department.id}/edit`}
                                                        className="action-edit"
                                                    >
                                                        Edit
                                                    </Link>

                                                    <button
                                                        className="action-delete"
                                                        onClick={() =>
                                                            deleteDepartment(
                                                                department.id
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

export default DepartmentList;
