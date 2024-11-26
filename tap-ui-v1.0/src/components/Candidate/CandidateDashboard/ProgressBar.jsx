

// import React, { useState } from 'react';
// import { FaCheckCircle, FaClock } from 'react-icons/fa'; // Import the checkmark and clock icons

// const ProgressBar = ({ stages, currentStage, onStageClick }) => {
//   const [disabledStages, setDisabledStages] = useState([]);

//   const handleStageClick = (index) => {
//     // Disable stages after the clicked stage
//     setDisabledStages([...stages.slice(0, index + 1)]);
//     onStageClick(index);
//   };

//   return (
//     <div className="flex justify-between border-2 border-[#27235c] rounded-lg p-2 mb-4">
//       {stages.map((stage, index) => {
//         const isCurrentStage = index === currentStage;
//         const isDisabled = disabledStages.includes(index);
//         const isPastStage = index < currentStage;
//         const isFutureStage = index > currentStage;

//         return (
//           <button
//             key={index}
//             className={`flex items-center justify-center w-full py-2 px-4 cursor-pointer rounded-lg ${
//               isCurrentStage ? 'text-[#27235c] font-bold' : isDisabled ? 'bg-gray-300 text-gray-500' : isFutureStage ? 'text-[#27235c]' : 'text-[#27235c] hover:bg-[#27235c] hover:text-white'
//             }`}
//             onClick={() => !isDisabled && handleStageClick(index)}
//             disabled={isDisabled}
//           >
//             {isCurrentStage && <FaCheckCircle className="mr-2" />}
//             {isPastStage && <FaCheckCircle className="mr-2 text-green-500" />}
//             {isFutureStage && <FaClock className="mr-2 text-gray-500 animate-spin" />}
//             <span className="text-sm">{stage}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default ProgressBar;

// import React, { useState } from 'react';
// import { FaCheckCircle, FaClock } from 'react-icons/fa';

// const ProgressBar = ({ stages, currentStage, onStageClick }) => {
//   const [activeStage, setActiveStage] = useState(null); // Track the active stage

//   const handleStageClick = (index) => {
//     setActiveStage(index); // Set the clicked stage as active
//     onStageClick(index);
//   };

//   return (
//     <div className="flex justify-between border-2 border-[#27235c] rounded-lg p-2 mb-4">
//       {stages.map((stage, index) => {
//         const isCurrentStage = index === currentStage;
//         const isPastStage = index < currentStage;
//         const isFutureStage = index > currentStage;
//         const isActiveStage = index === activeStage;

//         return (
//           <button
//             key={index}
//             className={`flex items-center justify-center w-full py-2 px-4 cursor-pointer rounded-lg ${
//               isCurrentStage ? 'text-[#27235c] font-bold' : isFutureStage ? 'text-[#27235c]' : isPastStage ? 'text-green-500' : ''
//             } ${isActiveStage ? 'bg-[#27235c] text-white' : 'hover:bg-[#27235c] hover:text-white'}`}
//             onClick={() => handleStageClick(index)}
//           >
//             {isCurrentStage && <FaCheckCircle className="mr-2" />}
//             {isPastStage && <FaCheckCircle className="mr-2" />}
//             {isFutureStage && <FaClock className="mr-2 text-gray-500 animate-spin" />}
//             <span className="text-sm">{stage}</span>
//           </button>
//         );
//       })}
//     </div>
//   );
// };

// export default ProgressBar;

import React, { useState } from 'react';
import { FaCheckCircle, FaClock, FaHourglassStart } from 'react-icons/fa'; // Import Hourglass icon

const ProgressBar = ({ stages, currentStage, onStageClick }) => {
  const [activeStage, setActiveStage] = useState(null); // Track the active stage

  const handleStageClick = (index) => {
    setActiveStage(index); // Set the clicked stage as active
    onStageClick(index);
  };

  return (
    <div className="flex justify-between border-2 border-[#27235c] rounded-lg p-2 mb-4">
      {stages.map((stage, index) => {
        const isCurrentStage = index === currentStage;
        const isPastStage = index < currentStage;
        const isFutureStage = index > currentStage;
        const isActiveStage = index === activeStage;

        return (
          <button
            key={index}
            className={`flex flex-col items-center justify-center w-full py-3 cursor-pointer rounded-lg ${
              isCurrentStage ? 'text-black font-bold' : isFutureStage ? 'text-[#27235c]' : isPastStage ? 'text-black' : ''
            } ${isActiveStage ? 'bg-[#27235c] text-white' : 'hover:bg-[#27235c] hover:text-white'}`}
            onClick={() => handleStageClick(index)}
            style={{ minWidth: '80px' }} // Set a minimum width for uniformity
          >
            {isPastStage && <FaCheckCircle className="text-green-500" style={{ fontSize: '1.5em' }} />}
            {isCurrentStage && <FaClock className="text-gray-500 animate-spin" style={{ fontSize: '1.5em' }} />}
            {isFutureStage && <FaHourglassStart className="text-orange-500" style={{ fontSize: '1.5em' }} />}
            <span className="text-sm mt-1 text-center">{stage}</span> {/* Add margin for spacing */}
          </button>
        );
      })}
    </div>
  );
};

export default ProgressBar;