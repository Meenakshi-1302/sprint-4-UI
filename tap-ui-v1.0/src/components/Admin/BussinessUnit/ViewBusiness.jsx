// import React, { useState, useEffect } from 'react';
// import { 
//   Building2, 
//   User, 
//   ClipboardList, 
//   CalendarDays,
//   Users, 
//   Briefcase,
//   BarChart3
// } from 'lucide-react';

// import Datewise from '../../../components/ClientPartner/Dashboard/Datewise';
// import RecruitingManagerwise from '../../../components/ClientPartner/Dashboard/RecruitingManagerwise';
// import Projectwise from '../../../components/ClientPartner/Dashboard/Projectwise';
// import ClientWise from '../../../components/ClientPartner/Dashboard/Clientwise';
// import SkillWise from '../../../components/ClientPartner/Dashboard/Skillwise';
// import ScheduleWise from '../../../components/ClientPartner/Dashboard/Schedulewise';

// const BussinessUnitHeadDashboard = () => {
//   const [activeTab, setActiveTab] = useState('clientwise');
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [selectedDates, setSelectedDates] = useState({ fromDate: '', toDate: '' });

//   const tabs = [
//     { 
//       id: 'clientwise', 
//       label: 'Client Overview', 
//       icon: Building2,
//       color: 'bg-blue-500',
//       description: 'Track client engagements and performance'
//     },
//     { 
//       id: 'skillwise', 
//       label: 'Skill Analysis', 
//       icon: User,
//       color: 'bg-purple-500',
//       description: 'Monitor team skill distribution'
//     },
//     { 
//       id: 'schedulewise', 
//       label: 'Schedule Analytics', 
//       icon: ClipboardList,
//       color: 'bg-green-500',
//       description: 'View scheduling and timeline data'
//     },
//     { 
//       id: 'datewise', 
//       label: 'Date Metrics', 
//       icon: CalendarDays,
//       color: 'bg-orange-500',
//       description: 'Analyze temporal patterns'
//     },
//     { 
//       id: 'recruitingmanagerwise', 
//       label: 'Recruitment Overview', 
//       icon: Users,
//       color: 'bg-pink-500',
//       description: 'Track recruiting performance'
//     },
//     { 
//       id: 'projectwise', 
//       label: 'Project Analytics', 
//       icon: Briefcase,
//       color: 'bg-indigo-500',
//       description: 'Monitor project progress'
//     }
//   ];

//   const handleDateChange = (fromDate, toDate) => {
//     setSelectedDates({ fromDate, toDate });
//   };

//   const renderContent = () => {
//     const components = {
//       datewise: <Datewise onDateChange={handleDateChange} selectedDates={selectedDates} sidebarOpen={sidebarOpen} />,
//       recruitingmanagerwise: <RecruitingManagerwise sidebarOpen={sidebarOpen} />,
//       projectwise: <Projectwise sidebarOpen={sidebarOpen} />,
//       clientwise: <ClientWise />,
//       skillwise: <SkillWise />,
//       schedulewise: <ScheduleWise />
//     };
//     return components[activeTab] || null;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Unit Dashboard</h1>
//           <div className="flex items-center space-x-2">
//             <BarChart3 className="w-5 h-5 text-blue-600" />
//             <span className="text-gray-600">Real-time business metrics and analytics</span>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
//           {tabs.map((tab, index) => (
//             <div
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`relative overflow-hidden bg-white rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer 
//                 ${activeTab === tab.id 
//                   ? 'ring-2 ring-blue-500 shadow-lg' 
//                   : 'hover:shadow-md border border-gray-200'}`}
//             >
//               <div className="p-6">
//                 <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 ${tab.color}`} />
                
//                 <div className="flex items-start space-x-4">
//                   <div className={`p-3 rounded-lg ${tab.color} bg-opacity-10`}>
//                     <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'}`} />
//                   </div>
                  
//                   <div className="flex-1">
//                     <h3 className={`font-semibold text-lg mb-1 ${
//                       activeTab === tab.id ? 'text-blue-600' : 'text-gray-900'
//                     }`}>
//                       {tab.label}
//                     </h3>
//                     <p className="text-sm text-gray-500">{tab.description}</p>
//                   </div>
//                 </div>
//               </div>

//               {activeTab === tab.id && (
//                 <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500" />
//               )}
//             </div>
//           ))}
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6 transition-all duration-500 ease-in-out">
//           <div className="animate-in slide-in-from-right">
//             {renderContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BussinessUnitHeadDashboard;