import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  User, 
  Calendar, 
  Users, 
  Clipboard, 
  Briefcase 
} from 'lucide-react';

// Import your components
import BUClientwise from '../../../components/BussinessUnitHead/RequirementStatusReport/BUClientwise';
import BUSkillWise from '../../../components/BussinessUnitHead/RequirementStatusReport/BUSkillwise';
import BUScheduleWise from '../../../components/BussinessUnitHead/RequirementStatusReport/BUSchedulewise';

const BussinessUnitHeadTabs = () => {
  const [activeTab, setActiveTab] = useState('clientwise');
  const [selectedDates, setSelectedDates] = useState({ fromDate: '', toDate: '' });

  const tabs = [
    { 
      id: 'clientwise', 
      label: 'Client Wise', 
      icon: Building,
      gradient: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-100',
      Component: BUClientwise
    },
    { 
      id: 'skillwise', 
      label: 'Skill Wise', 
      icon: User,
      gradient: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-100',
      Component: BUSkillWise
    },
    { 
      id: 'schedulewise', 
      label: 'Schedule Wise', 
      icon: Clipboard,
      gradient: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-100',
      Component: BUScheduleWise
    },
    { 
      id: 'datewise', 
      label: 'Date Range', 
      icon: Calendar,
      gradient: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-100',
    //   Component: Datewise,
    //   componentProps: { 
    //     onDateChange: (fromDate, toDate) => setSelectedDates({ fromDate, toDate }),
    //     selectedDates 
    //   }
    },
    { 
      id: 'recruitingmanagerwise', 
      label: 'Recruiting Manager', 
      icon: Users,
      gradient: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-100',
    //   Component: RecruitingManagerwise
    },
    { 
      id: 'clientpartnerwise', 
      label: 'Client Partner', 
      icon: Briefcase,
      gradient: 'from-indigo-500 to-indigo-700',
      bgColor: 'bg-indigo-100',
    //   Component: Projectwise
    }
  ];

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.Component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto"
      >
        

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl 
                shadow-xl transition-all duration-300 
                ${activeTab === tab.id 
                  ? `bg-gradient-to-br ${tab.gradient} text-white` 
                  : `bg-white ${tab.bgColor} text-gray-700 hover:shadow-lg`}`}
            >
              <tab.icon className={`w-10 h-10 mb-3 
                ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
              <span className="text-sm font-semibold text-center">{tab.label}</span>
            </motion.button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "tween", duration: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl p-8 min-h-[400px]"
        >
          {ActiveTabComponent && (
            <ActiveTabComponent {...(tabs.find(tab => tab.id === activeTab)?.componentProps || {})} />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BussinessUnitHeadTabs;