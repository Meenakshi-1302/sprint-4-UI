// import React, { useState, useEffect } from 'react';
// import { fetchDatewiseData, fetchMrfData } from '../../../services/ClientPartner/DatewiseService';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faArrowRightLong, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
// import ClientDetails from './ClientDetails';
// import { Bar } from 'react-chartjs-2';
// import * as XLSX from 'xlsx';

// // Cell Renderer for Status
// const StatusCellRenderer = (props) => {
//     const status = props.value;
//     let bgColor;

//     switch (status) {
//         case 'Approved':
//             bgColor = 'bg-green-200';
//             break;
//         case 'Rejected':
//             bgColor = 'bg-red-200';
//             break;
//         case 'Pending':
//             bgColor = 'bg-blue-200';
//             break;
//         default:
//             bgColor = 'bg-gray-200';
//     }

//     return (
//         <div className={`${bgColor} text-black p-2 rounded transition-colors duration-300 ease-in-out flex items-center justify-center h-full`}>
//             {status}
//         </div>
//     );
// };

// function Datewise({ onDateChange, sidebarOpen }) {
//     const [fromDate, setFromDate] = useState('');
//     const [toDate, setToDate] = useState('');
//     const [activeTab, setActiveTab] = useState('requirements');
//     const [requirements, setRequirements] = useState([]);
//     const [mrfData, setMrfData] = useState([]);
//     const [filteredMrfData, setFilteredMrfData] = useState([]);
//     const [error, setError] = useState(null);
//     const [modalOpen, setModalOpen] = useState(false);
//     const [selectedOrganization, setSelectedOrganization] = useState([]);
//     const [selectedMonth, setSelectedMonth] = useState('');
//     const [barChartData, setBarChartData] = useState({}); // State for bar chart data

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const fetchedRequirements = await fetchDatewiseData();
//                 const fetchedMrfData = await fetchMrfData();
//                 setRequirements(fetchedRequirements);
//                 setMrfData(fetchedMrfData);
//                 setFilteredMrfData(fetchedMrfData);
//                 setError(null);
//             } catch (err) {
//                 setError('Failed to fetch data. Please try again.');
//                 setRequirements([]);
//                 setMrfData([]);
//             }
//         };

//         fetchData();
//     }, []);

//     useEffect(() => {
//         const getMonthlyAggregatedData = (requirements) => {
//             const monthlyData = {};

//             requirements.forEach(req => {
//                 const createdAtDate = new Date(req.createdAt);
//                 const month = createdAtDate.toLocaleString('default', { month: 'long' });

//                 if (!monthlyData[month]) {
//                     monthlyData[month] = 0;
//                 }
//                 monthlyData[month] += req.totalRequiredResourceCount;
//             });

//             return {
//                 labels: Object.keys(monthlyData) || [],
//                 data: Object.values(monthlyData) || []
//             };
//         };

//         const { labels, data } = getMonthlyAggregatedData(requirements);

//         if (labels.length > 0 && data.length > 0) {
//             setBarChartData({
//                 labels,
//                 datasets: [{
//                     label: 'Total Required Resources',
//                     data,
//                     backgroundColor: 'rgba(151, 36, 126, 0.6)',
//                     borderColor: 'rgba(151, 36, 126, 1)',
//                     borderWidth: 1,
//                 }]
//             });
//         } else {
//             setBarChartData({
//                 labels: [],
//                 datasets: [{
//                     label: 'Total Required Resources',
//                     data: [],
//                     backgroundColor: 'rgba(151, 36, 126, 0.6)',
//                     borderColor: 'rgba(151, 36, 126, 1)',
//                     borderWidth: 1,
//                 }]
//             });
//         }

//     }, [requirements]);

//     const handleDateSelection = () => {
//         onDateChange(fromDate, toDate);
//         const startDate = new Date(fromDate);
//         const endDate = new Date(toDate);

//         const filteredRequirements = requirements.filter(req => {
//             const createdAtDate = new Date(req.createdAt);
//             return createdAtDate >= startDate && createdAtDate <= endDate;
//         });

