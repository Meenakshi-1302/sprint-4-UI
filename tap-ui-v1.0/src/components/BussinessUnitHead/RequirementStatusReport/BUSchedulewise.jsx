import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { Toaster, toast } from 'react-hot-toast';
import { getEmployees } from '../../../services/Admin/Employee/EmployeeService';
import { getAllCandidates } from '../../../services/Recruiter/Candidate/CandidateInfoService';
import { getAllInterviews } from '../../../services/Admin/BussinessUnit/AdminBusinessUnitService';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Chart, registerables } from 'chart.js';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Building2, UserCog, Users } from 'lucide-react';
 
Chart.register(...registerables);
 
const StatCard = ({ icon: Icon, title, value, color }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-gray-600 text-sm">{title}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
        </div>
    );
};
 
const ScheduleWise = () => {
    const [employees, setEmployees] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [interviews, setInterviews] = useState([]); // State for interviews
    const [filteredData, setFilteredData] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [selectedJobRole, setSelectedJobRole] = useState('All');
    const [selectedOrganization, setSelectedOrganization] = useState('All');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState({});
    const [hiringTrendData, setHiringTrendData] = useState({ labels: [], datasets: [] });
 
    // Weekly Dates State
    const [startOfWeek, setStartOfWeek] = useState(new Date());
    const [weeksData, setWeeksData] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [expandedCandidates, setExpandedCandidates] = useState(false);
 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const employeeData = await getEmployees();
                const candidateData = await getAllCandidates();
                const interviewData = await getAllInterviews();
 
                setEmployees(employeeData);
                setCandidates(candidateData);
                setInterviews(interviewData);
                setFilteredData(candidateData);
                setJobRoles(['All', ...new Set(candidateData.map(item => item.skill))]);
                setOrganizations(['All', ...new Set(employeeData.map(item => item.businessUnit.name))]);
 
                calculateHiringTrend(candidateData);
                setWeeksData(getCurrentWeekDates(startOfWeek));
            } catch (error) {
                toast.error('Error fetching data');
                console.error(error);
            }
        };
 
        fetchData();
    }, [startOfWeek]);
 
    const getCurrentWeekDates = (startDate) => {
        const dates = [];
        const day = startDate.getDay();
        const diff = day >= 1 ? day - 1 : 6;
        startDate.setDate(startDate.getDate() - diff);
 
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const dayData = {
                day: date.toLocaleDateString("en-US", { day: "2-digit" }),
                month: date.toLocaleDateString("en-US", { month: "short" }),
                year: date.getFullYear(),
                weekDay: date.toLocaleDateString("en-US", { weekday: "short" }),
                interviews: interviews.filter(interview => {
                    return (
                        new Date(interview.interviewDate).toDateString() === date.toDateString()
                    );
                }),
            };
            dates.push(dayData);
        }
        return dates;
    };
 
    const calculateHiringTrend = (data) => {
        const dateCounts = {};
        data.forEach(candidate => {
            const date = new Date(candidate.assignedAt);
            const month = date.toLocaleString('default', { month: 'long' });
            const year = date.getFullYear();
            const key = `${month} ${year}`;
            dateCounts[key] = (dateCounts[key] || 0) + 1;
        });
 
        const labels = Object.keys(dateCounts);
        const dataValues = Object.values(dateCounts);
 
        setHiringTrendData({
            labels: labels,
            datasets: [{
                label: 'Candidates Hired',
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                data: dataValues,
            }]
        });
    };
 
    const openModal = (candidate) => {
        setSelectedCandidate(candidate);
        setModalIsOpen(true);
    };
 
    const closeModal = () => {
        setModalIsOpen(false);
    };
 
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = filteredData.map(candidate => ({
            Name: candidate.firstName + ' ' + candidate.lastName,
            Skill: candidate.skill,
            Mobile: candidate.mobileNumber,
            Email: candidate.email,
            Status: candidate.status,
        }));
 
        const ws = XLSX.utils.json_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Candidates');
        XLSX.writeFile(wb, 'candidates_data.xlsx');
 
        toast.success('Exported to Excel successfully!');
    };
 
    const columnDefs = [
        {
            headerName: "S.No",
            cellRenderer: params => params.node.rowIndex + 1,
            width: 80,
        },
        {
            headerName: "Candidate Name",
            field: "firstName",
            cellRendererFramework: params => (
                <div className="flex items-center">
                    <div style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: '#007bff',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {params.data.firstName.charAt(0)}
                    </div>
                    <span className="text-blue-500 cursor-pointer ml-2" onClick={() => openModal(params.data)}>
                        {params.data.firstName + " " + (params.data.lastName || '')}
                    </span>
                </div>
            ),
        },
        { headerName: "Mobile", field: "mobileNumber" },
        { headerName: "Email", field: "email" },
        { headerName: "Status", field: "status" },
    ];
 
    const handleDateSelect = (index) => {
        setSelectedIndex(index);
    };
 
    const handleNextWeek = () => {
        const nextWeekStart = new Date(startOfWeek);
        nextWeekStart.setDate(startOfWeek.getDate() + 7);
        setStartOfWeek(nextWeekStart);
    };
 
    const handlePreviousWeek = () => {
        const prevWeekStart = new Date(startOfWeek);
        prevWeekStart.setDate(startOfWeek.getDate() - 7);
        setStartOfWeek(prevWeekStart);
    };
 
    // Get the candidate details for the selected date
    const selectedDateInterviews = weeksData[selectedIndex]?.interviews || [];
    const selectedCandidates = selectedDateInterviews.map(interview => interview.candidate); // Extracting candidates from selected interviews
 
    return (
        <div className="flex p-6">
            <div className="flex-1">
                <Toaster position="top-center" reverseOrder={false} />
 
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        title="Total Candidates"
                        value={filteredData.length}
                        color="bg-orange-500"
                    />
                    <StatCard
                        icon={UserCog}
                        title="Total Job Roles"
                        value={jobRoles.length - 1}
                        color="bg-purple-500"
                    />
                    <StatCard
                        icon={Building2}
                        title="Total Organizations"
                        value={organizations.length - 1}
                        color="bg-red-500"
                    />
                </div>
 
                <div className="shadow-lg rounded-lg p-2 my-4 bg-white">
                    <h2 className="text-lg font-bold mb-4">Hiring Trend</h2>
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                        <Bar data={hiringTrendData} options={{ maintainAspectRatio: false }} height={200} />
                    </div>
                </div>
 
                {/* Weekly Calendar Card */}
                <div className="shadow-lg rounded-lg p-4 my-4 bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePreviousWeek} className="text-blue-600">
                            <FaChevronLeft />
                        </button>
                        <div className="text-xl font-bold text-center">
                            {weeksData.length > 0 ? `${weeksData[0].month} ${weeksData[0].year}` : ""}
                        </div>
                        <button onClick={handleNextWeek} className="text-blue-600">
                            <FaChevronRight />
                        </button>
                    </div>
 
                    <div className="flex justify-center">
                        {weeksData.map((date, index) => (
                            <div key={index} className="relative cursor-pointer mx-4 text-center" onClick={() => handleDateSelect(index)}>
                                <div className="text-gray-600 font-semibold">{date.weekDay}</div>
                                <div className={`text-2xl ${selectedIndex === index ? "font-bold text-blue-600" : "text-gray-800"}`}>
                                    {date.day}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
 
                {/* Candidate Profiles for Selected Day */}
                <div className="shadow-lg rounded-lg p-4 my-4 bg-white">
                    <h2 className="text-lg font-bold mb-4">Candidates for Selected Day</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedCandidates.length > 0 ? (
                            selectedCandidates.map(candidate => (
                                <div key={candidate.candidateId} className="bg-gray-100 p-4 rounded-lg flex items-center">
                                    <div className="mr-4" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {candidate.firstName.charAt(0)}
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold">{candidate.firstName} {candidate.lastName}</p>
                                        <p>{candidate.skill} - {candidate.status}</p>
                                    </div>
                                    <button className="text-blue-500" onClick={() => openModal(candidate)}>Details</button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No candidates scheduled for this date.</p>
                        )}
                    </div>
                </div>
 
                <div className="shadow-lg rounded-lg p-4 my-4">
                    <div className="flex mb-4 items-center">
                        <div className="flex flex-grow">
                            <select className="border rounded-md p-2 mr-4" onChange={e => setSelectedJobRole(e.target.value)}>
                                {jobRoles.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                            <select className="border rounded-md p-2" onChange={e => setSelectedOrganization(e.target.value)}>
                                {organizations.map(org => <option key={org} value={org}>{org}</option>)}
                            </select>
                        </div>
 
                        <button onClick={exportToExcel} className="px-4 py-2 bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-md hover:from-[#A05292] hover:to-[#E03A69] transition duration-200">
                            Export to Excel
                        </button>
                    </div>
 
                    <div className="ag-theme-alpine" style={{ height: 400, width: '90%', backgroundColor: '#ffffff', border: '1px solid #D9D9D9' }}>
                        <AgGridReact
                            rowData={filteredData}
                            columnDefs={columnDefs}
                            pagination={true}
                            paginationPageSize={5}
                            domLayout="autoHeight"
                            rowHeight={40}
                        />
                    </div>
                </div>
 
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Candidate Profile"
                    ariaHideApp={false}
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        },
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                            maxWidth: '400px',
                        },
                    }}
                >
                    <h2 className="text-xl font-bold">{selectedCandidate.firstName} {selectedCandidate.lastName} - Profile</h2>
                    <p><strong>Mobile:</strong> {selectedCandidate.mobileNumber}</p>
                    <p><strong>Email:</strong> {selectedCandidate.email}</p>
                    <p><strong>Skill:</strong> {selectedCandidate.skill}</p>
                    <p><strong>Status:</strong> {selectedCandidate.status}</p>
                    <button className='mt-4 p-2 bg-red-500 text-white rounded-md' onClick={closeModal}>Close</button>
                </Modal>
            </div>
        </div>
    );
};
 
export default ScheduleWise;