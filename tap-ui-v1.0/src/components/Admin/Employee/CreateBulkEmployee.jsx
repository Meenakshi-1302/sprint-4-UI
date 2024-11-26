import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { uploadEmployeeData } from "../../../redux/actions/Admin/Employee/CreateBulkEmployeeActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket, faExclamationTriangle, faEye, faInfoCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";
import excelImage from "../../../assets/excel.png";
import employeeTemplate from "../../../assets/Final_Template_Bulk_Employee.xlsx";
import DuplicateModal from "./DuplicateModal";
import StatusModal from "./BulkEmployeeStatusModal"; // Import StatusModal
import { useNavigate } from "react-router-dom";
import PreviewModal from "./PreviewModal";
import {
  Upload,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet
} from "lucide-react";
 
// Helper function to convert header to a key for the object
const convertHeaderToKey = (header) => {
  const headerMapping = {
    "Employee Name": "employeeName",
    "Employee Email": "employeeEmail",
    "Role": "role",
    "Work Location": "workLocation",
    "Manager Name": "managerName",
    "Manager Email": "managerEmail",
  };
  return headerMapping[header] || header.toLowerCase().replace(/\s+./g, (x) => x.charAt(1).toUpperCase());
};
 
 const InvalidDataModal = ({ isOpen, data, onClose }) => {
      if (!isOpen) return null;
   
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-red-600 flex items-center">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Invalid Records
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-auto max-h-[60vh]">
              <div className="space-y-4">
                {data.map((record, index) => (
                  <div key={index} className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-700 mb-2">Record #{index + 1}</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(record).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-medium text-gray-700">{key}: </span>
                          <span className="text-red-600">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    };
 
// Validation for the uploaded data
const validateExcelData = (data) => {
  const errors = [];
  const requiredFields = ["employeeName", "employeeEmail", "role", "workLocation", "managerName", "managerEmail"];
  const invalidRecords = [];
 
  data.forEach((row, index) => {
    const rowNum = index + 1;
    let hasError = false;
 
    requiredFields.forEach((field) => {
      if (!row[field]) {
        errors.push(`Row ${rowNum}: ${field} is required`);
        hasError = true;
      }
    });
 
    // Check email format validity
    if (row.employeeEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.employeeEmail)) {
      errors.push(`Row ${rowNum}: Invalid Employee Email format`);
      hasError = true;
    }
    if(row.employeeName && !/^[a-zA-Z\s]+$/.test(row.employeeName)){
      errors.push(`Row ${rowNum}: Invalid Employee Name format`);
      hasError = true;
    }
    if(row.managerName && !/^[a-zA-Z\s]+$/.test(row.managerName)){
      errors.push(`Row ${rowNum}: Invalid Manager Name format`);
      hasError = true;
    }
    if(row.role && !/^[a-zA-Z\s]+$/.test(row.role)){
      errors.push(`Row ${rowNum}: Invalid Role format`);
      hasError = true;
    }
 
    if (row.workLocation && !/^[a-zA-Z\s]+$/.test(row.workLocation)) {
      errors.push(`Row ${rowNum}: Invalid Work Location format`);
      hasError = true;
    }
 
    // If the row has errors, add it to invalid records
    if (hasError) {
      invalidRecords.push(row);
    }
  });
 
  return { errors, isValid: errors.length === 0, invalidRecords };
};
 
// Convert Excel to JSON
const convertExcelToJson = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: "",
          header: 1,
          blankrows: false,
        });
 
        const headers = jsonData[0];
        const formattedData = jsonData.slice(1).map((row) => {
          const rowData = {};
          headers.forEach((header, index) => {
            const key = convertHeaderToKey(header);
            rowData[key] = row[index] || "";
          });
          return Object.fromEntries(Object.entries(rowData).filter(([key, value]) => value !== "")); // remove empty values
        }).filter((row) => Object.keys(row).length > 0); // remove empty rows
 
        if (formattedData.length === 0) {
          reject(new Error("No valid records found in the spreadsheet"));
          return;
        }
 
        const validationResult = validateExcelData(formattedData);
        if (validationResult.errors.length > 0) {
          reject(new Error(validationResult.errors.join("\n")));
          return;
        }
 
        resolve({
          data: formattedData,
          invalidRecords: validationResult.invalidRecords, // invalid rows for preview
        });
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };
    reader.onerror = (error) => {
      reject(new Error(`Error reading file: ${error.message}`));
    };
    reader.readAsArrayBuffer(file);
  });
};
 
// Helper function to find duplicates based on employeeEmail
const findDuplicates = (data) => {
  const seen = new Map();
  const duplicates = [];
 
  data.forEach((item, index) => {
    if (seen.has(item.employeeEmail)) {
      duplicates.push({
        original: seen.get(item.employeeEmail),
        duplicate: item,
      });
    } else {
      seen.set(item.employeeEmail, item);
    }
  });
 
  return duplicates;
};
 
