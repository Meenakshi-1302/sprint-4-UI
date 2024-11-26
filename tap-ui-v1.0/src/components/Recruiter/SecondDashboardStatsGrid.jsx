import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { GiHumanPyramid } from "react-icons/gi";  
import {Users} from 'lucide-react';
import {GiCheckMark, GiHourglass, GiFamilyHouse,GiTakeMyMoney } from "react-icons/gi"; 

 
 
function SecondDashboardStatsGrid() {
 
  const [candidateCount, setCandidateCount] = useState(0);
  const [hiredcandidateCount, setHiredcandidateCount] = useState(0);
  const [pendingcandidateCount, setPendingcandidateCount] = useState(0);
  const [rejectedcandidateCount, setRejectedcandidateCount] = useState(0);
 
 
 
  useEffect(() => {
    const id = sessionStorage.getItem('employeeId');
   
    const fetchCounts = async () => {
      if (id) {
        try {
         
          const totalcandidatesResponse = await axios.get(`http://localhost:8080/tap/api/totalrecruitercandidates/${id}`);
          setCandidateCount(totalcandidatesResponse.data);
 
          const hiredcandidatesResponse = await axios.get(`http://localhost:8080/tap/api/hiredrecruitercandidates/${id}`);
          setHiredcandidateCount(hiredcandidatesResponse.data);
 
          const pendingcandidatesResponse = await axios.get(`http://localhost:8080/tap/api/pendingrecruitercandidates/${id}`);
          setPendingcandidateCount(pendingcandidatesResponse.data);
 
         
          const rejectedcandidatesResponse = await axios.get(`http://localhost:8080/tap/api/rejectedrecruitercandidates/${id}`);
          setRejectedcandidateCount(rejectedcandidatesResponse.data);
 
        } catch (error) {
          console.error('Error fetching counts:', error);
        }
      }
    };
 
    fetchCounts();
  }, []);
 
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
  return (
    <div className='w-full'>
    <div className='flex gap-4 mb-4 '>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-6 w-full">
                            <StatCard
                                icon={Users}
                                title="Total Candidates"
                                value={candidateCount}
                                color="bg-blue-500"
                            />
                            <StatCard
                                icon={GiCheckMark}
                                title="Hired Candidates"
                                value={hiredcandidateCount}
                                color="bg-green-500"
                            />
                            <StatCard
                                icon={GiHourglass}
                                title="On-Process Candidates "
                                value={pendingcandidateCount}
                                color="bg-orange-500"
                            />
                             <StatCard
                                icon={GiHumanPyramid}
                                title="Rejected Candidates"
                                value={rejectedcandidateCount}
                                color="bg-purple-500"
                            />
                        </div>
 
 
    </div>
 
 
    </div>
 
  );
}
 
export default SecondDashboardStatsGrid;
 
function BoxWrapper({ children }) {
  return <div className="bg-white rounded-lg shadow-lg p-4 w-full flex-3 border border-gray-200 flex items-center">{children}</div>;
}
 