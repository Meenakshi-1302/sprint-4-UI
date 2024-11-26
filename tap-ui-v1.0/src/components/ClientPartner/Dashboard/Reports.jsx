import React, { useState } from 'react';
import ClientNavbar from '../../../components/NavbarComponent/ClientPartnerNavbar';
import ClientPartnerTabs from '../Dashboard/ClientPartnerTabs';
 
 
function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  return (
    <div>
      <ClientNavbar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
      <ClientPartnerTabs sidebarOpen={sidebarOpen} />
   
    </div>
  );
}
 
export default Reports;