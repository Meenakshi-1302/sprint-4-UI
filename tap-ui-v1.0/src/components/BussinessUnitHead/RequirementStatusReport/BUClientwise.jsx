import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';
import { AgGridReact } from 'ag-grid-react';
import { Toaster, toast } from 'react-hot-toast';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Award, User, UserCheck, UserMinus } from 'lucide-react';
import {
  getAllClients,
  getAllRequirements,
} from '../../../services/ClientPartner/ClientPartnerClientService';
 
 
const StatCard = ({ icon: Icon, title, value, color }) => {
  return (
      <div className="bg-white rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300 flex items-center space-x-4">
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
 
const ClientWise = () => {
  const [rowData, setRowData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(true);
 
  // Initial Chart Data States
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Total Requirements',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  });
 
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Filled Resources Over Time',
      data: [],
      fill: false,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      tension: 0.1,
    }],
  });
 
  const [doughnutChartData, setDoughnutChartData] = useState({
    labels: ['Approved', 'Rejected', 'Pending'],
    datasets: [{
      label: 'Client Status',
      data: [0, 0, 0], // Initial data counts; will be updated after fetching
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 205, 86, 0.6)',
      ],
      borderWidth: 1,
    }],
  });
 
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const clients = await getAllClients();
        const requirements = await getAllRequirements();
 
        const requirementsMap = {};
 
        // Initialize counts for the status
        let approvedCount = 0;
        let rejectedCount = 0;
        let pendingCount = 0;
 
        // Calculate filled resource counts
        for (const req of requirements) {
          const clientId = req.client.clientId;
          if (!requirementsMap[clientId]) {
            requirementsMap[clientId] = {
              totalRequiredCount: 0,
              status: req.client.clientStatus // Assuming status is part of requirements
            };
          }
          requirementsMap[clientId].totalRequiredCount += req.totalRequiredResourceCount || 0;
        }
 
        const formattedData = clients.map(client => {
          // Update the counts based on the client status
          if (client.clientStatus === 'Approved') {
            approvedCount++;
          } else if (client.clientStatus === 'Rejected') {
            rejectedCount++;
          } else if (client.clientStatus === 'Pending') {
            pendingCount++;
          }
 
          return {
            id: client.clientId,
            name: client.clientName,
            status: client.clientStatus,
            role: client.clientPosition,
            mobile: client.clientMobile,
            email: client.clientEmail,
            createdAt: client.createdAt,
            totalRequirements: requirementsMap[client.clientId]?.totalRequiredCount || 0,
          };
        });
 
        setRowData(formattedData);
        setOriginalData(formattedData);
 
        // Update Bar Chart Data
        setBarChartData(prevState => ({
          ...prevState,
          labels: formattedData.map(client => client.name),
          datasets: [{
            ...prevState.datasets[0],
            data: formattedData.map(client => client.totalRequirements),
          }],
        }));
 
        // Update Line Chart Data
        setLineChartData(prevState => ({
          ...prevState,
          labels: formattedData.map(client => client.name), // Modify for time dimension if needed
          datasets: [{
            ...prevState.datasets[0],
            data: formattedData.map(client => client.totalRequirements), // Or whatever data structure is appropriate
          }],
        }));
 
        // Update Doughnut Chart Data with actual counts
        setDoughnutChartData({
          labels: ['Approved', 'Rejected', 'Pending'],
          datasets: [{
            label: 'Client Status',
            data: [approvedCount, rejectedCount, pendingCount], // Use calculated counts
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(255, 205, 86, 0.6)',
            ],
            borderWidth: 1,
          }],
        });
 
      } catch (error) {
        console.error('Failed to fetch clients:', error);
        toast.error('Failed to load clients. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
 
    fetchClients();
  }, []);
 
  const totalCount = originalData.length;
 
  const columnDefs = [
    {
      headerName: "S.No",
      cellRenderer: params => params.node.rowIndex + 1,
      width: 80,
    },
    { headerName: 'Client Name', field: 'name', editable: true },
    { headerName: 'Status', field: 'status', editable: true },
    { headerName: 'Role', field: 'role', editable: true },
    { headerName: 'Mobile', field: 'mobile', editable: true },
    { headerName: 'Email', field: 'email', editable: true },
  ];
 
  return (
    <div className="p-6 bg-100 min-h-screen">
      <Toaster position="top-center" />
      {loading && <div className="flex justify-center items-center w-full h-full"><div className="spinner-border animate-spin border-4 border-blue-600 rounded-full w-16 h-16" /></div>}
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            icon={User}
            title="Total Clients"
            value={totalCount}
            color="bg-purple-500"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            icon={UserCheck}
            title="Approved Clients"
            value={originalData.filter(client => client.status === 'Approved').length}
            color="bg-green-500"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            icon={UserMinus}
            title="Pending Clients"
            value={originalData.filter(client => client.status === 'Pending').length}
            color="bg-red-500"
          />
        </div>
      </div>
 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    {/* Total Requirements Bar Chart */}
    <div className="bg-white shadow-xl rounded-lg p-5 transition-transform transform hover:scale-105">
        <h3 className="font-semibold text-lg text-gray-800">Total Requirements</h3>
        <div style={{ width: '100%', height: '250px', position: 'relative' }}>
            <Bar data={barChartData} options={{ maintainAspectRatio: false, responsive: true, plugins: { tooltip: { enabled: true } } }} />
        </div>
    </div>
 
    {/* Filled Resources Over Time Line Chart */}
    <div className="bg-white shadow-xl rounded-lg p-5 transition-transform transform hover:scale-105">
        <h3 className="font-semibold text-lg text-gray-800">Filled Resources Over Time</h3>
        <div style={{ width: '100%', height: '250px', position: 'relative' }}>
            <Line data={lineChartData} options={{ maintainAspectRatio: false, responsive: true, plugins: { tooltip: { enabled: true } } }} />
        </div>
    </div>
 
    {/* Client Status Distribution Doughnut Chart */}
    <div className="bg-white shadow-xl rounded-lg p-5 transition-transform transform hover:scale-105">
        <h3 className="font-semibold text-lg text-gray-800">Client Status Distribution</h3>
        <div style={{ width: '100%', height: '250px', position: 'relative' }}>
            <Doughnut data={doughnutChartData} options={{ responsive: true, plugins: { tooltip: { enabled: true } } }} />
        </div>
    </div>
</div>
 
      {/* Client Details Table */}
      <div className="shadow-lg rounded-lg p-4 mb-6 bg-white">
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
    </div>
  );
};
 
export default ClientWise;