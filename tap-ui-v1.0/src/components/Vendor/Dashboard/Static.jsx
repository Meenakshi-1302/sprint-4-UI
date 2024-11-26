
import React, { useState } from 'react';
import SidebarVendor from './SidebarVenodr';
import VendorNavbar from './VendorNavbar';
import { Outlet } from 'react-router-dom';
import classNames from 'classnames';
 
function Static() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
 
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };
 
    return (
        <div className='flex w-screen h-screen overflow-hidden'>
            <SidebarVendor isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={classNames('flex flex-col transition-all duration-300', {
                'w-[calc(100%-15rem)]': isSidebarOpen, 
                'w-[calc(100%-4rem)]': !isSidebarOpen, 
            })}>
                <VendorNavbar />
                <div className='flex-1 p-4 min-h-0 overflow-auto'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
 
export default Static;