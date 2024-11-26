import axios from "axios";

const API_URL = "http://localhost:8080/candidates";

export const getAssessmentCount = async (candidateId) => {
  try {
    const response = await axios.get(`${API_URL}/assessment-count`, {
      params: {
        candidateId: candidateId,
      },
    });
    console.log(candidateId);
    return response.data;
  } catch (error) {
    throw Error("Error in fetching candidate assessment count data");
  }
};

export const getAppliedJobsCount = async (candidateId) => {
  try {
    const response = await axios.get(`${API_URL}/applied-job-count`, {
      params: {
        candidateId: candidateId,
      },
    });
    return response.data;
  } catch (error) {
    throw Error("Error in fetching candidate Applied jobs count data");
  }
};

export const getInterviewCount = async (candidateId) => {
  try {
    const response = await axios.get(`${API_URL}/interview-count`, {
      params: {
        candidateId: candidateId,
      },
    });
    return response.data;
  } catch (error) {
    throw Error("Error in fetching candidate Interview count data");
  }
};

export const getAppliedJobs = async (candidateId) => {
  try {
    const response = await axios.get(`${API_URL}/applied-job`, {
      params: { candidateId },
    });
    return response.data;
  } catch (error) {
    throw Error("Error in fetching applied jobs data");
  }
};

export const getCandidateById = async (candidateId) => {
  try {
    const response = await axios.get(`${API_URL}/get/${candidateId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate data", error);
    throw error;
  }
};

export const updateCandidateProfile = async (candidateId, profileData) => {
  const formData = new FormData();
  formData.append("firstName", profileData.firstName);
  formData.append("lastName", profileData.lastName);
  formData.append("experience", profileData.experience);
  formData.append("skill", profileData.skill);
  formData.append("location", profileData.location);
  formData.append("email", profileData.email);
  formData.append("panNumber", profileData.panNumber);
  formData.append("mobileNumber", profileData.mobileNumber);
  formData.append("source", profileData.source);
  if (profileData.candidateProfileImage instanceof File) {
    formData.append("candidateProfileImage", profileData.candidateProfileImage);
  } else {
    const byteCharacters = atob(profileData.candidateProfileImage);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    formData.append("candidateProfileImage", blob, "profileImage.png");
  }

  if (profileData.candidateResume) {
    const resumeBlob = new Blob([Uint8Array.from(atob(profileData.candidateResume), c => c.charCodeAt(0))], { type: 'application/pdf' });
    formData.append("candidateResume", resumeBlob, "candidateResume.pdf");
  }
  try {
    const response = await axios.patch(
      `${API_URL}/profileupdate/${candidateId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating candidate profile", error);
    throw error;
  }
};

export const getInterviewLevels = async (mrfJdId) => {
  try {
    const response = await axios.get(`${API_URL}/interview-levels`, {
      params: { mrfJdId: mrfJdId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching interview levels', error);
    throw error;
  }
};

export const getInterviewDetails = async (recruitmentProcessId, candidateId) => {
  
  try {
    
    const response = await axios.get(`${API_URL}/interview-types`, {
      params: { recruitmentProcessId: recruitmentProcessId, candidateId: candidateId },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching interview details', error);
    throw error;
  }
};
