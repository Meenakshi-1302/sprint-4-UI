import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFileAlt,
  FaMapMarkerAlt,
  FaBriefcase,
  FaRegCreditCard,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimes,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import {
  getApprovalLevel,
  getCandidateById,
  getOfferApprovalByCandidateIdAndMrfId,
} from "../../../services/Recruiter/Candidate/CandidateInfoService";

const fetchApprovalLevels = async () => {
  const mrfid = sessionStorage.getItem("mrfid");
  try {
    const response = await getApprovalLevel(mrfid);
    return response.data;
  } catch (error) {
    console.error("Error fetching approval levels:", error);
    return [];
  }
};

const fetchOfferApproval = async (candidateId) => {
  const mrfid = sessionStorage.getItem('mrfid');
  try {
    const response = await getOfferApprovalByCandidateIdAndMrfId(candidateId, mrfid);
    return response.data;
  } catch (error) {
    console.error("Error fetching offer approval:", error);
    return [];
  }
};

const fetchCandidate = async (candidateId) => {
  try {
    const response = await getCandidateById(candidateId);
    return response.data;
  } catch (error) {
    console.error("Error fetching Candidate:", error);
    return {};
  }
};

const fetchCandidateRecruitmentProcessLevels = async (candidateId, mrfId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/tap/getCandidateRecruitmentProcessByCandidateIdAndMrfId`,
      {
        params: { candidateId, mrfId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate levels:", error);
    return [];
  }
};

const fetchCandidateAssessmentLevels = async (candidateId, mrfId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/scores/getScoreByMrfIdAndCandidateId`,
      {
        params: { mrfId, candidateId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate assessment levels:", error);
    return [];
  }
};

const fetchRecruitmentProcessLevels = async (mrfId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/tap/getRecruitmentProcessLevels/${mrfId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching recruitment process levels:", error);
    return [];
  }
};

const combineCandidateAssessmentInterview = (
  recruitmentLevels,
  assessmentLevels,
  candidateInterviewLevels
) => {
  const candidateAssessmentInterview = [];

  recruitmentLevels.forEach((level) => {
    assessmentLevels.forEach((assessment) => {
      if (level.level === assessment.assessment.recruitmentProcess.level) {
        candidateAssessmentInterview.push(assessment);
      }
    });

    candidateInterviewLevels.forEach((interview) => {
      if (level.level === interview.recruitmentProcess.level) {
        candidateAssessmentInterview.push(interview);
      }
    });
  });

  return candidateAssessmentInterview;
};

function CandidateInfo() {
  const [approvalLevels, setApprovalLevels] = useState([]);
  const [offerApproval, setOfferApproval] = useState([]);
  const [offerApprovalCurrentLevel, setOfferApprovalCurrentLevel] =
    useState(null);
  const [candidate, setCandidate] = useState(null);
  const [recruitmentProcessLevels, setRecruitmentProcessLevels] = useState([]);
  const [
    candidateRecruitmentProcessLevels,
    setCandidateRecruitmentProcessLevels,
  ] = useState([]);
  const [recruitmentProcessCurrentLevel, setRecruitmentProcessCurrentLevel] =
    useState(null);
  const [candidateAssessmentLevel, setCandidateAssessmentLevel] = useState([]);
  const [candidateInterviewLevels, setCandidateInterviewLevels] = useState([]);
  const { candidateId } = useParams();

  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const mrfId = sessionStorage.getItem("mrfid");
      const levels = await fetchApprovalLevels();
      const offerApprovalData = await fetchOfferApproval(candidateId);
      const candidateData = await fetchCandidate(candidateId);
      const candidateLevels = await fetchCandidateRecruitmentProcessLevels(
        candidateId,
        mrfId
      );
      const recruitmentLevels = await fetchRecruitmentProcessLevels(mrfId);
      const assessmentLevels = await fetchCandidateAssessmentLevels(
        candidateId,
        mrfId
      );

      setCandidateInterviewLevels(candidateLevels);
      setRecruitmentProcessLevels(recruitmentLevels);
      setRecruitmentProcessCurrentLevel(
        candidateLevels.length + assessmentLevels.length
      );
      setCandidateAssessmentLevel(assessmentLevels);
      setApprovalLevels(levels);
      setOfferApproval(offerApprovalData);
      setOfferApprovalCurrentLevel(offerApprovalData.length);
      setCandidate(candidateData);

      const combinedLevels = combineCandidateAssessmentInterview(
        recruitmentLevels,
        assessmentLevels,
        candidateLevels
      );
      setCandidateRecruitmentProcessLevels(combinedLevels);
    };

    fetchData();
  }, [candidateId]);

  const openModal = (data) => {
    setModalData(data);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-8">
      <h2 className="text-2xl font-semibold text-blue-950 text-center bg-clip-text">
        Candidate Details
      </h2>
      {candidate && (
        <div className="space-y-6 bg-white rounded-lg shadow-xl p-10">
          <div className="space-y-4">
            <h3 className="text-3xl text-gradient bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-transparent bg-clip-text">{`${candidate.firstName} ${candidate.lastName}`}</h3>
            <p className="text-lg text-gray-600">{candidate.skill}</p>
            <div className="flex items-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <FaPhoneAlt className="text-xl text-indigo-600 transition-transform transform hover:scale-110" />
                <span>{candidate.mobileNumber}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaEnvelope className="text-xl text-indigo-600 transition-transform transform hover:scale-110" />
                <span>{candidate.email}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-xl text-gray-600" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-xl text-gray-600" />
              <span>{candidate.experience} Years Experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaRegCreditCard className="text-xl text-gray-600" />
              <span>{candidate.panNumber}</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaFileAlt className="text-xl text-gray-600" />
              <a
                href={candidate.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline transition-all transform hover:scale-105"
              >
                Resume
              </a>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700">
              Status: <span className="text-green-500">{candidate.status}</span>
            </h3>
          </div>
        </div>
      )}

      {/* Recruitment Process Level Tracking */}
      {recruitmentProcessCurrentLevel > 0 && (
        <div className="space-y-6 bg-white rounded-lg shadow-xl p-10">
          <h2 className="text-xl font-semibold text-blue-950 bg-clip-text">
            Recruitment Process Level
          </h2>
          <div className="flex items-center space-x-6 mt-8">
            {recruitmentProcessLevels.map((level, index) => {
              const isCompleted = recruitmentProcessCurrentLevel > level.level;
              const isCurrent = recruitmentProcessCurrentLevel === level.level;
              let rejectionStatus;
              let selectedStatus;
              if (level.recruitmentProcessType === "Interview") {
                rejectionStatus =
                  candidateRecruitmentProcessLevels[level.level - 1]
                    ?.candidateStatus === "Rejected";
                selectedStatus =
                  candidateRecruitmentProcessLevels[level.level - 1]
                    ?.candidateStatus === "Selected";
              } else if (level.recruitmentProcessType === "Assessment") {
                rejectionStatus =
                  candidateRecruitmentProcessLevels[level.level - 1]?.status ===
                  "Rejected";
                selectedStatus =
                  candidateRecruitmentProcessLevels[level.level - 1]?.status ===
                  "Selected";
              }

              const stepClass = rejectionStatus
                ? "bg-red-500 text-white"
                : isCompleted || selectedStatus
                ? "bg-green-500 text-white"
                : isCurrent
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500";

              const modalInfo = () => {
                if (
                  (level.recruitmentProcessType === "Assessment" &&
                    selectedStatus)  || (level.recruitmentProcessType === "Assessment" &&
                    rejectionStatus) 
                ) {
                  return {
                    type: "Assessment",
                    score: candidateAssessmentLevel[level.level - 1]?.score,
                    assessmentName:
                      candidateAssessmentLevel[
                        level.level - candidateAssessmentLevel.length
                      ]?.assessment.assessmentName,
                    assessmentType:
                      candidateAssessmentLevel[
                        level.level - candidateAssessmentLevel.length
                      ]?.assessment.assessmentType,
                    assessmentStartDate:
                      candidateAssessmentLevel[
                        level.level - candidateAssessmentLevel.length
                      ]?.assessment.assessmentStartDate,
                    assessmentEndDate:
                      candidateAssessmentLevel[
                        level.level - candidateAssessmentLevel.length
                      ]?.assessment.assessmentEndDate,
                    assessmentStartTime:
                      candidateAssessmentLevel[
                        level.level - candidateAssessmentLevel.length
                      ]?.assessment.assessmentStartTime,
                    assessmentEndTime:
                      candidateAssessmentLevel[
                        level.level - candidateAssessmentLevel.length
                      ]?.assessment.assessmentEndTime,
                  };
                } else if (
                  (level.recruitmentProcessType === "Interview" &&
                    selectedStatus)   ||   (level.recruitmentProcessType === "Interview" &&
                    rejectionStatus)           
                ) {
                  return {
                    type: "Interview",
                    interviewTitle:
                      candidateInterviewLevels[
                        level.level - candidateInterviewLevels.length
                      ]?.interviewTitle,
                    interviewDate:
                      candidateInterviewLevels[
                        level.level - candidateInterviewLevels.length
                      ]?.interviewDate,
                    interviewFromTime:
                      candidateInterviewLevels[
                        level.level - candidateInterviewLevels.length
                      ]?.interviewFromTime,
                    interviewToTime:
                      candidateInterviewLevels[
                        level.level - candidateInterviewLevels.length
                      ]?.interviewToTime,
                    candidateStatus:
                      candidateInterviewLevels[
                        level.level - candidateInterviewLevels.length
                      ]?.candidateStatus,
                  };
                }
                return null;
              };

              return (
                <div key={level.id} className="flex items-center space-x-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out cursor-pointer transform ${stepClass}`}
                    onClick={() => {
                      const data = modalInfo();
                      if (data) {
                        openModal(data);
                      }
                    }}
                  >
                    {rejectionStatus ? (
                      <FaTimes className="text-xl" />
                    ) : isCompleted || selectedStatus ? (
                      <FaCheckCircle className="text-xl" />
                    ) : isCurrent ? (
                      <FaHourglassHalf className="text-xl animate-pulse" />
                    ) : (
                      <FaTimes className="text-xl" />
                    )}
                  </div>

                  <div className="text-center">
                    <div
                      className={`font-semibold ${
                        rejectionStatus
                          ? "text-red-500"
                          : isCompleted || selectedStatus
                          ? "text-green-500"
                          : isCurrent
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {level.recruitmentProcessName || "Unknown"}
                    </div>
                    <div
                      className={`text-xs ${
                        rejectionStatus
                          ? "text-red-500"
                          : isCompleted || selectedStatus
                          ? "text-green-500"
                          : isCurrent
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {level.recruitmentProcessType === "Interview"
                        ? candidateRecruitmentProcessLevels[level.level - 1]
                            ?.candidateStatus || "Unknown"
                        : level.recruitmentProcessType === "Assessment"
                        ? candidateRecruitmentProcessLevels[level.level - 1]
                            ?.status || "Unknown"
                        : ""}
                    </div>
                  </div>

                  {index < recruitmentProcessLevels.length - 1 && (
                    <div className="mx-2 text-gray-400 text-2xl">
                      <span>{"-->"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Modal Display */}
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
              <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full transition-transform duration-300 transform">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-gray-800">
                  Details
                </h2>
                {modalData?.type === "Assessment" && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Assessment Name:
                      </span>
                      <span className="text-gray-900">
                        {modalData.assessmentName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Assessment Type:
                      </span>
                      <span className="text-gray-900">
                        {modalData.assessmentType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Assessment Score:
                      </span>
                      <span className="text-gray-900">{modalData.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Start Date:
                      </span>
                      <span className="text-gray-900">
                        {modalData.assessmentStartDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        End Date:
                      </span>
                      <span className="text-gray-900">
                        {modalData.assessmentEndDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Start Time:
                      </span>
                      <span className="text-gray-900">
                        {modalData.assessmentStartTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        End Time:
                      </span>
                      <span className="text-gray-900">
                        {modalData.assessmentEndTime}
                      </span>
                    </div>
                  </div>
                )}
                {modalData?.type === "Interview" && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Interview Title:
                      </span>
                      <span className="text-gray-900">
                        {modalData.interviewTitle}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Interview Date:
                      </span>
                      <span className="text-gray-900">
                        {modalData.interviewDate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        Start Time:
                      </span>
                      <span className="text-gray-900">
                        {modalData.interviewFromTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        End Time:
                      </span>
                      <span className="text-gray-900">
                        {modalData.interviewToTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="text-gray-900">
                        {modalData.candidateStatus}
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={closeModal}
                  className="w-full mt-6 py-3 px-4 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Offer Letter Tracking */}
      {offerApproval.length > 0 && (
        <div className="space-y-6 bg-white rounded-lg shadow-xl p-10">
          <h2 className="text-xl font-semibold text-blue-950 bg-clip-text">
            Offer Letter Process
          </h2>
          <div className="flex items-center space-x-6 mt-8">
            {approvalLevels.map((level, index) => {
              const isCompleted = offerApprovalCurrentLevel > level.level;
              const isCurrent = offerApprovalCurrentLevel === level.level;
              const rejectionStatus =
                offerApproval[level.level - 1] &&
                offerApproval[level.level - 1].status === "Rejected";

              const stepClass = rejectionStatus
                ? "bg-red-500 text-white"
                : isCompleted
                ? "bg-green-500 text-white"
                : isCurrent
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-500";

              return (
                <div key={level.id} className="flex items-center space-x-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform ${stepClass}`}
                  >
                    {rejectionStatus ? (
                      <FaTimes className="text-xl" />
                    ) : isCompleted ? (
                      <FaCheckCircle className="text-xl" />
                    ) : isCurrent ? (
                      <FaHourglassHalf className="text-xl animate-pulse" />
                    ) : (
                      <FaTimes className="text-xl" />
                    )}
                  </div>

                  <div className="text-center">
                    <div
                      className={`font-semibold ${
                        rejectionStatus
                          ? "text-red-500"
                          : isCompleted
                          ? "text-green-500"
                          : isCurrent
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {level.level ? level.level : "Unknown"}
                    </div>
                    <div
                      className={`text-xs ${
                        rejectionStatus
                          ? "text-red-500"
                          : isCompleted
                          ? "text-green-500"
                          : isCurrent
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {level.employee.role.roleName}
                    </div>
                    <div
                      className={`text-xs ${
                        rejectionStatus
                          ? "text-red-500"
                          : isCompleted
                          ? "text-green-500"
                          : isCurrent
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    >
                      {offerApproval[level.level - 1] &&
                        offerApproval[level.level - 1].status}
                    </div>
                  </div>

                  {index < approvalLevels.length - 1 && (
                    <div className="mx-2 text-gray-400 text-2xl">
                      <span>{"-->"}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default CandidateInfo;
