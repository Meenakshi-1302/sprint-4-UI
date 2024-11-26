import { faClipboardCheck, faClipboardList, faTimesCircle, faUsers, faSearch, faChevronDown, faCheckCircle, faClipboardQuestion, faCircle } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import RecruitingManagerNavbar from './RecruitingManagerNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { assignMrfToRecruiter, getALLMrfAssignedForRM, getAllRecruitersAssignedRecruitingManager, getMrfsResponse, postMrfsVendorAssign } from '../../services/RecruitingManager/MRFService';
import axios from 'axios';
import toast from 'react-hot-toast'
import { getAllVendor } from '../../services/RecruitingManager/VendorService';

const ListMrfForRecruitingManager = () => {
    const [selectedMrf, setSelectedMrf] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mrfData, setMrfData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
    const [recruiterModalOpen, setRecruiterModalOpen] = useState(false);
    const [vendorModalOpen, setVendorModalOpen] = useState(false); // New state for vendor modal
    const [hoveredRecruiterId, setHoveredRecruiterId] = useState(null);
    const [filteredStatus, setFilteredStatus] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [assignedRecruiter, setAssignedRecruiter] = useState([])
    const [vendors, setVendors] = useState([])
    const [assignedVendor, setAssignedVendor] = useState([])
    const rmId = sessionStorage.getItem('employeeId') || 1;

    // const recruiter = [
    //     { id: 1, name: 'Recruiter 1', email: 'recruiter1@example.com', score: "80", grade: "A" },
    //     { id: 2, name: 'Recruiter 2', email: 'recruiter2@example.com', score: "90", grade: "S" },
    //     { id: 3, name: 'Recruiter 3', email: 'recruiter3@example.com', score: "70", grade: "B" },
    //     { id: 4, name: 'Recruiter 4', email: 'recruiter4@example.com', score: "80", grade: "A" },
    //     { id: 5, name: 'Recruiter 5', email: 'recruiter5@example.com', score: "60", grade: "C" },
    //     { id: 6, name: 'Recruiter 6', email: 'recruiter6@example.com', score: "50", grade: "D" },
    // ];

    const [recruiters, setRecruiters] = useState([])

    // const vendors = [
    //     { id: 1, name: 'Vendor 1', email: 'vendor1@example.com', score: "50", grade: "D" },
    //     { id: 2, name: 'Vendor 2' },
    //     { id: 3, name: 'Vendor 3' },
    //     { id: 4, name: 'Vendor 4' },
    //     { id: 5, name: 'Vendor 5' },
    //     { id: 6, name: 'Vendor 6' },
    // ];

    useEffect(() => {
        const fetchAllMrfs = async (rmId) => {
            try {
                const response = await getMrfsResponse(rmId);
                const sortedMrfs = response.data.sort((a, b) => b.mrfRecruitingManagerId - a.mrfRecruitingManagerId);
                setMrfData(sortedMrfs);
                console.log(response.data);

            } catch (error) {
                console.error('Error fetching MRF data:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchAllRecruiter = async (rmId) => {
            try {
                const response = await getAllRecruitersAssignedRecruitingManager(rmId);
                setRecruiters(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching MRF data:', error);
            } finally {
                setLoading(false);
            }
        }
        const fetchAllVendor = async () => {
            try {
                const response = await getAllVendor();
                setVendors(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching MRF data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAllMrfs(rmId);
        fetchAllRecruiter(rmId);
        fetchAllVendor();
    }, [selectedMrf]);

    const getAssignedRecruiters = async (mrfRmId) => {
        const response = await axios.get(`http://localhost:8080/api/recruitingManager/fetchByMrfRmId/${mrfRmId}`);
        setAssignedRecruiter(response.data);
        console.log(response.data);
    }

    const getAssignedVendors = async (mrfId) => {
        const response = await axios.get(`http://localhost:8080/api/recruitingManager/fetchVendorsByMrfId/${mrfId}`);
        setAssignedVendor(response.data);
        console.log(response.data);
    }

    const filteredMrfs = mrfData.filter(item => {
        const matchesSearchTerm = item.mrf.mrfDepartmentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = (selectedFilter === 'All' || item.mrf.mrfStatus.mrfStage === selectedFilter);
        return matchesSearchTerm && matchesStatus;
    });

    const handleFilterChange = (status) => {
        setFilteredStatus(status);
        setSelectedFilter(status);
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    };

    const handleSubmitAssignMrfToRecruiter = async (mrfRecruitingManagerId, recruiterId) => {
        try {
            const response = await assignMrfToRecruiter(mrfRecruitingManagerId, recruiterId);
            console.log(response.data);
            setTimeout(() => {
                toast.success('Successfully Assigned!')
                setSelectedMrf(null);
            }, 2000);

        } catch (error) {
            console.error('Error fetching MRF data:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAssignMrfToVendor = async (vendorid, mrfId) => {
        try {
            const response = await postMrfsVendorAssign({
                vendorId: vendorid,
                mrfId: mrfId,
                recrutingManagerId: rmId
            });
            console.log('MRF assigned to vendor successfully:', response.data);
            // window.location.reload();
            setTimeout(() => {
                toast.success('Successfully Assigned!')
                setSelectedMrf(null);
            }, 2000);
        } catch (error) {
            console.error('Error assigning MRF:', error);
        }
    };

    const splitName = (email) => {
        const name = email.split("@");
        return name[0];
    }

    return (
        <>
            <RecruitingManagerNavbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className={`min-h-screen bg-[#F5F5F5] p-4 flex flex-col ml-${sidebarOpen ? "64" : "16"} transition-all duration-300`}>
                <div className="mt-20 mb-5 flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">MRF Dashboard</h2>
                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full">
                    {[
                        { icon: faClipboardList, title: 'Available MRFs', value: mrfData.length, status: 'All' },
                        { icon: faClipboardQuestion, title: 'Pending MRFs', value: mrfData.filter(mrf => mrf.mrf.mrfStatus.mrfStage === "Pending").length, status: "Pending" },
                        { icon: faClipboardCheck, title: 'Assigned MRFs', value: mrfData.filter(mrf => mrf.mrf.mrfStatus.mrfStage === "Assigned").length, status: "Assigned" },
                        { icon: faCheckCircle, title: 'Completed MRFs', value: mrfData.filter(mrf => mrf.mrf.mrfStatus.mrfStage === "Completed").length, status: "Completed" },
                        { icon: faTimesCircle, title: 'Closed MRFs', value: mrfData.filter(mrf => mrf.mrf.mrfStatus.mrfStage === "Closed").length, status: "Closed" },
                    ].map((card, index) => (
                        <div
                            key={index}
                            className="bg-[linear-gradient(to_right,_rgb(151,_36,_126),_rgb(224,_25,_80))] text-white hover:opacity-80 transition duration-300 ease-in-out rounded-lg shadow-md p-6 flex items-center justify-center transform hover:scale-105"
                            onClick={() => {
                                handleFilterChange(card.status);
                                if (card.status === 'All') {
                                    setFilteredStatus(null); // Clear filters when showing all
                                }
                            }}
                        >
                            <div className="flex flex-col items-center">
                                <FontAwesomeIcon icon={card.icon} className="text-5xl mb-2" />
                                <p className="text-4xl font-bold">{card.value}</p>
                                <h3 className="text-lg font-semibold text-center">{card.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative mt-4">
                    <select
                        value={selectedFilter}
                        onChange={(e) => {
                            setSelectedFilter(e.target.value);
                            setFilteredStatus(e.target.value === 'All' ? null : e.target.value);
                        }}
                        className="rounded-lg border-2 border-gray-300 pl-4 pr-10 py-2 focus:outline-none focus:border-blue-500"
                    >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Completed">Completed</option>
                        <option value="Closed">Closed</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search Client Name..."
                        className="rounded-lg border-2 border-gray-300 pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 ml-2"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="relative right-56 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <FontAwesomeIcon icon={faSearch} />
                    </span>
                </div>

                <div className="w-full p-6 sm:p-8 bg-white bg-opacity-5 rounded-lg shadow-md mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                        {filteredMrfs.length > 0 ? (
                            filteredMrfs.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                                    onClick={() => {
                                        setSelectedMrf(item)
                                        console.log(item.mrf.mrfId);
                                        getAssignedRecruiters(item.mrfRecruitingManagerId)
                                        getAssignedVendors(item.mrf.mrfId)
                                    }}
                                >
                                    <div className="p-6">
                                        <div className="p-6 flex justify-between">

                                            <div className="flex justify-between rounded-md h-10 mt-8">
                                                <h3 className="text-xl font-semibold text-gray-800  mx-5 mt-1">{`${item.mrf.requirement.client.clientOrganization.organizationName}`}</h3>
                                            </div>
                                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                                {item.mrf.requirement.client.clientOrganization.organizationLogo ? (
                                                    <img
                                                        src={`data:image/jpeg;base64,${item.mrf.requirement.client.clientOrganization.organizationLogo}`}
                                                        alt={item.mrf.requirement.client.clientOrganization.organizationName}
                                                        className="w-full h-full object-cover top-5"
                                                    />
                                                ) : (
                                                    <FontAwesomeIcon className="text-5xl text-gray-400" icon={faCircle} />
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <FontAwesomeIcon icon={faClipboardCheck} className="mr-1" />
                                            <span className="font-medium text-gray-800">Designation:</span> {item.mrf.probableDesignation || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <FontAwesomeIcon icon={faClipboardList} className="mr-1" />
                                            <span className="font-medium text-gray-800">Required Skill:</span> {item.mrf.requiredSkills || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <FontAwesomeIcon icon={faClipboardQuestion} className="mr-1" />
                                            <span className="font-medium text-gray-800">Required Technology:</span> {item.mrf.mrfRequiredTechnology || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <FontAwesomeIcon icon={faUsers} className="mr-1" />
                                            <span className="font-medium text-gray-800">Required Resource Count:</span> {item.mrf.requiredResourceCount || "N/A"}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-2">
                                            <FontAwesomeIcon icon={faCircle} className="mr-1" />
                                            <span className="font-medium text-gray-800">MRF status</span> <span className={`${item.mrf.mrfStatus.mrfStage === "Closed" ? 'text-red-500' : (item.mrf.mrfStatus.mrfStage === "Pending") ? ('text-yellow-500') : ('text-green-500')}`}>{item.mrf.mrfStatus.mrfStage || "N/A"}</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (<div>No record found</div>)}
                    </div>

                    {selectedMrf && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 transition-all ease-in-out duration-300">
                            <div className="bg-white rounded-lg w-full sm:w-3/5 md:w-1/2 lg:w-1/2 p-8 backdrop-blur-md relative">
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                    onClick={() => setSelectedMrf(null)}
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                                </button>

                                <h3 className="text-2xl font-semibold text-gray-800 mb-2 text-center">{selectedMrf.mrf.requirement.client.clientOrganization.organizationName}</h3> <hr />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="">
                                        <div className="space-y-2">
                                            <h3 className='text-2xl text-center'> Mrf Details</h3>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Department:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.mrfDepartmentName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Designation:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.probableDesignation}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Required Skills:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.requiredSkills}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Required Technology:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.mrfRequiredTechnology}</span>
                                            </div>
                                        </div>
                                        <br />
                                        <hr />
                                        <br />
                                        <div className="space-y-2">
                                            <h3 className='text-2xl text-center'>MRf additional Details</h3>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Skills:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.requiredSkills}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Years of Experience:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.mrfCriteria.yearsOfExperience}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Employement mode:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.mrfCriteria.employmentMode}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Job Location:</span>
                                                <span className="text-gray-600">{selectedMrf.mrf.mrfCriteria.jobLocation}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Create at: </span>
                                                <span className="text-gray-600">{formatDate(selectedMrf.mrf.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Closing at: </span>
                                                <span className="text-gray-600">{formatDate(selectedMrf.mrf.mrfCriteria.closureDate)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-800">Status:</span>
                                                <span className={`${selectedMrf.mrf.mrfStatus.mrfStage === "Closed" ? 'text-red-500' : (selectedMrf.mrf.mrfStatus.mrfStage === "Pending") ? ('text-yellow-500') : ('text-green-500')}`}>
                                                    {selectedMrf.mrf.mrfStatus.mrfStage}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-around">
                                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                            {selectedMrf.mrf.requirement.client.clientOrganization.organizationLogo ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${selectedMrf.mrf.requirement.client.clientOrganization.organizationLogo}`}
                                                    alt={selectedMrf.mrf.requirement.client.clientOrganization.organizationName}
                                                    className="w-full h-full object-cover top-5"
                                                />
                                            ) : (
                                                // <FaCircle className="text-5xl text-gray-400" /> // Placeholder icon
                                                <FontAwesomeIcon className="text-5xl text-gray-400" icon={faCircle} />
                                            )}
                                        </div>

                                        {/* requirement's Score card */}
                                        <div className="bg-[linear-gradient(to_right,_rgb(151,_36,_126),_rgb(224,_25,_80))] rounded-lg p-6 text-white  flex justify-between items-center w-3/5">
                                            <div className="flex flex-col items-center">
                                                <div className="text-3xl font-bold">{selectedMrf.mrf.mrfStatus.requirementFilled}</div>
                                                <div className="text-sm">Filled</div>
                                            </div>
                                            <div className="mx-4 text-lg">|</div>
                                            <div className="flex flex-col items-center">
                                                <div className="text-3xl font-bold">{selectedMrf.mrf.requiredResourceCount}</div>
                                                <div className="text-sm">Required</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end mt-1">
                                    {/* Show Assign Button only if MRF stage is not Closed or Completed */}
                                    {/* Uncomment to re-assign mrf to recruiter or vendor */}
                                    {/* {(selectedMrf.mrf.mrfStatus.mrfStage !== 'Closed' && selectedMrf.mrf.mrfStatus.mrfStage !== 'Completed') ? ( */}
                                    {(selectedMrf.mrf.mrfStatus.mrfStage === 'Pending') ? (
                                        <>
                                            <div className="relative inline-block">
                                                <button
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                                    onClick={() => {
                                                        setAssignDropdownOpen(!assignDropdownOpen);
                                                        setRecruiterModalOpen(false);
                                                        setVendorModalOpen(false); // Close vendor modal if open
                                                    }}
                                                >
                                                    {selectedMrf.mrf.mrfStatus.mrfStage === 'Assigned' ? 'Re-assign' : 'Assign'} <FontAwesomeIcon icon={faChevronDown} className="ml-2" />
                                                </button>
                                                {assignDropdownOpen && (
                                                    <div className="absolute bg-white rounded-md shadow-lg z-10">
                                                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setRecruiterModalOpen(true)}>Recruiter</button>
                                                        <button className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:rounded-md w-full" onClick={() => {
                                                            setVendorModalOpen(true); // Open vendor modal
                                                            setAssignDropdownOpen(false); // Close dropdown
                                                        }}>Vendor</button>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex justify-between rounded-md border-2 border-[#23275c]">
                                            <span className="font-medium text-gray-800 mx-5">Assigned to: </span>
                                            {/* <span className="text-gray-600 mx-5">
                                                {assignedRecruiter && assignedRecruiter.length > 0
                                                    ? assignedRecruiter.map(item => splitName(item.recruiterId.employeeEmail) || "N/A").join(', ')
                                                    : "N/A" // Fallback if no recruiters are assigned
                                                }
                                            </span> */}
                                            <span className="text-gray-600 mx-5">
                                                {assignedRecruiter && assignedRecruiter.length > 0 && assignedVendor && assignedVendor.length > 0
                                                    ? // If both lists have records
                                                    `Recruiter- ${assignedRecruiter.map(item => splitName(item.recruiterId.employeeEmail) || "N/A").join(', ')}, Vendor: ${assignedVendor.map(item => item.vendor.organizationName || "N/A").join(', ')}`
                                                    : assignedRecruiter && assignedRecruiter.length > 0
                                                        ? // If only assignedRecruiter has records
                                                        `Recruiter- ${assignedRecruiter.map(item => splitName(item.recruiterId.employeeEmail) || "N/A").join(', ')}`
                                                        : assignedVendor && assignedVendor.length > 0
                                                            ? // If only assignedVendor has records
                                                            `Vendor- ${assignedVendor.map(item => item.vendor.organizationName || "N/A").join(', ')}`
                                                            : // Fallback if neither list has records
                                                            "N/A"
                                                }
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Recruiter Modal */}
                    {recruiterModalOpen && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 transition-all ease-in-out duration-300">
                            <div className="bg-white rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-6 backdrop-blur-md relative max-h-80 overflow-auto">
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                    onClick={() => {
                                        setRecruiterModalOpen(false);
                                        setAssignDropdownOpen(!assignDropdownOpen);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                                </button>

                                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{selectedMrf.mrf.mrfDepartmentName}</h3>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-start">Available Recruiters</h3>
                                <ul className="space-y-2">
                                    {recruiters.map(recruiter => (
                                        <li
                                            key={recruiter.employeeId}
                                            className="flex justify-between items-center p-2 border-b hover:bg-gray-100"
                                            onMouseEnter={() => setHoveredRecruiterId(recruiter.employeeId)}
                                            onMouseLeave={() => setHoveredRecruiterId(null)}
                                        >
                                            <span>{splitName(recruiter.employeeEmail)}</span>
                                            {hoveredRecruiterId === recruiter.employeeId && (
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                    onClick={() => {
                                                        handleSubmitAssignMrfToRecruiter(selectedMrf.mrfRecruitingManagerId, recruiter.employeeId)
                                                        console.log(`Assigned MRF ID: ${selectedMrf.mrfRecruitingManagerId}, Recruiter ID: ${recruiter.employeeId}`);
                                                        setRecruiterModalOpen(false);
                                                        setAssignDropdownOpen(!assignDropdownOpen);
                                                    }}
                                                >
                                                    Assign
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Vendor Modal */}
                    {vendorModalOpen && (
                        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50 transition-all ease-in-out duration-300">
                            <div className="bg-white rounded-lg w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-6 backdrop-blur-md relative max-h-80 overflow-auto">
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                                    onClick={() => {
                                        setVendorModalOpen(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faTimesCircle} size="lg" />
                                </button>

                                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">{selectedMrf.mrf.mrfDepartmentName}</h3>
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-start">Available Vendors</h3>
                                <ul className="space-y-2">
                                    {vendors.map(vendor => (
                                        <li
                                            key={vendor.vendorId}
                                            className="flex justify-between items-center p-2 border-b hover:bg-gray-100"
                                        >
                                            <span>{vendor.organizationName}</span>
                                            <button
                                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                                                onClick={() => {
                                                    // console.log(selectedMrf);                                                    
                                                    // console.log(vendor);         
                                                    handleAssignMrfToVendor(vendor.vendorId, selectedMrf.mrf.mrfId)
                                                    // console.log(`Assigned MRF ID: ${}, Vendor ID: ${}`);
                                                    setVendorModalOpen(false); // Close modal after assignment
                                                    setAssignDropdownOpen(!assignDropdownOpen); // Close dropdown
                                                }}
                                            >
                                                Assign
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default ListMrfForRecruitingManager;