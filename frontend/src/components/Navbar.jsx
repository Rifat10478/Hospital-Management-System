import { useState } from "react";
import { useAuth } from "../context/AuthContext";


function Navbar({ onMenuClick }) {

    const { user, logout } = useAuth();

    const [showMenu, setShowMenu] = useState(false);


    const handleLogout = () => {

        logout();

        window.location.href = "/login";
    };


    return (
        <header className="navbar">

            <div className="navbar-left">

                <button
                    className="menu-button"
                    onClick={onMenuClick}
                >
                    ☰
                </button>

                <div className="navbar-logo">

                    <div className="hospital-logo">
                        +
                    </div>

                    <div>
                        <h2>
                            MediCare
                        </h2>

                        <span>
                            Hospital Management
                        </span>
                    </div>

                </div>

            </div>


            <div className="navbar-right">

                <div className="user-info">

                    <div className="user-avatar">
                        {user?.first_name
                            ?.charAt(0)
                            .toUpperCase() ||
                            user?.username
                                ?.charAt(0)
                                .toUpperCase()
                        }
                    </div>

                    <div className="user-details">

                        <strong>
                            {user?.first_name
                                ? `${user.first_name} ${user.last_name || ""}`
                                : user?.username
                            }
                        </strong>

                        <span>
                            {user?.role}
                        </span>

                    </div>

                </div>


                <div className="user-dropdown">

                    <button
                        className="profile-button"
                        onClick={() =>
                            setShowMenu(!showMenu)
                        }
                    >
                        ▼
                    </button>


                    {showMenu && (

                        <div className="dropdown-menu">

                            <a href="/dashboard">
                                Dashboard
                            </a>

                            <button
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}


export default Navbar;