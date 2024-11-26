import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { formatDate } from 'date-fns';

function VendorMRF() {
    const vendorId = sessionStorage.getItem("vendorId");
    const url = `http://localhost:8080/api/vendors/getremainingdays/${vendorId}`; // URL to fetch data

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(url);
                // Set data based on the structure of your response
                setData(response.data.map(item => ({
                    id: item.mrfId,
                    role: item.mrf.probableDesignation, // Adjusted to match your structure
                    resource: item.mrf.requiredResourceCount, // Adjusted to match your structure
                    remainingDays: item.remainingDays,
                    closureDate: formatDate(item.mrf.mrfCriteria.closureDate) // This is already in your JSON
                })));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    if (loading) {
        return <div className='p-4'>Loading...</div>;
    }

    if (error) {
        return <div className='p-4'>Error: {error}</div>;
    }

    // Define column definitions for AG Grid
    const columnDefs = [
        { headerName: "MRF ID", field: "id", sortable: true, filter: true }, // MRF ID
        { headerName: "Role", field: "role", sortable: true, filter: true }, // Role
        { headerName: "Resource Count", field: "resource", sortable: true, filter: true }, // Resource Count
        { headerName: "Remaining Days", field: "remainingDays", sortable: true, filter: true }, // Remaining Days
        { headerName: "Closure Date", field: "closureDate", sortable: true, filter: true }
    ];



    return (
        <div className='bg-white p-4 rounded-lg border border-gray-200 shadow shadow-md h-full'>
            <strong className='text-gray-700 font-4xl'>MRF Countdown Tracker</strong>

            <div className="flex justify-between items-center ">
                <div></div>
                <button className='rounded-md text-white font-medium py-2 px-4 -mt-7' onClick={() => navigate('viewmrfbyvendor')} style={{ backgroundColor: '#27235c' }}>
                    View more
                </button>
            </div>

            <div className="ag-theme-alpine mt-3" style={{ height: 300, width: '100%' }}>
                <AgGridReact
                    rowData={data}
                    columnDefs={columnDefs}
                    pagination={true} // Enable pagination
                    paginationPageSize={5} // Set the number of rows per page
                    domLayout='autoHeight' // Automatically adjust grid height based on the data
                    enableSorting={true} // Enable sorting
                    enableFilter={true} // Enable filtering
                    
                />
            </div>
        </div>
    );
}

export default VendorMRF;