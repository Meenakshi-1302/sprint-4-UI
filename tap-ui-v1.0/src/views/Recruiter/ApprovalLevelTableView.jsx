import React from "react";
import ApprovalLevelTable from "../../components/Recruiter/ApprovalLevelTable";
import MRFRecruiterNavbar from "../../components/Recruiter/MRFdashboard/MRFRecruiterNavbar";

function ApprovalLevelTableView() {
  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
      <MRFRecruiterNavbar />
      <div className="flex flex-col flex-1">
        <div className="flex-1 p-4 min-h-0 overflow-auto mt-14">
          <ApprovalLevelTable />
        </div>
      </div>
    </div>
  );
}

export default ApprovalLevelTableView;
