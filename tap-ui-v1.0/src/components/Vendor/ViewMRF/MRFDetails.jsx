import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
 
const MRFDetails = () => {
    const { id } = useParams(); // Get the MRF ID from URL parameters
    const [mrfDetails, setMrfDetails] = useState(null);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        const fetchMRFDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/tap/mrf/getMrf/${id}`);
                setMrfDetails(response.data);
                console.log(response);
            } catch (error) {
                console.error("An error occurred while fetching MRF details:", error);
            } finally {
                setLoading(false);
            }
        };
 
        fetchMRFDetails();
    }, [id]);
 
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="loader"></div>
            </div>
        );
    }
 
    if (!mrfDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold text-gray-700">No MRF details found</p>
            </div>
        );
    }
 
    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-3xl font-bold text-center text-[#27235C] mb-6">MRF Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">MRF ID:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfId}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Department:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfDepartmentName}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Required Technology:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfRequiredTechnology}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Probable Designation:</h3>
                    <p className="text-gray-600">{mrfDetails.probableDesignation}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Resource Count:</h3>
                    <p className="text-gray-600">{mrfDetails.requiredResourceCount}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Required Skills:</h3>
                    <p className="text-gray-600">{mrfDetails.requiredSkills}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Employment Mode:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfCriteria.employmentMode}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Education:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfCriteria.educationalQualification}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Experience:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfCriteria.yearsOfExperience}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Salary Range:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfCriteria.minimumCTC} - {mrfDetails.mrfCriteria.maximumCTC}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Contract Start:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfCriteria.contractStartDate}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Closure:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfCriteria.closureDate}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Location:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfCriteria.jobLocation}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-800">Filled Positions:</h3>
                    <p className="text-gray-600">{mrfDetails.mrfStatus?.requirementFilled}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 col-span-2">
                    <h3 className="font-semibold text-gray-800">Job Description:</h3>
                    <a
                        href={`http://your-api-url/job-description/${mrfDetails.jobDescriptionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition duration-200"
                    >
                        Download Job Description
                    </a>
                </div>
            </div>
            <div className="mt-6 text-center">
                <a
                    href="/vendorDashboard/viewmrfbyvendor"
                    className="inline-block px-6 py-2 bg-[#27235C] text-white rounded-lg hover:bg-[#1F1A3D] transition duration-200">
                    Back to MRF List
                </a>
            </div>
        </div>
    );
};
 
export default MRFDetails;
