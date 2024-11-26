import React, { useEffect, useState } from 'react';
import ProjectwiseService from '../../../services/ClientPartner/ProjectwiseService';
import { AgGridReact } from 'ag-grid-react';
import Modal from 'react-modal';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faCheckCircle, faHourglassHalf, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
 
const Projectwise = () => {
  const [rowData, setRowData] = useState([]);
  const [filterApprovalStatus, setFilterApprovalStatus] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
 
  const columnDefs = [
    { headerName: "MRF ID", field: "mrfId", sortable: true, filter: true },
    {
      headerName: "Client Organization",
      valueGetter: params => params.data.requirement.client.clientOrganization.organizationName,
      cellRenderer: params => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {params.data.requirement.client.clientOrganization.organizationLogo ? (
            <img
              src={`data:image/jpeg;base64,${params.data.requirement.client.clientOrganization.organizationLogo}`}
              alt="Organization Logo"
              style={{ width: '20px', height: '20px', marginRight: '5px' }}
            />
          ) : null}
          <span>{params.data.requirement.client.clientOrganization.organizationName}</span>
        </div>
      )
    },
    {
      headerName: "Sub Requirements",
      cellRenderer: params => {
        return params.data.requirement.subrequirement.map(req => (
          <div key={req.subRequirementId}>
            {`${req.role} - ${req.resourceCount}`}
          </div>
        ));
      }
    },
    { headerName: "MRF Approval Status", field: "mrfStatus.mrfApprovalStatus", sortable: true, filter: true },
    { headerName: "MRF Stage", field: "mrfStatus.mrfStage", sortable: true, filter: true },
    { headerName: "Requirement Filed", field: "mrfStatus.requirementFilled", sortable: true, filter: true },
  ];
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ProjectwiseService.fetchProjectwiseData();
        setRowData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
 
    fetchData();
  }, []);
 
  const onFilterChangeApprovalStatus = (event) => {
    setFilterApprovalStatus(event.target.value);
  };
 
  const onFilterChangeStage = (event) => {
    setFilterStage(event.target.value);
  };
 
  // Filter function to be applied to row data
  const filteredRowData = rowData.filter(row =>
    (filterApprovalStatus ? row.mrfStatus.mrfApprovalStatus.includes(filterApprovalStatus) : true) &&
    (filterStage ? row.mrfStatus.mrfStage.includes(filterStage) : true)
  );
 
  // Calculate total projects and their statuses
  const totalProjects = filteredRowData.length;
  const approvedProjects = filteredRowData.filter(row => row.mrfStatus.mrfApprovalStatus === 'Approved').length;
  const pendingProjects = filteredRowData.filter(row => row.mrfStatus.mrfApprovalStatus === 'Pending').length;
  const closedProjects = filteredRowData.filter(row => row.mrfStatus.mrfApprovalStatus === 'Closed').length;
 
  const openModal = () => {
    setModalIsOpen(true);
  };
 
  const closeModal = () => {
    setModalIsOpen(false);
  };
 
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRowData.map(row => ({
      MRF_ID: row.mrfId,
      "Client_Organization": row.requirement.client.clientOrganization.organizationName,
      "MRF_Approval_Status": row.mrfStatus.mrfApprovalStatus,
      "MRF_Stage": row.mrfStatus.mrfStage,
      "Requirement_Filed": row.mrfStatus.requirementFilled,
    })));
 
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    XLSX.writeFile(wb, "Project_Data.xlsx");
  };
 
  // Styles for the modal
  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      padding: '20px',
      borderRadius: '8px',
      width: '400px',
      height: '300px',
      overflowY: 'auto',
      background: '#ffffff',
    },
  };
 
  return (
    <div style={{ width: '100%', height: '700px', padding: '20px', background: '#f5f5f5' }} className='mt-28'>
      <h2 className="text-lg font-semibold mb-4 text-center mt-4">All Projects</h2>
     
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
        <div
          onClick={openModal}
          style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            textAlign: 'center',
            background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)', 
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <FontAwesomeIcon icon={faFolder} size="2x" color="#00796b" />
          <h3>Total Projects</h3>
          <p style={{ fontSize: '24px', color: '#333' }}>{totalProjects}</p>
        </div>
 
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <FontAwesomeIcon icon={faCheckCircle} size="2x" color="#4caf50" />
          <h3>Approved Projects</h3>
          <p style={{ fontSize: '24px', color: '#4caf50' }}>{approvedProjects}</p>
        </div>
 
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <FontAwesomeIcon icon={faHourglassHalf} size="2x" color="#ff9800" />
          <h3>Pending Projects</h3>
          <p style={{ fontSize: '24px', color: '#ff9800' }}>{pendingProjects}</p>
        </div>
 
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', background: 'linear-gradient(to bottom right, #e0f7fa, #ffffff)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
          <FontAwesomeIcon icon={faTimesCircle} size="2x" color="#f44336" />
          <h3>Closed Projects</h3>
          <p style={{ fontSize: '24px', color: '#f44336' }}>{closedProjects}</p>
        </div>
      </div>
 
      {/* Filter inputs for table */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div>
          <label className='font-bold'>
            MRF Approval Status:
            <select
              onChange={onFilterChangeApprovalStatus}
              style={{
                marginLeft: '5px',
                width: '150px',
                height: '35px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Closed">Closed</option>
            </select>
          </label>
        </div>
        <div>
          <label className='font-bold'>
            MRF Stage:
            <select
              onChange={onFilterChangeStage}
              style={{
                marginLeft: '5px',
                width: '150px',
                height: '35px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '5px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="">All</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>
      </div>
 
      {/* Button to Export data to Excel */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={exportToExcel}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #E01950, #97247E)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#C0174A'} 
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(90deg, #E01950, #97247E)'}
        >
          Export to Excel
        </button>
      </div>
 
      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          rowData={filteredRowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
          }}
          getRowHeight={() => 75}
        />
      </div>
 
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles}>
        <h3 style={{ marginBottom: '10px' }}>Project Names</h3>
        <ul style={{ listStyleType: 'none', padding: 0, overflowY: 'auto', maxHeight: '200px' }}>
          {filteredRowData.map((row, index) => (
            <li key={index} style={{ margin: '5px 0' }}>
              {row.mrfId} - {row.requirement?.client?.clientOrganization.organizationName}
            </li>
          ))}
        </ul>
        <button
          onClick={closeModal}
          style={{
            marginTop: '10px',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#27235C',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          Close
        </button>
      </Modal>
    </div>
  );
};
 
export default Projectwise;