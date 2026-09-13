import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function MedicineList() {

    const [medicines, setMedicines] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const loadMedicines = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("access_token");


            const response = await fetch(
                "https://hospital-management-system-zjkw.onrender.com/api/hospital/medicines/",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );


            if (!response.ok) {

                throw new Error(
                    "Unable to load medicines."
                );
            }


            const data =
                await response.json();


            setMedicines(data);

        } catch (error) {

            console.error(error);

            setError(
                "Unable to load medicines."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadMedicines();

    }, []);


    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this medicine?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const token =
                localStorage.getItem("access_token");


            const response = await fetch(
                `https://hospital-management-system-zjkw.onrender.com/api/hospital/medicines/${id}/`,
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


            setMedicines(
                medicines.filter(
                    (medicine) =>
                        medicine.id !== id
                )
            );

        } catch (error) {

            console.error(error);

            alert(
                "Unable to delete medicine."
            );
        }
    };


    if (loading) {

        return (
            <div className="loading">
                Loading medicines...
            </div>
        );
    }


    return (

        <div className="page-container">

            <div className="page-header">

                <div>

                    <h1>
                        Medicines
                    </h1>

                    <p>
                        Manage hospital medicines
                    </p>

                </div>


                <Link
                    to="/medicines/add"
                    className="primary-button"
                >
                    + Add Medicine
                </Link>

            </div>


            {error && (

                <div className="error-box">
                    {error}
                </div>

            )}


            <div className="table-card">

                <div className="table-toolbar">

                    <strong>
                        Medicine List
                    </strong>

                    <span className="result-count">
                        {medicines.length} medicines
                    </span>

                </div>


                {medicines.length === 0 ? (

                    <div className="empty-state">

                        <div>
                            💊
                        </div>

                        <h3>
                            No medicines found
                        </h3>

                        <p>
                            Add your first medicine.
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
                                        Medicine
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Unit
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {medicines.map(
                                    (medicine) => (

                                        <tr
                                            key={
                                                medicine.id
                                            }
                                        >

                                            <td>
                                                #{medicine.id}
                                            </td>

                                            <td>
                                                <strong>
                                                    {medicine.name}
                                                </strong>
                                            </td>

                                            <td>
                                                {medicine.description ||
                                                    "—"}
                                            </td>

                                            <td>
                                                {medicine.unit}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <Link
                                                        to={`/medicines/${medicine.id}`}
                                                        className="action-view"
                                                    >
                                                        View
                                                    </Link>


                                                    <Link
                                                        to={`/medicines/${medicine.id}/edit`}
                                                        className="action-edit"
                                                    >
                                                        Edit
                                                    </Link>


                                                    <button
                                                        className="action-delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                medicine.id
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


export default MedicineList;
