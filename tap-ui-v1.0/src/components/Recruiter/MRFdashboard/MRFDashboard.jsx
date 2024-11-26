import React from 'react'
import CandidateList from './MRFCandidateList';
import MRFRingChart from './MRFRingChart';
import MRFDashboardStatsGrid from './MRFdashboardStatsGrid';
import MRFDashboardDateCard from './MRFDashboardDateCard';
 
function MRFonedashboard() {
    return (
        <div className='flex flex-col gap-4 h-screen'>
          <div className='flex flex-row gap-4 w-full mt-6'>         
             <MRFDashboardStatsGrid/>

          </div>  
          <div className='flex flex-row gap-4 w-full'>
              <MRFDashboardDateCard/>
               <MRFRingChart/>
          </div>
          <div className="flex flex-row gap-4 w-full mt-5 pb-28 p-9">
            <CandidateList />
          </div>
        </div>
      );
}


export default MRFonedashboard;
