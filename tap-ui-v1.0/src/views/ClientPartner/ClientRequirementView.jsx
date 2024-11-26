// // src/views/ClientRequirementView.jsx
// import React from "react";
// // import Navbar from "../components/mrf/Navbar";
// import ClientRequirementDetails from "../../components/ClientPartner/ClientPartnerMRF/ClientRequirementDetails";
// import ClientPartnerNavbar from "../../components/NavbarComponent/ClientPartnerNavbar";

// const ClientRequirementView = () => {
//   return (
//     <div style={{ backgroundColor: '#eeeeee', minHeight: '100vh' }}>
//       <ClientPartnerNavbar />
//       <div className="mt-20">
//       <h1 className="text-2xl font-bold text-center">Client Requirements</h1>
//       <ClientRequirementDetails /> {/* Render the details component */}
//       </div>
//     </div>
//   );
// };

// export default ClientRequirementView;


// src/views/ClientRequirementView.jsx
// import React, { useState } from "react";
// import ClientPartnerNavbar from "../../components/NavbarComponent/ClientPartnerNavbar";
// import ClientRequirementDetails from "../../components/ClientPartner/ClientPartnerMRF/ClientRequirementDetails";

// const ClientRequirementView = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false); // Managing sidebar state

//   return (
//     <div className="flex h-screen">
//       <ClientPartnerNavbar
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />
//       <div className={`flex-grow p-4 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`} style={{ backgroundColor: '#eeeeee' }}>
//         <h1 className="text-2xl font-bold text-center mt-16">Client Requirements</h1>
//         <ClientRequirementDetails /> {/* Render the details component */}
//       </div>
//     </div>
//   );
// };

// export default ClientRequirementView;

import React, { useState } from "react";
import ClientPartnerNavbar from "../../components/NavbarComponent/ClientPartnerNavbar";
import ClientRequirementDetails from "../../components/ClientPartner/ClientPartnerMRF/ClientRequirementDetails";
 
const ClientRequirementView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Managing sidebar state
 
  return (
    <div className="flex h-screen">
      <ClientPartnerNavbar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className={`flex-grow p-4 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
      <h1 className="text-xl sm:text-2xl font-bold text-center mt-16 sm:mt-24">Client Requirements</h1>
        <ClientRequirementDetails />
      </div>
    </div>
  );
};
 
export default ClientRequirementView;
 