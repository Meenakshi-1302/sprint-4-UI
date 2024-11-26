// import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { getMrfsResponse } from "../../services/RecruitingManager/MRFService";
// import {
//     faClipboardCheck,
//     faClipboardList,
//     faTimesCircle,
//     faCheckCircle,
//     faClipboardQuestion,
//     faGlobeAmericas,
//     faTools,
//     faUserGraduate,
//     faCoffee, // Example icon for Java
//     faBolt,
//     faHome,   // Example icon for JavaScript
// } from '@fortawesome/free-solid-svg-icons';
// import RecruitingManagerNavbar from "./RecruitingManagerNavbar";
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import { Bar, Pie } from 'react-chartjs-2';
// import {faClock, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
//     ArcElement,
// } from 'chart.js';

// // Register Chart.js components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// // Create a mapping between skills and icons
// const skillIconMap = {
//     Java: faCoffee,
//     JavaScript: faBolt,
//     Python: faCoffee,
// };

// const Breadcrumb = ({ items }) => (
//     <nav aria-label="breadcrumb" className="mb-4">
//         <ol className="list-reset flex text-grey-dark">
//             {items.map((item, index) => (
//                 <li key={index}>
//                     <a href={item.link} className="text-blue-500 hover:text-blue-700">{item.label}</a>
//                     {index < items.length - 1 && <span className="mx-2"> / </span>}
//                 </li>
//             ))}
//         </ol>
//     </nav>
// );

// // Modal Component to Display Required Skills
// const SkillsModal = ({ isOpen, onClose, skills }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 mx-auto">
//                 <h2 className="text-2xl font-bold text-center mb-4 border-b pb-2">Required Skills</h2>
//                 <div className="max-h-60 overflow-y-auto mb-4">
//                     {skills.map((skill, index) => (
//                         <div key={index} className="flex items-center mb-2 p-2 hover:bg-gray-100 rounded">
//                             <FontAwesomeIcon icon={skill.icon} className="text-2xl mr-3 text-blue-600" />
//                             <span className="text-lg font-medium">{skill.name}</span>
//                         </div>
//                     ))}
//                 </div>
//                 <button onClick={onClose} className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">
//                     Close
//                 </button>
//             </div>
//         </div>
//     );
// };

// const SkillwiseDashboard = () => {
//     const [loading, setLoading] = useState(true);
//     const [mrfData, setMrfData] = useState([]);
//     const employeeId = sessionStorage.getItem("employeeId");
//     const [sidebarOpen, setSidebarOpen] = useState(false);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [requiredSkills, setRequiredSkills] = useState([]);
//     const [barChartData, setBarChartData] = useState([]);
//     const [pieChartData, setPieChartData] = useState([]);

//     useEffect(() => {
//         const fetchAllMrfs = async () => {
//             try {
//                 const response = await getMrfsResponse(employeeId);
//                 setMrfData(response.data);
//             } catch (error) {
//                 console.error('Error fetching MRF data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAllMrfs();
//     }, [employeeId]);

//     useEffect(() => {
//         if (!loading && mrfData.length > 0) {
//             const skillCountMap = new Map();
//             const techCountMap = new Map();

//             mrfData.forEach(item => {
//                 const reqSkills = item.mrf.requiredSkills;
//                 if (reqSkills) {
//                     reqSkills.split(',').forEach(skill => {
//                         const trimmedSkill = skill.trim();
//                         if (trimmedSkill) {
//                             skillCountMap.set(trimmedSkill, (skillCountMap.get(trimmedSkill) || 0) + 1);
//                         }
//                     });
//                 }

//                 const reqTech = item.mrf.mrfRequiredTechnology;
//                 if (reqTech) {
//                     techCountMap.set(reqTech, (techCountMap.get(reqTech) || 0) + 1);
//                 }
//             });

//             const skillsArray = Array.from(skillCountMap, ([name, count]) => ({ name, count }));
//             const technologiesArray = Array.from(techCountMap, ([name, count]) => ({ name, count }));