//         const filteredMrfData = mrfData.filter(mrf => {
//             const createdAtDate = new Date(mrf.createdAt);
//             return createdAtDate >= startDate && createdAtDate <= endDate;
//         });

//         setRequirements(filteredRequirements);
//         setFilteredMrfData(filteredMrfData);
//     };

//     const handleMonthSelection = (e) => {
//         const month = e.target.value;
//         setSelectedMonth(month);

//         const filteredMrfData = mrfData.filter(mrf => {
//             const createdAtDate = new Date(mrf.createdAt);
//             return `${createdAtDate.getMonth() + 1}` === month;
//         });

//         setFilteredMrfData(filteredMrfData);
//     };

//     const getRowHeight = (params) => {
//         const subRequirements = params.data.subrequirement || [];
//         return 40 + (subRequirements.length * 20);
//     };

//     const columnDefs = [
//         { headerName: "Requirement Id", field: "requirementId", sortable: true, filter: true },
//         {
//             headerName: "Given by",
//             cellRenderer: (params) => {
//                 const organization = params.data.client?.clientOrganization;
//                 return organization ? (
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                         {organization.organizationLogo && (
//                             <img className='rounded-lg'
//                                 src={`data:image/jpeg;base64,${organization.organizationLogo}`}
//                                 style={{ width: '30px', height: '30px', marginRight: '5px' }}
//                                 alt="Organization Logo"
//                             />
//                         )}
//                         <span>{organization.organizationName}</span>
//                     </div>
//                 ) : null;
//             },
//             sortable: true,
//             filter: true
//         },
//         { headerName: "Created On", field: "createdAt", sortable: true, filter: true, valueFormatter: params => new Date(params.value).toLocaleDateString() },
//         { headerName: "Total Required Resource Count", field: "totalRequiredResourceCount", sortable: true, filter: true },
//         {
//             headerName: "Resource Specifications - Count",
//             cellRenderer: (params) => {
//                 const subRequirements = params.data.subrequirement || [];
//                 return (
//                     <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
//                         {subRequirements.map(subReq => (
//                             <li key={subReq.subRequirementId} style={{ margin: "5px 0" }}>
//                                 {subReq.role} - {subReq.resourceCount}
//                             </li>
//                         ))}
//                     </ul>
//                 );
//             },
//             sortable: false,
//             filter: false
//         }
//     ];

//     const mrfColumnDefs = [
//         { headerName: "MRF Id", field: "mrfId", sortable: true, filter: true },
//         {
//             headerName: "Given by",
//             cellRenderer: (params) => {
//                 const organization = params.data.requirement?.client.clientOrganization;
//                 const organizationClientDetails = params.data.requirement.client;
//                 return organization ? (
//                     <div style={{ display: 'flex', alignItems: 'center' }}>
//                         {organization.organizationLogo && (
//                             <img className='rounded-lg'
//                                 src={`data:image/jpeg;base64,${organization.organizationLogo}`}
//                                 style={{ width: '30px', height: '30px', marginRight: '5px' }}
//                                 alt="Organization Logo"
//                             />
//                         )}
//                         <span>{organization.organizationName}</span>
//                         <FontAwesomeIcon
//                             icon={faInfoCircle}
//                             size="1x"
//                             style={{ marginLeft: '5px', cursor: 'pointer' }}
//                             onClick={() => {
//                                 setSelectedOrganization(organizationClientDetails);
//                                 setModalOpen(true);
//                             }}
//                         />
//                     </div>
//                 ) : null;
//             },
//             sortable: true,
//             filter: true
//         },
//         { headerName: "Created On", field: "createdAt", sortable: true, filter: true, valueFormatter: params => new Date(params.value).toLocaleDateString() },
//         {
//             headerName: "CTC (Min - Max)",
//             valueGetter: (params) => `${params.data.mrfCriteria.minimumCTC} - ${params.data.mrfCriteria.maximumCTC}`,
//             sortable: true,
//             filter: true
//         },
//         { headerName: "Start Date", field: "mrfCriteria.contractStartDate", sortable: true, filter: true },
//         { headerName: "Closure Date", field: "mrfCriteria.closureDate", sortable: true, filter: true },
//         {
//             headerName: "Status",
//             field: "mrfStatus.mrfApprovalStatus",
//             sortable: true,
//             filter: true,
//             cellRenderer: 'statusCellRenderer'
//         },
//         { headerName: "Filled Candidates", field: "mrfStatus.requirementFilled", sortable: true, filter: true },
//     ];

//     const chartOptions = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 display: true,
//             },
//         },
//         scales: {
//             x: {
//                 title: {
//                     display: true,
//                     text: 'Month',
//                 },
//                 grid: {
//                     color: 'rgba(151, 36, 126, 0.1)',
//                 },
//             },
//             y: {
//                 title: {
//                     display: true,
//                     text: 'Total Required Resources',
//                 },
//                 beginAtZero: true,
//             },
//         },
//     };

//     const exportToExcel = () => {
//         const ws = XLSX.utils.json_to_sheet(filteredMrfData);
//         const wb = XLSX.utils.book_new();
//         XLSX.utils.book_append_sheet(wb, ws, 'MRF Data');
//         XLSX.writeFile(wb, 'MRF_Data.xlsx');
//     };

//     return (
//         <div className="flex justify-between transition-all duration-300 w-full">
//             <div className="p-4 bg-white rounded-lg shadow-md w-full">
//                 <h2 className="text-lg font-semibold mb-4 text-start mt-32 ml-72">Date Wise Analysis</h2>

//                 <div className="flex items-start justify-between mt-2">
//                     <div className="flex flex-col w-2/3">
//                         <div className="flex items-center gap-4">
//                             <div className="flex flex-col ml-48">
//                                 <label className="block mb-1 font-bold">From:</label>
//                                 <input
//                                     type="date"
//                                     value={fromDate}
//                                     onChange={(e) => setFromDate(e.target.value)}
//                                     className="border p-2 rounded"
//                                 />
//                             </div>

//                             <div className="flex flex-col items-center mt-5">
//                                 <FontAwesomeIcon icon={faArrowRightLong} size="2x" />
//                             </div>

//                             <div className="flex flex-col">
//                                 <label className="block mb-1 font-bold">To:</label>
//                                 <input
//                                     type="date"
//                                     value={toDate}
//                                     onChange={(e) => setToDate(e.target.value)}
//                                     className="border p-2 rounded"
//                                 />
//                             </div>
//                         </div>

//                         <button
//                             onClick={handleDateSelection}
//                             className="bg-[linear-gradient(to_right,rgb(151,36,126),rgb(224,25,80))] text-white p-2 rounded w-32 mt-4 ml-72"
//                         >
//                             Search
//                         </button>
//                     </div>

//                     <div className="w-1/3 h-1/3 -mt-12 mr-36">
//                         <h2 className="text-lg font-semibold mb-2 text-center">Bar Analysis</h2>
//                         {barChartData.labels && barChartData.labels.length > 0 && (
//                             <Bar data={barChartData} options={chartOptions} />
//                         )}
//                     </div>
//                 </div>

//                 <div className="mt-4">
//                     <div className="flex space-x-4 mb-2 bg-white shadow-md rounded">
//                         <button
//                             onClick={() => setActiveTab('requirements')}
//                             className={`px-4 py-2 rounded ${activeTab === 'requirements' ? 'relative text-gray' : 'text-gray-700'}`}
//                         >
//                             Requirements
//                             {activeTab === 'requirements' && (
//                                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(151,36,126)] to-[rgb(224,25,80)]"></div>
//                             )}
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('mrf')}
//                             className={`px-4 py-2 rounded ${activeTab === 'mrf' ? 'relative text-gray' : 'text-gray-700'}`}
//                         >
//                             MRFs
//                             {activeTab === 'mrf' && (
//                                 <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(151,36,126)] to-[rgb(224,25,80)]"></div>
//                             )}
//                         </button>
//                     </div>

//                     {activeTab === 'requirements' && (
//                         <div className="mt-2">
//                             {error && <p className="text-red-500">{error}</p>}
//                             {requirements.length > 0 ? (
//                                 <div className="ag-theme-alpine text-left" style={{ height: 400, width: '100%' }}>
//                                     <AgGridReact
//                                         columnDefs={columnDefs}
//                                         rowData={requirements}
//                                         pagination={true}
//                                         paginationPageSize={10}
//                                         defaultColDef={{
//                                             resizable: true,
//                                             flex: 1,
//                                             filter: true,
//                                             sortable: true,
//                                             cellStyle: { display: 'flex', alignItems: 'center' }
//                                         }}
//                                         getRowHeight={getRowHeight}
//                                         headerHeight={50}
//                                     />
//                                 </div>
//                             ) : (
//                                 <p>No requirements found.</p>
//                             )}
//                         </div>
//                     )}

//                     {activeTab === 'mrf' && (
//                         <div className="mt-2">
//                             {error && <p className="text-red-500">{error}</p>}
//                             <div className="flex mb-2 items-center">
//                                 <label className="block mt-1.5 font-bold">Filter by Month:</label>
//                                 <select
//                                     value={selectedMonth}
//                                     onChange={handleMonthSelection}
//                                     className="border p-2 rounded ml-2"
//                                 >
//                                     <option value="">--Select Month--</option>
//                                     {Array.from({ length: 12 }, (_, index) => {
//                                         const month = index + 1;
//                                         return (
//                                             <option key={month} value={`${month < 10 ? '0' : ''}${month}`}>
//                                                 {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
//                                             </option>
//                                         );
//                                     })}
//                                 </select>

//                             </div>

//                             <div className="flex justify-end mb-2 -mt-12">
//                                 <button
//                                     onClick={exportToExcel}
//                                     className="bg-[linear-gradient(to_right,rgb(151,36,126),rgb(224,25,80))] text-white p-2 rounded"
//                                 >
//                                     Export to Excel
//                                 </button>
//                             </div>

//                             {filteredMrfData.length > 0 ? (
//                                 <div className="ag-theme-alpine text-left" style={{ height: 400, width: '100%' }}>
//                                     <AgGridReact
//                                         columnDefs={mrfColumnDefs}
//                                         rowData={filteredMrfData}
//                                         frameworkComponents={{ statusCellRenderer: StatusCellRenderer }}
//                                         pagination={true}
//                                         paginationPageSize={10}
//                                         defaultColDef={{
//                                             flex: 1,
//                                             cellStyle: { display: 'flex', alignItems: 'center' }
//                                         }}
//                                         headerHeight={50}
//                                     />
//                                 </div>
//                             ) : (
//                                 <p>No MRFs found.</p>
//                             )}

//                         </div>
//                     )}
//                 </div>

//                 {modalOpen && (
//                     <ClientDetails
//                         organizationClientDetails={selectedOrganization}
//                         onClose={() => {
//                             setModalOpen(false);
//                             setSelectedOrganization(null);
//                         }}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Datewise;

import React, { useState, useEffect } from 'react';
import { fetchDatewiseData, fetchMrfData } from '../../../services/ClientPartner/DatewiseService';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ClientDetails from './ClientDetails';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
 
const StatusCellRenderer = (props) => {
    const status = props.value;
    let bgColor;
 
    switch (status) {
        case 'Approved':
            bgColor = 'bg-green-200';
            break;
        case 'Rejected':
            bgColor = 'bg-red-200';
            break;
        case 'Pending':
            bgColor = 'bg-blue-200';
            break;
        default:
            bgColor = 'bg-gray-200';
    }
 
    return (
        <div className={`${bgColor} text-black p-2 rounded transition-colors duration-300 ease-in-out flex items-center justify-center h-full`}>
            {status}
        </div>
    );
};
 
function Datewise({ onDateChange, sidebarOpen }) {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [activeTab, setActiveTab] = useState('requirements');
    const [requirements, setRequirements] = useState([]);
    const [originalRequirements, setOriginalRequirements] = useState([]); // Store original requirements
    const [mrfData, setMrfData] = useState([]);
    const [filteredMrfData, setFilteredMrfData] = useState([]);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState('');
    const [barChartData, setBarChartData] = useState({});
 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedRequirements = await fetchDatewiseData();
                const fetchedMrfData = await fetchMrfData();
                setRequirements(fetchedRequirements);
                setOriginalRequirements(fetchedRequirements); // Set original requirements
                setMrfData(fetchedMrfData);
                setFilteredMrfData(fetchedMrfData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch data. Please try again.');
                setRequirements([]);
                setOriginalRequirements([]);
                setMrfData([]);
            }
        };
 
        fetchData();
    }, []);
 
    useEffect(() => {
        const getMonthlyAggregatedData = (requirements) => {
            const monthlyData = {};
 
            requirements.forEach(req => {
                const createdAtDate = new Date(req.createdAt);
                const month = createdAtDate.toLocaleString('default', { month: 'long' });
 
                if (!monthlyData[month]) {
                    monthlyData[month] = 0;
                }
                monthlyData[month] += req.totalRequiredResourceCount;
            });
 
            return {
                labels: Object.keys(monthlyData) || [],
                data: Object.values(monthlyData) || []
            };
        };
 
        const { labels, data } = getMonthlyAggregatedData(originalRequirements); // Use originalRequirements
 
        if (labels.length > 0 && data.length > 0) {
            setBarChartData({
                labels,
                datasets: [{
                    label: 'Total Required Resources',
                    data,
                    backgroundColor: 'rgba(151, 36, 126, 0.6)',
                    borderColor: 'rgba(151, 36, 126, 1)',
                    borderWidth: 1,
                }]
            });
        } else {
            setBarChartData({
                labels: [],
                datasets: [{
                    label: 'Total Required Resources',
                    data: [],
                    backgroundColor: 'rgba(151, 36, 126, 0.6)',
                    borderColor: 'rgba(151, 36, 126, 1)',
                    borderWidth: 1,
                }]
            });
        }
 
    }, [originalRequirements]);  // Trigger on changes to originalRequirements
 
    const handleDateSelection = () => {
        onDateChange(fromDate, toDate);
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999); // Inclusive
 
        // Filter requirements based on the originalRequirements
        const filteredRequirements = originalRequirements.filter(req => {
            const createdAtDate = new Date(req.createdAt);
            return createdAtDate >= startDate && createdAtDate <= endDate;
        });
 
        // Filter mrfData based on the selected date range
        const filteredMrfData = mrfData.filter(mrf => {
            const createdAtDate = new Date(mrf.createdAt);
            return createdAtDate >= startDate && createdAtDate <= endDate;
        });
 
        setRequirements(filteredRequirements);
        setFilteredMrfData(filteredMrfData);
    };
 
    const handleMonthSelection = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
 
        const filteredMrfData = mrfData.filter(mrf => {
            const createdAtDate = new Date(mrf.createdAt);
            return `${createdAtDate.getMonth() + 1}` === month;
        });
 
        setFilteredMrfData(filteredMrfData);
    };
 
    const getRowHeight = (params) => {
        const subRequirements = params.data.subrequirement || [];
        return 40 + (subRequirements.length * 20);
    };
 
    const columnDefs = [
        { headerName: "Requirement Id", field: "requirementId", sortable: true, filter: true },
        {
            headerName: "Given by",
            cellRenderer: (params) => {
                const organization = params.data.client?.clientOrganization;
                return organization ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {organization.organizationLogo && (
                            <img className='rounded-lg'
                                src={`data:image/jpeg;base64,${organization.organizationLogo}`}
                                style={{ width: '30px', height: '30px', marginRight: '5px' }}
                                alt="Organization Logo"
                            />
                        )}
                        <span>{organization.organizationName}</span>
                    </div>
                ) : null;
            },
            sortable: true,
            filter: true
        },
        { headerName: "Created On", field: "createdAt", sortable: true, filter: true, valueFormatter: params => new Date(params.value).toLocaleDateString() },
        { headerName: "Total Required Resource Count", field: "totalRequiredResourceCount", sortable: true, filter: true },
        {
            headerName: "Resource Specifications - Count",
            cellRenderer: (params) => {
                const subRequirements = params.data.subrequirement || [];
                return (
                    <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                        {subRequirements.map(subReq => (
                            <li key={subReq.subRequirementId} style={{ margin: "5px 0" }}>
                                {subReq.role} - {subReq.resourceCount}
                            </li>
                        ))}
                    </ul>
                );
            },
            sortable: false,
            filter: false
        }
    ];
 
    const mrfColumnDefs = [
        { headerName: "MRF Id", field: "mrfId", sortable: true, filter: true },
        {
            headerName: "Given by",
            cellRenderer: (params) => {
                const organization = params.data.requirement?.client.clientOrganization;
                const organizationClientDetails = params.data.requirement.client;
                return organization ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {organization.organizationLogo && (
                            <img className='rounded-lg'
                                src={`data:image/jpeg;base64,${organization.organizationLogo}`}
                                style={{ width: '30px', height: '30px', marginRight: '5px' }}
                                alt="Organization Logo"
                            />
                        )}
                        <span>{organization.organizationName}</span>
                        <FontAwesomeIcon
                            icon={faInfoCircle}
                            size="1x"
                            style={{ marginLeft: '5px', cursor: 'pointer' }}
                            onClick={() => {
                                setSelectedOrganization(organizationClientDetails);
                                setModalOpen(true);
                            }}
                        />
                    </div>
                ) : null;
            },
            sortable: true,
            filter: true
        },
        { headerName: "Created On", field: "createdAt", sortable: true, filter: true, valueFormatter: params => new Date(params.value).toLocaleDateString() },
        {
            headerName: "CTC (Min - Max)",
            valueGetter: (params) => `${params.data.mrfCriteria.minimumCTC} - ${params.data.mrfCriteria.maximumCTC}`,
            sortable: true,
            filter: true
        },
        { headerName: "Start Date", field: "mrfCriteria.contractStartDate", sortable: true, filter: true },
        { headerName: "Closure Date", field: "mrfCriteria.closureDate", sortable: true, filter: true },
        {
            headerName: "Status",
            field: "mrfStatus.mrfApprovalStatus",
            sortable: true,
            filter: true,
            cellRenderer: 'statusCellRenderer'
        },
        { headerName: "Filled Candidates", field: "mrfStatus.requirementFilled", sortable: true, filter: true },
    ];
 
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
                grid: {
                    color: 'rgba(151, 36, 126, 0.1)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Total Required Resources',
                },
                beginAtZero: true,
            },
        },
    };
 
    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(filteredMrfData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'MRF Data');
        XLSX.writeFile(wb, 'MRF_Data.xlsx');
    };
 
    return (
        <div className="flex justify-between transition-all duration-300 w-full">
            <div className="p-4 bg-white rounded-lg shadow-md w-full">
                <h2 className="text-lg font-semibold mb-4 text-start mt-32 ml-72">Date Wise Analysis</h2>
 
                <div className="flex items-start justify-between mt-2">
                    <div className="flex flex-col w-2/3">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col ml-48">
                                <label className="block mb-1 font-bold">From:</label>
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
 
                            <div className="flex flex-col items-center mt-5">
                                <FontAwesomeIcon icon={faArrowRightLong} size="2x" />
                            </div>
 
                            <div className="flex flex-col">
                                <label className="block mb-1 font-bold">To:</label>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="border p-2 rounded"
                                />
                            </div>
                        </div>
 
                        <button
                            onClick={handleDateSelection}
                            className="bg-[linear-gradient(to_right,rgb(151,36,126),rgb(224,25,80))] text-white p-2 rounded w-32 mt-4 ml-72"
                        >
                            Search
                        </button>
                    </div>
 
                    <div className="w-1/3 h-1/3 -mt-12 mr-36">
                        <h2 className="text-lg font-semibold mb-2 text-center">Bar Analysis</h2>
                        {barChartData.labels && barChartData.labels.length > 0 && (
                            <Bar data={barChartData} options={chartOptions} />
                        )}
                    </div>
                </div>
 
                <div className="mt-4">
                    <div className="flex space-x-4 mb-2 bg-white shadow-md rounded">
                        <button
                            onClick={() => setActiveTab('requirements')}
                            className={`px-4 py-2 rounded ${activeTab === 'requirements' ? 'relative text-gray' : 'text-gray-700'}`}
                        >
                            Requirements
                            {activeTab === 'requirements' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(151,36,126)] to-[rgb(224,25,80)]"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('mrf')}
                            className={`px-4 py-2 rounded ${activeTab === 'mrf' ? 'relative text-gray' : 'text-gray-700'}`}
                        >
                            MRFs
                            {activeTab === 'mrf' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[rgb(151,36,126)] to-[rgb(224,25,80)]"></div>
                            )}
                        </button>
                    </div>
 
                    {activeTab === 'requirements' && (
                        <div className="mt-2">
                            {error && <p className="text-red-500">{error}</p>}
                            {requirements.length > 0 ? (
                                <div className="ag-theme-alpine text-left" style={{ height: 400, width: '100%' }}>
                                    <AgGridReact
                                        columnDefs={columnDefs}
                                        rowData={requirements}
                                        pagination={true}
                                        paginationPageSize={10}
                                        defaultColDef={{
                                            resizable: true,
                                            flex: 1,
                                            filter: true,
                                            sortable: true,
                                            cellStyle: { display: 'flex', alignItems: 'center' }
                                        }}
                                        getRowHeight={getRowHeight}
                                        headerHeight={50}
                                    />
                                </div>
                            ) : (
                                <p>No requirements found.</p>
                            )}
                        </div>
                    )}
 
                    {activeTab === 'mrf' && (
                        <div className="mt-2">
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="flex mb-2 items-center">
                                <label className="block mt-1.5 font-bold">Filter by Month:</label>
                                <select
                                    value={selectedMonth}
                                    onChange={handleMonthSelection}
                                    className="border p-2 rounded ml-2"
                                >
                                    <option value="">--Select Month--</option>
                                    {Array.from({ length: 12 }, (_, index) => {
                                        const month = index + 1;
                                        return (
                                            <option key={month} value={`${month < 10 ? '0' : ''}${month}`}>
                                                {new Date(0, month - 1).toLocaleString('default', { month: 'long' })}
                                            </option>
                                        );
                                    })}
                                </select>
 
                            </div>
 
                            <div className="flex justify-end mb-2 -mt-12">
                                <button
                                    onClick={exportToExcel}
                                    className="bg-[linear-gradient(to_right,rgb(151,36,126),rgb(224,25,80))] text-white p-2 rounded"
                                >
                                    Export to Excel
                                </button>
                            </div>
 
                            {filteredMrfData.length > 0 ? (
                                <div className="ag-theme-alpine text-left" style={{ height: 400, width: '100%' }}>
                                    <AgGridReact
                                        columnDefs={mrfColumnDefs}
                                        rowData={filteredMrfData}
                                        frameworkComponents={{ statusCellRenderer: StatusCellRenderer }}
                                        pagination={true}
                                        paginationPageSize={10}
                                        defaultColDef={{
                                            flex: 1,
                                            cellStyle: { display: 'flex', alignItems: 'center' }
                                        }}
                                        headerHeight={50}
                                    />
                                </div>
                            ) : (
                                <p>No MRFs found.</p>
                            )}
 
                        </div>
                    )}
                </div>
 
                {modalOpen && (
                    <ClientDetails
                        organizationClientDetails={selectedOrganization}
                        onClose={() => {
                            setModalOpen(false);
                            setSelectedOrganization(null);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
 
export default Datewise;