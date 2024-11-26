import React, { useState } from 'react';
import { 
  Download, 
  X, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  FileSpreadsheet 
} from "lucide-react";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Enhanced UI Components
const Modal = ({ isOpen, onClose, children, className = '' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div 
        className={`bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

const ModalHeader = ({ title, onClose }) => (
  <div className="flex justify-between items-center p-5 border-b border-gray-200">
    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
      <FileSpreadsheet className="w-7 h-7 text-blue-600" />
      {title}
    </h2>
    <button 
      onClick={onClose} 
      className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
    >
      <X className="w-6 h-6" />
    </button>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusConfig = {
    inserted: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    failed: {
      color: 'bg-red-100 text-red-800',
      icon: AlertTriangle,
      iconColor: 'text-red-500'
    },
    skipped: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: ArrowRight,
      iconColor: 'text-yellow-500'
    }
  };

  const { color, icon: StatusIcon, iconColor } = statusConfig[status] || statusConfig.skipped;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      <StatusIcon className={`w-3.5 h-3.5 ${iconColor}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const BulkEmployeeStatusModal = ({
  isOpen,
  insertedEmployees = [],
  failedEmployees = [],
  skippedEmployees = [],
  errorMessage = "",
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('inserted');

  const exportToExcel = () => {
    const data = [
      ['Employee Name', 'Email', 'Role', 'Status', 'Error Message'],
      ...insertedEmployees.map(emp => [
        emp.employeeName, emp.employeeEmail, emp.role, 'Inserted', ''
      ]),
      ...failedEmployees.map(emp => [
        emp.employeeName, emp.employeeEmail, emp.role, 'Failed', 
        emp.errorMessage || 'Unknown error'
      ]),
      ...skippedEmployees.map(emp => [
        emp.employeeName, emp.employeeEmail, emp.role, 'Skipped', 
        emp.errorMessage || 'Unknown error'
      ])
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Status');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'employee_status.xlsx');
  };

  const renderEmployeeTable = (employees, status) => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Role</th>
            <th className="p-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-8 text-center text-gray-500">
                <Info className="w-10 h-10 mx-auto mb-3 text-blue-400" />
                No {status} records found
              </td>
            </tr>
          ) : (
            employees.map((employee, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{employee.employeeName}</div>
                      <div className="text-sm text-gray-500">{employee.employeeEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="p-3 hidden md:table-cell text-gray-600">{employee.role}</td>
                <td className="p-3 text-center">
                  <StatusBadge status={status} />
                  {(status === 'failed' || status === 'skipped') && (
                    <div className="text-xs text-gray-500 mt-1">
                      {employee.errorMessage || 'Unknown error'}
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const tabConfig = [
    { 
      value: 'inserted', 
      label: `Inserted (${insertedEmployees.length})`, 
      content: renderEmployeeTable(insertedEmployees, 'inserted') 
    },
    { 
      value: 'failed', 
      label: `Failed (${failedEmployees.length})`, 
      content: renderEmployeeTable(failedEmployees, 'failed') 
    },
    { 
      value: 'skipped', 
      label: `Skipped (${skippedEmployees.length})`, 
      content: renderEmployeeTable(skippedEmployees, 'skipped') 
    }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader title="Bulk Employee Upload Status" onClose={onClose} />
      
      {errorMessage && (
        <div className="bg-red-50 p-4 text-red-700 flex items-center gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          {errorMessage}
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            {tabConfig.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  px-4 py-3 text-sm font-medium 
                  ${activeTab === tab.value 
                    ? 'border-b-2 border-blue-500 text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 h-[500px] overflow-y-auto">
          {tabConfig.find(tab => tab.value === activeTab)?.content}
        </div>
      </div>

      <div className="p-4 bg-gray-50 border-t flex justify-end gap-3">
        <button 
          onClick={onClose} 
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Close
        </button>
        <button 
          onClick={exportToExcel} 
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export to Excel
        </button>
      </div>
    </Modal>
  );
};

export default BulkEmployeeStatusModal;