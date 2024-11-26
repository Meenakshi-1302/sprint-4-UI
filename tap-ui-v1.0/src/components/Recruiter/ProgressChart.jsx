import React, { useEffect, useState } from 'react';
import { AgCharts } from 'ag-charts-react';
import axios from 'axios';
 
function ProgressChart() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const employeeId = sessionStorage.getItem('employeeId');
    const currentYear = new Date().getFullYear();
 
    const fetchData = async () => {
      try {
        const resolvedResponse = await axios.get(`http://localhost:8080/tap/api/resolvedMRFcount/${employeeId}/${currentYear}`);
        const totalResponse = await axios.get(`http://localhost:8080/tap/api/pendingMRFcount/${employeeId}/${currentYear}`);
 
        const monthNames = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
 
        const monthData = Array.from({ length: 12 }, (_, index) => {
          const month = index + 1; // Months from 1 to 12
          const totalData = totalResponse.data.find(item => item[0] === month);
          const resolvedData = resolvedResponse.data.find(item => item[0] === month);
 
          return {
            month: monthNames[index], // Use month name instead of number
            totalMRF: totalData ? totalData[1] : 0,
            resolvedMRF: resolvedData ? resolvedData[1] : 0,
          };
        });
 
        setMonthlyData(monthData);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError('Error fetching data. Please try again.');
      }
    };
 
    fetchData();
  }, []);
 
  const options = {
    data: monthlyData,
    title: {
      text: 'Monthly MRF Resolution',
      fontSize: 18,
    },
    axes: [
      {
        type: 'category',
        position: 'bottom',
        label: {
          rotation: -30,
        },
      },
      {
        type: 'number',
        position: 'left',
        title: 'Counts',
      },
    ],
    series: [
      {
        type: 'bar',
        xKey: 'month',
        yKey: 'totalMRF',
        fill: '#0ea5e9',
        tooltip: {
          renderer: (params) => {
            return {
              content: `Total MRFs: ${params.datum.totalMRF}`,
            };
          },
        },
      },
      {
        type: 'bar',
        xKey: 'month',
        yKey: 'resolvedMRF',
        fill: '#ea580c',
        tooltip: {
          renderer: (params) => {
            return {
              content: `Resolved MRFs: ${params.datum.resolvedMRF}`,
            };
          },
        },
      },
    ],
  };
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  if (error) {
    return <div>{error}</div>;
  }
 
  return (
    <div className="h-[22rem] bg-white p-4 shadow-lg rounded-sm border border-gray-200 flex flex-col flex-1">
      <strong className="text-gray-700 font-medium">Monthly Progress</strong>
      <div className="mt-3 w-full flex-1">
        <AgCharts options={options} />
      </div>
    </div>
  );
}
 
export default ProgressChart;