//             setBarChartData(skillsArray);
//             setPieChartData(technologiesArray);
//         }
//     }, [loading, mrfData]);

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     const columnDefs = [
//         { headerName: "MRF ID", field: "mrf.mrfId", sortable: true, filter: true },
//         { headerName: "Department Name", field: "mrf.mrfDepartmentName", sortable: true, filter: true },
//         { headerName: "Required Technology", field: "mrf.mrfRequiredTechnology", sortable: true, filter: true },
//         { headerName: "Probable Designation", field: "mrf.probableDesignation", sortable: true, filter: true },
//         { headerName: "Required Skills", field: "mrf.requiredSkills", sortable: true, filter: true }
//     ];

//     const cardsData = [
//         {
//             icon: faClipboardList,
//             title: 'Available MRFs',
//             value: mrfData.length,
//             status: 'All',
//         },
//         {
//             icon: faGlobeAmericas,
//             title: 'Required Technologies',
//             value: (() => {
//                 const uniqueTechno = new Set();
//                 mrfData.forEach(item => {
//                     const requiredTech = item.mrf.mrfRequiredTechnology;
//                     if (requiredTech) {
//                         const trimmedName = requiredTech.trim().toLowerCase();
//                         uniqueTechno.add(trimmedName);
//                     }
//                 });
//                 return uniqueTechno.size;
//             })(),
//         },
//         {
//             icon: faTools,
//             title: 'Required Skills',
//             value: (() => {
//                 const reqTechno = new Set();
//                 mrfData.forEach(item => {
//                     const reqTech = item.mrf.requiredSkills;
//                     if (reqTech) {
//                         reqTech.split(',').forEach(skill => {
//                             const trimmedSkill = skill.trim();
//                             if (trimmedSkill) {
//                                 reqTechno.add(trimmedSkill);
//                             }
//                         });
//                     }
//                 });
//                 return reqTechno.size; 
//             })(),
//             onClick: () => {
//                 const allSkills = new Set();
//                 mrfData.forEach(item => {
//                     const reqTech = item.mrf.requiredSkills;
//                     if (reqTech) {
//                         reqTech.split(',').forEach(skill => {
//                             const trimmedSkill = skill.trim();
//                             if (trimmedSkill) {
//                                 allSkills.add(trimmedSkill);
//                             }
//                         });
//                     }
//                 });

//                 const skillWithIcons = Array.from(allSkills).map(skill => ({
//                     name: skill,
//                     icon: skillIconMap[skill] || faTools
//                 }));

//                 setRequiredSkills(skillWithIcons);
//                 setIsModalOpen(true);
//             },
//         },
//         {
//             icon: faUserGraduate,
//             title: 'Probable Designation',
//             value: (() => {
//                 const probDesig = new Set();
//                 mrfData.forEach(item => {
//                     const desig = item.mrf.probableDesignation;
//                     if (desig) {
//                         probDesig.add(desig);
//                     }
//                 });
//                 return probDesig.size;
//             })(),
//         }
//     ];

//     return (
//         <>
//             <RecruitingManagerNavbar
//                 sidebarOpen={sidebarOpen}
//                 toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
//             />
//             <div className={`min-h-screen bg-[#F5F5F5] p-4 flex flex-col ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>
//                 <br />
//                 <br />
//                 <br />

// <div className="bg-gradient-to-r from-[white] to-[skyblue] shadow-md rounded-lg py-2">
//     <div className="container mx-auto">
//         <nav className="flex justify-around items-center fixed-top">
//             <a href="/recruitingManagerDashboard" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
//                 <FontAwesomeIcon icon={faHome} className="mr-2" />
//                 Home
//             </a>
//             <a href="/skillwiseDash" className={`flex items-center text-dark-700 text-lg font-bold ${window.location.pathname === '/skillwiseDash' ? 'text-[#eeeeee] bg-[#23275c] font-semibold' : 'hover:text-[#E01950]'} hover:shadow-lg rounded-full px-4 py-2 transition duration-300`}>
//                 <FontAwesomeIcon icon={faClipboardCheck} className="mr-2" />
//                 Skillwise
//             </a>
//             <a href="#" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
//                 <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
//                 Clientwise
//             </a>
//             <a href="#" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
//                 <FontAwesomeIcon icon={faClock} className="mr-2" />
//                 Schedulewise
//             </a>
//             <a href="#" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
//                 <FontAwesomeIcon icon={faUser} className="mr-2" />
//                 Recruiterwise
//             </a>
//             <a href="#" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
//                 <FontAwesomeIcon icon={faUsers} className="mr-2" />
//                 Vendorwise
//             </a>
//         </nav>
//     </div>
// </div>
//                 <div className="bg-gray-100 p-6">
//                     <header className="text-center mb-8">
//                         <Breadcrumb items={[
//                             { label: "Home", link: "/recruitingManagerDashboard" },
//                             { label: "Skill Dashboard", link: "/skillwiseDash" }
//                         ]} />
//                     </header>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
//                     {cardsData.map((card, index) => (
//                         <div key={index} className="bg-gradient-to-r from-[white] to-[white] shadow-md rounded-lg p-4 flex items-center" onClick={card.onClick}>
//                             <FontAwesomeIcon icon={card.icon} className="text-3xl text-gray-700 mr-4" />
//                             <div>
//                                 <h2 className="font-semibold text-xl">{card.title}</h2>
//                                 <p>Total: {card.value}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex justify-center mt-5 space-x-5">
//     <div className="w-2/4"> {/* Bar Chart Width */}
//         <Bar
//             data={{
//                 labels: barChartData.map(skill => skill.name),
//                 datasets: [{
//                     label: 'Required Skills',
//                     data: barChartData.map(skill => skill.count),
//                     backgroundColor: 'rgb(47, 109, 224)',
//                 }]
//             }}
//             options={{
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Required Skills Distribution',
//                     },
//                 },
//             }}
//         />
//     </div>
//     <div className="w-1/3"> {/* Pie Chart Width Reduced */}
//         <Pie
//             data={{
//                 labels: pieChartData.map(tech => tech.name),
//                 datasets: [{
//                     label: 'Required Technologies',
//                     data: pieChartData.map(tech => tech.count),
//                     backgroundColor: [
//                         'rgb(47, 109, 224)',
//                         'rgba(54, 162, 235, 0.6)',
//                         'rgba(255, 206, 86, 0.6)',
//                         'rgba(75, 192, 192, 0.6)',
//                         'rgba(153, 102, 255, 0.6)',
//                     ],
//                 }]
//             }}
//             options={{
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Required Technologies Distribution',
//                     },
//                 },
//             }}
//         />
//     </div>
// </div>

//                 <div className="flex justify-center mt-5">
//                     <div className="ag-theme-alpine mt-5" style={{ height: 400, width: '80%' }}>
//                         <AgGridReact
//                             columnDefs={columnDefs}
//                             rowData={mrfData}
//                             pagination={true}
//                             paginationPageSize={10}
//                         />
//                     </div>
//                 </div>
//             </div>

//             <SkillsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} skills={requiredSkills} />
//         </>
//     );
// };

// export default SkillwiseDashboard;

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getMrfsResponse } from "../../services/RecruitingManager/MRFService";
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
import RecruitingManagerNavbar from "./RecruitingManagerNavbar";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Bar, Pie } from 'react-chartjs-2';
import { faClock, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Create a mapping between skills and icons
const skillIconMap = {
    Java: faCoffee,
    JavaScript: faBolt,
    Python: faCoffee,
};

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

// Modal Component to Display Required Skills
const SkillsModal = ({ isOpen, onClose, skills }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 mx-auto">
                <h2 className="text-2xl font-bold text-center mb-4 border-b pb-2">Required Skills</h2>
                <div className="max-h-60 overflow-y-auto mb-4">
                    {skills.map((skill, index) => (
                        <div key={index} className="flex items-center mb-2 p-2 hover:bg-gray-100 rounded">
                            <FontAwesomeIcon icon={skill.icon} className="text-2xl mr-3 text-blue-600" />
                            <span className="text-lg font-medium">{skill.name}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300">
                    Close
                </button>
            </div>
        </div>
    );
};

const SkillwiseDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [mrfData, setMrfData] = useState([]);
    const employeeId = sessionStorage.getItem("employeeId");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [barChartData, setBarChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [skillScores, setSkillScores] = useState([]); // Renamed to skillScores
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchAllMrfs = async () => {
            try {
                const response = await getMrfsResponse(employeeId);
                setMrfData(response.data);
            } catch (error) {
                console.error('Error fetching MRF data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllMrfs();
    }, [employeeId]);

    useEffect(() => {
        if (!loading && mrfData.length > 0) {
            const skillCountMap = new Map();
            const techCountMap = new Map();

            mrfData.forEach(item => {
                const reqSkills = item.mrf.requiredSkills;
                if (reqSkills) {
                    reqSkills.split(',').forEach(skill => {
                        const trimmedSkill = skill.trim();
                        if (trimmedSkill) {
                            skillCountMap.set(trimmedSkill, (skillCountMap.get(trimmedSkill) || 0) + 1);
                        }
                    });
                }

                const reqTech = item.mrf.mrfRequiredTechnology;
                if (reqTech) {
                    techCountMap.set(reqTech, (techCountMap.get(reqTech) || 0) + 1);
                }
            });

            const skillsArray = Array.from(skillCountMap, ([name, count]) => ({ name, count }));
            const technologiesArray = Array.from(techCountMap, ([name, count]) => ({ name, count }));

            setBarChartData(skillsArray);
            setPieChartData(technologiesArray);
            setSkillScores(skillsArray); // Keep the scores based on skills
        }
    }, [loading, mrfData]);

    const filteredSkillScores = skillScores.filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    const columnDefs = [
        { headerName: "MRF ID", field: "mrf.mrfId", sortable: true, filter: true },
        { headerName: "Department Name", field: "mrf.mrfDepartmentName", sortable: true, filter: true },
        { headerName: "Required Technology", field: "mrf.mrfRequiredTechnology", sortable: true, filter: true },
        { headerName: "Probable Designation", field: "mrf.probableDesignation", sortable: true, filter: true },
        { headerName: "Required Skills", field: "mrf.requiredSkills", sortable: true, filter: true }
    ];

    const cardsData = [
        {
            icon: faClipboardList,
            title: 'Available MRFs',
            value: mrfData.length,
            status: 'All',
        },
        {
            icon: faGlobeAmericas,
            title: 'Required Technologies',
            value: (() => {
                const uniqueTechno = new Set();
                mrfData.forEach(item => {
                    const requiredTech = item.mrf.mrfRequiredTechnology;
                    if (requiredTech) {
                        const trimmedName = requiredTech.trim().toLowerCase();
                        uniqueTechno.add(trimmedName);
                    }
                });
                return uniqueTechno.size;
            })(),
        },
        {
            icon: faTools,
            title: 'Required Skills',
            value: (() => {
                const reqTechno = new Set();
                mrfData.forEach(item => {
                    const reqTech = item.mrf.requiredSkills;
                    if (reqTech) {
                        reqTech.split(',').forEach(skill => {
                            const trimmedSkill = skill.trim();
                            if (trimmedSkill) {
                                reqTechno.add(trimmedSkill);
                            }
                        });
                    }
                });
                return reqTechno.size; 
            })(),
            onClick: () => {
                const allSkills = new Set();
                mrfData.forEach(item => {
                    const reqTech = item.mrf.requiredSkills;
                    if (reqTech) {
                        reqTech.split(',').forEach(skill => {
                            const trimmedSkill = skill.trim();
                            if (trimmedSkill) {
                                allSkills.add(trimmedSkill);
                            }
                        });
                    }
                });

                const skillWithIcons = Array.from(allSkills).map(skill => ({
                    name: skill,
                    icon: skillIconMap[skill] || faTools
                }));

                setRequiredSkills(skillWithIcons);
                setIsModalOpen(true);
            },
        },
        {
            icon: faUserGraduate,
            title: 'Probable Designation',
            value: (() => {
                const probDesig = new Set();
                mrfData.forEach(item => {
                    const desig = item.mrf.probableDesignation;
                    if (desig) {
                        probDesig.add(desig);
                    }
                });
                return probDesig.size;
            })(),
        }
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
            <a href="/skillwiseDash" className={`flex items-center text-dark-700 text-lg font-bold ${window.location.pathname === '/skillwiseDash' ? 'text-[#eeeeee] bg-[#23275c] font-semibold' : 'hover:text-[#E01950]'} hover:shadow-lg rounded-full px-4 py-2 transition duration-300`}>
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
            <a href="/vendorwiseDash" className="flex items-center text-gray-700 text-lg font-semibold hover:text-[#E01950] hover:shadow-lg rounded-full px-4 py-2 transition duration-300">
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
                            { label: "Skill Dashboard", link: "/skillwiseDash" }
                        ]} />
                    </header>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
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

                <div className="flex justify-center mt-5 space-x-5">
                    <div className="w-2/4"> {/* Bar Chart Width */}
                        <Bar
                            data={{
                                labels: barChartData.map(skill => skill.name),
                                datasets: [{
                                    label: 'Required Skills',
                                    data: barChartData.map(skill => skill.count),
                                    backgroundColor: 'rgb(47, 109, 224)',
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Required Skills Distribution',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div className="w-1/3"> {/* Pie Chart Width */}
                        <Pie
                            data={{
                                labels: pieChartData.map(tech => tech.name),
                                datasets: [{
                                    label: 'Required Technologies',
                                    data: pieChartData.map(tech => tech.count),
                                    backgroundColor: [
                                        'rgb(47, 109, 224)',
                                        'rgba(54, 162, 235, 0.6)',
                                        'rgba(255, 206, 86, 0.6)',
                                        'rgba(75, 192, 192, 0.6)',
                                        'rgba(153, 102, 255, 0.6)',
                                    ],
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Required Technologies Distribution',
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <br />


                <div className="flex justify-center mt-5">
                    <div className="ag-theme-alpine mt-5" style={{ height: 400, width: '80%' }}>
                        <AgGridReact
                            columnDefs={columnDefs}
                            rowData={mrfData}
                            pagination={true}
                            paginationPageSize={10}
                        />
                    </div>
                </div>
            </div>

            <SkillsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} skills={requiredSkills} />
        </>
    );
};

export default SkillwiseDashboard;