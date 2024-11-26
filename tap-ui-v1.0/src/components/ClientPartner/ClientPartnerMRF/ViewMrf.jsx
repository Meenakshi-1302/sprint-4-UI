import React, { useEffect, useState } from 'react';
import {
    deleteMRF,
    fetchAllMRFs,
    fetchAllRecruitingManagers,
    assignMrfToRecruitingManager,
    fetchAssignedMRFs
} from '../../../services/ClientPartner/requirementService';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaTimes } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import ClientNavbar from '../../NavbarComponent/ClientPartnerNavbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
 
 
const ViewMrf = () => {
    const [mrfs, setMrfs] = useState([]);
    const [filteredMrfs, setFilteredMrfs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMrf, setSelectedMrf] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [slaDocumentUrl, setSlaDocumentUrl] = useState(null);
    const [slaModalOpen, setSlaModalOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeAccordionIndex, setActiveAccordionIndex] = useState(null);
    const [recruiterManagers, setRecruiterManagers] = useState([]);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedManagerId, setSelectedManagerId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
 
    const navigate = useNavigate();
 
    useEffect(() => {
        const fetchMRFs = async () => {
            setLoading(true); // Start loading
            try {
                const data = await fetchAllMRFs();
                console.log("Fetched MRFs:", data); // Fetched MRFs for debugging
                setMrfs(data); // Save fetched data
                setFilteredMrfs(data); // Initialize filtered MRFs
                await getAssignedMRFs(data); // Pass the fetched data to get assigned MRFs
            } catch (err) {
                setError("Failed to fetch MRFs");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
 
        fetchMRFs(); // Call the function
    }, []); // Empty dependency array means this runs once on mount
 
    const getAssignedMRFs = async (fetchedMrfs) => {
        try {
            const assignedData = await fetchAssignedMRFs();
            console.log("Fetched Assigned MRFs:", assignedData); // Logging assigned data
 
            // Use the fetched MRFs to find assignments
            const updatedMrfs = fetchedMrfs.map(mrf => {
                const assignedMrf = assignedData.find(assigned => assigned.mrf.mrfId === mrf.mrfId);
 
                if (assignedMrf) {
                    return {
                        ...mrf,
                        assigned: true,
                        assignedManagers: [
                            {
                                employeeName: assignedMrf.recruitingManager.employeeName,
                                employeeEmail:assignedMrf.recruitingManager.employeeEmail                            }
                        ]
                    };
                }
                return mrf; // Return original MRF if no match
            });
 
            console.log("Updated MRFs with Assigned Data:", updatedMrfs); // Logging updated MRFs
            setMrfs(updatedMrfs); // Update MRFs state with assigned data
            setFilteredMrfs(updatedMrfs); // Also update filtered MRFs
        } catch (err) {
            console.error("Failed to fetch assigned MRFs", err);
        }
    };
 
 
 
    useEffect(() => {
        const filtered = mrfs.filter(mrf => {
            const matchesStatus = statusFilter ? mrf?.mrfStatus?.mrfApprovalStatus === statusFilter : true;
            const matchesSearch =
                mrf?.probableDesignation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mrf?.mrfDepartmentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                mrf?.requiredSkills?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
 
        console.log("Filtered MRFs:", filtered); // Log filtered MRFs
        setFilteredMrfs(filtered);
    }, [statusFilter, searchQuery, mrfs]);
 
    const handleOpenModal = (mrf) => {
        setSelectedMrf(mrf);
        setModalOpen(true);
    };
 
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedMrf(null);
        setSlaDocumentUrl(null);
        setActiveAccordionIndex(null);
        setSelectedManagerId(null);
        setAssignModalOpen(false);
    };
 
    const handleAccordionToggle = (index) => {
        setActiveAccordionIndex(activeAccordionIndex === index ? null : index);
    };
 
    const handleViewBlobDocument = async () => {
        const base64 = selectedMrf?.mrfAgreement?.serviceLevelAgreement;
        if (base64) {
            const byteCharacters = atob(base64);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            setSlaDocumentUrl(url);
            setSlaModalOpen(true);
        } else {
            console.error('No SLA document available.');
        }
    };
 
    const handleCloseSlaModal = () => {
        setSlaModalOpen(false);
        setSlaDocumentUrl(null);
    };
 
    const handleEdit = (mrf) => {
        navigate('/updateMrf', { state: { requirementDetails: mrf } });
    };
 
    const handleDelete = (mrfId) => {
        const confirmDelete = toast.custom((t) => (
            <div className={`bg-white p-4 rounded shadow-lg ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
                <p className="text-lg">Are you sure you want to delete this MRF?</p>
                <div className="flex justify-end mt-2">
                    <button onClick={() => {
                        toast.dismiss(t.id);
                        deleteMRF(mrfId)
                            .then(() => {
                                setMrfs((prev) => prev.filter(mrf => mrf.mrfId !== mrfId));
                                setFilteredMrfs((prev) => prev.filter(mrf => mrf.mrfId !== mrfId));
                                toast.success('MRF deleted successfully.');
                            })
                            .catch((error) => {
                                console.error('Error deleting MRF:', error);
                                toast.error('Failed to delete MRF.');
                            });
                    }}
                    className="text-red-500 hover:text-red-700 mr-2"
                    >
                        OK
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="text-blue-500 hover:text-blue-700">
                        Cancel
                    </button>
                </div>
            </div>
        ));
    };
 
    const fetchRecruiterManagers = async () => {
        try {
            const response = await fetchAllRecruitingManagers();
            setRecruiterManagers(response);
            console.log("Fetched Recruiting Managers:", response); // Logging recruiting managers
        } catch (error) {
            console.error('Error fetching recruiter managers', error);
            toast.error('Failed to fetch recruiter managers');
        }
    };
 
    const handleAssignClick = (mrf) => {
        setSelectedMrf(mrf);
        fetchRecruiterManagers();
        setAssignModalOpen(true);
    };
 
    const handleAssignAction = async () => {
        if (selectedManagerId && selectedMrf) {
            const mrfId = selectedMrf.mrfId;
 
            try {
                const payload = {
                    mrf: {
                        mrfId: Number(mrfId),
                    },
                    recruitingManager: {
                        employeeId: Number(selectedManagerId),
                    }
                };
 
                await assignMrfToRecruitingManager(payload);
                await getAssignedMRFs();
 
                toast.success('Recruiter assigned successfully.');
                window.location.reload();
            } catch (error) {
                console.error('Error assigning recruiter:', error);
                toast.error('Failed to assign recruiter. Please try again.');
            } finally {
                handleCloseModal();
                setSelectedManagerId(null);
            }
        } else {
            toast.error('No MRF or manager selected for assignment.');
        }
    };
 
    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }
 
    if (error) {
        return <div className="text-center mt-10">{error}</div>;
    }
 
    return (
        <>
            <ClientNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
<div
    className={`flex-grow transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}
    ${sidebarOpen ? 'pl-8' : 'pl-2'} mt-16`}
>
    <div className="w-full max-w-screen-lg mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mt-20">MRF Summary</h1>
        <br />
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-2 md:mb-0">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded p-2 text-gray-500"
                >
                    <option value="">Filter by Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Declined">Declined</option>
                </select>
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search by designation, department, or skills"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border rounded p-2 pl-10 w-full md:w-3/4 lg:w-2/3 xl:w-2/5"
                    style={{ minWidth: '400px' }}
                />
                <AiOutlineSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
        </div>
                    {filteredMrfs.length === 0 ? (
                        <div className="text-center text-red-500 mt-4">No data found.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredMrfs.map((mrf) => (
                                <div key={mrf.mrfId} className="relative border rounded-lg shadow-lg p-6 bg-white transition-transform transform hover:scale-105 flex flex-col justify-between">
                                    <button onClick={() => handleOpenModal(mrf)} className="absolute top-2 right-2 text-blue-600 hover:text-blue-800 transition duration-200 flex items-center">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm0 22C6.478 22 2 17.522 2 12S6.478 2 12 2s10 4.478 10 10-4.478 10-10 10zm-1-15h2v2h-2zm0 4h2v8h-2z" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-xl">Department: {mrf.mrfDepartmentName}</h3>
                                        <p><strong>Required Technology:</strong> {mrf.mrfRequiredTechnology}</p>
                                        <p><strong>Probable Designation:</strong> {mrf.probableDesignation}</p>
                                        <p><strong>Required Resource Count:</strong> {mrf.requiredResourceCount}</p>
                                        <p><strong>Required Skills:</strong> {mrf.requiredSkills}</p>
                                        <p>
                                            <strong>Approval Status:</strong>
                                            <span className={
                                                mrf.mrfStatus?.mrfApprovalStatus === "Approved" ? "text-green-600 font-semibold" :
                                                mrf.mrfStatus?.mrfApprovalStatus === "Pending" ? "text-yellow-500 font-semibold" :
                                                mrf.mrfStatus?.mrfApprovalStatus === "Declined" ? "text-red-600 font-semibold" :
                                                "text-gray-500"
                                            }>
                                                {mrf.mrfStatus?.mrfApprovalStatus ?? 'N/A'}
                                            </span>
                                        </p>
                                        {mrf.assignedManagers && mrf.assignedManagers.length > 0 && (
                                            <p className="mt-2 text-blue-600 font-semibold">
                                                Assigned to: {mrf.assignedManagers.map(manager => `${manager.employeeName} (${manager.employeeEmail})`).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        {mrf.assigned ? (
                                            <span className="text-green-500 font-bold flex-grow flex justify-center">Assigned</span>
                                        ) : (
                                            mrf.mrfStatus?.mrfApprovalStatus === "Approved" && (
                                                <button onClick={() => handleAssignClick(mrf)} className="bg-[#27235C] text-white rounded px-4 py-1 hover:bg-[#1E1A4D] transition duration-200">
                                                    Assign
                                                </button>
                                            )
                                        )}
                                        <div className="flex space-x-4">
                                            {!mrf.assigned && (
                                                <>
                                                    <button onClick={() => handleEdit(mrf)} className="text-green-600 hover:text-green-700 transition duration-200 flex items-center">
                                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M3 17.25V21h3.75l12.75-12.75-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.42l-3.29-3.29a1 1 0 00-1.42 0l-1.41 1.41 4.7 4.7 1.42-1.42z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(mrf.mrfId)} className="text-red-600 hover:text-red-800 transition duration-200 flex items-center">
                                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M3 6h18l-1.5 12H4.5L3 6zm2-4h12a1 1 0 011 1v1H4V3a1 1 0 011-1z" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
 
            {/* Details Modal */}
            {modalOpen && selectedMrf && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6 relative shadow-lg transition-all transform hover:scale-105">
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                            <FaTimes size={20} />
                        </button>
                        <h2 className="font-bold text-xl text-center mb-2">Department: {selectedMrf.mrfDepartmentName}</h2>
                        <div className="mt-4">
                            <div className="border-b">
                                <button className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none focus:ring focus:ring-blue-400" onClick={() => handleAccordionToggle(0)}>
                                    <h3 className="font-bold">MRF Criteria</h3>
                                    {activeAccordionIndex === 0 ? <IoIosArrowUp className="text-gray-600" /> : <IoIosArrowDown className="text-gray-600" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 0 ? 'max-h-screen' : 'max-h-0'}`}>
                                    <div className="p-3">
                                        <p><strong>Employment Mode:</strong> {selectedMrf.mrfCriteria?.employmentMode ?? 'N/A'}</p>
                                        <p><strong>Educational Qualification:</strong> {selectedMrf.mrfCriteria?.educationalQualification ?? 'N/A'}</p>
                                        <p><strong>Years of Experience:</strong> {selectedMrf.mrfCriteria?.yearsOfExperience ?? 'N/A'}</p>
                                        <p><strong>Minimum CTC:</strong> {selectedMrf.mrfCriteria?.minimumCTC ?? 'N/A'}</p>
                                        <p><strong>Maximum CTC:</strong> {selectedMrf.mrfCriteria?.maximumCTC ?? 'N/A'}</p>
                                        <p><strong>Contract Start Date:</strong> {selectedMrf.mrfCriteria?.contractStartDate ?? 'N/A'}</p>
                                        <p><strong>Closure Date:</strong> {selectedMrf.mrfCriteria?.closureDate ?? 'N/A'}</p>
                                        <p><strong>Job Location:</strong> {selectedMrf.mrfCriteria?.jobLocation ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
 
                            <div className="border-b mt-2">
                                <button className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none focus:ring focus:ring-blue-400" onClick={() => handleAccordionToggle(1)}>
                                    <h3 className="font-bold">MRF Agreement</h3>
                                    {activeAccordionIndex === 1 ? <IoIosArrowUp className="text-gray-600" /> : <IoIosArrowDown className="text-gray-600" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 1 ? 'max-h-screen' : 'max-h-0'}`}>
                                    <div className="p-3">
                                        <p><strong>Billing Cycle:</strong> {selectedMrf.mrfAgreement?.billingCycle ?? 'N/A'}</p>
                                        <p><strong>Proposed Budget:</strong> {selectedMrf.mrfAgreement?.proposedBudget ?? 'N/A'}</p>
                                        <p><strong>Negotiated Price Point:</strong> {selectedMrf.mrfAgreement?.negotiatedPricePoint ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
 
                            <div className="border-b mt-2">
                                <button className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none focus:ring focus:ring-blue-400" onClick={() => handleAccordionToggle(2)}>
                                    <h3 className="font-bold">MRF Status</h3>
                                    {activeAccordionIndex === 2 ? <IoIosArrowUp className="text-gray-600" /> : <IoIosArrowDown className="text-gray-600" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 2 ? 'max-h-screen' : 'max-h-0'}`}>
                                    <div className="p-3">
                                        <p><strong>Approval Status:</strong> {selectedMrf.mrfStatus?.mrfApprovalStatus ?? 'N/A'}</p>
                                        <p><strong>Description for Changes:</strong> {selectedMrf.mrfStatus?.descriptionForChanges ?? 'N/A'}</p>
                                        <p><strong>Requirements Filled:</strong> {selectedMrf.mrfStatus?.requirementFilled ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
 
                            <div className="border-b mt-2">
                                <button className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none focus:ring focus:ring-blue-400" onClick={() => handleAccordionToggle(3)}>
                                    <h3 className="font-bold">Organization Details</h3>
                                    {activeAccordionIndex === 3 ? <IoIosArrowUp className="text-gray-600" /> : <IoIosArrowDown className="text-gray-600" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 3 ? 'max-h-screen' : 'max-h-0'}`}>
                                    <div className="p-3">
                                        <p><strong>Organization Name:</strong> {selectedMrf.requirement?.client.clientOrganization.organizationName ?? 'N/A'}</p>
                                        <p><strong>Organization Industry:</strong> {selectedMrf.requirement?.client.clientOrganization.organizationIndustry ?? 'N/A'}</p>
                                        <p><strong>Organization Email:</strong> {selectedMrf.requirement?.client.clientOrganization.organizationEmail ?? 'N/A'}</p>
                                        <p><strong>Organization Contact Number:</strong> {selectedMrf.requirement?.client.clientOrganization.organizationContactNumber ?? 'N/A'}</p>
                                        <p><strong>Organization Address:</strong> {selectedMrf.requirement?.client.clientOrganization.organizationAddress ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
 
                            <div className="border-b mt-2">
                                <button className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none focus:ring focus:ring-blue-400" onClick={() => handleAccordionToggle(4)}>
                                    <h3 className="font-bold">Client Details</h3>
                                    {activeAccordionIndex === 4 ? <IoIosArrowUp className="text-gray-600" /> : <IoIosArrowDown className="text-gray-600" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 4 ? 'max-h-screen' : 'max-h-0'}`}>
                                    <div className="p-3">
                                        <p><strong>Client Name:</strong> {selectedMrf.requirement?.client?.clientName ?? 'N/A'}</p>
                                        <p><strong>Client Position:</strong> {selectedMrf.requirement?.client?.clientPosition ?? 'N/A'}</p>
                                        <p><strong>Client Mobile:</strong> {selectedMrf.requirement?.client?.clientMobile ?? 'N/A'}</p>
                                        <p><strong>Client Email:</strong> {selectedMrf.requirement?.client?.clientEmail ?? 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        {selectedMrf.mrfAgreement?.serviceLevelAgreement && (
                            <button onClick={handleViewBlobDocument} className="mt-4 bg-[#27235C] text-white rounded px-4 py-2 hover:bg-[#1E1A4D]">
                                View SOW Document
                            </button>
                        )}
                    </div>
                </div>
            )}
 
            {/* Assign Manager Modal */}
            {assignModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-lg">
                        <button
                            onClick={() => setAssignModalOpen(false)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                        >
                            <FaTimes size={20} />
                        </button>
                        <h2 className="font-bold text-xl mb-4 text-center">Select Recruiting Manager</h2>
                        <select
                            className="border rounded p-2 w-full mb-4"
                            value={selectedManagerId || ""}
                            onChange={e => setSelectedManagerId(e.target.value)}
                        >
                            <option value="" disabled>Select a recruiting manager</option>
                            {recruiterManagers.map((manager) => (
                                <option key={manager.employeeId} value={manager.employeeId}>
                                    {manager.employeeName} - {manager.employeeEmail}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleAssignAction}
                                className={`bg-[#27235C] text-white rounded px-4 py-2 hover:bg-[#1E1A4D] ${!selectedManagerId ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={!selectedManagerId}
                            >
                                Assign
                            </button>
                        </div>
                    </div>
                </div>
            )}
 
            {/* SLA Document Modal */}
            {slaModalOpen && slaDocumentUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg max-w-4xl w-full mt-10 p-6 relative shadow-lg">
                        <button onClick={handleCloseSlaModal} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                            <FaTimes size={20} />
                        </button>
                        <h2 className="font-bold text-xl mb-4 text-center">SOW Document</h2>
                        <iframe
                            title={`SLA Document for ${selectedMrf.mrfDepartmentName}`}
                            src={slaDocumentUrl}
                            className="w-full h-[450px] border-0 shadow-lg"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
 
export default ViewMrf;