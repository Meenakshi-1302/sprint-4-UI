import React, { useState, useEffect } from 'react';
import axios from 'axios';
import role from '../../../assets/pngtre.png';
import { FaCalendarAlt, FaChevronDown, FaChevronUp, FaClock, FaTimes } from 'react-icons/fa'; 

function MRFDashboardDateCard() {
  const [remainingDays, setRemainingDays] = useState(null);
  const [MRFDates, setMRFDates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(null); // Track the active accordion index

  const mrfId = sessionStorage.getItem("mrfid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [daysResponse, mrfResponse] = await Promise.all([
          axios.get(`http://localhost:8080/tap/remainingDaysForMrf/${mrfId}`),
          axios.get(`http://localhost:8080/tap/mrf/getMrf/${mrfId}`),
        ]);
        setRemainingDays(daysResponse.data);
        setMRFDates(mrfResponse.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  
  }, [mrfId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActiveAccordionIndex(null);
  };

  const handleAccordionToggle = (index) => {
    setActiveAccordionIndex(activeAccordionIndex === index ? null : index);
  };

  return (
    <div className="m-3 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-[#97247E] to-[#E01950] text-white rounded-lg shadow-xl p-4 w-full md:w-1/2 lg:w-1/3 mb-2 md:mb-0">
      <div>
        <h2 className="text-xl font-semibold">MRF Details</h2>

        {loading ? (
          <p className="mt-2">Loading MRF Dates and Remaining Days...</p>
        ) : error ? (
          <p className="mt-2 text-red-500">{error}</p>
        ) : (
          <div>
            <p className="mt-2 text-lg flex items-center">
              <FaCalendarAlt className="mr-2" />
              Start Date: {formatDate(MRFDates?.mrfCriteria?.contractStartDate)}
            </p>
            <p className="mt-2 text-lg flex items-center">
              <FaCalendarAlt className="mr-2" />
              Closure Date: {formatDate(MRFDates?.mrfCriteria?.closureDate)}
            </p>
            <p className="mt-2 text-lg flex items-center">
              <FaClock className="mr-2" />
              Days Remaining to Close: {remainingDays}
            </p>
          </div>
        )}
        <button
          onClick={handleOpenModal}
          className="mt-2 bg-gray-200 text-[#23275c] border border-[#23275c] py-1 px-4 rounded-lg shadow hover:bg-[#23275c] hover:text-gray-200 hover:border-gray-200"
        >
          View MRF
        </button>
      </div>
      <img
        src={role}
        alt="Profile"
        className="rounded-md ml-4 bounce"
        style={{ width: '100%', maxWidth: '160.9px', height: '180px' }}
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white text-black rounded-lg max-w-lg w-full p-6 relative shadow-lg transition-all transform hover:scale-105">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="font-bold text-xl text-center mb-2">MRF Detailed View</h2>

            {/* Display MRF Criteria, Agreement, Status, Organization and Client Details */}
            <div className="mt-4">
              {/* MRF Criteria Accordion */}
              <div className="border-b mb-2">
                <button
                  className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none"
                  onClick={() => handleAccordionToggle(0)}
                >
                  <h3 className="font-bold">MRF Criteria</h3>
                  {activeAccordionIndex === 0 ? (
                    <FaChevronUp className="text-gray-600" />
                  ) : (
                    <FaChevronDown className="text-gray-600" />
                  )}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 0 ? 'max-h-screen' : 'max-h-0'}`}>
                  <div className="p-3">
                    <p><strong>Employment Mode :</strong> {MRFDates.mrfCriteria?.employmentMode ?? 'N/A'}</p>
                    <p><strong>Educational Qualification :</strong> {MRFDates.mrfCriteria?.educationalQualification ?? 'N/A'}</p>
                    <p><strong>Minimum CTC :</strong> {MRFDates.mrfCriteria?.minimumCTC ?? 'N/A'}</p>
                    <p><strong>Maximum CTC :</strong> {MRFDates.mrfCriteria?.maximumCTC ?? 'N/A'}</p>
                    <p><strong>Contract Start Date :</strong> {formatDate(MRFDates.mrfCriteria?.contractStartDate) ?? 'N/A'}</p>
                    <p><strong>Closure Date :</strong> {formatDate(MRFDates.mrfCriteria?.closureDate) ?? 'N/A'}</p>
                    <p><strong>Job Location :</strong> {MRFDates.mrfCriteria?.jobLocation ?? 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* MRF Agreement Accordion */}
              <div className="border-b mb-2">
                <button
                  className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none"
                  onClick={() => handleAccordionToggle(1)}
                >
                  <h3 className="font-bold">Requirements</h3>
                  {activeAccordionIndex === 1 ? (
                    <FaChevronUp className="text-gray-600" />
                  ) : (
                    <FaChevronDown className="text-gray-600" />
                  )}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 1 ? 'max-h-screen' : 'max-h-0'}`}>
                  <div className="p-3">
                    <p><strong>Required Technology :</strong> {MRFDates.mrfRequiredTechnology?? 'N/A'}</p>
                    <p><strong>Probable Designation :</strong> {MRFDates.probableDesignation ?? 'N/A'}</p>
                    <p><strong>Required Skills :</strong> {MRFDates.requiredSkills ?? 'N/A'}</p>
                    <p><strong>Years of Experience :</strong> {MRFDates.mrfCriteria?.yearsOfExperience ?? 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* MRF Status Accordion */}
              <div className="border-b mb-2">
                <button
                  className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none"
                  onClick={() => handleAccordionToggle(2)}
                >
                  <h3 className="font-bold">MRF Status</h3>
                  {activeAccordionIndex === 2 ? (
                    <FaChevronUp className="text-gray-600" />
                  ) : (
                    <FaChevronDown className="text-gray-600" />
                  )}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 2 ? 'max-h-screen' : 'max-h-0'}`}>
                  <div className="p-3">
                    
                    <p><strong>Required Resource :</strong>  {MRFDates.requiredResourceCount?? 'N/A'}</p>
                    <p><strong>Requirements Filled :</strong>  {MRFDates.mrfStatus?.requirementFilled ?? 'N/A'}</p>
                    <p><strong>Pending Resource :</strong>  {MRFDates.requiredResourceCount !== undefined && MRFDates.mrfStatus?.requirementFilled !== undefined 
                     ? MRFDates.requiredResourceCount - MRFDates.mrfStatus.requirementFilled : 'N/A'}</p>
                  </div>
                </div>
              </div>


              {/* JD Details Accordion */}
              <div className="border-b mb-2">
                <button
                  className="w-full text-left p-3 flex items-center justify-between rounded-lg focus:outline-none"
                  onClick={() => handleAccordionToggle(4)}
                >
                  <h3 className="font-bold">Job Description</h3>
                  {activeAccordionIndex === 4 ? (
                    <FaChevronUp className="text-gray-600" />
                  ) : (
                    <FaChevronDown className="text-gray-600" />
                  )}
                </button>
                <div className={`overflow-hidden transition-all duration-500 ${activeAccordionIndex === 4 ? 'max-h-screen' : 'max-h-0'}`}>
                  <div className="p-3">
                    {/* <p><strong>Client Name:</strong> {MRFDates.requirement?.client?.clientName ?? 'N/A'}</p>
                    <p><strong>Client Position:</strong> {MRFDates.requirement?.client?.clientPosition ?? 'N/A'}</p>
                    <p><strong>Client Mobile:</strong> {MRFDates.requirement?.client?.clientMobile ?? 'N/A'}</p>
                    <p><strong>Client Email:</strong> {MRFDates.requirement?.client?.clientEmail ?? 'N/A'}</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MRFDashboardDateCard;