import MRFRecruiterNavbar from "../../components/Recruiter/MRFdashboard/MRFRecruiterNavbar";
import RecruitementProcessLevels from "../../components/Recruiter/RecruitmentProcessLevels";
import LevelCards from "../../components/Recruiter/RecruitmentProcessLevels";
import Header from "../../components/Recruiter/shared/Header";
import MRFSidebar from "../../components/Recruiter/shared/MRFsidebar";

const RecruitementProcessLevelsView = () => {
  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
       
        <MRFRecruiterNavbar/>
        <div className="flex flex-col flex-1">
            <div className="flex-1 p-4 min-h-0 overflow-auto mt-14">
                <RecruitementProcessLevels />
            </div>
        </div>
    </div>
  );
};

export default RecruitementProcessLevelsView;