const CreateBulkEmployee = () =>
{
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [parsedData, setParsedData] = useState(null);
  const [duplicateData, setDuplicateData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [finalData, setFinalData] = useState(null);
  const [invalidRecords, setInvalidRecords] = useState([]);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [insertedEmployees, setInsertedEmployees] = useState([]);
  const [notInsertedEmployees, setNotInsertedEmployees] = useState([]);
  const [skippedEmployees, setSkippedEmployees] = useState([]);
  const [failedEmployees, setFailedEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isInvalidDataModalOpen, setIsInvalidDataModalOpen] = useState(false);
 
  const navigate = useNavigate();
 
 
  // Handle file input change
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      setFile(selectedFile);
      setError("");
      setValidationError("");
      try {
        const { data, invalidRecords } = await convertExcelToJson(selectedFile);
        const duplicates = findDuplicates(data);
        const uniqueData = data.filter(item => !duplicates.some(duplicate => duplicate.original.employeeEmail === item.employeeEmail));
 
        setParsedData(data);
        setDuplicateData(duplicates);
        setFinalData(uniqueData); // Only unique records are added to finalData initially.
        setInvalidRecords(invalidRecords); // Store invalid records
 
        if (duplicates.length > 0) {
          setIsModalOpen(true); // Show modal to resolve duplicates
        }
      } catch (err) {
        setError(err.message);
        setParsedData(null);
        setDuplicateData([]);
        setInvalidRecords([]);
      }
    } else {
      setError("Please upload a valid XLSX file.");
      setFile(null);
      setParsedData(null);
      setDuplicateData([]);
      setInvalidRecords([]);
    }
  };
 
  // New function to handle drag and drop
  const handleDrop = async (e) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      await handleFileChange({ target: { files: [selectedFile] } });
    }
  };
 
  // Handle submit action
  const handleSubmit = (e) => {
    e.preventDefault();
 
    if (!finalData || finalData.length === 0) {
      setValidationError("No valid data has been uploaded. Please check the Excel file and update the values.");
      return;
    }
 
    console.log("Dispatching with data:", finalData);  // Debugging line
 
    // Dispatching action
    dispatch(uploadEmployeeData(finalData))
      .then((response) => {
        console.log("Response from API:", response);  // Now this should show the actual response object
 
        // Extract inserted, skipped, failed from response
        const inserted = response?.inserted || [];
        const skipped = response?.skipped || [];
        const failed = response?.failed || [];
 
        // Map error messages for skipped employees
        skipped.forEach((employee) => {
          employee.errorMessage = `Employee already exists with email: ${employee .employeeEmail}`;
        });
 
        // Map error messages for failed employees
        failed.forEach((employee) => {
          if (employee.errorMessage) {
            employee.errorMessage = employee.errorMessage;
          } else {
            employee.errorMessage = "Unknown error occurred"; // Default error message for failed records
          }
        });
 
        // Set the states to store the inserted, skipped, and failed employees
        setInsertedEmployees(inserted);
        setSkippedEmployees(skipped);
        setFailedEmployees(failed);
 
        // Open the status modal after submission
        setStatusModalOpen(true);
 
        // Set the errorMessage to show in the status modal (if any)
        if (failed.length > 0 || skipped.length > 0) {
          setErrorMessage("There were issues with some records. Please review the failed or skipped employees.");
        } else {
          setErrorMessage(""); // Clear the error message if everything succeeded
        }
 
        console.log("Inserted Employees:", inserted);
        console.log("Skipped Employees:", skipped);
        console.log("Failed Employees:", failed);
 
      })
      .catch((err) => {
        console.error("Error during upload:", err);  // Log any error here
        setError(err.message);
      });
 
    // Clear previous data after submission
    setFile(null);
    setParsedData(null);
    setFinalData(null);
    setValidationError("");
  };
 
  const closeModal = () => {
    setIsModalOpen(false);
  };
 
  const onConfirmSelection = (selectedData) => {
    // Append selected duplicates to the final data
    setFinalData(prevFinalData => [...prevFinalData, ...selectedData]);
 
    // Close the modal after confirmation
    setIsModalOpen(false);
  };
 
  const downloadTemplate = () => {
    const link = document.createElement("a");
    link.href = employeeTemplate;
    link.download = "employee_bulk_data_template.xlsx";
    link.click();
  };
 
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
 
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
 
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen flex flex-col items-center pt-12">
      <div className="max-w-5xl w-full flex space-x-6 bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Instructions Section */}
        <div className="w-1/3 bg-gradient-to-br from-blue-900 to-blue-700 p-8 text-white space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <FontAwesomeIcon icon={faInfoCircle} className="text-3xl" />
            <h3 className="text-2xl font-bold">Bulk Upload Guide</h3>
          </div>
         
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <CheckCircle className="mr-2 text-green-400" size={20} />
                Data Requirements
              </h4>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>Use valid email formats</li>
                <li>All fields are mandatory</li>
                <li>Use provided Excel template</li>
              </ul>
            </div>
 
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <AlertTriangle className="mr-2 text-yellow-400" size={20} />
                Validation Checks
              </h4>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>Empty fields not allowed</li>
                <li>Duplicate emails will be flagged</li>
                <li>Invalid name/email formats rejected</li>
              </ul>
            </div>
 
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center">
                <FileSpreadsheet className="mr-2 text-blue-400" size={20} />
                File Guidelines
              </h4>
              <ul className="text-sm space-y-2 list-disc pl-4">
                <li>.xlsx format only</li>
                <li>File size under 5MB</li>
                <li>Can't accept your own template</li>
              </ul>
            </div>
          </div>
        </div>
       
       
       
        <div className="w-2/3 p-8 flex flex-col justify-center">
          <div className="flex justify-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              Employee Bulk Upload
            </h2>
          </div>
 
          {/* Rest of the existing form code remains the same */}
          <div
            className={`relative border-2 rounded-lg p-8 text-center mb-6 transition-all duration-300
              ${isDragging
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-dashed border-gray-300 hover:border-blue-400"}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* Existing file upload section */}
            <input
              type="file"
              onChange={handleFileChange}
              accept=".xlsx"
              className="hidden"
              id="file-upload"
            />
 
            <label htmlFor="file-upload" className="flex flex-col items-center cursor-pointer w-full h-full group">
              {/* Existing file upload label content */}
              {file ? (
                <div className="transform transition-all duration-300 hover:scale-105">
                  <img src={excelImage} alt="Excel File" className="w-20 h-20 mb-3" />
                  <span className="text-gray-800 text-lg font-medium">{file.name}</span>
                </div>
              ) : (
                <div className="group-hover:transform group-hover:scale-105 transition-all duration-300">
                  <FontAwesomeIcon
                    icon={faArrowUpFromBracket}
                    className="text-blue-900 text-6xl mb-4 transition-colors duration-300 group-hover:text-blue-700"
                  />
                  <div className="space-y-2">
                    <p className="text-gray-800 text-xl font-medium">Click to Upload XLSX File</p>
                    <p className="text-gray-500">or drag and drop your XLSX file here</p>
                  </div>
                </div>
              )}
            </label>
 
 
            {file && (
              <div className="absolute top-4 right-4 flex space-x-3">
            <button
              onClick={() => setIsPreviewModalOpen(true)}
              disabled={!finalData}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300"
              title="Preview Data"
            >
              <FontAwesomeIcon icon={faEye} />
              <span className="text-sm font-medium">Preview</span>
            </button>
            {invalidRecords.length > 0 && (
              <button
                onClick={() => setIsInvalidDataModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all duration-300"
                title="View Invalid Data"
              >
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <span className="text-sm font-medium">Invalid Data</span>
              </button>
            )}
            <button
              onClick={() => {
                setFile(null);
                navigate("/admindash");
              }}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        )}
 
        </div>
 
        {(validationError || error) && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 animate-fadeIn">
              {validationError || error}
            </div>
          )}
 
        {/* Invalid Records */}
        {invalidRecords.length > 0 && (
          <div className="mt-6 bg-red-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-center text-red-600">Invalid Records Found</h3>
            <p className="text-red-500 text-center">Please correct the data and upload again.</p>
          </div>
        )}
 
<div className="mt-8 space-y-4">
            <button
              onClick={downloadTemplate}
              className="w-full py-3 bg-gray-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-gray-700 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <span>Download Template</span>
            </button>
 
            <button
              onClick={handleSubmit}
              disabled={!finalData}
              className={`w-full py-3 ${
                finalData
                  ? 'bg-blue-900 hover:bg-blue-800'
                  : 'bg-blue-300 cursor-not-allowed'
              } text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2`}
            >
              <span>Submit Data</span>
            </button>
          </div>
 
          <DuplicateModal
            isOpen={isModalOpen}
            duplicates={duplicateData}
            onClose={closeModal}
            onConfirmSelection={onConfirmSelection}
          />
 
          <StatusModal
            isOpen={statusModalOpen}
            insertedEmployees={insertedEmployees}
            skippedEmployees={skippedEmployees}
            failedEmployees={failedEmployees}
            onClose={() => setStatusModalOpen(false)}
          />
 
          <PreviewModal
            isOpen={isPreviewModalOpen}
            data={finalData || []}
            onClose={() => setIsPreviewModalOpen(false)}
          />
 
          <InvalidDataModal
            isOpen={isInvalidDataModalOpen}
            data={invalidRecords}
            onClose={() => setIsInvalidDataModalOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};
 
export default CreateBulkEmployee;
 