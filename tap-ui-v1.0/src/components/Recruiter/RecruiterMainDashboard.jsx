import React, { useEffect, useState } from 'react';
import axios from 'axios';
import RecruiterNavbar from './RecruiterMainNavbar';
import role from '../../assets/pngtre.png';
import { GiHumanPyramid } from "react-icons/gi";
import DashboardStatsGrid from './DashboardStatsGrid';
import MRFList from './MRFList';
import { useNavigate } from 'react-router-dom';
import ProgressChart from './ProgressChart';
import Piechart from './Piechart';
import MRFRingChart from './Piechart';
import SecondDashboardStatsGrid from './SecondDashboardStatsGrid';
 
 
const RecruiterMainDashboard = ({ isSidebarOpen }) => {
    // Get current time
    const [currentTime, setCurrentTime] = useState(new Date());
    const [totalCount, setTotalCount] = useState(0);
    const [resolvedCount, setResolvedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
   
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
 
        // Fetch the MRF counts
        const fetchCounts = async () => {
           
// sessionStorage.setItem('employeeId', sessionStorage.getItem("UserId"));
//            sessionStorage.setItem('employeeId',)
            const id = sessionStorage.getItem('employeeId');
            console.log(id);
            if (id) {
                try {
                    const totalResponse = await axios.get(`http://localhost:8080/tap/api/totalmrfassigned/${id}`);
                    setTotalCount(totalResponse.data);
                    const resolvedResponse = await axios.get(`http://localhost:8080/tap/api/resolvedmrf/${id}`);
                    setResolvedCount(resolvedResponse.data);
                    const pendingResponse = await axios.get(`http://localhost:8080/tap/api/pendingmrf/${id}`);
                    setPendingCount(pendingResponse.data);
                } catch (error) {
                    console.error('Error fetching counts:', error);
                }
            }
        };
 
        fetchCounts();
 
        // Clean up the interval timer on component unmount
        return () => clearInterval(timer);
    }, []);
 
    return (
        <div className={`flex transition-all duration-300 h-screen bg-[#eeeeee] ${isSidebarOpen ? 'ml-64' : 'ml-12'}`}>
           
            <div className='flex flex-col flex-grow mt-1 bg-neutral-100 -ml-12'>
                <div className={`flex-grow p-6 transition-all duration-300`}>
                    <div className="flex flex-col md:flex-row w-full mt-20 ">
                        {/* <div className="flex gap-4 w-full h-full justify-between items-center bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-lg shadow-md p-4 w-full md:w-1/2 lg:w-1/3 mb-4 md:mb-0">
                            <div>
                                <h2 className="text-xl font-semibold">Welcome Back!</h2>
                                <p className="mt-1">We're glad to see you here.</p>
                                <p className="mt-2 text-lg">{currentTime.toLocaleTimeString()}</p>
                            </div>
                            <img src={role} alt="Profile" className="rounded-md ml-4 bounce" style={{ width: '100%', maxWidth: '172.9px', height: 'auto' }} />
                        </div> */}
                        <br />
                        <div className="flex flex-col md:flex-row flex-grow ml-0 md:ml-4 gap-4">
                            <DashboardStatsGrid/>
 
                           
                        </div>      
                    </div>
                    <div className='flex flex-row gap-4 mb-4 w-full'>
                    <ProgressChart/>
                    <MRFRingChart/>
 
                    </div>
                    <div className='flex flex-row mt-10 gap-4 mb-4 w-full'>
                        <SecondDashboardStatsGrid />
                    </div>
                       
                   
 
                    <MRFList/>
                </div>
            </div>
        </div>
    );
};
 
export default RecruiterMainDashboard;