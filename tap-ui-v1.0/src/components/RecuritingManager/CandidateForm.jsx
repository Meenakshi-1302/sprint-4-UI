//uienhanced

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist/webpack";
import RecruitingManagerNavbar from "./RecruitingManagerNavbar";
import { Toaster, toast } from 'react-hot-toast';
import { addCandidateByRecruitingManager } from "../../services/RecruitingManager/CandidateService";
// import Loader from "./Loader";

const CandidateForm = () => {
  const id = sessionStorage.getItem('employeeId');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    skill: "",
    certifications: "",
    candidateResume: ""
  });
  
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [popupMessage, setPopupMessage] = useState(""); // New state for popup messages
  const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

  // Validation state
  const [errors, setErrors] = useState({});

  // Define IT skills and certifications for efficient extraction
  const IT_SKILLS = [
    "java", "python", "c", "html", "css", "javascript", "react", "node js",
    "sql", "nosql", "aws", "azure", "docker", "linux", "tableau",
    "machine learning", "iot", "flutter", "cloud", "power bi", "spring boot"
  ];

  const CERTIFICATIONS = [
    "aws certified", "google cloud certified", "coursera certification",
    "nptel certification", "tableau certification", "cisco certification",
    "sql basics", "python programming", "java programming",
    "html and css certification", "data visualization certification",
    "machine learning certification"
  ];

  // Extract text from PDF
  const extractTextFromPDF = async (file) => {
    const fileReader = new FileReader();

    return new Promise((resolve, reject) => {
      fileReader.onload = async () => {
        try {
          const pdf = await pdfjsLib.getDocument(fileReader.result).promise;
          let extractedText = "";

          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
            extractedText += `${pageText} `;
          }

          resolve(extractedText);
        } catch (error) {
          reject(error);
        }
      };

      fileReader.onerror = () => {
        reject(new Error("Failed to read the file"));
      };

      fileReader.readAsArrayBuffer(file);
    });
  };

  // Extract Candidate Name
  const extractCandidateName = (text) => {
    const namePatterns = [
      /^(?:Mr\.|Ms\.|Mrs\.|Dr\.)?\s*([A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)*)/m,
      /^(?:Mr\.|Ms\.|Mrs\.|Dr\.)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/m,
      /(?:I\s*am\s*:?\s*|S\/o\s*:?\s*|About\s*me\s*:?\s*)([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
      /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})/
    ];
  
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match) {
        const fullName = match[1].trim();
        const nameParts = fullName.split(/\s+/);
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");
        return { firstName, lastName };
      }
    }
  
    return { firstName: "", lastName: "" };
  };

  // Extract Skills
  const extractSkills = (text) => {
    const skillSections = [
      /Skills?[:\s]*(.*?)(?:\n\n|\n| $)/i,
      /Tech\s*Stack[:\s]*(.*?)(?:\n\n|\n|$)/i,
      /Technologies?\s*Known[:\s]*(.*?)(?:\n\n|\n|$)/i,
      /Area\s*of\s*Interest[:\s]*(.*?)(?:\n\n|\n|$)/i,
      /Expertise[:\s]*(.*?)(?:\n\n|\n|$)/i
    ];

    let extractedSkills = [];

    skillSections.forEach(section => {
      const match = text.match(section);
      if (match) {
        const sectionSkills = match[1].split(/[,\n]+/)
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0);
        extractedSkills.push(...sectionSkills);
      }
    });
    const certificationsFound = CERTIFICATIONS.filter(cert => 
      text.toLowerCase().includes(cert.toLowerCase())
    );
    const predefinedSkillsFound = IT_SKILLS.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    const allSkills = [...new Set([...predefinedSkillsFound, ...certificationsFound])];

    return allSkills.join(", ");
  };

  // Extract Email
  const extractEmail = (text) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : "";
  };

  // Extract Mobile Number
  const extractMobileNumber = (text) => {
    const phoneRegex = [
      /(?:\+?91[-\s]?)?[6-9]\d{9}/,
      /\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/,
      /\+?44\s?(\d{4})[\s]?(\d{3})[\s]?(\d{3})/,
      /\+?61\s?(\d{4})[\s]?(\d{3})[\s]?(\d{3})/,
      /\+?(\d{1,3})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})[-.\s]?(\d{3,4})/
    ];
  
    for (const regex of phoneRegex) {
      const match = text.match(regex);
      if (match) {
        const cleanedNumber = match[0]
          .replace(/[-\s().+]/g, '')
          .replace(/^(?:91|1|44|61)/, '')
          .slice(0, 10);
  
        if (cleanedNumber.length === 10 && /^[6-9]/.test(cleanedNumber)) {
          return cleanedNumber;
        }
      }
    }
  
    return "";
  };

  // Handle File Change
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if(file.size > 250 * 1024){
        toast.error("Resume size should be less than 250 KB");
        return;
      }
      else if(file.type !== "application/pdf"){
        toast.error("Only PDF files are allowed");
        return;
      }
      setResume(file);
      setMessage("");
      setIsParsing(true);

      try {
        const extractedText = await extractTextFromPDF(file);
        const { firstName, lastName } = extractCandidateName(extractedText);
        const email = extractEmail(extractedText);
        const mobileNumber = extractMobileNumber(extractedText);
        const skill = extractSkills(extractedText);

        setFormData({
          firstName,
          lastName,
          email,
          mobileNumber,
          skill,
        });

        setPopupMessage("Data extracted successfully!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000); // Show popup for 3 seconds

        setIsFormVisible(true);
      } catch (error) {
        setMessage("Error extracting data from resume. Please fill the form manually.");
      } finally {
        setIsParsing(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleMobileNumberInput = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, mobileNumber: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName || /[^a-zA-Z]/.test(formData.firstName)) {
      newErrors.firstName = "First Name is required and should only contain alphabetic characters.";
    }
 
    if (!formData.lastName || /[^a-zA-Z]/.test(formData.lastName)) {
      newErrors.lastName = "Last Name is required and should only contain alphabetic characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email is not valid.";
    }

    if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile Number must be 10 digits long and numeric.";
    }

    if (!formData.skill || /\d/.test(formData.skill)) {
      newErrors.skill = "Skills cannot be empty and should not contain numbers.";
    }

    if (resume && (resume.size > 250 * 1024 || resume.type !== "application/pdf")) {
      newErrors.resume = "Resume must be a PDF file and less than 250 KB.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const formDataToSubmit = new FormData();

    for (const key in formData) {
      formDataToSubmit.append(key, formData[key]);
    }

    if (resume) {
      formDataToSubmit.append("candidateResume", resume);
    }

    try {
      formDataToSubmit.append("status", "Candidate Added");
      formDataToSubmit.append("sourceId", id);

      const response = await addCandidateByRecruitingManager(formDataToSubmit);
        // method: "POST",
        // body: formDataToSubmit,

      if (response.status === 200) {
        setTimeout(() => {
          toast.success("Form submitted successfully!");
        }, 2000); // Delay toast for 2 seconds

        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          skill: "",
          certifications: "",
          candidateResume: ""
        });
        setResume(null);
        setIsFormVisible(false);
        navigate("/candidates");
      } else {
        toast.error("Failed to submit the form.");
      }
    } catch (error) {
      toast.error("Error occurred while submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <RecruitingManagerNavbar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div 
        className={`
          min-h-screen 
          bg-gray-200
          p-4 
          flex 
          flex-col 
          ${sidebarOpen ? 'ml-64' : ' ml-16'} 
          transition-all 
          duration-300 
          ease-in-out
        `}
      >
        <div 
          className={`
            container 
            mx-auto 
            mt-20 
            max-w-4xl 
            w-full 
            ${sidebarOpen ? 'md:w-[calc(100%-16rem)]' : 'md:w-full'} 
            transition-all 
            duration-300
          `}
        >
          <div 
            className="
              bg-white 
              shadow-2xl 
              rounded-xl 
              p-8 
              transform 
              hover:scale-105 
              transition-transform 
              duration-300
              mt-28
            "
          >
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Candidate Addition Form</h1>
            
            {isParsing && (
              <div className="flex justify-center items-center mb-4">
                <div className="loader">Parsing Resume...</div>
              </div>
            )}

            {/* Popup for Data Extraction */}
            {showPopup && (
              <div className="fixed top-0 left-0 right-0 mt-20 flex justify-center">
                <div className="bg-green-500 text-white p-4 rounded shadow-lg">
                  {popupMessage}
                </div>
              </div>
            )}

            {/* File Upload Section */}
            {!isFormVisible && (
              <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100">
                <svg 
                  className="w-16 h-16 text-gray-400 mb-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http ://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m -2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
                <p className="text-gray-600 mb-4">Upload your resume to auto-fill the form</p>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                {errors.resume && <p className="text-red-500 text-xs italic">{errors.resume}</p>}

                <label 
                  htmlFor="resume-upload" 
                  className="
                    bg-blue-500 
                    text-white 
                    px-4 
                    py-2 
                    rounded 
                    hover:bg-blue-600 
                    transition 
                    duration-300 
                    cursor-pointer
                  "
                >
                  Choose Resume
                </label>
              </div>
            )}

            {/* Form Fields */}
            {isFormVisible && (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.firstName ? 'border-red-500' : ''}`}
                  />
                  {errors.firstName && <p className="text-red-500 text-xs italic">{errors.firstName}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.lastName ? 'border-red-500' : ''}`}
                  />
                  {errors.lastName && <p className="text-red-500 text-xs italic">{errors.lastName}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mobileNumber">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleMobileNumberInput}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${errors.mobileNumber ? 'border-red-500' : ''}`}
                    maxLength="10"
                    inputMode="numeric"
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-xs italic">{errors.mobileNumber}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skill">
                    Skill
                  </label>
                  <textarea
                    name="skill"
                    value={formData.skill}
                    onChange={handleInputChange}
                    className={`shadow appearance-none border rounded w-full py-2 px- 3 text-gray-700 ${errors.skill ? 'border-red-500' : ''}`}
                    rows="3"
                  ></textarea>
                  {errors.skill && <p className="text-red-500 text-xs italic">{errors.skill}</p>}
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
            {message && (
              <div className="jus mt-4 text-center text-sm text-gray-700">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateForm;
