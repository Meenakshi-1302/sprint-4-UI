import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faTimes, faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const DuplicateModal = ({ isOpen, duplicates, onClose, onConfirmSelection }) => {
  const [selections, setSelections] = useState({});
  const [selectionError, setSelectionError] = useState(false);

  if (!isOpen) return null;

  const handleSelection = (email, recordType) => {
    setSelections((prev) => {
      const newSelections = { ...prev };
      if (!newSelections[email]) {
        newSelections[email] = { original: false, duplicate: false };
      }
      if (recordType === 'original') {
        newSelections[email].original = true;
        newSelections[email].duplicate = false;
      } else {
        newSelections[email].duplicate = true;
        newSelections[email].original = false;
      }
      return newSelections;
    });
  };

  const handleConfirm = () => {
    const hasSelection = Object.values(selections).some(selection => selection.original || selection.duplicate);
    if (!hasSelection) {
      setSelectionError(true);
      return;
    }

    const finalSelectedData = duplicates.flatMap(dup => {
      const selectedTypes = selections[dup.original.employeeEmail] || {};
      return [
        selectedTypes.original ? dup.original : null,
        selectedTypes.duplicate ? dup.duplicate : null,
      ];
    }).filter(Boolean);

    onConfirmSelection(finalSelectedData);
    setSelections({});
    setSelectionError(false);
  };

  const downloadDuplicatesAsExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // Prepare data for Excel
    const excelData = duplicates.flatMap(dup => [
      {
        Type: 'Original',
        'Employee Name': dup.original.employeeName,
        'Employee Email': dup.original.employeeEmail,
        'Role': dup.original.role,
        'Work Location': dup.original.workLocation,
        'Manager Name': dup.original.managerName,
        'Manager Email': dup.original.managerEmail,
      },
      {
        Type: 'Duplicate',
        'Employee Name': dup.duplicate.employeeName,
        'Employee Email': dup.duplicate.employeeEmail,
        'Role': dup.duplicate.role,
        'Work Location': dup.duplicate.workLocation,
        'Manager Name': dup.duplicate.managerName,
        'Manager Email': dup.duplicate.managerEmail,
      }
    ]);

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Duplicate Records');

    // Generate and download Excel file
    XLSX.writeFile(workbook, 'duplicate_records.xlsx');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-80 animate-fadeIn">
      <div className="bg-white rounded-xl w-7xl shadow-2xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-yellow-300 text-2xl" />
            <h3 className="text-2xl font-bold text-white">Duplicate Records Found</h3>
          </div>
          <button 
            onClick={downloadDuplicatesAsExcel}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faDownload} />
            <span>Download Excel</span>
          </button>
        </div>

        {/* Error Message */}
        {selectionError && (
          <div className="bg-red-50 text-red-600 p-4 m-4 rounded-lg flex items-center space-x-2 animate-shake">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>Please select at least one record before confirming.</span>
          </div>
        )}

        {/* Table Container */}
        <div className="max-h-[calc(100vh-300px)] overflow-y-auto p-6">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {duplicates.map((dup, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-blue-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        Original
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.original.employeeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.original.employeeEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.original.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.original.workLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.original.managerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selections[dup.original.employeeEmail]?.original || false}
                          onChange={() => handleSelection(dup.original.employeeEmail, 'original')}
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 rounded transition-all duration-150"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-red-50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                        Duplicate
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.duplicate.employeeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.duplicate.employeeEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.duplicate.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.duplicate.workLocation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{dup.duplicate.managerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={selections[dup.duplicate.employeeEmail]?.duplicate || false}
                          onChange={() => handleSelection(dup.duplicate.employeeEmail, 'duplicate')}
                          className="h-5 w-5 text-red-600 focus:ring-red-500 rounded transition-all duration-150"
                        />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50 flex justify-end space-x-4">
          <button 
            onClick={onClose} 
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faTimes} />
            <span>Cancel</span>
          </button>
          <button 
            onClick={handleConfirm} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 flex items-center space-x-2"
          >
            <FontAwesomeIcon icon={faCheck} />
            <span>Confirm Selection</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateModal;