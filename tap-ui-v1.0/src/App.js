import { Toaster } from "react-hot-toast";
import MainRouter from "./routes/MainRouter";
import '../src/styles/index.css';
import UpdatePassword from "./components/Login/UpdatePassword";
import JobListingPage from "./components/Admin/CommonCards/JobListingPage";
import BussinessUnitHeadDashboard from "./components/Admin/BussinessUnit/ViewBusiness";

function App() {
  return (
    <div>
      <MainRouter />
      <Toaster /> 
      {/* <BussinessUnitHeadDashboard/> */}
    </div>
  );
}

export default App;
