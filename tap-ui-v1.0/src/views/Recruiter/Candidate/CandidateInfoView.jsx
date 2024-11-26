import React from 'react'
import CandidateInfo from '../../../components/Recruiter/Candidate/CandidateInfo'
import MRFRecruiterNavbar from '../../../components/Recruiter/MRFdashboard/MRFRecruiterNavbar'

function CandidateInfoView() {
  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
      <MRFRecruiterNavbar />
      <div className="flex flex-col flex-1">
        
        <div className="flex-1 p-4 min-h-0 overflow-auto mt-14">
          <CandidateInfo />
        </div>
      </div>
    </div>
  )
}

export default CandidateInfoView
