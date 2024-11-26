import React from 'react';
import DashboardStatsGrid from './DashboardStatsGrid';
import ProgressChart from './ProgressChart';
import Piechart from './Piechart';
import MRFList from './MRFList';
 
function Dashboard() {
  return (
    <div className='flex flex-col gap-4 h-screen'>
      <DashboardStatsGrid />
      <div className='flex flex-row gap-4 w-full'>
        <ProgressChart />
        <Piechart />
      </div>
      <div className="flex flex-row gap-4 w-full">
        <MRFList />
      </div>
    </div>
  );
}
 
export default Dashboard;