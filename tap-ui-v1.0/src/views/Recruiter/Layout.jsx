import React from "react";
import { Outlet } from "react-router-dom";

import RecruiterNavbar from "../../components/Recruiter/RecruiterMainNavbar";
 
function Layout() {
    return (
        <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
            <RecruiterNavbar />
            <div className="flex-1 p-4 min-h-0 overflow-auto">
                <Outlet />
            </div>
 
        </div>
    )
}
export default Layout