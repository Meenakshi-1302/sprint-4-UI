import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { HiOutlineLogout } from 'react-icons/hi';
import axios from 'axios';
import { DASHBOARD_SIDEBAR_BOTTOM_LINKS, DASHBOARD_SIDEBAR_LINKS } from '../constants/NavigationVendorDash';

const linkClass = 'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base';

function SidebarVendor({ isOpen, toggleSidebar }) {
    const [organizationName, setOrganizationName] = useState('');
    const [vendorOrganizationLogo, setVendorOrganizationLogo] = useState(null);
    const vendorId = sessionStorage.getItem("vendorId"); // Replace with actual vendorId as needed

    useEffect(() => {
        const fetchOrganizationName = async () => {
            try {
                // Fetching the vendor data using Axios
                const response = await axios.get(`http://localhost:8080/api/vendors/${vendorId}`);

                // Assuming the response data structure matches as per your provided example
                if (response.status === 200) {
                    const data = response.data;
                    console.log('API response data:', data);

                    setOrganizationName(data.organizationName || 'Unknown Organization');
                    setVendorOrganizationLogo(data.vendorOrganizationLogo || null); // Set the logo if available
                } else {
                    console.error('Failed to fetch vendor data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching organization name:', error);
            }
        };

        // Only fetch if vendorId is valid
        if (vendorId) {
            fetchOrganizationName();
        }
    }, [vendorId]);

    return (
        <div className={classNames('bg-[#27235c] text-white h-full transition-all duration-300', {
            'w-60': isOpen,
            'w-16': !isOpen,
        })}>
            {/* Logo/Icon Section */}
            <div className='flex items-center justify-between px-3 py-5 cursor-pointer' onClick={toggleSidebar}>
                {/* Render vendorOrganizationLogo if available, otherwise use a default placeholder */}
                {vendorOrganizationLogo ? (
                    <img src={`data:image/png;base64,${vendorOrganizationLogo}`} alt="Organization Logo" className="w-8 h-8 rounded-full" />
                ) : (
                    <span className="text-xl">No Logo</span>
                )}
                {isOpen && <span className='text-neutral-100 text-md'>{organizationName}</span>}
                <span className='text-xl'>
                    {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
                </span>
            </div>

            <div className='flex-1 py-6 flex flex-col gap-0.5'>
                {DASHBOARD_SIDEBAR_LINKS.map((item) => (
                    <SideBarLink key={item.key} item={item} isOpen={isOpen} />
                ))}
            </div>

            <div>
                {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
                    <SideBarLink key={item.key} item={item} isOpen={isOpen} />
                ))}
                <div className={classNames('text-red-400 cursor-pointer', linkClass)}>
                    <span className='text-xl'><HiOutlineLogout /></span>
                    {isOpen && "Logout"}
                </div>
            </div>
        </div>
    );
}

function SideBarLink({ item, isOpen }) {
    const { pathname } = useLocation();
    return (
        <Link to={item.path} className={classNames(pathname === item.path ? 'bg-neutral-700 text-white' : 'text-neutral-400', linkClass)}>
            <span className='text-xl'>{item.icon}</span>
            {isOpen && item.label}
        </Link>
    );
}

export default SidebarVendor;

