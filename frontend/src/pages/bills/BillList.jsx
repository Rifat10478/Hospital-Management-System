import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function BillList() {

    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchBills = async () => {

        setLoading(true);
        setError("");

        try {

            const token =
                localStorage.getItem("access_token");

            const response = await fetch(
                "https://hospital-management-system-zjkw.onrender.com/api/billing/bills/",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to load bills."
                );
            }

            const data =
                await response.json();

            setBills(data);

        } catch (error) {

            setError(
                error.message ||
                "Unable to load bills."
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchBills();

    }, []);


    const handleDelete = async (id) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this bill?"
            );

        if (!confirmDelete) {
            return;
        }


        try {

            const token =
                localStorage.getItem("access_token");

            const response = await fetch(
                `https://hospital-management-system-zjkw.onrender.com/api/billing/bills/${id}/`,
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
                    "Unable to delete bill."
                );
            }


            setBills(
                bills.filter(
                    (bill) => bill.id !== id
                )
            );

        } catch (error) {

            setError(
                error.message ||
                "Unable to delete bill."
            );
        }
    };


    if (loading) {

        return (
            <div className="appointment-loading">
                Loading bills...
            </div>
        );
    }


    return (

        <div className="appointment-page">

            <div className="appointment-header">

                <div>

                    <h1>
                        Billing
                    </h1>

                    <p>
                        Manage patient bills and payments
                    </p>

                </div>


                <Link
                    to="/bills/add"
                    className="appointment-add-button"
                >
                    + Create Bill
                </Link>

            </div>


            {error && (

                <div className="appointment-error">
                    {error}
                </div>

            )}


            <div className="appointment-table-container">

                <table className="appointment-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Patient
                            </th>

                            <th>
                                Description
                            </th>

                            <th>
                                Amount
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Date
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {bills.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="7"
                                    style={{
                                        textAlign: "center",
                                        padding: "50px"
                                    }}
                                >
                                    No bills found.
                                </td>

                            </tr>

                        ) : (

                            bills.map((bill) => (

                                <tr key={bill.id}>

                                    <td>
                                        #{bill.id}
                                    </td>

                                    <td>

                                        <strong>
                                            {bill.patient_name ||
                                                bill.patient_username}
                                        </strong>

                                    </td>

                                    <td>
                                        {bill.description}
                                    </td>

                                    <td>

                                        <strong>
                                            ৳ {bill.amount}
                                        </strong>

                                    </td>

                                    <td>

                                        <span
                                            className={`appointment-status ${bill.status}`}
                                        >
                                            {bill.status}
                                        </span>

                                    </td>

                                    <td>
                                        {new Date(
                                            bill.created_at
                                        ).toLocaleDateString()}
                                    </td>

                                    <td>

                                        <div className="appointment-actions">

                                            <Link
                                                to={`/bills/${bill.id}/edit`}
                                                className="appointment-edit"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="appointment-cancel"
                                                onClick={() =>
                                                    handleDelete(
                                                        bill.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}


export default BillList;
