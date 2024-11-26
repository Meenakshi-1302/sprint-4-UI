import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';
import { Bar } from 'react-chartjs-2';
import * as XLSX from 'xlsx';
import { Toaster, toast } from 'react-hot-toast';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Chart, registerables } from 'chart.js';
import Candidate from '../../../assets/candidate.gif';
import Jobrole from '../../../assets/jobrole.gif';
import Organization from '../../../assets/organization.gif';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { FaUserTie, FaClipboardCheck, FaUserCheck } from "react-icons/fa";
 
Chart.register(...registerables);
 
const candidateData = [
    {
        id: 1,
        name: "Arun",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "TechCorp" },
        interviewer: "John",
        interviewLevel: "Technical",
        status: "Completed",
        jobRole: "Frontend Developer",
        hiredDate: "2023-01-12",
    },
    {
        id: 2,
        name: "Raj",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "BNY" },
        interviewer: "kumaran",
        interviewLevel: "HR",
        status: "Screened",
        jobRole: "Designer",
        hiredDate: "2023-02-20",
    },
    {
        id: 3,
        name: "kuamr",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "Relevantz" },
        interviewer: "Naveen",
        interviewLevel: "Technical",
        status: "Completed",
        jobRole: "Tester",
        hiredDate: "2023-01-25",
    },
    {
        id: 4,
        name: "Ashwin",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "IFF" },
        interviewer: "Bala",
        interviewLevel: "Managerial",
        status: "Completed",
        jobRole: "Backend Developer",
        hiredDate: "2023-03-15",
    },
    {
        id: 5,
        name: "Peter",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "Relevantz" },
        interviewer: "Palani",
        interviewLevel: "Group Discussion",
        status: "Interviewing",
        jobRole: "Backend Developer",
        hiredDate: "2023-04-10",
    },
    {
        id: 6,
        name: "Akshaya",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "BNY" },
        interviewer: "Bharath",
        interviewLevel: "HR",
        status: "Completed",
        jobRole: "Devops",
        hiredDate: "2023-05-05",
    },
    {
        id: 7,
        name: "Monika",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "IFF" },
        interviewer: "Varathan",
        interviewLevel: "Assessment",
        status: "Screened",
        jobRole: "Cloud Engineer",
        hiredDate: "2023-06-30",
    },
    {
        id: 8,
        name: "Charumathi",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "Athena" },
        interviewer: "Guru",
        interviewLevel: "Managerial",
        status: "Completed",
        jobRole: "UI/UX",
        hiredDate: "2023-07-20",
    },
    {
        id: 9,
        name: "Varun",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "Athena" },
        interviewer: "kumaran",
        interviewLevel: "Technical",
        status: "Interviewing",
        jobRole: "HR",
        hiredDate: "2023-08-15",
    },
    {
        id: 10,
        name: "Banu",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "Relevantz" },
        interviewer: "Naveen",
        interviewLevel: "Group Discussion",
        status: "Pending",
        jobRole: "Frontend Developer",
        hiredDate: "2023-09-10",
    },
    {
        id: 11,
        name: "Abi",
        logo: "https://static.thenounproject.com/png/141120-200.png",
        organization: { name: "Athena" },
        interviewer: "Vel",
        interviewLevel: "Resume Screening",
        status: "Completed",
        jobRole: "CEO",
        hiredDate: "2023-10-05",
    },
];
 
const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};
 
