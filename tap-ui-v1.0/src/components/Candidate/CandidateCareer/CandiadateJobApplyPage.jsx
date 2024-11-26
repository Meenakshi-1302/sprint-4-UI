

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CandidateNavbar from './CandidateNavbar';
import { Link, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import * as pdfjsLib from 'pdfjs-dist/webpack';
import { FaHome } from 'react-icons/fa';

const CandidateJobApplyPage = () => {
  const [searchKeywords, setSearchKeywords] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showJobDetails, setShowJobDetails] = useState(new Set());
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tap/jobDescription/viewAllJobDescriptions');
        setJobs(response.data);
        setFilteredJobs(response.data); // Initialize filtered jobs with all jobs
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching job data:", error);
      }
    };

    fetchJobs();
  }, []);
  
  // Filter jobs based on search keywords
  useEffect(() => {
    const results = jobs.filter(job => 
      job.jobTitle && job.jobTitle.toLowerCase().includes(searchKeywords.toLowerCase())
    );
    setFilteredJobs(results);
  }, [searchKeywords, jobs]); // Only depend on searchKeywords and jobs

  const toggleJobDetails = async (jobId) => {
    const newShowJobDetails = new Set(showJobDetails);

    if (newShowJobDetails.has(jobId)) {
      newShowJobDetails.delete(jobId);
    } else {
      newShowJobDetails.add(jobId);

      const job = filteredJobs.find(job => job.jobDescriptionId === jobId);
      if (job && job.rolesAndResponsibilities) {
        setLoading(true);
        try {
          const pdfBlob = await fetchPDFBlob(job.rolesAndResponsibilities);
          const pdfText = await extractTextFromPDF(pdfBlob);
          const parsedData = populateFieldsFromText(pdfText);
          
          // Print parsed data in console
          console.log("Parsed Data:", parsedData);

          setFilteredJobs((prevJobs) =>
            prevJobs.map((j) => (j.jobDescriptionId === jobId ? { ...j, parsedData } : j))
          );
        } catch (error) {
          console.error('Error retrieving or parsing the PDF:', error);
          toast.error('Error retrieving or parsing PDF document.');
        } finally {
          setLoading(false);
        }
      }
    }
    setShowJobDetails(newShowJobDetails);
  };

  const fetchPDFBlob = async (base64String) => {
    const byteCharacters = atob(base64String);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/pdf' });
  };

  const extractTextFromPDF = async (pdfBlob) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = async () => {
        const pdfData = new Uint8Array(fileReader.result);
        const pdfDocument = await pdfjsLib.getDocument({ data: pdfData }).promise;

        let textContent = '';
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const content = await page.getTextContent();
          content.items.forEach((item) => {
            textContent += item.str + ' ';
          });
        }

        resolve(textContent);
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(pdfBlob); // Read Blob as ArrayBuffer
    });
  };

  const populateFieldsFromText = (text) => {
    const fieldPatterns = {
      type: /Type:\s*“(.*?)”/i,
      location: /Location:\s*“(.*?)”/i,
      jobDescription: /Job Description:\s*([\s\S]*?)(?=Qualifications:)/i,
      qualifications: /Qualifications:\s*([\s\S]*?)(?=Responsibilities:)/i,
      responsibilities: /Responsibilities:\s*([\s\S]*)/i,
    };

    const parsedData = {};

    Object.keys(fieldPatterns).forEach((key) => {
      const match = text.match(fieldPatterns[key]);
      parsedData[key] = match && match[1] ? match[1].trim() : 'Not found';
    });

    return parsedData;
  };
  
  const breadcrumbPath = [
    { label: 'Home', path: '/candidatecareerpage' },
    { label: 'Jobs', path: '/candidatejobapplypage' },
    // { label: 'Apply', path: '#' }
  ];

  return (
    <div className="w-full">
      <CandidateNavbar />
      <Toaster />

      <nav className="bg-white p-4 rounded-lg mb-10">
        <ul className="flex items-center">
          <li className="inline-flex items-center">
            <Link to="/" className="text-[#27235C] hover:text-[#524F7D]">
              <FaHome className="mr-2" />
            </Link>
          </li>
          {breadcrumbPath.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              <Link to={item.path} className={`text-[#27235C] hover:text-[#524F7D] ${index === breadcrumbPath.length - 1 ? 'font-medium' : ''}`}>
                {item.label}
              </Link>
              {index < breadcrumbPath.length - 1 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* <nav className="bg-gray-200 p-4 rounded-lg mb-10">
        <span className="text-[#27235C]">Home</span> 
        <span className="text-[#524F7D]">Jobs</span>
      </nav> */}

      <div className="flex h-100 justify-center items-center bg-gradient-to-r bg-[#d3dcf1b1] text-white rounded-lg p-10">
        <div className="text-left w-full">
          <h2 className="ml-20 text-6xl md:text-8xl font-thin not-italic text-[#27235C]">
            Join us to create relevant<br /> solutions for customers that<br /> improve lives
          </h2>
        </div>
      </div>

      <div className="flex flex-col px-8 py-10 ml-40 mr-40 justify-center md:flex-row md:space-x-4 mt-10">
        <input
          type="text"
          className="p-3 border rounded-md border-gray-300 w-full"
          placeholder="Search by Position"
          value={searchKeywords}
          onChange={(e) => setSearchKeywords(e.target.value)} // Update the keywords on input change
        />
        {/* <input
          type="text"
          className="p-3 border rounded-md border-gray-300 w-full"
          placeholder="Location"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)} // Keep location input for potential future use
        /> */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 mx-40 gap-4 mt-10">
        {filteredJobs.length === 0 ? (
          <div className="p-4 text-center justify-center ml-20  text-red-600">
            No results matched your search.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isJobExpanded = showJobDetails.has(job.jobDescriptionId);
            const jobData = job.parsedData || {}; // Retrieve parsed data from job object
            return (
              <div 
                key={job.jobDescriptionId}
                className="relative bg-gradient-to-r bg-[#27235C] p-4 rounded-lg shadow-md"
              >
                <div
                  className="text-[#27235C] cursor-pointer"
                  onClick={() => toggleJobDetails(job.jobDescriptionId)}
                >
                  <h3 className="font-bold text-white text-xl">{job.jobTitle || 'Job Title Not Found'}</h3>
                </div>
                <button
                  className="absolute top-2 right-2 text-[#27235C] bg-white rounded-full border border-[#27235C] w-8 h-8 flex items-center justify-center"
                  onClick={() => toggleJobDetails(job.jobDescriptionId)}
                >
                  {isJobExpanded ? '-' : '+'}
                </button>

                {isJobExpanded && (
                  <div className="absolute left-0 mt-1 w-full p-4 border border-gray-300 rounded-md bg-gray-50 z-20">
                    <h4 className="font-semibold">Job Type:</h4>
                    <p className="text-[#333] text-sm">{loading ? 'Loading...' : jobData.type || 'Not available'}</p>
                    <h4 className="font-semibold">Location:</h4>
                    <p className="text-[#333] text-sm">{loading ? 'Loading...' : jobData.location || 'Not available'}</p>
                    <h4 className="font-semibold">Job Description:</h4>
                    <p className="text-[#333] text-sm">{loading ? 'Loading...' : jobData.jobDescription || 'Not available'}</p>
                    <h4 className="font-semibold">Qualifications:</h4>
                    <p className="text-[#333] text-sm">{loading ? 'Loading...' : jobData.qualifications || 'Not available'}</p>
                    <h4 className="font-semibold">Responsibilities:</h4>
                    <p className="text-[#333] text-sm">{loading ? 'Loading...' : jobData.responsibilities || 'Not available'}</p>
                    
                    <div className="mt-4 text-center">
                      <button
                        className="bg-[#27235C] text-white py-3 px-6 rounded-md hover:bg-[#524F7D] transition duration-300"
                        onClick={() => navigate(`/jobapplyformpage/${job.jobDescriptionId}`, { state: { jobTitle: job.jobTitle } })}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CandidateJobApplyPage;