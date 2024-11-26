import React, { useEffect, useState } from 'react';
import total from '../../../assets/book.gif';
import completed from '../../../assets/award.gif';
import pending from '../../../assets/hourglass.gif';
import { getAllMrfCount, getAssignedMrfCount, getCompletedMrfCount } from '../../../services/Vendor/VendorCardService';

function VendorStats({ }) { // Expect vendorId as a prop
    const [assignedCount, setAssignedCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const vendorId = sessionStorage.getItem("vendorId");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assigned = await getAssignedMrfCount(vendorId);
                const completed = await getCompletedMrfCount(vendorId);

                const total = await getAllMrfCount(vendorId);

                setAssignedCount(assigned);
                setCompletedCount(completed);
                setTotalCount(total);
            } catch (error) {
                console.error("Error fetching vendor stats:", error);
                // Handle error as necessary
            }
        };

        fetchData();
    }, [vendorId]);

    return (
        <div className='flex gap-4 w-full'>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-sky-500'>
                    <img src={total} className='text-2xl text-white' alt="Total MRF Assigned"/>
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total MRF Assigned</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>{totalCount}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-orange-500'>
                    <img src={completed} className='text-2xl text-white' alt="Completed MRF"/>
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>Total MRF Completed</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>{completedCount}</strong>
                    </div>
                </div>
            </BoxWrapper>
            <BoxWrapper>
                <div className='rounded-full h-12 w-12 flex items-center justify-center bg-yellow-500'>
                    <img src={pending} className='text-2xl text-white' alt="In Progress"/>
                </div>
                <div className='pl-4'>
                    <span className='text-sm text-gray-500 font-light'>In Progress</span>
                    <div className='flex items-center'>
                        <strong className='text-xl text-gray-700 font-semibold'>{assignedCount - completedCount}</strong>
                    </div>
                </div>
            </BoxWrapper>
        </div>
    );
}

export default VendorStats;

function BoxWrapper({ children }) {
    return <div className='bg-white rounded-md p-4 flex-1 border border-blue-800 flex items-center shadow shadow-lg'>{children}</div>;
}