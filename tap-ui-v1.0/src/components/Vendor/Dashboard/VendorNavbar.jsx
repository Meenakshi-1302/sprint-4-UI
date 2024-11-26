import React, { Fragment, useState, useEffect } from 'react';
import { HiOutlineBell, HiOutlineChatAlt } from 'react-icons/hi';
import { Popover, Transition, Menu } from '@headlessui/react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../../../assets/logo.png.png';

function VendorNavbar() {
    const [username, setUsername] = useState(null);  // State to store vendor's username
    const navigate = useNavigate();
    const vendorId = sessionStorage.getItem("vendorId");
    // Fetch vendor username from JSON server
    useEffect(() => {
        // Make sure the endpoint is correct, this can be different based on how your JSON server is set up.
        axios.get(`http://localhost:8080/api/vendors/${vendorId}`)
            .then((response) => {
                console.log(response.data);
                // If the response is an array, take the first vendor object.
                // Adjust this part based on how your JSON is structured.
                const vendorData = response.data;  // Assuming it's an array, take the first item.
                if (vendorData && vendorData.username) {
                    setUsername(vendorData.username);  // Set the vendorUsername
                }
            })
            .catch((error) => {
                console.error('Error fetching vendor username:', error);
            });
    }, []);  // Empty dependency array means this runs once when the component mounts.

    if (!username) {
        return <div>Loading...</div>;  // Display loading if vendorUsername is not fetched yet.
    }

    // Extract the first letter of the vendor's username
    const firstLetter = username.charAt(0).toUpperCase();

    return (
        <div className='bg-white h-16 px-4 flex justify-between items-center border-b border-gray-200'>
            <div>
                <img src={logo} alt="Downloaded" className="flex items-center h-10 w-auto" />
            </div>

            <div className='flex items-center gap-2 mr-2'>
                {/* Chat Icon */}
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={classNames(open && 'bg-gray-100',
                                    'p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100')}>
                                <HiOutlineChatAlt fontSize={24} />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className='absolute right-0 z-10 mt-2.5 w-80'>
                                    <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                                        <strong className='text-gray-700 font-medium'>Messages</strong>
                                        <div className='mt-2 py-1 text-sm'>
                                            This is message panel
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                {/* Bell Icon */}
                <Popover className="relative">
                    {({ open }) => (
                        <>
                            <Popover.Button
                                className={classNames(open && 'bg-gray-100',
                                    'p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100')}>
                                <HiOutlineBell fontSize={24} />
                            </Popover.Button>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className='absolute right-0 z-10 mt-2.5 w-80'>
                                    <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                                        <strong className='text-gray-700 font-medium'>Notifications</strong>
                                        <div className='mt-2 py-1 text-sm'>
                                            This is notification panel
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                {/* User Menu */}
                <Menu as="div" className="relative">
                    <div>
                        <Menu.Button className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-400">
                            <span className='sr-only'>Open user menu</span>
                            {/* Display the first letter of the vendor's username */}
                            <div className='h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center text-xl'>
                                {firstLetter}
                            </div>
                        </Menu.Button>
                    </div>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}
                                        onClick={() => navigate('vendorprofileview')}
                                    >
                                        Your profile
                                    </div>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}
                                        onClick={() => navigate('/settings')}
                                    >
                                        Settings
                                    </div>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <div
                                        className={classNames(active && 'bg-gray-100', 'text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2')}
                                        onClick={() => navigate('/clientLoginpage')}
                                    >
                                        Sign out
                                    </div>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </div>
    )
}

export default VendorNavbar;



