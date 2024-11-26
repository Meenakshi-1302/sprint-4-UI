import React from 'react';
import { Outlet } from 'react-router-dom';
import CandidateProfile from './CandidateProfile';
import CandidateNavbar from './CandidateNavbar';

const LayoutProfile = () => {
  const candidateId = sessionStorage.getItem("vendorId"); // This should be dynamically fetched or set

  return (
    <>
      <CandidateNavbar />
      <div className="flex">
        <div className="w-full p-6">
          <Outlet />
        </div>
        <div className="w-1/3 p-6">
          <CandidateProfile candidateId={candidateId} />
        </div>
      </div>
    </>
  );
};

export default LayoutProfile;
