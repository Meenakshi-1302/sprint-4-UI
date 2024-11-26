import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import * as XLSX from 'xlsx';
import { FaFileAlt, FaSearch } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Modal from 'react-modal';
import {
  getAllClients,
  getAllRequirements,
  getRequirementFilledCount
} from '../../../services/ClientPartner/ClientPartnerClientService';  
import Customer from '../../../assets/customer.gif';
import ApprovedClients from '../../../assets/ApprovedClients.gif';
import PendingClients from '../../../assets/PendingClients.gif';
import RejectedClients from '../../../assets/RejectedClients.gif';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import ClientDetailsModal from './ClientDetailsModal'; // Ensure this path is correct
 
ChartJS.register(ArcElement, Tooltip, Legend);
 
const ClientWise = () => {
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [totalClientModalOpen, setTotalClientModalOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedFilterType, setSelectedFilterType] = useState('None');
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState(null);
  const [clientDetailsModalOpen, setClientDetailsModalOpen] = useState(false);
 
  const generateRandomNameAndEmail = (count) => {
    const names = ['Kumar', 'John', 'Peter', 'Raj', 'Alan', 'Ashok'];
    const domains = ['gmail.com'];
 
    let candidates = [];
    for (let i = 0; i < count; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      const email = `${name.replace(' ', '.').toLowerCase()}@${domains[0]}`;
      candidates.push({ name, email });
    }
    return candidates;
  };
 
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const clients = await getAllClients();
        const requirements = await getAllRequirements();
 
        const requirementsMap = {};
        const filledCountMap = {};
 
        for (const req of requirements) {
          const clientId = req.client.clientId;
          const filledCount = await getRequirementFilledCount(req.requirementId);
          if (!requirementsMap[clientId]) {
            requirementsMap[clientId] = 0;
            filledCountMap[clientId] = 0;
          }
          requirementsMap[clientId] += req.totalRequiredResourceCount;
          filledCountMap[clientId] += filledCount;
        }
 
        const formattedData = clients.map(client => {
          const logoBase64 = client.clientOrganization.organizationLogo || null;
          const filledResources = filledCountMap[client.clientId] || 0;
 
          return {
            id: client.clientId,
            name: client.clientName,
            status: client.clientStatus,
            role: client.clientPosition,
            mobile:client.clientMobile,
            email:client.clientEmail,
            createdAt:client.createdAt,
            organization: {
              name: client.clientOrganization.organizationName,
              logo: logoBase64,
            },
            resources: requirementsMap[client.clientId] || 0,
            hired: filledResources,
            totalRequirements: requirementsMap[client.clientId] || 0,
            filledResources: filledResources,
            candidates: filledResources > 0 ? generateRandomNameAndEmail(filledResources) : [],
          };
        });
 
        setRowData(formattedData);
        setOriginalData(formattedData);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        toast.error('Failed to load clients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchClients();
  }, []);
 
  useEffect(() => {
    const filterData = () => {
      let filteredData = originalData;
 
      if (selectedFilterType === 'Client Name') {
        filteredData = originalData.filter(client =>
          client.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      } else if (selectedFilterType === 'Organization') {
        filteredData = originalData.filter(client =>
          client.organization.name.toLowerCase().includes(filterValue.toLowerCase())
        );
      } else if (selectedFilterType === 'Role') {
        filteredData = originalData.filter(client =>
          client.role.toLowerCase().includes(filterValue.toLowerCase())
        );
      } else if (selectedFilterType === 'Status') {
        filteredData = originalData.filter(client => client.status === filterValue);
      }
 
      setRowData(filteredData);
    };
 
    filterData();
  }, [filterValue, selectedFilterType]);
 
  const openTotalClientModal = () => {
    setTotalClientModalOpen(true);
  };
 
  const closeModal = () => {
    setModalIsOpen(false);
  };
 
  const closeTotalClientModal = () => {
    setTotalClientModalOpen(false);
  };
 
  const openModal = (candidates) => {
    setSelectedCandidates(candidates);
    setModalIsOpen(true);
  };
 
  const openClientDetailsModal = (client) => {
    setSelectedClient(client);
    setClientDetailsModalOpen(true);
  };
 
  const closeClientDetailsModal = () => {
    setClientDetailsModalOpen(false);
    setSelectedClient(null);
  };
 
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = rowData.map(({ candidates, organization, filledResources, ...client }) => ({
      ...client,
      organization: organization.name,
      candidates: candidates.length ? candidates.map(c => `${c.name} (${c.email})`).join(', ') : 'None',
      filledResources,
    }));
 
    const ws = XLSX.utils.json_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Clients');
    XLSX.writeFile(wb, 'clients_data.xlsx');
 
    toast.success('Exported to Excel successfully!');
  };
 
  const totalCount = originalData.length;
  const approvedCount = originalData.filter(client => client.status === 'Approved').length;
  const rejectedCount = originalData.filter(client => client.status === 'Rejected').length;
  const pendingCount = originalData.filter(client => client.status === 'Pending').length;
 
  const chartData = {
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [
      {
        data: [approvedCount, rejectedCount, pendingCount],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
        borderColor: ['rgba(255,255,255,0.8)'],
        borderWidth: 2,
      },
    ],
  };
 
  const columnDefs = [
    {
      headerName: "S.No",
      cellRenderer: params => params.node.rowIndex + 1,
      width: 80,
    },
    {
      headerName: 'Organization',
      cellRenderer: params => (
        <div className="flex items-center">
          {params.data.organization.logo && (
            <img
              src={`data:image/png;base64,${params.data.organization.logo}`}
              alt={params.data.organization.name}
              style={{ width: '30px', height: '30px', marginRight: '8px' }}
            />
          )}
          <span>{params.data.organization.name}</span>
        </div>
      ),
    },
    {
      headerName: 'Client Name',
      cellRenderer: params => (
        <div className="flex items-center">
          <span>{params.data.name}</span>
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="text-blue-500 cursor-pointer ml-2"
            onClick={(event) => {
              event.stopPropagation();
              openClientDetailsModal(params.data);
            }}
          />
        </div>
      ),
    },
    { headerName: 'Status', field: 'status', editable: true },
    { headerName: 'Client Role', field: 'role', editable: true },
    {
      headerName: 'Total Requirements',
      field: 'totalRequirements',
      cellRenderer: params => (
        <div className="flex justify-center items-center text-black">
          {params.data.totalRequirements}
        </div>
      ),
    },
    {
      headerName: 'Filled Resources',
      field: 'filledResources',
      cellRenderer: params => (
        <div className="flex justify-center items-center text-black">
          {params.data.filledResources}
        </div>
      ),
    },
    {
      headerName: 'Hired Resources',
      cellRenderer: params => (
        <div className="flex justify-center mt-2">
          <div className="relative w-full">
            <div className="w-full h-4 bg-gray-300 rounded">
              <div
                className="h-4 bg-blue-500 rounded"
                style={{
                  width: `${(params.data.hired / params.data.resources) * 100}%`,
                }}
              />
            </div>
            <span className="absolute inset-0 flex items-center justify-center text-xs">
              {params.data.hired}/{params.data.resources}
            </span>
          </div>
        </div>
      ),
    },
    {
      headerName: 'Candidates',
      cellRenderer: params => (
        <div className="flex justify-center items-center" style={{ height: '100%' }}>
          <FaFileAlt
            className="cursor-pointer text-blue-500"
            style={{ fontSize: '24px' }}
            onClick={(e) => {
              e.stopPropagation();
              openModal(params.data.filledResources === 0 ? [] : params.data.candidates);
            }}
          />
        </div>
      ),
    },
  ];
 
  return (
    <div className="p-6">
      <Toaster position="top-center" />
 
      {loading && (
        <div className="flex justify-center items-center w-full h-full">
          <div className="spinner-border animate-spin border-4 border-blue-600 rounded-full w-16 h-16" />
        </div>
      )}
 
      <div className="flex justify-between items-center mb-6 mt-24">
        <div
          className="border border-gray-300 rounded-lg p-4 shadow-lg bg-gradient-to-r from-[#d9e4f5] to-[#f2f2f2] hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col items-center justify-center w-1/5 m-2 h-52 cursor-pointer"
          onClick={openTotalClientModal}
        >
          <img src={Customer} alt="Total Clients" className="object-contain w-16 h-16 mb-3 rounded-full border border-gray-400 p-1" />
          <h2 className="font-semibold text-center text-lg text-gray-800">Total Clients</h2>
          <p className="font-bold text-black text-center text-3xl">{totalCount}</p>
        </div>
 
        <div className="border border-gray-300 rounded-lg p-4 shadow-lg bg-gradient-to-r from-[#d9e4f5] to-[#f2f2f2] hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col items-center justify-center w-1/5 m-2 h-52">
          <img src={ApprovedClients} alt="Approved Clients" className="object-contain w-16 h-16 mb-3 rounded-full border border-gray-400 p-1" />
          <h2 className="font-semibold text-center text-lg text-gray-800">Approved Clients</h2>
          <p className="font-bold text-black text-center text-3xl">{approvedCount}</p>
        </div>
 
        <div className="border border-gray-300 rounded-lg p-4 shadow-lg bg-gradient-to-r from-[#d9e4f5] to-[#f2f2f2] hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col items-center justify-center w-1/5 m-2 h-52">
          <img src={PendingClients} alt="Pending Clients" className="object-contain w-16 h-16 mb-3 rounded-full border border-gray-400 p-1" />
          <h2 className="font-semibold text-center text-lg text-gray-800">Pending Clients</h2>
          <p className="font-bold text-black text-center text-3xl">{pendingCount}</p>
        </div>
 
        <div className="border border-gray-300 rounded-lg p-4 shadow-lg bg-gradient-to-r from-[#d9e4f5] to-[#f2f2f2] hover:scale-105 hover:shadow-xl transition-transform duration-200 flex flex-col items-center justify-center w-1/5 m-2 h-52">
          <img src={RejectedClients} alt="Rejected Clients" className="object-contain w-16 h-16 mb-3 rounded-full border border-gray-400 p-1" />
          <h2 className="font-semibold text-center text-lg text-gray-800">Rejected Clients</h2>
          <p className="font-bold text-black text-center text-3xl">{rejectedCount}</p>
        </div>
 
        <div className="flex flex-col items-center justify-center w-1/5 mx-2 h-72 p-4 hover:scale-105 transition-transform duration-200">
          <div className="flex justify-center items-center w-full h-full">
            <Pie data={chartData} options={{ maintainAspectRatio: false }} height={100} />
          </div>
        </div>
      </div>
 
      <div className="shadow-lg rounded-lg p-4 mb-6" style={{ backgroundColor: '#f2f2f2' }}>
        <div className="flex items-center mb-4">
          <select
            value={selectedFilterType}
            onChange={e => {
              setSelectedFilterType(e.target.value);
              setFilterValue('');
              setRowData(originalData);
            }}
            className="border rounded-md p-2 mr-4 h-10"
          >
            <option value="None">Select Filter Type...</option>
            <option value="Client Name">Client Name</option>
            <option value="Organization">Organization</option>
            <option value="Role">Client Role</option>
            <option value="Status">Status</option>
          </select>
 
          {selectedFilterType === 'Status' && (
            <select
              value={filterValue}
              onChange={e => setFilterValue(e.target.value)}
              className="border rounded-md p-2 mr-4 h-10"
            >
              <option value="">Select Status...</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
              <option value="Pending">Pending</option>
            </select>
          )}
 
          {(selectedFilterType !== 'None' && selectedFilterType !== 'Status') && (
            <div className="relative flex items-center flex-1 mr-4">
              <FaSearch className="absolute left-3 text-gray-400" style={{ fontSize: '20px' }} />
              <input
                type="text"
                placeholder={`Enter ${selectedFilterType}...`}
                className="border rounded-md pl-10 pr-2 h-10 w-80"
                value={filterValue}
                onChange={e => setFilterValue(e.target.value)}
              />
            </div>
          )}
 
          <button
            onClick={exportToExcel}
            className="p-2 text-white rounded-md h-10 bg-gradient-to-r from-[#97247E] to-[#E01950] hover:from-[#A05292] hover:to-[#E03A69] transition duration-200"
          >
            Export to Excel
          </button>
        </div>
 
        <h3 className="text-lg font-semibold mb-4">Client Details</h3>
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={5}
            domLayout="autoHeight"
          />
        </div>
      </div>
 
      {/* Modal for displaying hired candidates info */}
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
            <li>No candidates hired yet.</li>
          ) : (
            selectedCandidates.map((candidate, index) => (
              <li key={index}>
                <strong>Name:</strong> {candidate.name} - <strong>Email:</strong> {candidate.email}
              </li>
            ))
          )}
        </ul>
        <button className="mt-4 p-2 bg-red-500 text-white rounded-md" onClick={closeModal}>
          Close
        </button>
      </Modal>
 
      {/* Modal for displaying all clients info in table format */}
      <Modal
        isOpen={totalClientModalOpen}
        onRequestClose={closeTotalClientModal}
        contentLabel="Total Clients Information"
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
            maxWidth: '600px',
          },
        }}
      >
        <h2 className="text-xl font-bold">All Clients Information</h2>
        <table className="min-w-full divide-y divide-gray-200 mt-2">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {originalData.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center">No clients found.</td>
              </tr>
            ) : (
              originalData.map(client => (
                <tr key={client.id}>
                  <td className="px-6 py-4">{client.name}</td>
                  <td className="px-6 py-4">{client.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button className="mt-4 p-2 bg-red-500 text-white rounded-md" onClick={closeTotalClientModal}>
          Close
        </button>
      </Modal>
 
     
<Modal
  isOpen={clientDetailsModalOpen}
  onRequestClose={closeClientDetailsModal}
  contentLabel="Client Details"
  ariaHideApp={false}
  style={{
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black overlay
    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '30%',
      height: '40%',
      maxWidth: '600px',
      maxHeight: '90vh',
      overflowY: 'auto',
      backgroundColor: '#fff', // Ensure the modal background is white
      border: 'none', // Removing any default border
      borderRadius: '8px', // Adding rounded corners for a better look
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0)', // Optionally add shadow for a lifted effect
      padding: '20px', // Add some internal padding for content
    },
  }}
>
  {selectedClient && (
    <ClientDetailsModal client={selectedClient} closeModal={closeClientDetailsModal} />
  )}
</Modal>
 
    </div>
  );
};
 
 
export default ClientWise;