const generateDailyEmployeeData = (dayOffset) => {
    const employees = [
        { id: "1", name: "Akshay", contact: "john@example.com", initial: "A", role: "DevOps Engineer", status: "Assessment - UI/UX" },
        { id: "2", name: "Lithi", contact: "jane@example.com", initial: "L", role: "Software Engineer", status: "Technical Round - Java Developer" },
        { id: "3", name: "Angelina", contact: "alice@example.com", initial: "A", role: "QA Engineer", status: "Hired - Full-Stack Developer" },
        { id: "4", name: "Michael", contact: "michael@example.com", initial: "M", role: "Data Scientist", status: "Assessment - UI/UX" },
        { id: "5", name: "Sarah", contact: "sarah@example.com", initial: "S", role: "Project Manager", status: "Technical Round - Java Developer" },
        { id: "6", name: "James", contact: "james@example.com", initial: "J", role: "Software Engineer", status: "Hired - Full-Stack Developer" },
        { id: "7", name: "Tina", contact: "tina@example.com", initial: "T", role: "DevOps Engineer", status: "Assessment - UI/UX" },
        { id: "8", name: "Laura", contact: "laura@example.com", initial: "L", role: "Software Engineer", status: "Technical Round - Java Developer" },
        { id: "9", name: "David", contact: "david@example.com", initial: "D", role: "QA Engineer", status: "Hired - Full-Stack Developer" },
        { id: "10", name: "Emily", contact: "emily@example.com", initial: "E", role: "Data Scientist", status: "Assessment - UI/UX" },
        { id: "11", name: "Anna", contact: "anna@example.com", initial: "A", role: "DevOps Engineer", status: "Technical Round - Java Developer" },
        { id: "12", name: "Luke", contact: "luke@example.com", initial: "L", role: "Project Manager", status: "Hired - Full-Stack Developer" }
    ];
   
    return employees.map(employee => {
        const newEmployee = { ...employee };
        // Modify employee status based on the offset
        if (dayOffset === 0 && ['Assessment - UI/UX', 'Technical Round - Java Developer', 'Hired - Full-Stack Developer'].includes(employee.status)) newEmployee.status = "Assessment - UI/UX";
        else if (dayOffset === 1 && employee.status === "Assessment - UI/UX") newEmployee.status = "Technical Round - Java Developer";
        else if (dayOffset === 2 && employee.status === "Technical Round - Java Developer") newEmployee.status = "Hired - Full-Stack Developer";
        return newEmployee;
    });
};
 
const getCurrentWeekDates = (startDate) => {
    const dates = [];
    const day = startDate.getDay();
    const diff = day >= 1 ? day - 1 : 6;
    startDate.setDate(startDate.getDate() - diff);
 
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push({
            day: date.toLocaleDateString("en-US", { day: "2-digit" }),
            month: date.toLocaleDateString("en-US", { month: "short" }),
            year: date.getFullYear(),
            weekDay: date.toLocaleDateString("en-US", { weekday: "short" }),
            employees: generateDailyEmployeeData(i)
        });
    }
    return dates;
};
 
