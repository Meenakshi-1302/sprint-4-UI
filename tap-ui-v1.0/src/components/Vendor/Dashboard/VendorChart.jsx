import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { getHiredCandidates, getTotalCandidates, getJoinedCandidates } from '../../../services/Vendor/VendorDashboardService';

function VendorChart() {
  const [hired, setHired] = useState(0);
  const [joined, setJoined] = useState(0);
  const [totalCandidate, setTotalCandidate] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], series: [], colors: [] });
  const [filterOption, setFilterOption] = useState('Joined vs Hired');

  useEffect(() => {
    const vendorId = sessionStorage.getItem("vendorId"); // Change this to your actual vendor ID
    const fetchData = async () => {
      try {
        const hiredCandidatesResponse = await getHiredCandidates(vendorId);
        const hiredCandidates = hiredCandidatesResponse;
        setHired(hiredCandidates);

        const totalCandidatesResponse = await getTotalCandidates(vendorId);
        const totalCandidates = totalCandidatesResponse;
        setTotalCandidate(totalCandidates);

        const joinedCandidatesResponse = await getJoinedCandidates(vendorId);
        const joinedCandidates = joinedCandidatesResponse;
        setJoined(joinedCandidates);

        updateChartData(filterOption, joinedCandidates, hiredCandidates, totalCandidates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [filterOption]); // Re-fetch data on filter change

  const updateChartData = (option, joined, hired, total) => {
    let labels, series, colors;
    if (option === 'Joined vs Hired') {
      labels = ['Joined', 'Hired'];
      series = [joined, hired];
      colors = ['#6FCF97', '#56CCF2'];
    } else if (option === 'Total Candidate vs Hired') {
      labels = ['Total Candidates', 'Hired'];
      series = [total, hired];
      colors = ['#A0AEC0', '#56CCF2'];
    }
    setChartData({ labels, series, colors });
  };

  const handleFilterChange = (e) => {
    const option = e.target.value;
    setFilterOption(option);
    // Update chart data for the new filter option
    updateChartData(option, joined, hired, totalCandidate);
  };

  const chartOptions = {
    chart: {
      type: 'pie',
      toolbar: { show: false },
    },
    labels: chartData.labels,
    colors: chartData.colors,
    legend: {
      position: 'bottom',
      fontSize: '14px',
      labels: { colors: ['#333'], useSeriesColors: false },
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} candidates`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: { position: 'bottom' },
        },
      },
    ],
  };

  // Debugging: Log the chart data for analysis
  console.log('Chart Data:', chartData);

  return (
    <div className='bg-white p-4 rounded-lg border border-gray-200 shadow-md'>
      <div className="mb-4">
        <strong className="text-gray-700 font-bold text-lg">Vendor Hiring Overview</strong>
      </div>

      <div className="relative mb-4">
        <select
          value={filterOption}
          onChange={handleFilterChange}
          className="p-1 text-sm border rounded text-gray-700 bg-white"
        >
          <option value="Joined vs Hired">Joined vs Hired</option>
          <option value="Total Candidate vs Hired">Total Candidate vs Hired</option>
        </select>
      </div>

      {/* Render the chart only if data is present */}
      {chartData.series.length > 0 && (
        <Chart options={chartOptions} series={chartData.series} type="pie" height={350} />
      )}
    </div>
  );
}

export default VendorChart;
