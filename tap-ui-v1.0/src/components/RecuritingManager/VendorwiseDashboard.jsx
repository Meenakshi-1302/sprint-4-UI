import React, { useEffect } from 'react'
import RecruitingManagerNavbar from './RecruitingManagerNavbar'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClipboardCheck,
    faClipboardList,
    faTimesCircle,
    faCheckCircle,
    faClipboardQuestion,
    faGlobeAmericas,
    faTools,
    faUserGraduate,
    faCoffee,
    faBolt,
    faHome,
} from '@fortawesome/free-solid-svg-icons';
import { faClock, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { getAllVendor } from '../../services/RecruitingManager/VendorService';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


function VendorwiseDashboard() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [vendorData, setVendorData] = useState([]);
  
    const Breadcrumb = ({ items }) => (
        <nav aria-label="breadcrumb" className="mb-4">
            <ol className="list-reset flex text-grey-dark">
                {items.map((item, index) => (
                    <li key={index}>
                        <a href={item.link} className="text-blue-500 hover:text-blue-700">{item.label}</a>
                        {index < items.length - 1 && <span className="mx-2"> / </span>}
                    </li>
                ))}
            </ol>
        </nav>
    );

    useEffect(()=>{
        const fetchVendors = async () => {
            try {
              const response = await getAllVendor();
              setVendorData(response.data);
              console.log(response.data);
            } catch (error) {
              console.error('Error fetching vendor data:', error);
              setError(error.message);
            } finally {
              setLoading(false);
            }
          };

          fetchVendors();
    }, []);

    const columnDefs = [
        { headerName: "Vendor ID", field: "vendorId", sortable: true, filter: true },
        { headerName: "Organisation Name", field: "organizationName", sortable: true, filter: true },
        { headerName: "Email ID", field: "email", sortable: true, filter: true },
        { headerName: "Username", field: "username", sortable: true, filter: true },
        { headerName: "TIN", field: "taxIdentifyNumber", sortable: true, filter: true }
    ];

    const cardsData = [
        {
            icon: faClipboardList,
            title: 'Available Vendors',
            value: vendorData.length,
            status: 'All',
        },
        // {
        //     icon: faGlobeAmericas,
        //     title: 'Required Technologies',
        //     value: (() => {
        //         const uniqueTechno = new Set();
        //         vendorData.forEach(item => {
        //             const requiredTech = item.mrf.mrfRequiredTechnology;
        //             if (requiredTech) {
        //                 const trimmedName = requiredTech.trim().toLowerCase();
        //                 uniqueTechno.add(trimmedName);
        //             }
        //         });
        //         return uniqueTechno.size;
        //     })(),
        // },
    ];

  return (
    <>
    <RecruitingManagerNavbar
                sidebarOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
    />
                <div className={`min-h-screen bg-[#F5F5F5] p-4 flex flex-col ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>
                <br />
                <br />
                <br />

                <div className="bg-gradient-to-r from-[white] to-[skyblue] shadow-md rounded-lg py-2">
    <div className="container mx-auto">
        <nav className="flex justify-around items-center fixed-top">
            <a href="/recruitingManagerDashboard" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Home
            </a>
            <a href="/skillwiseDash"  className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300" >
                <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
                Skillwise
            </a>
            <a href="#" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
                <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                Clientwise
            </a>
            <a href="#" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Schedulewise
            </a>
            <a href="#" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                Recruiterwise
            </a>
            <a href="/vendorwiseDash" className={`flex items-center text-dark-700 text-lg font-bold ${window.location.pathname === '/vendorwiseDash' ? 'text-[#eeeeee] bg-[#23275c] font-semibold' : 'hover:text-[#E01950]'} hover:shadow-lg rounded-full px-4 py-2 transition duration-300`}>
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Vendorwise
            </a>
        </nav>
    </div>
</div>

<div className="bg-gray-100 p-6">
                    <header className="text-center mb-8">
                        <Breadcrumb items={[
                            { label: "Home", link: "/recruitingManagerDashboard" },
                            { label: "Vendor Dashboard", link: "/vendorwiseDash" }
                        ]} />
                    </header>
                </div>

                <div className="flex-justify-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                    {cardsData.map((card, index) => (
                        <div key={index} className="bg-gradient-to-r from-[white] to-[white] shadow-md rounded-lg p-4 flex items-center" onClick={card.onClick}>
                            <FontAwesomeIcon icon={card.icon} className="text-3xl text-gray-700 mr-4" />
                            <div>
                                <h2 className="font-semibold text-xl">{card.title}</h2>
                                <p>Total: {card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
     <div className="flex justify-center mt-5">
                    <div className="ag-theme-alpine mt-5" style={{ height: 400, width: '80%' }}>
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={vendorData}
                            pagination={true}
                            paginationPageSize={10}
                        />
                    </div>
                </div>
                </div>
    </>
  )
}

export default VendorwiseDashboard
