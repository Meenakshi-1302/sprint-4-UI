import {
    faClipboardCheck,
    faClipboardList,
    faTimesCircle,
    faUsers,
    faSearch,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Tooltip,
    Cell,
    XAxis,
    YAxis,
    BarChart,
    Bar
} from 'recharts';
import React, { useState, useEffect } from "react";
import RecruitingManagerNavbar from "./RecruitingManagerNavbar";
import role from "../../../src/assets/pngtre.png";
import { Link } from "react-router-dom";

const RecruitingManagerdashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(()=>{
        setCurrentTime(new Date());
    },[currentTime])

    return (
        <>
            <RecruitingManagerNavbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            <div className={`min-h-screen bg-[#F5F5F5] p-4 flex flex-col ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>
                <br />
                <br />
                <br />

                <div className="bg-gradient-to-r from-[white] to-[skyblue] shadow-md rounded-lg py-2">
                    <div className="container mx-auto">
                        <nav className="flex justify-around items-center">
                            <a href="/recruitingManagerDashbaord" className="text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">Home</a>
                            <Link to="/skillwiseDash" className="text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">Skillwise</Link>
                            <a href="#" className="text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">Clientwise</a>
                            <a href="#" className="text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">Schedulewise</a>
                            <a href="#" className="text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">Recruiterwise</a>
                            <a href="/vendorwiseDash" className="text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">Vendorwise</a>
                        </nav>
                    </div>
                </div>
                <br />

                <div className="flex flex-col md:flex-row w-full mt-4">
                    {/* Static Welcome Card */}
                    <div className="flex justify-between items-center bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-lg shadow-md p-3 w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0 ml-20 mt-5">
                        <div>
                            <h2 className="text-lg font-semibold">Welcome</h2>
                            <p className="mt-1 text-lg">We're glad to see you here.</p>
                            <button className="mt-1 bg-white text-[#E01950] rounded-lg px-3 py-1 text-sm">
                                View Profile
                            </button>
                            <p className="mt-1 text-lg">{currentTime.toLocaleTimeString()}</p>
                        </div>
                        <img
                            src={role}
                            alt="Profile"
                            className="rounded-md ml-4"
                            style={{ width: "150%", maxWidth: "150px", height: "auto" }}
                        />
                    </div>

                    {/* Dynamic Cards Section */}
                    <div className="flex flex-col w-full md:w-1/2 lg:w-2/3 ml-7 mr-3 mt-5">
                        <center>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Responsive grid */}
                                
                                {/* Card 1 */}
                                <div className="bg-gradient-to-r from-[#FFDEE9] to-[#B5FFFC] rounded-lg shadow-md p-4 flex items-center">
                                    <div className="relative w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center overflow-hidden transition-transform duration-300 transform hover:scale-105">
                                        <FontAwesomeIcon icon={faClipboardCheck} className="text-4xl text-[#E01950]" />
                                    </div>
                                    <div className="text-center ml-2">
                                        <h2 className="text-2xl">10</h2>
                                        <h5 className="text-lg"><strong>MRF's</strong></h5>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-gradient-to-r from-[#FFDEE9] to-[#B5FFFC] rounded-lg shadow-md p-4 flex items-center">
                                    <div className="relative w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center overflow-hidden transition-transform duration-300 transform hover:scale-105">
                                        <FontAwesomeIcon icon={faUsers} className="text-4xl text-[#E01950]" />
                                    </div>
                                    <div className="text-center ml-2">
                                        <h2 className="text-2xl">20</h2>
                                        <h5 className="text-lg"><strong>RECRUITER's</strong></h5>                                    
                                    </div>
                                </div>

                                {/* Card 3 */}
                                <div className="bg-gradient-to-r from-[#FFDEE9] to-[#B5FFFC] rounded-lg shadow-md p-4 flex items-center">
                                    <div className="relative w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center overflow-hidden transition-transform duration-300 transform hover:scale-105">
                                        <FontAwesomeIcon icon={faClipboardList} className="text-4xl text-[#E01950]" />
                                    </div>
                                    <div className="text-center ml-2">
                                        <h2 className="text-2xl">10</h2>
                                        <h5 className="text-lg"><strong>VENDOR's</strong></h5>                                    
                                    </div>
                                </div>

                                {/* Card 4 */}
                                <div className="bg-gradient-to-r from-[#FFDEE9] to-[#B5FFFC] rounded-lg shadow-md p-4 flex items-center">
                                    <div className="relative w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center overflow-hidden transition-transform duration-300 transform hover:scale-105">
                                        <FontAwesomeIcon icon={faSearch} className="text-4xl text-[#E01950]" />
                                    </div>
                                    <div className="text-center ml-2">
                                        <h2 className="text-2xl">20</h2>
                                        <h5 className="text-lg"><strong>CLIENT's</strong></h5>                                    
                                    </div>
                                </div>
                            </div>
                        </center>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RecruitingManagerdashboard;