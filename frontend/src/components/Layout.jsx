import { useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";


function Layout({ children }) {

    const [sidebarOpen, setSidebarOpen] =
        useState(false);


    return (
        <div className="app-layout">

            <Navbar
                onMenuClick={() =>
                    setSidebarOpen(true)
                }
            />


            <Sidebar
                isOpen={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />


            <main className="main-content">

                {children}

            </main>

        </div>
    );
}


export default Layout;