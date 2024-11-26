import React, { useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import Header from '../../components/Recruiter/shared/Header';
import MRFsidebar from '../../components/Recruiter/shared/MRFsidebar'
import MRFRecruiterNavbar from '../../components/Recruiter/MRFdashboard/MRFRecruiterNavbar';


function MRFone() {
    const { mrfid } = useParams();
    console.log(mrfid);

    useEffect(() => {

        if (mrfid) {
            sessionStorage.clear();
            sessionStorage.setItem('mrfid', mrfid);
        }
    }, [mrfid]);
    return (
        <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
        {/* <MRFsidebar/> */}
        <MRFRecruiterNavbar/>
        <div className="flex flex-col flex-1">
            <div className="flex-1 p-4 min-h-0 overflow-auto">
                <Outlet />
            </div>
        </div>
    </div>
    )
}

export default MRFone
