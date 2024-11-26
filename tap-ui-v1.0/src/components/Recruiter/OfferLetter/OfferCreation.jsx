import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLaptopCode, FaBriefcase, FaEdit, FaEye, FaPlus, FaPen } from "react-icons/fa";
import logo from '../../../assets/logo.png.png';
import { Link, useNavigate } from 'react-router-dom';
import { getMrfByMrfId, getOfferLetterByCandidateId, getSelectedCandidatesByMrfId } from '../../../services/Recruiter/OfferLetter/OfferCreationService';
import { toast, ToastContainer } from 'react-toastify';
 
const OfferCreation = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mrfid, setMrfid] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState({});
  const [offerDetails, setOfferDetails] = useState({
    date: '28-Nov-2023',
    salutation: '',
    position: 'Intern - Software Engineer',
    probableDesignation: '',
    joiningDate: '',
    endDate: '31-Aug-2024',
    workSchedule: '48 hours per week, Monday through Saturday, from 9:00 am to 6:00 pm',
    benefits: 'employee health insurance and Accidental insurance for Rs.400,000/- each',
    offerPackage: ''
  });
  const [offer, setOffer] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const navigate = useNavigate();
  const [mrfData, setMrfData] = useState(null);
 
  const [offerDetailsValidate, setOfferDetailsValidate] = useState({
    joiningDate: '',
    offerPackage: ''
  });
 
  const [errors, setErrors] = useState({
    joiningDate: '',
    offerPackage: ''
  });
 
  const handleInputValidateChange = (e) => {
    const { name, value } = e.target;
 
    setOfferDetailsValidate({
      ...offerDetailsValidate,
      [name]: value
    });
 
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? '' : `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    }));
  };
 
  const validateForm = () => {
    const newErrors = {
      joiningDate: '',
      offerPackage: '',
    };
 
    if (!offerDetailsValidate.joiningDate) {
      newErrors.joiningDate = 'Joining Date is required';
    }
 
    if (!offerDetailsValidate.offerPackage) {
      newErrors.offerPackage = 'Offer Package is required';
    } else if (offerDetailsValidate.offerPackage <= 0) {
      newErrors.offerPackage = 'Offer Package should be greater than zero';
    }
 
    setErrors(newErrors);
 
    return !newErrors.joiningDate && !newErrors.offerPackage;
  };
 
  useEffect(() => {
    const mrfid = sessionStorage.getItem('mrfid');
    if (!mrfid) {
      setError('MRF ID not found in session storage.');
      setLoading(false);
      return;
    }
    setMrfid(mrfid);
 
    const fetchCandidates = async () => {
      try {
        const response = await getSelectedCandidatesByMrfId(mrfid);
        const selectedCandidates = response.data.filter(candidate => candidate.status === 'Selected');
 
        for (const candidate of selectedCandidates) {
          try {
            const offerResponse = await getOfferLetterByCandidateId(candidate.candidateId);
            candidate.offer = offerResponse.data;
          } catch (error) {
          }
        }
 
        setCandidates(selectedCandidates);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching candidates');
      } finally {
        setLoading(false);
      }
    };
 
    const fetchMRF = async () => {
      try {
        const response = await getMrfByMrfId(mrfid);
 
        setMrfData(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error fetching candidates');
      } finally {
        setLoading(false);
      }
    };
 
    fetchCandidates();
    fetchMRF();
  }, []);
 
  const handleActionClick = (action, candidate) => {
    if (action === 'createoffer') {
      setSelectedCandidate(candidate);
      setOfferDetails(prev => ({
        ...prev,
        salutation: `Dear ${candidate.firstName}`,
        probableDesignation: mrfData.probableDesignation,
      }));
      setShowCreateModal(true);
    } else if (action === 'viewoffer') {
      setOffer(candidate.offer);
      setSelectedCandidate(candidate)
      setShowViewModal(true);
    } else if (action === 'editoffer') {
      setSelectedCandidate(candidate);
      setOfferDetails({
        ...candidate.offer,
        salutation: `Dear ${candidate.firstName}`
      });
      console.log(candidate.offer.joiningDate);
      console.log(candidate.offer.offerPackage);
      setOfferDetailsValidate(prev => ({
        ...prev,
        joiningDate: candidate.offer.joiningDate,
        offerPackage: candidate.offer.offerPackage
      }));
      setShowEditModal(true);
    }
  };
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOfferDetails(prev => ({ ...prev, [name]: value }));
  };
 
  const generateOfferLetter = async () => {
 
    if (validateForm()) {
 
      const doc = new jsPDF();
      const margin = 15;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
 
      let yPosition = margin;
 
      const imgData = logo;
      const imgWidth = 30;
      const imgHeight = 10;
      doc.addImage(imgData, 'PNG', pageWidth - imgWidth - margin, yPosition - imgHeight, imgWidth, imgHeight);
      yPosition += 15;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text('Internship Offer Letter', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
 
 
 
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text('Karthikeyan RK,', margin, yPosition);
      yPosition += 10;
      doc.text('4308, TNHB Colony, Mela Anuppanadi, Madural-625009.', margin, yPosition);
      yPosition += 5;
 
      doc.autoTable({
        head: [[offerDetails.salutation]],
        startY: yPosition,
        theme: 'plain',
        margin: { left: margin, right: margin },
        styles: {
          font: 'helvetica',
          fontSize: 12,
          cellPadding: 2,
          valign: 'middle',
          halign: 'left',
        },
        columnStyles: {
          0: { halign: 'right' },
          1: { halign: 'left' },
        },
      });
      yPosition += 10;
 
      const bodyContent = `
      We are pleased to extend an offer for an internship position in our organization Relevantz Technology Services India Private Limited. Based on your qualifications and interview, we believe you will be a valuable addition to our Relevantian Family.
 
      Position: The position we are offering is that of ${mrfData.probableDesignation}.
 
      Start Date: The internship will commence on ${offerDetails.joiningDate} and will continue till ${offerDetails.endDate}.
 
      Work Schedule: You will be expected to work ${offerDetails.workSchedule}, including an hour lunch break.
 
      Benefit: During your internship, you will have the opportunity to get ${offerDetails.benefits}.
 
      Compensation: During your internship, you will get Package of ${offerDetails.offerPackage} LPA.
 
      Company Policies: You will be expected to adhere to our company's rules, regulations, and guidelines, including confidentiality and non-disclosure agreements.
 
      During your internship, you will have access to Relevantz and its client's private information. You agree that you will keep all this information and client information strictly confidential. Please bring along required documents when you arrive to commence duty on your first day.
 
      For any further discussions, please feel free to reach out to Mr. Azhagu Kumaran Mohan at azhagukumaran.mohan@relevantz.com or on +91 9789518386 from our campus recruitment team.`;
 
 
      const lineHeight = 6;
      const splitText = doc.splitTextToSize(bodyContent, pageWidth - 2 * margin);
      doc.text(splitText, margin, yPosition, { maxWidth: pageWidth - 2 * margin, align: 'justify' });
      yPosition += splitText.length * lineHeight + 10;
 
      doc.text('Relevantz Technology Services India Private Limited', margin, yPosition - 25);
      yPosition += 5;
      doc.text('[Formerly ObjectFrontier India Private Limited]', margin, yPosition - 25);
      yPosition += 5;
      doc.text('Regd. Office: Chenrial One- Chenno T SEZ, Module-4, 3rd Floor, South Block, Phase 2,', margin, yPosition - 25);
      yPosition += 5;
      doc.text('Pallavaram-Thoraipakkam 200 Feet Road, Thoraipakkam, Chennai-600097, India.', margin, yPosition - 25);
      yPosition += 5;
 
      const signatureYPosition = pageHeight - margin - 40;
      doc.setFontSize(12);
 
 
      doc.text('Candidate\'s Signature', margin, signatureYPosition);
      doc.text('BUHead\'s Signature', pageWidth - margin - 40, signatureYPosition);
 
      const dateYPosition = signatureYPosition + 10;
      doc.text('Date: ', margin, dateYPosition);
      doc.text('Date: ', pageWidth - margin - 40, dateYPosition);
 
      const footerText = `info@relevantz.com | +91 44 4006 1234 | www.relevantz.com`;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(footerText, pageWidth / 2, doc.internal.pageSize.height - margin, { align: 'center' });
 
      const pdfBlob = doc.output('blob');
      const formData = new FormData();
 
      formData.append('offerLetter', pdfBlob);
 
      try {
        if (selectedCandidate.offer == null) {
          const offerBlob = new Blob([JSON.stringify({
            candidate: selectedCandidate,
            mrf: mrfData,
            offerPackage: offerDetails.offerPackage,
            joiningDate: offerDetails.joiningDate,
          })], { type: 'application/json' });
 
          formData.append('offer', offerBlob);
          await axios.post('http://localhost:8080/tap/generateOfferLetter', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success("Offer letter generated and sent successfully!");
        }
        else {
          const offerBlob = new Blob([JSON.stringify({
            mrf: mrfData,
            offerPackage: offerDetails.offerPackage,
            joiningDate: offerDetails.joiningDate,
          })], { type: 'application/json' });
 
          formData.append('offer', offerBlob);
          formData.append('offerLetter', pdfBlob);
 
          await axios.put(`http://localhost:8080/tap/updateOfferLetter/${selectedCandidate.offer.offerId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          toast.success("Offer letter Updated successfully!");
        }
 
      } catch (error) {
        if (selectedCandidate.offer == null) {
          toast.error("Error generating offer letter");
        } else {
          toast.error("Error updating offer letter");
        }
      } finally {
        setShowCreateModal(false);
        setShowEditModal(false);
      }
    }
  };
 
 
  if (loading) {
    return <div className="text-center py-4">Loading candidates...</div>;
  }
 
  if (error) {
    return <div className="text-center py-4 text-red-600">Error: {error}</div>;
  }
 
  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      {mrfData && (
        <div className="mb-8 bg-white text-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-950">MRF DETAILS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Department</h3>
                <p className='text-black'>{mrfData.mrfDepartmentName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaLaptopCode className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Technology</h3>
                <p className='text-black'>{mrfData.mrfRequiredTechnology}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaUser className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Probable Designation</h3>
                <p className='text-black'>{mrfData.probableDesignation}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Required Resources</h3>
                <p className='text-black'>{mrfData.requiredResourceCount}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FaEnvelope className="text-2xl text-black" />
              <div>
                <h3 className="font-bold text-black">Required Skills</h3>
                <p className='text-black'>{mrfData.requiredSkills}</p>
              </div>
            </div>
          </div>
        </div>
      )}
 
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-xl font-bold mb-4 text-blue-950">SELECTED CANDIDATES</h1>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Skill</th>
              <th className="px-4 py-2 text-left">Experience</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                {/* <td className="px-4 py-2"><Link to={`/candidateInfo/${candidate.candidateId}`} className="text-black-500 hover:underline">
                  {candidate.firstName} {candidate.lastName}
                </Link></td> */}
                <td className="px-4 py-2 flex items-center">
                  <span>{candidate.firstName} {candidate.lastName}</span>
                  <Link to={`/candidateInfo/${candidate.candidateId}`} className="ml-2">
                    <FaEye className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                  </Link>
                </td>
                <td className="px-4 py-2">{candidate.email}</td>
                <td className="px-4 py-2">{candidate.skill}</td>
                <td className="px-4 py-2 text-left">{candidate.experience}</td>
                <td className="px-4 py-2 text-right">
                  {candidate.offer ? (
                    <div className='flex items-center'>
                      <button
                        onClick={() => handleActionClick('viewoffer', candidate)}
                        className="bg-gray-500 px-4 py-2 rounded-md text-white hover:bg-gray-600 mr-2 flex items-center"
                      >
                        <FaEye className="h-5 w-5 mr-2" /> {/* Eye icon */}
                        View
                      </button>
                      <button
                        onClick={() => handleActionClick('editoffer', candidate)}
                        className="bg-blue-950 px-4 py-2 rounded-md text-white hover:bg-blue-900 flex items-center"
                      >
                        <FaPen className="h-5 w-5 mr-2" /> {/* Pen icon */}
                        Edit
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleActionClick('createoffer', candidate)}
                      className="bg-blue-950 px-4 py-2 rounded-md text-white hover:bg-blue-900 flex"
                    >
                      <FaPlus className="h-5 w-5 mr-2" /> {/* Plus icon */}
                      Create Offer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-6xl w-full" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 className="text-2xl font-semibold mb-4">Create Offer Letter for {selectedCandidate?.firstName} {selectedCandidate?.lastName}</h2>
            <div className="space-y-4">
              <div>
                <label className="block"><strong>Salutation:</strong></label>
                <input
                  name="salutation"
                  value={offerDetails.salutation}
                  className="border rounded w-full p-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block"><strong>Destination:</strong></label>
                <input
                  name="probableDesignation"
                  value={offerDetails.probableDesignation}
                  className="border rounded w-full p-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block"><strong>Joining Date:</strong></label>
                <input
                  name="joiningDate"
                  type="date"
                  value={offerDetails.joiningDate}
                  className="border rounded w-full p-2"
                  onChange={(e) => {
                    handleInputChange(e);
                    handleInputValidateChange(e);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]}
                />
                {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
              </div>
 
              <div>
                <label className="block"><strong>Offer Package:</strong></label>
                <input
                  name="offerPackage"
                  value={offerDetails.offerPackage}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleInputValidateChange(e);
                  }}
                  className="border rounded w-full p-2"
                />
                {errors.offerPackage && <p className="text-red-500 text-sm">{errors.offerPackage}</p>}
              </div>
 
              <h3 className="font-semibold mt-4">Preview:</h3>
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                <h4 className="font-bold">Internship Offer Letter</h4>
                <div>{offerDetails.salutation}</div>
                <p>{`We are pleased to extend an offer for an internship position in our organization Relevantz Technology Services India Private Limited. Based on your qualifications and interview, we believe you will be a valuable addition to our Relevantian Family.`}</p>
                <p>{`Position: The position we are offering is that of ${offerDetails.position}.`}</p>
                <p>{`Start Date: The internship will commence on ${offerDetails.joiningDate} and will continue till ${offerDetails.endDate}.`}</p>
                <p>{`Work Schedule: You will be expected to work ${offerDetails.workSchedule}.`}</p>
                <p>{`Benefits: During your internship, you will have the opportunity to get ${offerDetails.benefits}.`}</p>
                <p>{`Compensation: During your internship, you will get Package of ${offerDetails.offerPackage} LPA.`}</p>
                <p>Company Policies: You will be expected to adhere to our company's rules, regulations, and guidelines, including confidentiality and non-disclosure agreements.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={generateOfferLetter}
                className="bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-900"
              >
                Create Offer
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="ml-2 bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
 
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-6xl w-full" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 className="text-2xl font-semibold mb-4">Editing Offer Letter for {selectedCandidate?.firstName} {selectedCandidate?.lastName}</h2>
            <div className="space-y-4">
              <div>
                <label className="block"><strong>Salutation:</strong></label>
                <input
                  name="salutation"
                  value={selectedCandidate?.firstName}
                  className="border rounded w-full p-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block"><strong>Destination:</strong></label>
                <input
                  name="probableDesignation"
                  value={offerDetails.probableDesignation}
                  className="border rounded w-full p-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block"><strong>Joining Date:</strong></label>
                <input
                  name="joiningDate"
                  type="date"
                  value={offerDetails.joiningDate}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleInputValidateChange(e);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]}
                  className="border rounded w-full p-2"
                />
                {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
              </div>
 
              <div>
                <label className="block"><strong>Offer Package:</strong></label>
                <input
                  name="offerPackage"
                  value={offerDetails.offerPackage}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleInputValidateChange(e);
                  }}
                  className="border rounded w-full p-2"
                />
                {errors.offerPackage && <p className="text-red-500 text-sm">{errors.offerPackage}</p>}
              </div>
 
              <h3 className="font-semibold mt-4">Preview:</h3>
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                <h4 className="font-bold">Internship Offer Letter</h4>
                <div>{offerDetails.salutation}</div>
                <p>{`We are pleased to extend an offer for an internship position in our organization Relevantz Technology Services India Private Limited. Based on your qualifications and interview, we believe you will be a valuable addition to our Relevantian Family.`}</p>
                <p>{`Position: The position we are offering is that of ${offerDetails.position}.`}</p>
                <p>{`Start Date: The internship will commence on ${offerDetails.joiningDate} and will continue till ${offerDetails.endDate}.`}</p>
                <p>{`Work Schedule: You will be expected to work ${offerDetails.workSchedule}.`}</p>
                <p>{`Benefits: During your internship, you will have the opportunity to get ${offerDetails.benefits}.`}</p>
                <p>{`Compensation: During your internship, you will get Package of ${offerDetails.offerPackage} LPA.`}</p>
                <p>Company Policies: You will be expected to adhere to our company's rules, regulations, and guidelines, including confidentiality and non-disclosure agreements.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={generateOfferLetter}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Update Offer
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="ml-2 bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )} */}
 
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-6xl w-full" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 className="text-2xl font-semibold mb-4">
              {showCreateModal
                ? `Create Offer Letter for ${selectedCandidate?.firstName} ${selectedCandidate?.lastName}`
                : `Editing Offer Letter for ${selectedCandidate?.firstName} ${selectedCandidate?.lastName}`}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block"><strong>Salutation:</strong></label>
                <input
                  name="salutation"
                  value={showCreateModal ? offerDetails.salutation : selectedCandidate?.firstName}
                  className="border rounded w-full p-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block"><strong>Destination:</strong></label>
                <input
                  name="probableDesignation"
                  value={offerDetails.probableDesignation}
                  className="border rounded w-full p-2"
                  readOnly
                />
              </div>
              <div>
                <label className="block"><strong>Joining Date:</strong></label>
                <input
                  name="joiningDate"
                  type="date"
                  value={offerDetails.joiningDate}
                  className="border rounded w-full p-2"
                  onChange={(e) => {
                    handleInputChange(e);
                    handleInputValidateChange(e);
                  }}
                  min={new Date().toISOString().split('T')[0]}
                  max={new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]}
                />
                {errors.joiningDate && <p className="text-red-500 text-sm">{errors.joiningDate}</p>}
              </div>
 
              <div>
                <label className="block"><strong>Offer Package:</strong></label>
                <input
                  name="offerPackage"
                  value={offerDetails.offerPackage}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleInputValidateChange(e);
                  }}
                  className="border rounded w-full p-2"
                />
                {errors.offerPackage && <p className="text-red-500 text-sm">{errors.offerPackage}</p>}
              </div>
 
              <h3 className="font-semibold mt-4">Preview:</h3>
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                <h4 className="font-bold">Internship Offer Letter</h4>
                <div>{offerDetails.salutation}</div>
                <p>{`We are pleased to extend an offer for an internship position in our organization Relevantz Technology Services India Private Limited. Based on your qualifications and interview, we believe you will be a valuable addition to our Relevantian Family.`}</p>
                <p>{`Position: The position we are offering is that of ${offerDetails.position}.`}</p>
                <p>{`Start Date: The internship will commence on ${offerDetails.joiningDate} and will continue till ${offerDetails.endDate}.`}</p>
                <p>{`Work Schedule: You will be expected to work ${offerDetails.workSchedule}.`}</p>
                <p>{`Benefits: During your internship, you will have the opportunity to get ${offerDetails.benefits}.`}</p>
                <p>{`Compensation: During your internship, you will get Package of ${offerDetails.offerPackage} LPA.`}</p>
                <p>Company Policies: You will be expected to adhere to our company's rules, regulations, and guidelines, including confidentiality and non-disclosure agreements.</p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={generateOfferLetter}
                className={showCreateModal ? "bg-blue-950 text-white px-6 py-2 rounded-lg hover:bg-blue-900" : "bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"}
              >
                {showCreateModal ? "Create Offer" : "Update Offer"}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
                className="ml-2 bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
 
      {showViewModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-6xl w-full" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <h2 className="text-2xl font-semibold mb-4 text-center">Offer Letter for {selectedCandidate.firstName} {selectedCandidate?.lastName}</h2>
 
            <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
              {offer?.offerLetter && offer.offerLetter ? (
                <div className="w-full h-96">
                  <iframe
                    src={`data:application/pdf;base64,${offer.offerLetter}`}
                    style={{ width: '100%', height: '500px' }}
                    title="PDF Document"
                  />
                </div>
              ) : (
                <p>No valid offer letter available or invalid file format.</p>
              )}
            </div>
 
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="ml-2 bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
 
 
 
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};
 
export default OfferCreation;