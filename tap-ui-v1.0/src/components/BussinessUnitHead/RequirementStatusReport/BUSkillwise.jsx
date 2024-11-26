import React, { useState, useEffect } from 'react';
import { AgCharts } from 'ag-charts-react';
import { AgGridReact } from 'ag-grid-react';
import * as XLSX from 'xlsx';
import { FileText, Users, Clipboard, Briefcase, CheckCircle } from 'lucide-react'; // Lucide icons
import { FaFileAlt } from 'react-icons/fa';
import Modal from 'react-modal';
import Select from 'react-select';
import { getAllMrf } from '../../../services/ClientPartner/ClientPartnerClientService';
import { Toaster, toast } from 'react-hot-toast';

const SkillWise = () => {
    const [rowData, setRowData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [rolesModalIsOpen, setRolesModalIsOpen] = useState(false);
    const [skillsModalIsOpen, setSkillsModalIsOpen] = useState(false);
    const [selectedCandidates, setSelectedCandidates] = useState([]);
    const [uniqueSkills, setUniqueSkills] = useState([]);
    const [skillsData, setSkillsData] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [selectedFilterType, setSelectedFilterType] = useState('None');
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [mrfCount, setMrfCount] = useState(0);
    const [totalHiredCount, setTotalHiredCount] = useState(0);
    const [totalRolesCount, setTotalRolesCount] = useState(0);
    const [skillsChartData, setSkillsChartData] = useState([]);

    // Fetch MRF data
    useEffect(() => {
        const fetchMrfData = async () => {
            try {
                setLoading(true);
                const response = await getAllMrf();
                let mrfData;

                if (typeof response === 'string') {
                    try {
                        mrfData = JSON.parse(response);
                    } catch (error) {
                        console.error("Error parsing string response:", error);
                        return;
                    }
                } else if (Array.isArray(response)) {
                    mrfData = response;
                } else if (response && typeof response === 'object') {
                    mrfData = response.data || [];
                } else {
                    console.error("Unexpected response format:", response);
                    return;
                }

                if (Array.isArray(mrfData)) {
                    processMrfData(mrfData);
                } else {
                    console.error("Parsed data is not an array:", mrfData);
                }
            } catch (error) {
                console.error("Error fetching MRF data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMrfData();
    }, []);

    const generateRandomCandidates = (num) => {
        const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eva', 'Frank'];
        const skillsArray = ['JavaScript', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Swift', 'Kotlin', 'TypeScript'];

        return Array.from({ length: num }, (_, index) => ({
            name: names[Math.floor(Math.random() * names.length)] + ` ${index + 1}`,
            email: `${index + 1}@example.com`,
            skills: [
                skillsArray[Math.floor(Math.random() * skillsArray.length)],
                skillsArray[Math.floor(Math.random() * skillsArray.length)]
            ]
        }));
    };

    const StatCard = ({ icon: Icon, title, value, color }) => {
        return (
            <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center space-x-4 h-28">
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <p className="text-gray-600 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold"> {value}
                    </h3>
                </div>
            </div>
        );
    };

    const processMrfData = (mrfData) => {
        const skillsCount = {};
        const skillsSet = new Set();
        let hiredCount = 0;
        const rolesSet = new Set();

        const processedData = mrfData.map(mrf => {
            const requirement = mrf.requirement || {};
            const candidates = generateRandomCandidates(Math.floor(Math.random() * 10) + 1);

            hiredCount += mrf.mrfStatus?.requirementFilled || 0;

            if (mrf.requiredSkills) {
                const skillArray = mrf.requiredSkills.split(", ").map(skill => skill.trim());
                skillArray.forEach(skill => {
                    skillsSet.add(skill);
                    skillsCount[skill] = (skillsCount[skill] || 0) + (candidates.length > 0 ? candidates.length : 0);
                });
            }

            if (requirement.subrequirement) {
                requirement.subrequirement.forEach(sr => {
                    rolesSet.add(sr.role);
                });
            }

            return {
                clientName: requirement.client?.clientName || 'Unknown',
                hired: mrf.mrfStatus?.requirementFilled || 0,
                skillsRequired: mrf.requiredSkills ? mrf.requiredSkills.split(", ").join(", ") : 'None',
                probableDesignation: mrf.probableDesignation || 'Not Specified',
                roles: requirement.subrequirement ? requirement.subrequirement.map(sr => sr.role).join(", ") : 'None',
                candidates
            };
        });

        const skillData = Object.entries(skillsCount).map(([skill, count]) => ({
            skill,
            candidates: count
        }));

        setRowData(processedData);
        setOriginalData(processedData);
        setMrfCount(mrfData.length);
        setUniqueSkills([...skillsSet].map(skill => ({ value: skill, label: skill })));
        setTotalHiredCount(hiredCount);
        setTotalRolesCount(rolesSet.size);
        setRolesData([...rolesSet]);
        setSkillsChartData(skillData);
    };

    const columnDefs = [
        {
            headerName: "S.No",
            cellRenderer: params => params.node.rowIndex + 1,
            width: 80,
        },
        { headerName: 'Client Name', field: 'clientName' },
        { headerName: 'Probable Designation', field: 'probableDesignation' },
        { headerName: 'Roles', field: 'roles' },
        { headerName: 'Skills Required', field: 'skillsRequired' },
        {
            headerName: 'Candidates',
            cellRenderer: (params) => (
                <div className="flex justify-center items-center mt-2 cursor-pointer">
                    <FaFileAlt
                        className="text-blue-500"
                        style={{ fontSize: '24px', cursor: 'pointer', marginTop: '10px' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            openModal(params.data.candidates);
                        }}
                    />
                </div>
            )
        }
    ];

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [['Client Name', 'Probable Designation', 'Candidates', 'Skills Required', 'Roles']];

        originalData.forEach(client => {
            wsData.push([
                client.clientName,
                client.probableDesignation,
                client.candidates.length > 0 ? client.candidates.map(c => `${c.name} (${c.email})`).join(', ') : 'None',
                client.skillsRequired,
                client.roles
            ]);
        });

        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, 'Skills');
        XLSX.writeFile(wb, 'skills_data.xlsx');

        toast.success('Exported to Excel successfully!');
    };

    const openModal = (candidates) => {
        setSelectedCandidates(candidates);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openRolesModal = () => {
        setRolesModalIsOpen(true);
    };

    const closeRolesModal = () => {
        setRolesModalIsOpen(false);
    };

    const openSkillsModal = () => {
        setSkillsData(uniqueSkills.map(skill => skill.value));
        setSkillsModalIsOpen(true);
    };

    const closeSkillsModal = () => {
        setSkillsModalIsOpen(false);
    };

    // Filtering logic based on selected filter type and selected skills
    useEffect(() => {
        const filteredData = originalData.filter(client => {
            let matches = true;

            // Filter by client name
            if (selectedFilterType === 'Client Name') {
                matches = client.clientName.toLowerCase().includes(filterValue.toLowerCase());
            }

            // Filter by selected skills
            if (selectedFilterType === 'Skills' && selectedSkills.length > 0) {
                const requiredSkills = client.skillsRequired.split(", ").map(skill => skill.trim().toLowerCase());
                matches = selectedSkills.some(skill => requiredSkills.includes(skill.value.toLowerCase()));
            }

            return matches;
        });

        // Update displayed data
        setRowData(filteredData);
    }, [selectedFilterType, selectedSkills, filterValue, originalData]);

    return (
        <div className="p-6 bg-50 min-h-screen">
            {loading && <div className="text-center">Loading...</div>}
            <h3 className="text-2xl font-bold text-center mb-6">Skill-wise Resource Status</h3>

            {/* Grid for Cards and Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Card Grid */}
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    {/* Card Grid */}
                    <div className="grid grid-cols-2 gap-6 col-span-2">
                        <StatCard
                            icon={Users}
                            title="Total MRF"
                            value={mrfCount}
                            color="bg-blue-500"
                        />
                        <StatCard
                            icon={Users}
                            title="Total Skills Extracted"
                            value={uniqueSkills.length}
                            color="bg-green-500"
                        />
                        <StatCard
                            icon={Users}
                            title="Total Hired Candidates"
                            value={totalHiredCount}
                            color="bg-orange-500"
                        />
                        <StatCard
                            icon={Users}
                            title="Total Roles"
                            value={totalRolesCount}
                            color="bg-red-500"
                        />
                    </div>
                </div>

                {/* Skills Chart */}
                <div className="bg-white shadow-lg rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-4">Skills Chart</h4>
                    <AgCharts
                        options={{
                            data: skillsChartData.length > 0 ? skillsChartData : [{ skill: 'No Data', candidates: 0 }],
                            series: [
                                { type: 'bar', xKey: 'skill', yKey: 'candidates', fill: '#4C51BF' },
                            ],
                            axes: [
                                { type: 'category', position: 'bottom', title: { text: 'Skills', fontSize: 14 }, label: { fontSize: 12 } },
                                { type: 'number', position: 'left', title: { text: 'Number of Candidates', fontSize: 14 }, min: 0, label: { fontSize: 12 } },
                            ],
                            title: { text: 'Clients by Skill', fontSize: 16 },
                        }}
                    />
                </div>
            </div>


            <div className="shadow-lg rounded-lg p-4 my-4 bg-white">
                <div className="flex mb-4 items-center">
                    <select
                        value={selectedFilterType}
                        onChange={(e) => {
                            setSelectedFilterType(e.target.value);
                            setSelectedSkills([]);
                            setFilterValue('');
                        }}
                        className="border rounded-md p-2 mr-4 h-10"
                    >
                        <option value="None">Select Filter Type...</option>
                        <option value="Client Name">Client Name</option>
                        <option value="Skills">Skills</option>
                    </select>

                    {selectedFilterType === 'Client Name' && (
                        <input
                            type="text"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            placeholder="Search Client Name..."
                            className="border rounded-md p-2 mr-4"
                        />
                    )}

                    {selectedFilterType === 'Skills' && (
                        <Select
                            isMulti
                            options={uniqueSkills}
                            onChange={setSelectedSkills}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            placeholder="Select skills..."
                        />
                    )}

                    <button
                        onClick={exportToExcel}
                        className="p-2 text-white rounded-md h-10 bg-gradient-to-tr from-[#97247E] to-[#E01950] hover:from-[#A05292] hover:to-[#E03A69] transition duration-200"
                    >
                        Export to Excel
                    </button>
                </div>

                <h3 className="text-lg font-semibold mb-4">Skill Details</h3>
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}
                        pagination={true}
                        paginationPageSize={20}
                        domLayout="autoHeight"
                    />
                </div>
            </div>

            {/* Modals for candidate details and roles */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Hired Candidates Information"
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
                <h2 className="text-xl font-bold">Hired Candidates</h2>
                <ul className="mt-2">
                    {selectedCandidates.length === 0 ? (
                        <li>No candidates available for this client.</li>
                    ) : (
                        selectedCandidates.map((candidate, index) => (
                            <li key={index} className="mb-2">
                                <strong>Name:</strong> {candidate.name}<br />
                                <strong>Email:</strong> {candidate.email}<br />
                                <strong>Skills:</strong> {candidate.skills.join(', ')}
                            </li>
                        ))
                    )}
                </ul>
                <button className="mt-4 p-2 bg-red-500 text-white rounded-md" onClick={closeModal}>
                    Close
                </button>
            </Modal>

            <Modal
                isOpen={rolesModalIsOpen}
                onRequestClose={closeRolesModal}
                contentLabel="Roles Extracted"
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
                <h2 className="text-xl font-bold">Roles Extracted</h2>
                <ul className="mt-2">
                    {rolesData.length === 0 ? (
                        <li>No roles available.</li>
                    ) : (
                        rolesData.map((role, index) => (
                            <li key={index} className="mb-2">
                                {role}
                            </li>
                        ))
                    )}
                </ul>
                <button className="mt-4 p-2 bg-red-500 text-white rounded-md" onClick={closeRolesModal}>
                    Close
                </button>
            </Modal>

            <Modal
                isOpen={skillsModalIsOpen}
                onRequestClose={closeSkillsModal}
                contentLabel="Skills Extracted"
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
                <h2 className="text-xl font-bold">Skills Extracted</h2>
                <ul className="mt-2">
                    {skillsData.length === 0 ? (
                        <li>No skills available.</li>
                    ) : (
                        skillsData.map((skill, index) => (
                            <li key={index} className="mb-2">
                                {skill}
                            </li>
                        ))
                    )}
                </ul>
                <button className="mt-4 p-2 bg-red-500 text-white rounded-md" onClick={closeSkillsModal}>
                    Close
                </button>
            </Modal>
        </div>
    );
};

export default SkillWise;