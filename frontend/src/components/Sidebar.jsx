import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


function Sidebar({
    isOpen,
    onClose
}) {

    const { user } = useAuth();

    const role = user?.role;


    const menuItems = {

        admin: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: "📊"
            },
            {
                name: "Doctors",
                path: "/doctors",
                icon: "👨‍⚕️"
            },
            {
                name: "Patients",
                path: "/patients",
                icon: "🧑‍🤝‍🧑"
            },
            {
                name: "Departments",
                path: "/departments",
                icon: "🏥"
            },
            {
                name: "Appointments",
                path: "/appointments",
                icon: "📅"
            },
            {
                name: "Prescriptions",
                path: "/prescriptions",
                icon: "📋"
            },
            {
                name: "Medicines",
                path: "/medicines",
                icon: "💊"
            },
            {
                name: "Billing",
                path: "/bills",
                icon: "💳"
            }
        ],


        receptionist: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: "📊"
            },
            {
                name: "Doctors",
                path: "/doctors",
                icon: "👨‍⚕️"
            },
            {
                name: "Patients",
                path: "/patients",
                icon: "🧑‍🤝‍🧑"
            },
            {
                name: "Appointments",
                path: "/appointments",
                icon: "📅"
            },
            {
                name: "Billing",
                path: "/bills",
                icon: "💳"
            }
        ],


        doctor: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: "📊"
            },
            {
                name: "My Appointments",
                path: "/appointments",
                icon: "📅"
            },
            {
                name: "My Patients",
                path: "/patients",
                icon: "🧑‍🤝‍🧑"
            },
            {
                name: "Prescriptions",
                path: "/prescriptions",
                icon: "📋"
            },
            {
                name: "Medicines",
                path: "/medicines",
                icon: "💊"
            }
        ],


        patient: [
            {
                name: "Dashboard",
                path: "/dashboard",
                icon: "📊"
            },
            {
                name: "My Appointments",
                path: "/appointments",
                icon: "📅"
            },
            {
                name: "Book Appointment",
                path: "/appointments/book",
                icon: "➕"
            },
            {
                name: "My Prescriptions",
                path: "/prescriptions",
                icon: "📋"
            },
            {
                name: "My Bills",
                path: "/bills",
                icon: "💳"
            }
        ]
    };


    const currentMenu =
        menuItems[role] || [];


    return (
        <>

            <div
                className={`sidebar-overlay ${
                    isOpen ? "show" : ""
                }`}
                onClick={onClose}
            />


            <aside
                className={`sidebar ${
                    isOpen ? "open" : ""
                }`}
            >

                <div className="sidebar-header">

                    <div className="sidebar-brand-icon">
                        +
                    </div>

                    <div>

                        <h3>
                            MediCare
                        </h3>

                        <span>
                            Hospital System
                        </span>

                    </div>


                    <button
                        className="sidebar-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <div className="sidebar-section">

                    <p className="sidebar-title">
                        MAIN MENU
                    </p>


                    <nav>

                        {currentMenu.map(
                            (item) => (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `sidebar-link ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >

                                    <span className="sidebar-icon">
                                        {item.icon}
                                    </span>

                                    <span>
                                        {item.name}
                                    </span>

                                </NavLink>

                            )
                        )}

                    </nav>

                </div>


                <div className="sidebar-footer">

                    <div className="sidebar-role">

                        <span className="role-icon">
                            👤
                        </span>

                        <div>

                            <small>
                                Logged in as
                            </small>

                            <strong>
                                {role}
                            </strong>

                        </div>

                    </div>

                </div>

            </aside>

        </>
    );
}


export default Sidebar;