import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLaptopCode, FaBriefcase, FaEdit, FaEye, FaPlus } from "react-icons/fa";
import { getMrfByMrfId } from '../../services/Recruiter/OfferLetter/OfferCreationService';

const RecruitementProcessLevels = () => {
    const navigate = useNavigate();
    const [mrfid, setMrfid] = useState(null);
    const [isPending, setIsPending] = useState(false);
    const [pendingMessage, setPendingMessage] = useState('');
    const [workflowEnabled, setWorkflowEnabled] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [mrfData, setMrfData] = useState(null);

    const fetchMrfId = async () => {
        const storedValue = sessionStorage.getItem('mrfid');
        if (storedValue) {
            setMrfid(storedValue);
        }
    };

    const [rpls, setRpls] = useState({
        recruiterManagerId: 2,
        recruitmentProcesses: [],
    });
    const [selectedClients, setSelectedClients] = useState([]);
    const [loading, setLoading] = useState(true);

    const [employees, setEmployees] = useState([]);
    const [client, setClient] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedType, setSelectedType] = useState('');
    const [assessmentType, setAssessmentType] = useState('');
    const [interviewName, setInterviewName] = useState('');
    const [interviewers, setInterviewers] = useState([]);
    const [editLevelNumber, setEditLevelNumber] = useState(null);
    const [workflowStatus, setWorkflowStatus] = useState('');
    const [clientId, setClientId] = useState([]);
    const [showEmployeeDropdowns, setShowEmployeeDropdowns] = useState(false);
    const [showClientDropdowns, setShowClientDropdowns] = useState(false);
    
    const fetchWorkflowStatus = async () => {
        try {
            const mrfid = sessionStorage.getItem('mrfid');
            const response = await axios.get(`http://localhost:8080/tap/getWorkflowByMrfIdForRecruitmentProcess/${mrfid}`);
            const status = response.data ? response.data.status : '';
            setWorkflowStatus(status);
            if (status === 'Pending') {
                setIsPending(true);
                setWorkflowEnabled(false);
                setPendingMessage("Can't add, edit, or delete levels because the workflow status is pending.");
            } else {
                setIsPending(false);
                setPendingMessage('');
                setWorkflowEnabled(true);
            }
        } catch (error) {
            console.error("Failed to fetch workflow status:", error);
        }
    };
    const fetchMRF = async () => {
        const mrfid = sessionStorage.getItem("mrfid");
        try {
          const response = await getMrfByMrfId(mrfid);
            console.log(response.data);
          setMrfData(response.data);
        } catch (err) {
          console.error('Error fetching data:', err);
        } finally {
          setLoading(false);
        }
      };
   

    const fetchRecruitmentProcesses = async () => {
        const mrfid = sessionStorage.getItem('mrfid');
        try {
            const response = await axios.get(`http://localhost:8080/tap/getRecruitmentProcessLevels/${mrfid}`);
            if (response.data) {
                setRpls(prevRpls => ({ ...prevRpls, recruitmentProcesses: response.data }));
            }
        } catch (error) {
            console.error("Failed to fetch recruitment processes:", error);
        }
    };

    const fetchAllEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8080/tap/getallemployee');
            if (response.data) {
                setEmployees(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch employee details", error);
        }
    };
    
    
    const fetchAllClients = async () => {
        try {
            const mrfid = sessionStorage.getItem('mrfid');
            const response = await axios.get(`http://localhost:8080/tap/clients/viewClientNameByMrfId/${mrfid}`);
            if (response.data) {
                if (Array.isArray(response.data)) {
                    setClient(response.data);
                } else {
                    setClient([response.data]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch client details", error);
        }
    };

    useEffect(() => {
        fetchMRF();
        fetchMrfId();
        fetchWorkflowStatus();
        fetchRecruitmentProcesses();
        fetchAllEmployees();
        fetchAllClients();
    }, []);

    const addLevel = () => {
        setOpenModal(true);
        resetModalFields();
    };

    const resetModalFields = () => {
        setSelectedType('');
        setAssessmentType('');
        setInterviewName('');
        setInterviewers([]);
    };
    const handleEdit = (level) => {
        setEditLevelNumber(level.level);
        setSelectedType(level.recruitmentProcessType);
        if (level.recruitmentProcessType === 'Assessment') {
            setAssessmentType(level.recruitmentProcessName);
            setInterviewName('');
            setInterviewers([]);
        } else {
            setInterviewName(level.recruitmentProcessName);
            setAssessmentType('');
            // Check if each interviewer has a valid employee object before accessing employeeId
            setInterviewers(level.interviewer
                .filter(emp => emp && emp.employee) // Filter out invalid interviewers
                .map(emp => emp.employee.employeeId)
            );
        }
        setOpenEditModal(true);
    };
    const handleDelete = async (level) => {
        if (isSaving) {
            toast.warn('Please wait until the current operation is finished.');
            return;
        }

        if (workflowStatus === 'Approved') {
            if (level.recruitmentProcessId) {
                await handleApprovedDeleteDetails(level);
            } else {
                const updatedLevels = rpls.recruitmentProcesses.filter(l => l.level !== level.level);
                const adjustedLevels = updatedLevels.map((lvl, index) => ({
                    ...lvl,
                    level: index + 1,
                }));

                setRpls(prevState => ({
                    ...prevState,
                    recruitmentProcesses: adjustedLevels,
                }));

                toast.success('Level deleted successfully!');
            }
        } else {
            const updatedLevels = rpls.recruitmentProcesses.filter(l => l.level !== level.level);
            const adjustedLevels = updatedLevels.map((lvl, index) => ({
                ...lvl,
                level: index + 1,
            }));

            setRpls(prevState => ({
                ...prevState,
                recruitmentProcesses: adjustedLevels,
            }));

            toast.success('Level deleted successfully!');
        }
    };

    const handleBeforeUpdateDetails = async () => {
        const updatedLevel = {
            level: editLevelNumber,
            recruitmentProcessType: selectedType,
            recruitmentProcessName: selectedType === 'Assessment' ? assessmentType : interviewName,
            interviewer: selectedType === 'Interview' ?
                interviewers.filter(empId => empId) // Only include non-empty interviewers
                    .map(empId => ({
                        client: {},
                        employee: { employeeId: empId },
                        status: 'Pending'
                    }))
                : [],
            completedStatus: 'Pending',
            client: clientId.length > 0 ? clientId.map(id => ({
                client: { clientId: id },
                status: 'Pending'
            })) : [] 
        };

        setRpls(prevRpls => ({
            ...prevRpls,
            recruitmentProcesses: prevRpls.recruitmentProcesses.map(level =>
                (level.level === editLevelNumber ? { ...level, ...updatedLevel } : level)
            )
        }));

        toast.success('Level details updated successfully!');
        setOpenEditModal(false);
    };

    const handleApprovedUpdateDetails = async () => {
        setIsSaving(true);
        const existingLevel = rpls.recruitmentProcesses.find(level => level.level === editLevelNumber);

        if (!existingLevel || !existingLevel.recruitmentProcessId) {
            toast.error('Unable to find the level to update.');
            setIsSaving(false);
            return;
        }

        const updatedLevel = {
            recruitmentProcessId: existingLevel.recruitmentProcessId,
            level: existingLevel.level,
            mrf: existingLevel.mrf,
            recruitmentProcessType: selectedType,
            recruitmentProcessName: selectedType === 'Assessment' ? assessmentType : interviewName,
            interviewer: selectedType === 'Interview' 
                ? interviewers.filter(empId => empId).map(empId => ({
                    client: {},
                    employee: { employeeId: empId },
                    status: 'Pending',
                })) 
                : [],
            completedStatus: 'Pending',
            client: clientId.length > 0 ? clientId.map(id => ({
                client: { clientId: id },
                status: 'Pending'
            })) : [] 
        };

        try {
            const response = await axios.put('http://localhost:8080/tap/updateRecruitmentProcessLevel', updatedLevel);
            console.log("new level is", updatedLevel);

            if (response.status === 200) {
                setRpls(prevRpls => ({
                    ...prevRpls,
                    recruitmentProcesses: prevRpls.recruitmentProcesses.map(level =>
                        (level.recruitmentProcessId === updatedLevel.recruitmentProcessId ? updatedLevel : level)
                    )
                }));
                toast.success('Level updated successfully!');
            } else {
                toast.error('Failed to update the level.');
            }
        } catch (error) {
            console.error("Failed to update recruitment process:", error);
            toast.error(`Failed to update the level. ${error.response ? error.response.data : 'Please verify the API.'}`);
        } finally {
            setIsSaving(false);
            setOpenEditModal(false);
        }
    };

    const handleUpdateDetails = async () => {
        if (!validateInputs()) return;

        if (workflowStatus === 'Rejected' || workflowStatus === 'Approved') {
            await handleApprovedUpdateDetails();
        } else if (workflowStatus === 'Pending') {
            toast.warning('Levels cannot be updated in the current workflow status.');
        } else {
            handleBeforeUpdateDetails();
        }
    };
 const handleSaveDetails = async () => {
        if (!validateInputs()) return;
    
        setIsSaving(true);
        try {
            const mrfid = sessionStorage.getItem('mrfid');
            const newLevel = {
                level: rpls.recruitmentProcesses.length + 1,
                mrf: { mrfId: mrfid },
                recruitmentProcessType: selectedType,
                recruitmentProcessName: selectedType === 'Assessment' ? assessmentType : interviewName,
                interviewer: selectedType === 'Interview'
                    ? [
                        ...interviewers
                            .filter(empId => empId)
                            .map(empId => ({
                                employee: { employeeId: empId },
                                client: {}, // Placeholder for client
                                status: 'Pending',
                            })),
                        ...clientId.map(id => ({
                            employee: {}, // Placeholder for employee
                            client: { clientId: id },
                            status: 'Pending',
                        })),
                    ]
                    : [],
                completedStatus: 'Pending'
            };

            console.log(newLevel);
            if (workflowStatus === "Approved") {
                // Directly save the new level in the database
                const response = await axios.post('http://localhost:8080/tap/insertRecruitmentProcessLevel', newLevel);
                if (response.status === 200) {
                    // Optionally: Update local state or show success message
                    setOpenModal(false);
                    toast.success('Level saved successfully!');
                } else {
                    toast.error('Failed to save level details.');
                }
            } else {
                setRpls(prevRpls => ({
                    ...prevRpls,
                    recruitmentProcesses: [...prevRpls.recruitmentProcesses, newLevel],
                }));
    
                toast.success('Level saved successfully!');
                setOpenModal(false);
            }
        } catch (error) {
            console.error("Failed to save level details:", error);
            toast.error('Failed to save level details.');
        } finally {
            setIsSaving(false);
        }
    };
    const handleApprovedDeleteDetails = async (level) => {
        const levelToDelete = rpls.recruitmentProcesses.find(l => l.level === level.level);

        if (!levelToDelete) {
            toast.error('Unable to find the level to delete.');
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:8080/tap/deleteRecruitmentProcessLevel/${levelToDelete.recruitmentProcessId}`);

            if (response.status === 200) {
                setRpls(prevRpls => ({
                    ...prevRpls,
                    recruitmentProcesses: prevRpls.recruitmentProcesses.filter(l => l.recruitmentProcessId !== levelToDelete.recruitmentProcessId)
                }));
                toast.success('Level deleted successfully!');
                setOpenEditModal(false);
            } else {
                toast.error('Failed to delete the level.');
            }
        } catch (error) {
            console.error("Failed to delete recruitment process:", error);
            toast.error('Failed to delete the level. Please verify the API.');
        }
    };

    const handleAddEmployee = () => {
        setInterviewers([...interviewers, '']);
        setShowEmployeeDropdowns(true);
        setShowClientDropdowns(false); 
    };

    const handleAddClient = () => {
        setClientId([...clientId, '']); 
        setShowClientDropdowns(true);
        setShowEmployeeDropdowns(false);
    };

    const handleEmployeeChange = (index, employeeId) => {
        const updatedInterviewers = [...interviewers];
        updatedInterviewers[index] = employeeId;
        setInterviewers(updatedInterviewers);
    };

    const handleRemoveEmployee = (index) => {
        const updatedEmployees = [...interviewers];
        updatedEmployees.splice(index, 1);
        setInterviewers(updatedEmployees);
    };

    const handleClientChange = (index, clientId) => {
        const updatedClients = [...clientId];
        updatedClients[index] = clientId; 
        setClientId(updatedClients);

        const selectedClient = client.find(c => c.clientId === clientId);
        if (selectedClient) {
            setSelectedClients(prev => {
                const newClients = [...prev];
                if (!newClients[index]) newClients[index] = selectedClient.clientName; 
                return newClients;
            });
        }
    };

    const handleRemoveClient = (index) => {
        const updatedClients = [...clientId];
        updatedClients.splice(index, 1);
        setClientId(updatedClients);

        const updatedSelectedClientNames = [...selectedClients];
        updatedSelectedClientNames.splice(index, 1);
        setSelectedClients(updatedSelectedClientNames);
    };

    const sendForApproval = async () => {
        if (workflowStatus === 'Rejected' || workflowStatus === 'Approved') {
            await axios.patch(`http://localhost:8080/tap/updateWorkFlowAsPendingForRecruitmentProcess/${mrfid}`);
            toast.info('Levels sent for approval successfully. Your status is pending!');
        } else {
            try {
                await axios.post('http://localhost:8080/tap/addRecruitmentProcess', rpls);
                toast.success('Levels sent for approval successfully!');
                await fetchWorkflowStatus();
            } catch (error) {
                console.error("Failed to send for approval:", error);
                toast.error('Failed to send for approval.');
            }
        }
    };

    const handleCardClick = (level) => {
        if (level.recruitmentProcessType === 'Assessment') {
            sessionStorage.setItem('rpId', level.recruitmentProcessId);
            navigate(`/mrfone/assessmentschedulingpage/${level.recruitmentProcessId}`);
        }
    };

    const handleRadioChange = (event) => {
        setSelectedType(event.target.value);
    };

    const validateInputs = () => {
        if (selectedType === 'Assessment' && !assessmentType) {
            toast.error('Invalid assessment name. Assessment name cannot be empty.');
            return false;
        }

        if (selectedType === 'Interview') {
            const invalidInterviewName = /^[0-9]+$/.test(interviewName) || /^[^a-zA-Z0-9]+$/.test(interviewName);
            if (invalidInterviewName || !interviewName) {
                toast.error('Invalid interview name. It must contain letters and numbers and cannot consist of only numbers or symbols.');
                return false;
            }
        }

        return true;
    };

    return (
        <div className="w-full p-6 min-h-screen">
            {mrfData && (
        <div className="mb-8 bg-white text-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-950">MRF DETAILS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Department</h3>
                <p className='text-black'>{mrfData.mrfDepartmentName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaLaptopCode className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Technology</h3>
                <p className='text-black'>{mrfData.mrfRequiredTechnology}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaUser className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Probable Designation</h3>
                <p className='text-black'>{mrfData.probableDesignation}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Required Resources</h3>
                <p className='text-black'>{mrfData.requiredResourceCount}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Required Skills</h3>
                <p className='text-black'>{mrfData.requiredSkills}</p>
              </div>
            </div>
          </div>
        </div>
      )}
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
            {isPending && (
                <div className="mb-4 p-4 bg-yellow-300 text-yellow-800 rounded-lg shadow-md">
                    <p>{pendingMessage}</p>
                </div>
            )}
           
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-center text-gray-800">RECRUITMENT PROCESS LEVEL</h1>
                <div className={`flex items-center ml-4 p-2 rounded ${workflowStatus === 'Approved' ? 'bg-yellow-300 text-green-600' : workflowStatus === 'Rejected' ? 'bg-red-600 text-white' : 'hidden'}`}>
                    {workflowStatus === 'Approved' && (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Approved</span>
                        </>
                    )}
                    {workflowStatus === 'Rejected' && (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            <span>Rejected</span>
                        </>
                    )}
                </div>
                <button className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={addLevel} disabled={workflowStatus === 'Pending'}>
                    Add Level
                </button>
            </div>
            {rpls.recruitmentProcesses.length === 0 && (
                <div className="mb-4 p-4 bg-gray-200 text-gray-600 italic rounded-lg text-center">  Not yet updated: No levels have been added.</div>
            )}
            <div className="overflow-x-auto mb-4">
                <div className="flex items-center justify-center relative">
                {rpls.recruitmentProcesses.map((level, index) => (
    <React.Fragment key={level.level}>
        <div className="flex flex-col items-center">
            <div className="bg-gray-200 rounded-full h-19 w-12 flex items-center justify-center text-xl font-bold text-black">
                {level.level}
            </div>
            <div className="bg-white p-4 border rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 mt-1 w-68 h-48 text-left" onClick={() => handleCardClick(level)}> {/* Adjust height here */}                <p className="font-normal text-black-600">Type: {level.recruitmentProcessType}</p>

                {level.recruitmentProcessType === 'Interview' && (
                    <div>
                        <p className="font-normal text-black-600">Interview Name: {level.recruitmentProcessName}</p>
                        {Array.isArray(level.interviewer) && level.interviewer.length > 0 && (
                            <p className="font-normal text-black-600">
                                Interviewers: {
                                    level.interviewer.map(interviewer => 
                                        interviewer.employee && interviewer.employee.employeeName
                                            ? interviewer.employee.employeeName
                                            : (interviewer.client && interviewer.client.clientName
                                                ? interviewer.client.clientName
                                                : '') // Fallback to client name if employee is not available
                                    ).join(', ')
                                }
                            </p>
                        )}
                    </div>
                )}

                {level.recruitmentProcessType === 'Assessment' && (
                    <><p className="font-normal text-black-600">Assessment Name: {level.recruitmentProcessName}</p><br /></>
                    
                )}
                
                <div className="flex justify-between mt-4">
                    <button
                        className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${isSaving || workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleEdit(level); }}
                        disabled={isSaving || workflowStatus === 'Pending'}
                    >
                        Edit
                    </button>
                    <button
                        className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${isSaving || workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleDelete(level); }}
                        disabled={isSaving || workflowStatus === 'Pending'}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
        {index < rpls.recruitmentProcesses.length - 1 && (
            <div className="flex justify-center mx-2">
                <span className="text-2xl text-blue-600">→</span>
            </div>
        )}
    </React.Fragment>
))}

                 
                </div>
            </div>

            {rpls.recruitmentProcesses.length > 0 && (
                <center>
                <button
                    className={`bg-[#27235c]  items-center text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${isSaving || workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={sendForApproval}
                >
                    Send for Approval
                </button></center>
            )}

            {/* Add Level Modal */}
            <div className={`fixed inset-0 flex items-center justify-center ${openModal ? 'block' : 'hidden'}`}>
                <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
                    <h2 className="mb-4 text-lg font-semibold text-gray-700">Select Assessment or Interview</h2>
                    <div>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Assessment"
                                checked={selectedType === 'Assessment'}
                                onChange={handleRadioChange}
                                className="mr-2"
                                disabled={workflowStatus === 'Pending'}
                            />
                            Assessment
                        </label>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Interview"
                                checked={selectedType === 'Interview'}
                                onChange={handleRadioChange}
                                className="mr-2"
                                disabled={workflowStatus === 'Pending'}
                            />
                            Interview
                        </label>
                    </div>

                    {selectedType === 'Assessment' && (
                        <input
                            type="text"
                            placeholder="Assessment Name"
                            value={assessmentType}
                            onChange={(e) => setAssessmentType(e.target.value)}
                            className="mb-4 w-full p-2 border border-gray-300 rounded"
                            disabled={workflowStatus === 'Pending'}
                        />
                    )}

                    {selectedType === 'Interview' && (
                        <>
                            <input
                                type="text"
                                placeholder="Interview Name"
                                value={interviewName}
                                onChange={(e) => setInterviewName(e.target.value)}
                                className="mb-4 w-full p-2 border border-gray-300 rounded"
                                disabled={workflowStatus === 'Pending'}
                            />
                            <p className="font-semibold mb-2 text-gray-700">Interviewers:</p>
                            {interviewers.map((empId, index) => (
                                <div key={index} className="flex items-center mb-4">
                                    <select
                                        value={empId}
                                        onChange={(e) => handleEmployeeChange(index, e.target.value)}
                                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                                        disabled={workflowStatus === 'Pending'}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(employee => (
                                            <option key={employee.employeeId} value={employee.employeeId}>
                                                {employee.employeeName}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleRemoveEmployee(index)}
                                        className="ml-2 bg-red-500 text-white rounded px-2 py-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={handleAddEmployee}
                                className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c]`}
                                disabled={workflowStatus === 'Pending'}
                            >
                                Add Employee
                            </button>

                            <p className="font-semibold mb-2 text-gray-700 mt-4">Clients:</p>
                            {clientId.map((clientId, index) => (
                                <div key={index} className="flex items-center mb-4">
                                    <select value={clientId}  onChange={(e) => handleClientChange(index, e.target.value)}className="mb-2 w-full p-2 border border-gray-300 rounded"  disabled={workflowStatus === 'Pending'} >
                                        <option value="">Select Client</option>
                                        {client.map(c => (
                                            <option key={c.clientId} value={c.clientId}>
                                                {c.clientName}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => handleRemoveClient(index)}
                                        className="ml-2 bg-red-500 text-white rounded px-2 py-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={handleAddClient}
                                className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c]`}
                                disabled={workflowStatus === 'Pending'}
                            >
                                Add Client
                            </button>
                        </>
                    )}

                    <div className="flex justify-end mt-4">
                        <button
                            onClick={handleSaveDetails}
                            className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c]`}
                            disabled={workflowStatus === 'Pending'}
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setOpenModal(false)}
                            className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] ml-2`}
                            disabled={workflowStatus === 'Pending'}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Edit Level Modal */}
            <div className={`fixed inset-0 flex items-center justify-center ${openEditModal ? 'block' : 'hidden'}`}>
                <div className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md">
                    <h2 className="mb-4 text-lg font-semibold text-gray-700">Edit Level Details</h2>
                    <div>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Assessment"
                                checked={selectedType === 'Assessment'}
                                onChange={handleRadioChange}
                                className="mr-2"
                                disabled={workflowStatus === 'Pending'}
                            />
                            Assessment
                        </label>
                        <label className="block mb-2">
                            <input
                                type="radio"
                                value="Interview"
                                checked={selectedType === 'Interview'}
                                onChange={handleRadioChange}
                                className="mr-2"
                                disabled={workflowStatus === 'Pending'}
                            />
                            Interview
                        </label>
                    </div>

                    {selectedType === 'Assessment' && (
                        <input
                            type="text"
                            placeholder="Assessment Name"
                            value={assessmentType}
                            onChange={(e) => setAssessmentType(e.target.value)}
                            className="mb-4 w-full p-2 border border-gray-300 rounded"
                            disabled={workflowStatus === 'Pending'}
                        />
                    )}

                    {selectedType === 'Interview' && (
                        <>
                            <input
                                type="text"
                                placeholder="Interview Name"
                                value={interviewName}
                                onChange={(e) => setInterviewName(e.target.value)}
                                className="mb-4 w-full p-2 border border-gray-300 rounded"
                                disabled={workflowStatus === 'Pending'}
                            />
                            <p className="font-semibold mb-2 text-gray-700">Interviewers:</p>
                            {interviewers.map((empId, index) => (
                                <div key={index} className="flex items-center mb-4">
                                    <select
                                        value={empId}
                                        onChange={(e) => handleEmployeeChange(index, e.target.value)}
                                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                                        disabled={workflowStatus === 'Pending'}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(employee => (
                                            <option key={employee.employeeId} value={employee.employeeId}>
                                                {employee.employeeName}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleRemoveEmployee(index)}
                                        className="ml-2 bg-red-500 text-white rounded px-2 py-1"
                                    >
                                        ×
                                    </button>
                                    <select
                                        value={clientId[index] || ''}
                                        onChange={(e) => handleClientChange(index, e.target.value)}
                                        className="mb-2 w-full p-2 border border-gray-300 rounded"
                                        disabled={workflowStatus === 'Pending'}
                                    >
                                        <option value="">Select Client</option>
                                        {client.map(c => (
                                            <option key={c.clientId} value={c.clientId}>
                                                {c.clientName}
                                            </option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={() => handleRemoveClient(index)}
                                        className="ml-2 bg-red-500 text-white rounded px-2 py-1"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={handleAddEmployee}
                                className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={workflowStatus === 'Pending'}
                            >
                                Add Employee
                            </button>
                            <br />
                            <button
                                onClick={handleAddClient}
                                className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={workflowStatus === 'Pending'}
                            >
                                Add Client
                            </button>
                        </>
                    )}
                    <div className="flex justify-end mt-3">
                        <button
                            onClick={handleUpdateDetails}
                            className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSaving}>
                            Update
                        </button>
                        <button
                            onClick={() => setOpenEditModal(false)}
                            className={`bg-[#27235c] text-white border border-[#23275c] py-2 px-4 rounded-lg shadow hover:bg-[#27235c] hover:text-white hover:border-gray-200 ${workflowStatus === 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={workflowStatus === 'Pending'}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecruitementProcessLevels;


