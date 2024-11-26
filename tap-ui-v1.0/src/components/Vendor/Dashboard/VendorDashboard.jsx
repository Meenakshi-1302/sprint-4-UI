import React from 'react';
import VendorStats from './VendorStats';
import VendorChart from './VendorChart';
import VendorMRF from './VendorMRF';
import BarChartVendor from './BarChartVendor';

function VendorDashboard() {
    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-row gap-4 w-full'>
                <VendorStats />
            </div>
            <div className='flex flex-row w-full space-x-4'>
                <div className='w-96'>
                    <VendorChart />
                </div>
                <div className='flex-1 w-2/3'>
                    <VendorMRF />
                </div>
            </div>
            <div className='flex flex-1 w-full'>
                <BarChartVendor />
            </div>
        </div>
    );
}

export default VendorDashboard;