const ScheduleWise = () => {
    const [filteredData, setFilteredData] = useState([]);
    const [jobRoles, setJobRoles] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [months, setMonths] = useState([
        ...Array(12).keys()].map(i => new Date(0, i).toLocaleString('default', { month: 'long' })).concat("All")
    );
    const [years, setYears] = useState(['All', '2023', '2022']);
    const [selectedJobRole, setSelectedJobRole] = useState('All');
    const [selectedOrganization, setSelectedOrganization] = useState('All');
    const [selectedMonth, setSelectedMonth] = useState('All');
    const [selectedYear, setSelectedYear] = useState('All');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState({});
    const [hiringTrendData, setHiringTrendData] = useState({ labels: [], datasets: [] });
 
    // WeeklyDates State
    const [startOfWeek, setStartOfWeek] = useState(new Date());
    const [weeksData, setWeeksData] = useState([getCurrentWeekDates(new Date())]);
    const [selectedIndex, setSelectedIndex] = useState(0);
 
    useEffect(() => {
        const loadImages = async () => {
            const candidateDataWithBase64 = await Promise.all(candidateData.map(async candidate => {
                const base64Logo = await fetchImageAsBase64(candidate.logo);
                return { ...candidate, logo: base64Logo };
            }));
            setFilteredData(candidateDataWithBase64);
            setJobRoles(['All', ...Array.from(new Set(candidateDataWithBase64.map(item => item.jobRole)))]);
            setOrganizations(['All', ...Array.from(new Set(candidateDataWithBase64.map(item => item.organization?.name).filter(Boolean)))]);
            calculateHiringTrend(candidateDataWithBase64);
        };
        loadImages();
    }, []);
 
    const fetchImageAsBase64 = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]); // Get just the Base64 part
            };
            reader.readAsDataURL(blob);
        });
    };
 
    const calculateHiringTrend = (data) => {
        const dateCounts = {};
        data.forEach(candidate => {
            const date = new Date(candidate.hiredDate);
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
 
    const filterData = () => {
        const filtered = candidateData.filter(candidate => {
            const candidateDate = new Date(candidate.hiredDate);
            const month = candidateDate.toLocaleString('default', { month: 'long' });
            const year = candidateDate.getFullYear();
 
            return (
                (selectedJobRole === 'All' || candidate.jobRole === selectedJobRole) &&
                (selectedOrganization === 'All' || candidate.organization.name === selectedOrganization) &&
                (selectedMonth === 'All' || month === selectedMonth) &&
                (selectedYear === 'All' || year.toString() === selectedYear)
            );
        });
 
        setFilteredData(filtered);
        calculateHiringTrend(filtered); // Update the trend based on filtered data
    };
 
    useEffect(() => {
        filterData();
    }, [selectedJobRole, selectedOrganization, selectedMonth, selectedYear]);
 
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
                    Name: candidate.name,
                    Job_Role: candidate.jobRole,
                    Interviewer: candidate.interviewer,
                    Interview_Level: candidate.interviewLevel,
                    Status: candidate.status,
                    Organization: candidate.organization.name
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
            field: "name",
            cellRendererFramework: params => (
                <div className="flex items-center">
                    <img src={`data:image/png;base64,${params.data.logo}`} alt={params.data.name} style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                    <span className="text-blue-500 cursor-pointer" onClick={() => openModal(params.data)}>
                        {params.value}
                    </span>
                </div>
            ),
        },
        { headerName: "Interviewer Name", field: "interviewer" },
        { headerName: "Interview Level", field: "interviewLevel" },
        { headerName: "Status", field: "status" },
    ];
 
    const handleDateSelect = (index) => {
        setSelectedIndex(index);
    };
 
    const handleNextWeek = () => {
        const nextWeekStart = new Date(startOfWeek);
        nextWeekStart.setDate(startOfWeek.getDate() + 7);
        setStartOfWeek(nextWeekStart);
        setWeeksData([...weeksData, getCurrentWeekDates(nextWeekStart)]);
    };
 
    const handlePreviousWeek = () => {
        const prevWeekStart = new Date(startOfWeek);
        prevWeekStart.setDate(startOfWeek.getDate() - 7);
        setStartOfWeek(prevWeekStart);
        setWeeksData([...weeksData, getCurrentWeekDates(prevWeekStart)]);
    };
 
    const groupEmployeesByStatus = (employees) => {
        return employees.reduce((groups, employee) => {
            const statusGroup = groups[employee.status] || [];
            statusGroup.push(employee);
            groups[employee.status] = statusGroup;
            return groups;
        }, {});
    };
 
    const groupedEmployees = weeksData.length > 0 && weeksData[weeksData.length - 1][selectedIndex]?.employees
        ? groupEmployeesByStatus(weeksData[weeksData.length - 1][selectedIndex].employees)
        : {};
 
    return (
        <div className="flex p-6">
            <div className="flex-1">
                <Toaster position="top-center" reverseOrder={false} />
 
                <div className="grid grid-cols-3 gap-4 mb-6 mt-32">
                    <div className="border border-gray-300 rounded-lg p-4 shadow-lg text-center bg-gradient-to-r from-[#d9e4f5] to-[#f2f2f2] h-40 flex flex-col justify-center items-center">
                        <img src={Candidate} alt="Total Candidates" className="object-contain w-16 h-16 mb-3 rounded-full border border-gray-400 p-1" />
                        <h2 className="font-semibold text-center text-lg text-gray-800">Total Candidates</h2>
                        <p className="font-bold text-black text-center text-3xl">{filteredData.length}</p>
                    </div>
 
                    <div className="border border-gray-300 rounded-lg p-4 shadow-lg text-center bg-gradient-to-r from-[#d9e4f5] to-[#f2f2f2] h-40 flex flex-col justify-center items-center">
                        <img src={Jobrole} alt="Total Job Roles" className="object-contain w-16 h-16 mb-3 rounded-full border border-gray-400 p-1" />
                        <h2 className="font-semibold text-center text-lg text-gray-800">Total Job Roles</h2>
                        <p className="font-bold text-black text-center text-3xl">{jobRoles.length - 1}</p>
                    </div>
 
                    <div className="border border-gray-300 rounded-lg p-4 shadow-lg text-center bg-gradient-to-r from-[#d9e4f5] to-[#f2f2f2] h-40 flex flex-col justify-center items-center">
                        <img src={Organization} alt="Total Organizations" className="object-contain w-16 h-16 mb-3 rounded-full border border-gray-400 p-1" />
                        <h2 className="font-semibold text-center text-lg text-gray-800">Total Organizations</h2>
                        <p className="font-bold text-black text-center text-3xl">{organizations.length - 1}</p>
                    </div>
                </div>
 
                <div className="flex mb-4">
                    <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="border rounded-md p-2 mr-4">
                        {months.map(month => <option key={month} value={month}>{month}</option>)}
                    </select>
 
                    <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="border rounded-md p-2">
                        {years.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
 
                <div style={{ width: '200%', maxWidth: '800px', marginRight: 'auto', marginBottom: '20px' }}>
    <Bar data={hiringTrendData} options={{ maintainAspectRatio: false }} height={300} />
</div>
 
                <div className="shadow-lg rounded-lg p-4 my-4" style={{ width: '160%', backgroundColor: '#f2f2f2' }}>
             
 
<div className="flex mb-4 items-center">
    <div className="flex flex-grow">
        <select value={selectedJobRole} onChange={e => setSelectedJobRole(e.target.value)} className="border rounded-md p-2 mr-4">
            {jobRoles.map(role => <option key={role} value={role}>{role}</option>)}
        </select>
 
        <select value={selectedOrganization} onChange={e => setSelectedOrganization(e.target.value)} className="border rounded-md p-2">
            {organizations.map(org => <option key={org} value={org}>{org}</option>)}
        </select>
    </div>
 
    <button
        onClick={exportToExcel}
        className="px-4 py-2 bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-md hover:from-[#A05292] hover:to-[#E03A69] transition duration-200"
        style={{ zIndex: 10, position: 'relative' }} // Make sure it's clickable
    >
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
                            getRowClass={(params) => (params.node.rowIndex % 2 === 0 ? 'even-row' : 'odd-row')}
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
                    <h2 className="text-xl font-bold">{selectedCandidate.name} - Profile</h2>
                    {selectedCandidate.logo && (
                        <img
                            src={`data:image/png;base64,${selectedCandidate.logo}`}
                            alt={selectedCandidate.name}
                            style={{ width: '50px', height: '50px', marginBottom: '8px' }}
                        />
                    )}
                    <p><strong>Job Role:</strong> {selectedCandidate.jobRole}</p>
                    <p><strong>Interviewer:</strong> {selectedCandidate.interviewer}</p>
                    <p><strong>Interview Level:</strong> {selectedCandidate.interviewLevel}</p>
                    <p><strong>Status:</strong> {selectedCandidate.status}</p>
                    <button className='mt-4 p-2 bg-red-500 text-white rounded-md' onClick={closeModal}>Close</button>
                </Modal>
            </div>
 
            <div className="ml-6 mt-32">
                <div className="max-w-md p-6 bg-blue-100 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={handlePreviousWeek} className="text-blue-600">
                            <FaChevronLeft />
                        </button>
                        <div className="text-xl font-bold text-center">
                            {weeksData.length > 0 ? `${weeksData[weeksData.length - 1][0].month} ${weeksData[weeksData.length - 1][0].year}` : ""}
                        </div>
                        <button onClick={handleNextWeek} className="text-blue-600">
                            <FaChevronRight />
                        </button>
                    </div>
 
                    <div className="flex justify-center">
                        {weeksData.length > 0 &&
                            weeksData[weeksData.length - 1].map((date, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleDateSelect(index)}
                                    className="relative cursor-pointer mx-4 text-center"
                                >
                                    <div className="text-gray-600 font-semibold">{date.weekDay}</div>
                                    <div className={`text-2xl ${selectedIndex === index ? "font-bold text-blue-600" : "text-gray-800"}`}>
                                        {date.day}
                                    </div>
                                    {selectedIndex === index && (
                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded"></div>
                                    )}
                                </div>
                            ))}
                    </div>
 
                    <hr className="my-4 border-t border-gray-400" />
 
                    <div className="flex flex-col">
                        {Object.keys(groupedEmployees).map((status) => {
                            const employees = groupedEmployees[status];
                            return (
                                <div key={status} className="mb-4">
                                    <h3 className="font-bold text-lg">
                                        {status} <span className="text-gray-500">({employees.length})</span>
                                    </h3>
                                    <div className="flex items-center">
                                        {employees.slice(0, 3).map((employee) => (
                                            <div
                                                key={employee.id}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: getRandomColor(),
                                                    borderRadius: '50%',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                    marginRight: '-15px',
                                                }}
                                            >
                                                {employee.initial}
                                                <span className="ml-1" title={employee.role}>
                                                    {employee.role.includes("Engineer") ? <FaUserTie /> : employee.role.includes("QA") ? <FaClipboardCheck /> : <FaUserCheck />}
                                                </span>
                                            </div>
                                        ))}
                                        {employees.length > 3 && (
                                            <span className="text-gray-600 ml-4">
                                                +{employees.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
 
export default ScheduleWise;