import MRFonedashboard from "../../components/Recruiter/MRFdashboard/MRFDashboard";
import MRFRecruiterNavbar from "../../components/Recruiter/MRFdashboard/MRFRecruiterNavbar";
import RecruiterMainDashboard from "../../components/Recruiter/RecruiterMainDashboard";
import RecruiterNavbar from "../../components/Recruiter/RecruiterMainNavbar";
const RecruiterDashboardView = () => {
  return (
    <div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
       
        <RecruiterNavbar/>
        <div className="flex flex-col flex-1">
            <div className="flex-1 p-4 min-h-0 overflow-auto">
                <RecruiterMainDashboard />
            </div>
        </div>
    </div>
  );
};

export default RecruiterDashboardView;
