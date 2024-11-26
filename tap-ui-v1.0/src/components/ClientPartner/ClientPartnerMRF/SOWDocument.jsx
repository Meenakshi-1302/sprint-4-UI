// import React, { useState } from 'react';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import logo from '../../../assets/relevantzwhite.PNG'; // Replace with the path to your logo



// const SOWDocument = ({ formData1, requirementDetails, subRequirementDetails }) => {

//     console.log("SOWDocument", formData1);
//     // Generate a unique SOW number on component mount
//     const generateSOWNumber = () => {
//         const currentYear = new Date().getFullYear();
//         const randomNum = Math.floor(100 + Math.random() * 900); // Generate a random number between 100 and 999
//         return `SOW_${randomNum}_${currentYear}`;
//     };

//     const clientPartnerName = sessionStorage.getItem('email');
//     const usernameWithDigits = clientPartnerName.split('@')[0];

//     // Remove all numbers from the username part
//     const username = usernameWithDigits.replace(/\d+/g, '');

//     // Optional: Trim to remove any extra spaces
//     const trimmedUsername = username.trim();


//     const [formData, setFormData] = useState({
//         sowNumber: generateSOWNumber(),
//         projectName: "TAP",
//         sowStartDate: new Date().toISOString().split("T")[0],
//         sowEndDate: "",
//         clientSOWOwner: requirementDetails.client.clientOrganization.organizationName,
//         relevantzAccountManager: trimmedUsername,
//         resource: "",
//         location: formData1.jobLocation,
//         numberOfResources: subRequirementDetails.resourceCount,
//         sowDuration: "",
//         role: subRequirementDetails.role,
//         costPerMonth: "",
//         totalMonthlyCost: "",
//         printedName: "RelevantZ",
//         director: "Domnic Savio",
//         title: "RelevantZ",
//         date: new Date().toLocaleDateString('en-GB'),
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prevData => ({ ...prevData, [name]: value }));
//     };

//     const addHeaderFooter = (doc, pageNumber, totalPages) => {
//         // Header
//         doc.addImage(logo, 'PNG', 3, 3, 25, 8); // Adjust logo width and height

//         // Footer
//         const footerTextPrefix = "Relevantz Technology Services India Private Limited";
//         const pageNumberText = `Page ${pageNumber} of ${totalPages}`; // Create the page number text

//         const totalWidth = doc.internal.pageSize.getWidth();
//         const confidentialX = 10; // Left-aligned
//         const footerTextWidth = doc.getTextWidth(footerTextPrefix);
//         const serviceProviderX = totalWidth / 2 - footerTextWidth / 2; // Centered
//         const pageNumberX = totalWidth - doc.getTextWidth(pageNumberText) - 10; // Right-aligned

//         // Set font size for the footer
//         doc.setFontSize(10);

//         // Print the footer text components
//         doc.text("Client Confidential", confidentialX, doc.internal.pageSize.getHeight() - 10);
//         doc.text(footerTextPrefix, serviceProviderX, doc.internal.pageSize.getHeight() - 10);
//         doc.text(pageNumberText, pageNumberX, doc.internal.pageSize.getHeight() - 10);
//     };

//     const generateSOWPDF = () => {
//         const doc = new jsPDF();

//         const firstPageFontSize = 14; // Decrease font size for Page 1

//         // Add content for the first page
//         const startY = 40; // Start Y position for first page content
//         const lineHeight = 10; // Space between lines

//         // Add content for Page 1
//         addHeaderFooter(doc, 1, 8); // Add header and footer for the first page
//         doc.setFontSize(firstPageFontSize);
//         const contentPage1 = [
//             "Relevantz Technology Services India Private Limited",
//             "",
//             "And",
//             "",
//             formData.clientSOWOwner,
//             "",
//             "Statement of Work (SOW)",
//             "",
//             formData.projectName,
//             "",
//             "SOW Version 1.1",
//             `Date: ${formData.date}`, // Dynamic date from form
//         ];
//         contentPage1.forEach((line, index) => {
//             const textWidth = doc.getTextWidth(line);
//             const x = (doc.internal.pageSize.getWidth() - textWidth) / 2; // Center the text
//             const y = startY + index * lineHeight; // Increment Y position for each line
//             doc.text(line, x, y);
//         });

//         // Add a new page for the Table of Contents
//         doc.addPage();
//         addHeaderFooter(doc, 2, 8); // Add header and footer

//         // Create a table for the Table of Contents
//         const tableData = [
//             ["1. SOW Specifications", "3"],
//             ["2. Introduction", "3"],
//             ["3. Project Description", "4"],
//             ["4. Scope of Work", "4"],
//             ["5. Assumptions and Dependencies", "5"],
//             ["5.1 Risks", "5"],
//             ["6. Costing", "5"],
//             ["7. Change Control Procedure", "5"],
//             ["8. General Information", "5"],
//             ["9. General Terms and Conditions", "5"],
//             ["9.1 Rights to the Software and Other Results of the Project", "5"],
//             ["9.2 Non solicitation", "6"],
//             ["9.3 Termination", "6"],
//             ["9.4 Severability", "6"],
//             ["10. Approval Signatures", "7"],
//         ];

//         doc.autoTable({
//             head: [['Table of Contents', 'Page Number']],
//             body: tableData.map(item => [item[0], item[1]]),
//             startY: 40,
//             theme: 'plain',
//             styles: { cellPadding: 5, fontSize: 10 },
//             margin: { left: 10, right: 10 },
//             columnStyles: {
//                 0: { cellWidth: 'auto' },
//                 1: { cellWidth: 30 },
//             },
//         });

//         // Add a new page for SOW Specifications and Introduction
//         doc.addPage();
//         addHeaderFooter(doc, 3, 8); // Add header and footer

//         // Add SOW Specifications Title
//         doc.setFont('helvetica', 'bold');
//         doc.text("1. SOW Specifications", 10, 20);

//         // Create a table for SOW Specifications with dynamic data
//         const sowSpecifications = [
//             ["SOW Number", formData.sowNumber],
//             ["Project Name", formData.projectName],
//             ["SOW Start Date", formData.sowStartDate],
//             ["SOW End Date", formData.sowEndDate],
//             ["Client Sample SOW Owner", formData.clientSOWOwner],
//             ["Relevantz Account Manager", formData.relevantzAccountManager],
//         ];

//         doc.autoTable({
//             head: [['Specification', 'Details']],
//             body: sowSpecifications,
//             startY: 30,
//             theme: 'grid',
//             styles: { cellPadding: 5, fontSize: 10, halign: 'left' },
//             margin: { left: 10, right: 10 },
//             columnStyles: {
//                 0: { cellWidth: 'auto' },
//                 1: { cellWidth: 100 },
//             },
//         });

//         // Add Introduction Title with static content
//         doc.setFont('helvetica', 'bold');
//         const introductionStartY = doc.lastAutoTable.finalY + 10; // Position below the table
//         doc.text("2. Introduction", 10, introductionStartY);

//         // const introductionPoints = [
//         //     "This Statement of Work is being executed by and between "+formData.clientSOWOwner+ " and Relevantz Technology Services India Private Limited; (“Relevantz” or “Service Provider”), the terms of which are incorporated herein by reference.",
//         //     "Service Provider agrees to provide the Services set forth in this SOW to Client on the terms and specifications provided herein.",
//         //     "This SOW is issued pursuant to the Master Service Agreement between Client and Service Provider dated "+formData.sowStartDate+" (the “Agreement”).",
//         //     "This is a fixed monthly cost for providing the extended engineering team.",
//         //     "This SOW is effective from "+formData.sowStartDate+" to "+formData.sowEndDate+". This period may be extended further by a mutually agreed upon written extension if deemed required by both Service Provider and Client.",
//         //     "This document will provide information on the scope, resource, cost, and other terms & conditions to be part of this engagement.",
//         // ];

//         const introductionPoints = [
//             "This Statement of Work is being executed by and between " + formData.clientSOWOwner + " and Relevantz Technology Services India Private Limited; (“Relevantz” or “Service Provider”), the terms of which are incorporated herein by reference.",
//             "Service Provider agrees to provide the Services set forth in this SOW to Client on the terms and specifications provided herein.",
//             "This SOW is issued pursuant to the Master Service Agreement between Client and Service Provider dated " + formData.sowStartDate + " (the “Agreement”).",
//             "This is a fixed monthly cost for providing the extended engineering team.",
//             "This SOW is effective from " + formData.sowStartDate + " to " + formData.sowEndDate + ". This period may be extended further by a mutually agreed upon written extension if deemed required by both Service Provider and Client.",
//             "This document will provide information on the scope, resource, cost, and other terms & conditions to be part of this engagement.",
//         ];

//         // Set position for the bullet points
//         let currentY = introductionStartY + 10; // Start under the title
//         const bulletFontSize = 10; // Smaller font size for bullet points

//         // Add Introduction content as bullet points
//         introductionPoints.forEach((point) => {
//             const splitText = doc.splitTextToSize(`- ${point}`, 180);
//             splitText.forEach((line) => {
//                 doc.setFont('helvetica', 'normal');
//                 doc.setFontSize(bulletFontSize);
//                 doc.text(line, 10, currentY);
//                 currentY += lineHeight;
//             });
//         });

//         // Combined Project Description, Scope of Work
//         doc.addPage();
//         addHeaderFooter(doc, 4, 8);

//         // Project Description
//         doc.setFont('helvetica', 'bold');
//         doc.text("3. Project Description", 10, 20);
//         doc.setFont('helvetica', 'normal');
//         doc.text("Service Provider would provide engineers as per the agreed terms to Client.", 10, 30);

//         // Scope of Work
//         doc.setFont('helvetica', 'bold');
//         doc.text("4. Scope of Work", 10, 50);
//         doc.setFont('helvetica', 'normal');
//         doc.text("As part of this engagement, Service Provider will provide a full-time engineer as mentioned in the table below:", 10, 60);

//         // Scope of Work Table with dynamic data
//         const scopeOfWorkTable = [
//             ["Resource", "Location", "No. of Resources", "SOW Duration"],
//             [formData.resource, formData.location, formData.numberOfResources, formData.sowDuration]
//         ];

//         // Generate the scope of work table
//         doc.autoTable({
//             head: [['Resource', 'Location', 'No. of Resources', 'SOW Duration']],
//             body: scopeOfWorkTable,
//             theme: 'grid',
//             startY: 80,
//             margin: { left: 10, right: 5 },
//             styles: { cellPadding: 5, fontSize: 10 },
//         });

//         // Additional text under Scope of Work table
//         doc.setFont('helvetica', 'normal');
//         const additionalTextY = doc.autoTable.previous.finalY + 10; // Position below the table
//         const additionalText = "Service Provider resource(s) will work under the leadership and direction of Client by adhering to Client practices.";
//         doc.text(additionalText, 10, additionalTextY);

//         // Add Assumptions and Dependencies Title with static content
//         doc.setFont('helvetica', 'bold');
//         const assumptionsTitleY = additionalTextY + 30;
//         doc.text("5. Assumptions and Dependencies", 10, assumptionsTitleY);
//         doc.setFont('helvetica', 'normal');

//         const assumptionsData = [
//             ["S. No", "Assumptions"],
//             ["1", "Access to development, testing and database environments of Client to allow Service Provider engineers to perform their assigned activities as required."],
//             ["2", "Access to Client’s deployment or staging environment as and when required."],
//             ["3", "Client will provide any laptops and infrastructure (software licenses or other specific hardware devices) for Service Provider resources to perform the project activities."],
//             ["4", "Technical directions/decisions are to be defined by Client. Any required variance to the approved directions/decisions will be reviewed and approved by Client."],
//             ["5", "Client will provide a SPOC for Service Provider, and would provide timely feedback on the engineers. Client will also provide the necessary SME for Service Provider engineers."],
//             ["6", "Client will provide necessary access and connectivity to Service Provider’s team from the start of the project."],
//             ["7", "Relevantz Account Management Team will have a separate monthly review meeting with the Client Team."],
//             ["8", "A minimum of 30 days’ notice period will be provided by Client if they wish to increase or decrease the size of the team."],
//             ["9", "Any addition of resources to the team will be made through a separate change order to this SOW."],
//             ["10", "A new SOW (versus a Change Order) will be created and signed if the proposed engagement involves specific deliverables and not just the addition of resources to the existing team covered by this SOW."],
//             ["11", "Client may request for replacing a resource if the performance of the resource is not up to satisfaction of Client. A suitable replacement shall be provided by Service Provider within 2-3 weeks of providing such notice."],
//             ["12", "The proposed resources should be evaluated in the first two weeks of the engagement, and it is understood that any resource swap request due to the quality of work or performance can be raised only within the first two weeks. This is to ensure to evaluate the resource capabilities and assign them to correct roles for the period of SOW duration."]
//         ];

//         doc.autoTable({
//             head: [['S. No', 'Assumptions']],
//             body: assumptionsData.slice(1), // Skip header
//             theme: 'grid',
//             startY: assumptionsTitleY + 10,
//             margin: { left: 10, right: 10 },
//             styles: { cellPadding: 5, fontSize: 10 },
//             columnStyles: {
//                 0: { cellWidth: 20 },
//                 1: { cellWidth: 150 },
//             },
//         });
//         addHeaderFooter(doc, 5, 8);
//         // 5.1 Risks Section
//         const risksTitleY = doc.autoTable.previous.finalY + 5; // Positioning Risks below Assumptions
//         doc.setFont('helvetica', 'bold');
//         doc.text("5.1 Risks", 10, risksTitleY);
//         doc.setFont('helvetica', 'normal');

//         const risksText = "• Non-availability of the required Client resources for validation of domain/business-related knowledge transfer will negatively impact the quality and productivity of Service Provider team.";
//         const splitRisksText = doc.splitTextToSize(risksText, 180);
//         let risksTextY = risksTitleY + 5;

//         // Add each line of the risks text to the PDF
//         splitRisksText.forEach((line) => {
//             doc.text(line, 10, risksTextY);
//             risksTextY += 10;
//         });

//         // 6. Costing Section with dynamic data
//         const costingTitleY = risksTextY + 5;
//         doc.setFont('helvetica', 'bold');
//         doc.text("6. Costing", 10, costingTitleY);

//         // Costing Table with dynamic data
//         doc.setFont('helvetica', 'normal');
//         doc.text("SOW Duration: " + formData.sowStartDate + " – " + formData.sowEndDate, 10, costingTitleY + 5);

//         const costingTableData = [
//             ["Role", "No. of Resources", "Cost Per Month / Per Resource (INR)", "Total Monthly Cost"],
//             [formData.role, formData.numberOfResources, formData.costPerMonth, formData.totalMonthlyCost],
//             ["", "", "Total Monthly Cost excluding prevailing taxes", formData.totalMonthlyCost]
//         ];

//         doc.autoTable({
//             head: costingTableData.slice(0, 1), // Header
//             body: costingTableData.slice(1), // Body
//             theme: 'grid',
//             startY: costingTitleY + 10, // Start below the Costing title
//             margin: { left: 10, right: 10 },
//             styles: { cellPadding: 5, fontSize: 10 },
//         });

//         // Add a new page for additional content
//         doc.addPage();
//         addHeaderFooter(doc, 6, 8); // Add header and footer

//         // Content for additional content page
//         const additionalContent = `
// Note:
//  • The fee mentioned in this section is a Full-Time Equivalent (FTE) or fixed monthly fee, i.e. no additional overtime will be charged.
//  • The payments are to be made as mentioned in MSA from the date of receipt invoice.
//  • Costs mentioned exclude any prevailing taxes. Each party shall cooperate with the other party in getting any tax refund by providing necessary documents/information within a reasonable time.
//  • The Service Provider resource can take 2 days of paid leave in a month and it will be billed to Client.
//  • This cost does not include the license cost required for any non-standard, third-party tools, components, etc.
//  • This cost does not include the hosting charges or other third-party hardware or infrastructure services other than the basic/standard development tools and environment required.
//  • These Rates are active for the period up to ${formData.sowEndDate} and any annual rate change will be discussed and reflected through a change order with mutual consent from Client.
//  • In case Client wants Service Provider resources to work at any other location other than Client office then the travel arrangements including travel cost, accommodation and food allowances would be taken care of by Client at actuals.
 
// 7. Change Control Procedure
//  Any changes to the scope, terms or pricing of this SOW will be made through a change order to be signed by both parties before becoming effective.
 
// 8. General Information
//  Relevantz resources will follow the holiday calendar and office timings of Client Sample.
 
// 9. General Terms and Conditions
//  The terms and conditions in this section shall be, upon mutual agreement, incorporated into a Master Services Agreement during or upon the continuation of the relationship beyond this initial SOW of the Agreement are incorporated by reference into this SOW.
 
// 9.1 Rights to the Software and Other Results of the Project
//  Unless otherwise agreed in writing by both the parties, the copyrights and all other intellectual property rights to the software, deliverables, work product, other documents and results produced as a result of the services under this SOW shall belong to Client.
//  The Parties agree that all and any new processes or technology innovations of Relevantz which are not part of the SOW work are and shall be the exclusive property of Relevantz, including without limitation, any Intellectual Property Rights associated therewith. Relevantz represents that it is not aware that any third-party software infringes upon or tends to infringe upon any other parties’ valid industrial or intellectual property rights or similar protection.
//  Client acknowledges that Relevantz shall not be required to provide to Client any third party licenses with the Services, Software or otherwise. Client is responsible for obtaining all third party licenses required and agrees to comply with all terms and conditions of such third party licenses.
//  Except as explicitly stated in the foregoing clauses of this Section, neither Party gives any right or license to the other in any Intellectual Property.
// `;

//         // Set font size and style for the content page
//         const leftMargin = 10; // Reduced left margin
//         const rightMargin = 10; // Reduced right margin
//         const margin = leftMargin + rightMargin; // Overall margin space
//         const pdfWidth = doc.internal.pageSize.getWidth() - margin; // Width considering margins
//         const additionalLineHeight = 6; // Adjusted line height for better fit

//         // Set font size and style
//         doc.setFontSize(10); // Reduced font size for better fit
//         doc.setFont("Helvetica", "normal");

//         // Split content into lines that fit the page width
//         const lines = doc.splitTextToSize(additionalContent, pdfWidth);

//         // Create a bold style for the specified headings
//         const headingsToBold = [
//             "Note:",
//             "7. Change Control Procedure",
//             "8. General Information",
//             "9. General Terms and Conditions",
//             "9.1 Rights to the Software and Other Results of the Project"
//         ];

//         // Calculate Y position and add line height
//         let startingY = 10; // Start at the top of the page
//         lines.forEach((line) => {
//             let isBold = false;
//             headingsToBold.forEach((heading) => {
//                 if (line.trim().startsWith(heading)) {
//                     isBold = true;
//                 }
//             });

//             if (isBold) {
//                 doc.setFont("Helvetica", "bold"); // Set font to bold for specified headings
//             } else {
//                 doc.setFont("Helvetica", "normal"); // Set font to normal
//             }

//             doc.text(line, leftMargin, startingY);
//             startingY += additionalLineHeight; // Increase line height for readability
//         });
//         doc.addPage();
//         addHeaderFooter(doc, 7, 8);
//         // Content for the 7th page
//         const additionalContentPage7 = `
//                 9.2 Non solicitation
//                 During the duration of this SOW and for a period of one year commencing upon termination of this SOW, both parties shall not solicit or cause any other related person or entity to solicit, directly or indirectly, for itself or any other party, the service of any person who is or was an employee of the other party anytime during the duration of this SOW; provided that a general advertisement or solicitation of employment by a party that is not directed at specific individuals who worked for the other party shall not be prohibited.
               
//                 9.3 Termination
//                     a) In addition to any other termination rights set forth herein, either party shall have the right to terminate this SOW with cause upon providing Thirty (30) days written notice to the other party. If Client wishes to terminate Relevantz services or downsize the services of a particular resource for any reasons, in this event, Client will pay amounts due and payable for all Services rendered through to the date of such termination. In the event of any material breach of this Agreement by either party, the non-breaching party may terminate this Agreement within 30 days by providing written notice to the other party, and if such breach event has not been rectified by the defaulting party within such 30 days.
//                     b) Effect of Termination. Immediately upon the effective date of a termination of this SOW for any reason, Client will (i) pay Service Provider all Fees for all Services performed by Service Provider up to the effective date of such termination; and (ii) return to Service Provider, or destroy, all Confidential Information of Service Provider, and all copies thereof. Immediately upon the effective date of termination of this SOW for any reason, Service Provider will deliver to Client, all Client property, and the Confidential Information of Client.
//                     c) Survival. Termination of this SOW will not affect the provisions that by their nature survive termination, including, without limitation, those provisions regarding Client or Service Provider’s treatment of Confidential Information, provisions relating to the payments of amounts accrued due, provisions disclaiming either party’s liability, or provisions relating to obligations to indemnify, which provisions will survive such termination.
               
//                 9.4 Severability
//                 If any provision of this SOW shall be declared invalid or unenforceable under applicable law, said provision shall be ineffective only to the extent of such declaration and such declaration shall not affect the remaining provisions of this SOW. In the event that a material and fundamental provision of this SOW is declared invalid or unenforceable under applicable law, the parties shall negotiate in good faith respecting an amendment hereto that would preserve, to the fullest extent possible, the respective rights and obligations imposed on each party under this SOW as originally executed.
//                 `;



//         // Set font size and style
//         doc.setFontSize(10); // Reduced font size for better fit
//         doc.setFont("Helvetica", "normal");

//         // Split content into lines that fit the page width
//         const linesPage7 = doc.splitTextToSize(additionalContentPage7, pdfWidth);

//         // Create a bold style for the specified headings
//         const headingsToBoldPage7 = [
//             "9.2 Non solicitation",
//             "9.3 Termination",
//             "9.4 Severability"
//         ];

//         // Calculate Y position and add line height
//         let startingYPage7 = 10; // Start at the top of the page
//         linesPage7.forEach((line) => {
//             let isBold = false;
//             headingsToBoldPage7.forEach((heading) => {
//                 if (line.trim().startsWith(heading)) {
//                     isBold = true;
//                 }
//             });

//             if (isBold) {
//                 doc.setFont("Helvetica", "bold"); // Set font to bold for specified headings
//             } else {
//                 doc.setFont("Helvetica", "normal"); // Set font to normal
//             }

//             doc.text(line, leftMargin, startingYPage7);
//             startingYPage7 += additionalLineHeight; // Increase line height for readability
//         });
//         // Next page for signatures
//         doc.addPage();
//         addHeaderFooter(doc, 8, 8); // Add header and footer for the signature page

//         // Prepare for the approval signatures table and acknowledgment text
//         const acknowledgmentText = "For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged by each of the parties, Client Sample and Relevantz agree to incorporate this SOW into the Agreement, effective as of the SOW Effective Date. N WITNESS WHEREOF, the parties have caused this instrument to be executed by their respective duly authorized representatives. Accepted and agreed to:";

//         // Title for the Approval Signatures page
//         doc.setFont('helvetica', 'bold');
//         doc.text("10. Approval Signatures", 10, 20);

//         // SOW Number
//         doc.setFont('helvetica', 'normal');
//         doc.text(formData.sowNumber, 10, 30); // Dynamic SOW number from form

//         // Acknowledgment text
//         const splitAcknowledgmentText = doc.splitTextToSize(acknowledgmentText, doc.internal.pageSize.width - 20);
//         const acknowledgmentStartY = 40; // Start below the title and SOW number
//         splitAcknowledgmentText.forEach((line, index) => {
//             doc.text(line, 10, acknowledgmentStartY + index * 10); // Position acknowledgment text
//         });

//         // Create the vertical table for approval signatures below the acknowledgment text
//         const approvalTable = [
//             [formData.clientSOWOwner, "Relevantz Technology Services India Private Limited"],
//             ["Signature", "Signature"],
//             ["*************", "************"],
//             ["Printed Name", formData.printedName],
//             ["Director", formData.director],
//             ["Title", formData.title],
//             ["Date", formData.date],
//         ];

//         // Position for the table
//         const tableStartY = acknowledgmentStartY + (splitAcknowledgmentText.length * 10) + 10; // Position below acknowledgment text

//         doc.autoTable({
//             head: [['', '']],
//             body: approvalTable,
//             startY: tableStartY,  // Position below the acknowledgment text
//             theme: 'grid',
//             styles: { cellPadding: 5, fontSize: 10, halign: 'left', cellWidth: 'auto' },
//             margin: { left: 10, right: 10 },
//             columnStyles: {
//                 0: { cellWidth: 50 }, // Adjust the width of the first column
//                 1: { cellWidth: 70 }, // Adjust the width of the second column
//             },
//         });

//         // Save the PDF
//         doc.save('Statement_of_Work.pdf');
//     };
//     const formGroupStyle = {
//         display: 'flex',
//         flexDirection: 'column',
//         marginBottom: '15px',
//     };

//     const labelStyle = {
//         marginBottom: '5px',
//         fontWeight: 'bold',
//     };

//     const inputStyle = {
//         padding: '10px',
//         border: '1px solid #ccc',
//         borderRadius: '4px',
//         fontSize: '16px',
//     };
//     return (
//         //     <div style={{ textAlign: "center", margin: "20px" }}>
//         //     <h1>Statement of Work Form</h1>
//         //     <form style={{ maxWidth: '800px', margin: '0 auto' }}>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>SOW Number:</label>
//         //             <input type="text" name="sowNumber" value={formData.sowNumber} readOnly style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Project Name:</label>
//         //             <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Start Date:</label>
//         //             <input type="date" name="sowStartDate" value={formData.sowStartDate} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>SOW End Date:</label>
//         //             <input type="date" name="sowEndDate" value={formData.sowEndDate} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Client Sample SOW Owner:</label>
//         //             <input type="text" name="clientSOWOwner" value={formData.clientSOWOwner} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Relevantz Account Manager:</label>
//         //             <input type="text" name="relevantzAccountManager" value={formData.relevantzAccountManager} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Resource:</label>
//         //             <input type="text" name="resource" value={formData.resource} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Location:</label>
//         //             <input type="text" name="location" value={formData.location} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>No. of Resources:</label>
//         //             <input type="number" name="numberOfResources" value={formData.numberOfResources} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>SOW Duration:</label>
//         //             <input type="text" name="sowDuration" value={formData.sowDuration} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Role:</label>
//         //             <input type="text" name="role" value={formData.role} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Cost Per Month / Per Resource (INR):</label>
//         //             <input type="text" name="costPerMonth" value={formData.costPerMonth} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Total Monthly Cost:</label>
//         //             <input type="text" name="totalMonthlyCost" value={formData.totalMonthlyCost} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Printed Name:</label>
//         //             <input type="text" name="printedName" value={formData.printedName} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Director:</label>
//         //             <input type="text" name="director" value={formData.director} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Title:</label>
//         //             <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} />
//         //         </div>
//         //         <div style={formGroupStyle}>
//         //             <label style={labelStyle}>Date:</label>
//         //             <input type="text" name="date" value={formData.date} readOnly style={inputStyle} />
//         //         </div>
//         //     </form>
//         //     <div style={{ marginTop: "20px" }}>
//         //         <button onClick={generateSOWPDF} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
//         //             Create PDF
//         //         </button>
//         //     </div>
//         // </div>
//         <div className="text-center m-5">
//             <h1 className="text-2xl font-bold text-[#2725c]">Statement of Work Form</h1>
//             <form className="max-w-lg mx-auto mt-5">
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">SOW Number:</label>
//                     <input type="text" name="sowNumber" value={formData.sowNumber} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Project Name:</label>
//                     <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Start Date:</label>
//                     <input type="date" name="sowStartDate" value={formData.sowStartDate} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>

//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">SOW End Date:</label>
//                     <input type="date" name="sowEndDate" value={formData.sowEndDate} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>

//                 <div className="mb-4">
//                     <div className="font-semibold">Client Sample SOW Owner:</div>
//                     <div className="p-2 border border-gray-300 rounded w-full bg-gray-100">{formData.clientSOWOwner}</div>
//                 </div>
//                 <div className="mb-4">
//                     <div className="font-semibold">Relevantz Account Manager:</div>
//                     <div className="p-2 border border-gray-300 rounded w-full bg-gray-100">{formData.relevantzAccountManager}</div>
//                 </div>
//                 <div className="mb-4">
//                     <div className="font-semibold">Location:</div>
//                     <div className="p-2 border border-gray-300 rounded w-full bg-gray-100">{formData.location}</div>
//                 </div>
//                 <div className="mb-4">
//                     <div className="font-semibold">No. of Resources:</div>
//                     <div className="p-2 border border-gray-300 rounded w-full bg-gray-100">{formData.numberOfResources}</div>
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">SOW Duration:</label>
//                     <input type="text" name="sowDuration" value={formData.sowDuration} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Role:</label>
//                     <input type="text" name="role" value={formData.role} onChange={handleChange} readOnly className="p-2 border border-gray-300 rounded w-full" />
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Cost Per Month / Per Resource (INR):</label>
//                     <input type="text" name="costPerMonth" value={formData.costPerMonth} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Total Monthly Cost:</label>
//                     <input type="text" name="totalMonthlyCost" value={formData.totalMonthlyCost} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Printed Name:</label>
//                     <input type="text" name="printedName" value={formData.printedName} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Director:</label>
//                     <input type="text" name="director" value={formData.director} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Title:</label>
//                     <input type="text" name="title" value={formData.title} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
//                 </div>
//                 <div className="mb-4">
//                     <label className="font-semibold block mb-1">Date:</label>
//                     <input type="text" name="date" value={formData.date} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100" />
//                 </div>
//             </form>
//             <div style={{ marginTop: "20px" }}>
//                 <button
//                     onClick={generateSOWPDF}
//                     style={{
//                         padding: "10px 20px",
//                         fontSize: "16px",
//                         cursor: "pointer",
//                         backgroundColor: "#27235c", // Set background color
//                         color: "white", // Set text color
//                         border: "none", // Remove default border
//                         borderRadius: "5px", // Optional: add border radius for rounded corners
//                     }}>
//                     Create PDF
//                 </button>
//             </div>
//         </div>
//     );
// };
// export default SOWDocument;

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../../../assets/relevantzwhite.PNG'; // Replace with the path to your logo



const SOWDocument = ({ formData1, requirementDetails, subRequirementDetails }) => {

    console.log("SOWDocument", formData1);
    // Generate a unique SOW number on component mount
    const generateSOWNumber = () => {
        const currentYear = new Date().getFullYear();
        const randomNum = Math.floor(100 + Math.random() * 900); // Generate a random number between 100 and 999
        return `SOW_${randomNum}_${currentYear}`;
    };

    const clientPartnerName = sessionStorage.getItem('email');
    const usernameWithDigits = clientPartnerName.split('@')[0];

    // Remove all numbers from the username part
    const username = usernameWithDigits.replace(/\d+/g, '');

    // Optional: Trim to remove any extra spaces
    const trimmedUsername = username.trim();


    const [formData, setFormData] = useState({
        sowNumber: generateSOWNumber(),
        projectName: "TAP",
        sowStartDate: new Date().toISOString().split("T")[0],
        sowEndDate: "",
        clientSOWOwner: requirementDetails.client.clientOrganization.organizationName,
        relevantzAccountManager: trimmedUsername,
        resource: "",
        location: formData1.jobLocation,
        numberOfResources: subRequirementDetails.resourceCount,
        sowDuration: "",
        role: subRequirementDetails.role,
        costPerMonth: "",
        totalMonthlyCost: "",
        printedName: "RelevantZ",
        director: "Domnic Savio",
        title: "RelevantZ",
        date: new Date().toLocaleDateString('en-GB'),
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!formData.projectName) {
            newErrors.projectName = "Project Name is required.";
            isValid = false;
        }

        if (!formData.sowEndDate) {
            newErrors.sowEndDate = "SOW End Date is required.";
        } else if (new Date(formData.sowEndDate) <= new Date(formData.sowStartDate)) {
            newErrors.sowEndDate = "SOW End Date must be after Start Date.";
            isValid = false;
        }

        if (!formData.sowDuration) {
            newErrors.sowDuration = "SOW Duration is required.";
            isValid = false;
        }

        if (!formData.costPerMonth || isNaN(formData.costPerMonth) || formData.costPerMonth <= 0) {
            newErrors.costPerMonth = "Cost Per Month must be a positive number.";
            isValid = false;
        }

        if (!formData.totalMonthlyCost || isNaN(formData.totalMonthlyCost) || formData.totalMonthlyCost <= 0) {
            newErrors.totalMonthlyCost = "Total Monthly Cost must be a positive number.";
            isValid = false;
        }

        if (!formData.printedName) {
            newErrors.printedName = "Printed Name is required.";
            isValid = false;
        }

        if (!formData.director) {
            newErrors.director = "Director is required.";
            isValid = false;
        }

        if (!formData.title) {
            newErrors.title = "Title is required.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' })); // Clear error on change
    };

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prevData => ({ ...prevData, [name]: value }));
    // };

    const addHeaderFooter = (doc, pageNumber, totalPages) => {
        // Header
        doc.addImage(logo, 'PNG', 3, 3, 25, 8); // Adjust logo width and height

        // Footer
        const footerTextPrefix = "Relevantz Technology Services India Private Limited";
        const pageNumberText = `Page ${pageNumber} of ${totalPages}`; // Create the page number text

        const totalWidth = doc.internal.pageSize.getWidth();
        const confidentialX = 10; // Left-aligned
        const footerTextWidth = doc.getTextWidth(footerTextPrefix);
        const serviceProviderX = totalWidth / 2 - footerTextWidth / 2; // Centered
        const pageNumberX = totalWidth - doc.getTextWidth(pageNumberText) - 10; // Right-aligned

        // Set font size for the footer
        doc.setFontSize(10);

        // Print the footer text components
        doc.text("Client Confidential", confidentialX, doc.internal.pageSize.getHeight() - 10);
        doc.text(footerTextPrefix, serviceProviderX, doc.internal.pageSize.getHeight() - 10);
        doc.text(pageNumberText, pageNumberX, doc.internal.pageSize.getHeight() - 10);
    };

    const generateSOWPDF = () => {
        const doc = new jsPDF();

        const firstPageFontSize = 14; // Decrease font size for Page 1

        // Add content for the first page
        const startY = 40; // Start Y position for first page content
        const lineHeight = 10; // Space between lines

        // Add content for Page 1
        addHeaderFooter(doc, 1, 8); // Add header and footer for the first page
        doc.setFontSize(firstPageFontSize);
        const contentPage1 = [
            "Relevantz Technology Services India Private Limited",
            "",
            "And",
            "",
            formData.clientSOWOwner,
            "",
            "Statement of Work (SOW)",
            "",
            formData.projectName,
            "",
            "SOW Version 1.1",
            `Date: ${formData.date}`, // Dynamic date from form
        ];
        contentPage1.forEach((line, index) => {
            const textWidth = doc.getTextWidth(line);
            const x = (doc.internal.pageSize.getWidth() - textWidth) / 2; // Center the text
            const y = startY + index * lineHeight; // Increment Y position for each line
            doc.text(line, x, y);
        });

        // Add a new page for the Table of Contents
        doc.addPage();
        addHeaderFooter(doc, 2, 8); // Add header and footer

        // Create a table for the Table of Contents
        const tableData = [
            ["1. SOW Specifications", "3"],
            ["2. Introduction", "3"],
            ["3. Project Description", "4"],
            ["4. Scope of Work", "4"],
            ["5. Assumptions and Dependencies", "5"],
            ["5.1 Risks", "5"],
            ["6. Costing", "5"],
            ["7. Change Control Procedure", "5"],
            ["8. General Information", "5"],
            ["9. General Terms and Conditions", "5"],
            ["9.1 Rights to the Software and Other Results of the Project", "5"],
            ["9.2 Non solicitation", "6"],
            ["9.3 Termination", "6"],
            ["9.4 Severability", "6"],
            ["10. Approval Signatures", "7"],
        ];

        doc.autoTable({
            head: [['Table of Contents', 'Page Number']],
            body: tableData.map(item => [item[0], item[1]]),
            startY: 40,
            theme: 'plain',
            styles: { cellPadding: 5, fontSize: 10 },
            margin: { left: 10, right: 10 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 30 },
            },
        });

        // Add a new page for SOW Specifications and Introduction
        doc.addPage();
        addHeaderFooter(doc, 3, 8); // Add header and footer

        // Add SOW Specifications Title
        doc.setFont('helvetica', 'bold');
        doc.text("1. SOW Specifications", 10, 20);

        // Create a table for SOW Specifications with dynamic data
        const sowSpecifications = [
            ["SOW Number", formData.sowNumber],
            ["Project Name", formData.projectName],
            ["SOW Start Date", formData.sowStartDate],
            ["SOW End Date", formData.sowEndDate],
            ["Client Sample SOW Owner", formData.clientSOWOwner],
            ["Relevantz Account Manager", formData.relevantzAccountManager],
        ];

        doc.autoTable({
            head: [['Specification', 'Details']],
            body: sowSpecifications,
            startY: 30,
            theme: 'grid',
            styles: { cellPadding: 5, fontSize: 10, halign: 'left' },
            margin: { left: 10, right: 10 },
            columnStyles: {
                0: { cellWidth: 'auto' },
                1: { cellWidth: 100 },
            },
        });

        // Add Introduction Title with static content
        doc.setFont('helvetica', 'bold');
        const introductionStartY = doc.lastAutoTable.finalY + 10; // Position below the table
        doc.text("2. Introduction", 10, introductionStartY);

        // const introductionPoints = [
        //     "This Statement of Work is being executed by and between "+formData.clientSOWOwner+ " and Relevantz Technology Services India Private Limited; (“Relevantz” or “Service Provider”), the terms of which are incorporated herein by reference.",
        //     "Service Provider agrees to provide the Services set forth in this SOW to Client on the terms and specifications provided herein.",
        //     "This SOW is issued pursuant to the Master Service Agreement between Client and Service Provider dated "+formData.sowStartDate+" (the “Agreement”).",
        //     "This is a fixed monthly cost for providing the extended engineering team.",
        //     "This SOW is effective from "+formData.sowStartDate+" to "+formData.sowEndDate+". This period may be extended further by a mutually agreed upon written extension if deemed required by both Service Provider and Client.",
        //     "This document will provide information on the scope, resource, cost, and other terms & conditions to be part of this engagement.",
        // ];

        const introductionPoints = [
            "This Statement of Work is being executed by and between " + formData.clientSOWOwner + " and Relevantz Technology Services India Private Limited; (“Relevantz” or “Service Provider”), the terms of which are incorporated herein by reference.",
            "Service Provider agrees to provide the Services set forth in this SOW to Client on the terms and specifications provided herein.",
            "This SOW is issued pursuant to the Master Service Agreement between Client and Service Provider dated " + formData.sowStartDate + " (the “Agreement”).",
            "This is a fixed monthly cost for providing the extended engineering team.",
            "This SOW is effective from " + formData.sowStartDate + " to " + formData.sowEndDate + ". This period may be extended further by a mutually agreed upon written extension if deemed required by both Service Provider and Client.",
            "This document will provide information on the scope, resource, cost, and other terms & conditions to be part of this engagement.",
        ];

        // Set position for the bullet points
        let currentY = introductionStartY + 10; // Start under the title
        const bulletFontSize = 10; // Smaller font size for bullet points

        // Add Introduction content as bullet points
        introductionPoints.forEach((point) => {
            const splitText = doc.splitTextToSize(`- ${point}`, 180);
            splitText.forEach((line) => {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(bulletFontSize);
                doc.text(line, 10, currentY);
                currentY += lineHeight;
            });
        });

        // Combined Project Description, Scope of Work
        doc.addPage();
        addHeaderFooter(doc, 4, 8);

        // Project Description
        doc.setFont('helvetica', 'bold');
        doc.text("3. Project Description", 10, 20);
        doc.setFont('helvetica', 'normal');
        doc.text("Service Provider would provide engineers as per the agreed terms to Client.", 10, 30);

        // Scope of Work
        doc.setFont('helvetica', 'bold');
        doc.text("4. Scope of Work", 10, 50);
        doc.setFont('helvetica', 'normal');
        doc.text("As part of this engagement, Service Provider will provide a full-time engineer as mentioned in the table below:", 10, 60);

        // Scope of Work Table with dynamic data
        const scopeOfWorkTable = [
            ["Resource", "Location", "No. of Resources", "SOW Duration"],
            [formData.resource, formData.location, formData.numberOfResources, formData.sowDuration]
        ];

        // Generate the scope of work table
        doc.autoTable({
            head: [['Resource', 'Location', 'No. of Resources', 'SOW Duration']],
            body: scopeOfWorkTable,
            theme: 'grid',
            startY: 80,
            margin: { left: 10, right: 5 },
            styles: { cellPadding: 5, fontSize: 10 },
        });

        // Additional text under Scope of Work table
        doc.setFont('helvetica', 'normal');
        const additionalTextY = doc.autoTable.previous.finalY + 10; // Position below the table
        const additionalText = "Service Provider resource(s) will work under the leadership and direction of Client by adhering to Client practices.";
        doc.text(additionalText, 10, additionalTextY);

        // Add Assumptions and Dependencies Title with static content
        doc.setFont('helvetica', 'bold');
        const assumptionsTitleY = additionalTextY + 30;
        doc.text("5. Assumptions and Dependencies", 10, assumptionsTitleY);
        doc.setFont('helvetica', 'normal');

        const assumptionsData = [
            ["S. No", "Assumptions"],
            ["1", "Access to development, testing and database environments of Client to allow Service Provider engineers to perform their assigned activities as required."],
            ["2", "Access to Client’s deployment or staging environment as and when required."],
            ["3", "Client will provide any laptops and infrastructure (software licenses or other specific hardware devices) for Service Provider resources to perform the project activities."],
            ["4", "Technical directions/decisions are to be defined by Client. Any required variance to the approved directions/decisions will be reviewed and approved by Client."],
            ["5", "Client will provide a SPOC for Service Provider, and would provide timely feedback on the engineers. Client will also provide the necessary SME for Service Provider engineers."],
            ["6", "Client will provide necessary access and connectivity to Service Provider’s team from the start of the project."],
            ["7", "Relevantz Account Management Team will have a separate monthly review meeting with the Client Team."],
            ["8", "A minimum of 30 days’ notice period will be provided by Client if they wish to increase or decrease the size of the team."],
            ["9", "Any addition of resources to the team will be made through a separate change order to this SOW."],
            ["10", "A new SOW (versus a Change Order) will be created and signed if the proposed engagement involves specific deliverables and not just the addition of resources to the existing team covered by this SOW."],
            ["11", "Client may request for replacing a resource if the performance of the resource is not up to satisfaction of Client. A suitable replacement shall be provided by Service Provider within 2-3 weeks of providing such notice."],
            ["12", "The proposed resources should be evaluated in the first two weeks of the engagement, and it is understood that any resource swap request due to the quality of work or performance can be raised only within the first two weeks. This is to ensure to evaluate the resource capabilities and assign them to correct roles for the period of SOW duration."]
        ];

        doc.autoTable({
            head: [['S. No', 'Assumptions']],
            body: assumptionsData.slice(1), // Skip header
            theme: 'grid',
            startY: assumptionsTitleY + 10,
            margin: { left: 10, right: 10 },
            styles: { cellPadding: 5, fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 150 },
            },
        });
        addHeaderFooter(doc, 5, 8);
        // 5.1 Risks Section
        const risksTitleY = doc.autoTable.previous.finalY + 5; // Positioning Risks below Assumptions
        doc.setFont('helvetica', 'bold');
        doc.text("5.1 Risks", 10, risksTitleY);
        doc.setFont('helvetica', 'normal');

        const risksText = "• Non-availability of the required Client resources for validation of domain/business-related knowledge transfer will negatively impact the quality and productivity of Service Provider team.";
        const splitRisksText = doc.splitTextToSize(risksText, 180);
        let risksTextY = risksTitleY + 5;

        // Add each line of the risks text to the PDF
        splitRisksText.forEach((line) => {
            doc.text(line, 10, risksTextY);
            risksTextY += 10;
        });

        // 6. Costing Section with dynamic data
        const costingTitleY = risksTextY + 5;
        doc.setFont('helvetica', 'bold');
        doc.text("6. Costing", 10, costingTitleY);

        // Costing Table with dynamic data
        doc.setFont('helvetica', 'normal');
        doc.text("SOW Duration: " + formData.sowStartDate + " – " + formData.sowEndDate, 10, costingTitleY + 5);

        const costingTableData = [
            ["Role", "No. of Resources", "Cost Per Month / Per Resource (INR)", "Total Monthly Cost"],
            [formData.role, formData.numberOfResources, formData.costPerMonth, formData.totalMonthlyCost],
            ["", "", "Total Monthly Cost excluding prevailing taxes", formData.totalMonthlyCost]
        ];

        doc.autoTable({
            head: costingTableData.slice(0, 1), // Header
            body: costingTableData.slice(1), // Body
            theme: 'grid',
            startY: costingTitleY + 10, // Start below the Costing title
            margin: { left: 10, right: 10 },
            styles: { cellPadding: 5, fontSize: 10 },
        });

        // Add a new page for additional content
        doc.addPage();
        addHeaderFooter(doc, 6, 8); // Add header and footer

        // Content for additional content page
        const additionalContent = `
Note:
 • The fee mentioned in this section is a Full-Time Equivalent (FTE) or fixed monthly fee, i.e. no additional overtime will be charged.
 • The payments are to be made as mentioned in MSA from the date of receipt invoice.
 • Costs mentioned exclude any prevailing taxes. Each party shall cooperate with the other party in getting any tax refund by providing necessary documents/information within a reasonable time.
 • The Service Provider resource can take 2 days of paid leave in a month and it will be billed to Client.
 • This cost does not include the license cost required for any non-standard, third-party tools, components, etc.
 • This cost does not include the hosting charges or other third-party hardware or infrastructure services other than the basic/standard development tools and environment required.
 • These Rates are active for the period up to ${formData.sowEndDate} and any annual rate change will be discussed and reflected through a change order with mutual consent from Client.
 • In case Client wants Service Provider resources to work at any other location other than Client office then the travel arrangements including travel cost, accommodation and food allowances would be taken care of by Client at actuals.
 
7. Change Control Procedure
 Any changes to the scope, terms or pricing of this SOW will be made through a change order to be signed by both parties before becoming effective.
 
8. General Information
 Relevantz resources will follow the holiday calendar and office timings of Client Sample.
 
9. General Terms and Conditions
 The terms and conditions in this section shall be, upon mutual agreement, incorporated into a Master Services Agreement during or upon the continuation of the relationship beyond this initial SOW of the Agreement are incorporated by reference into this SOW.
 
9.1 Rights to the Software and Other Results of the Project
 Unless otherwise agreed in writing by both the parties, the copyrights and all other intellectual property rights to the software, deliverables, work product, other documents and results produced as a result of the services under this SOW shall belong to Client.
 The Parties agree that all and any new processes or technology innovations of Relevantz which are not part of the SOW work are and shall be the exclusive property of Relevantz, including without limitation, any Intellectual Property Rights associated therewith. Relevantz represents that it is not aware that any third-party software infringes upon or tends to infringe upon any other parties’ valid industrial or intellectual property rights or similar protection.
 Client acknowledges that Relevantz shall not be required to provide to Client any third party licenses with the Services, Software or otherwise. Client is responsible for obtaining all third party licenses required and agrees to comply with all terms and conditions of such third party licenses.
 Except as explicitly stated in the foregoing clauses of this Section, neither Party gives any right or license to the other in any Intellectual Property.
`;

        // Set font size and style for the content page
        const leftMargin = 10; // Reduced left margin
        const rightMargin = 10; // Reduced right margin
        const margin = leftMargin + rightMargin; // Overall margin space
        const pdfWidth = doc.internal.pageSize.getWidth() - margin; // Width considering margins
        const additionalLineHeight = 6; // Adjusted line height for better fit

        // Set font size and style
        doc.setFontSize(10); // Reduced font size for better fit
        doc.setFont("Helvetica", "normal");

        // Split content into lines that fit the page width
        const lines = doc.splitTextToSize(additionalContent, pdfWidth);

        // Create a bold style for the specified headings
        const headingsToBold = [
            "Note:",
            "7. Change Control Procedure",
            "8. General Information",
            "9. General Terms and Conditions",
            "9.1 Rights to the Software and Other Results of the Project"
        ];

        // Calculate Y position and add line height
        let startingY = 10; // Start at the top of the page
        lines.forEach((line) => {
            let isBold = false;
            headingsToBold.forEach((heading) => {
                if (line.trim().startsWith(heading)) {
                    isBold = true;
                }
            });

            if (isBold) {
                doc.setFont("Helvetica", "bold"); // Set font to bold for specified headings
            } else {
                doc.setFont("Helvetica", "normal"); // Set font to normal
            }

            doc.text(line, leftMargin, startingY);
            startingY += additionalLineHeight; // Increase line height for readability
        });
        doc.addPage();
        addHeaderFooter(doc, 7, 8);
        // Content for the 7th page
        const additionalContentPage7 = `
                9.2 Non solicitation
                During the duration of this SOW and for a period of one year commencing upon termination of this SOW, both parties shall not solicit or cause any other related person or entity to solicit, directly or indirectly, for itself or any other party, the service of any person who is or was an employee of the other party anytime during the duration of this SOW; provided that a general advertisement or solicitation of employment by a party that is not directed at specific individuals who worked for the other party shall not be prohibited.
               
                9.3 Termination
                    a) In addition to any other termination rights set forth herein, either party shall have the right to terminate this SOW with cause upon providing Thirty (30) days written notice to the other party. If Client wishes to terminate Relevantz services or downsize the services of a particular resource for any reasons, in this event, Client will pay amounts due and payable for all Services rendered through to the date of such termination. In the event of any material breach of this Agreement by either party, the non-breaching party may terminate this Agreement within 30 days by providing written notice to the other party, and if such breach event has not been rectified by the defaulting party within such 30 days.
                    b) Effect of Termination. Immediately upon the effective date of a termination of this SOW for any reason, Client will (i) pay Service Provider all Fees for all Services performed by Service Provider up to the effective date of such termination; and (ii) return to Service Provider, or destroy, all Confidential Information of Service Provider, and all copies thereof. Immediately upon the effective date of termination of this SOW for any reason, Service Provider will deliver to Client, all Client property, and the Confidential Information of Client.
                    c) Survival. Termination of this SOW will not affect the provisions that by their nature survive termination, including, without limitation, those provisions regarding Client or Service Provider’s treatment of Confidential Information, provisions relating to the payments of amounts accrued due, provisions disclaiming either party’s liability, or provisions relating to obligations to indemnify, which provisions will survive such termination.
               
                9.4 Severability
                If any provision of this SOW shall be declared invalid or unenforceable under applicable law, said provision shall be ineffective only to the extent of such declaration and such declaration shall not affect the remaining provisions of this SOW. In the event that a material and fundamental provision of this SOW is declared invalid or unenforceable under applicable law, the parties shall negotiate in good faith respecting an amendment hereto that would preserve, to the fullest extent possible, the respective rights and obligations imposed on each party under this SOW as originally executed.
                `;



        // Set font size and style
        doc.setFontSize(10); // Reduced font size for better fit
        doc.setFont("Helvetica", "normal");

        // Split content into lines that fit the page width
        const linesPage7 = doc.splitTextToSize(additionalContentPage7, pdfWidth);

        // Create a bold style for the specified headings
        const headingsToBoldPage7 = [
            "9.2 Non solicitation",
            "9.3 Termination",
            "9.4 Severability"
        ];

        // Calculate Y position and add line height
        let startingYPage7 = 10; // Start at the top of the page
        linesPage7.forEach((line) => {
            let isBold = false;
            headingsToBoldPage7.forEach((heading) => {
                if (line.trim().startsWith(heading)) {
                    isBold = true;
                }
            });

            if (isBold) {
                doc.setFont("Helvetica", "bold"); // Set font to bold for specified headings
            } else {
                doc.setFont("Helvetica", "normal"); // Set font to normal
            }

            doc.text(line, leftMargin, startingYPage7);
            startingYPage7 += additionalLineHeight; // Increase line height for readability
        });
        // Next page for signatures
        doc.addPage();
        addHeaderFooter(doc, 8, 8); // Add header and footer for the signature page

        // Prepare for the approval signatures table and acknowledgment text
        const acknowledgmentText = "For good and valuable consideration, the receipt and sufficiency of which is hereby acknowledged by each of the parties, Client Sample and Relevantz agree to incorporate this SOW into the Agreement, effective as of the SOW Effective Date. N WITNESS WHEREOF, the parties have caused this instrument to be executed by their respective duly authorized representatives. Accepted and agreed to:";

        // Title for the Approval Signatures page
        doc.setFont('helvetica', 'bold');
        doc.text("10. Approval Signatures", 10, 20);

        // SOW Number
        doc.setFont('helvetica', 'normal');
        doc.text(formData.sowNumber, 10, 30); // Dynamic SOW number from form

        // Acknowledgment text
        const splitAcknowledgmentText = doc.splitTextToSize(acknowledgmentText, doc.internal.pageSize.width - 20);
        const acknowledgmentStartY = 40; // Start below the title and SOW number
        splitAcknowledgmentText.forEach((line, index) => {
            doc.text(line, 10, acknowledgmentStartY + index * 10); // Position acknowledgment text
        });

        // Create the vertical table for approval signatures below the acknowledgment text
        const approvalTable = [
            [formData.clientSOWOwner, "Relevantz Technology Services India Private Limited"],
            ["Signature", "Signature"],
            ["*************", "************"],
            ["Printed Name", formData.printedName],
            ["Director", formData.director],
            ["Title", formData.title],
            ["Date", formData.date],
        ];

        // Position for the table
        const tableStartY = acknowledgmentStartY + (splitAcknowledgmentText.length * 10) + 10; // Position below acknowledgment text

        doc.autoTable({
            head: [['', '']],
            body: approvalTable,
            startY: tableStartY,  // Position below the acknowledgment text
            theme: 'grid',
            styles: { cellPadding: 5, fontSize: 10, halign: 'left', cellWidth: 'auto' },
            margin: { left: 10, right: 10 },
            columnStyles: {
                0: { cellWidth: 50 }, // Adjust the width of the first column
                1: { cellWidth: 70 }, // Adjust the width of the second column
            },
        });

        // Save the PDF
        doc.save('Statement_of_Work.pdf');
    };
    const formGroupStyle = {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '15px',
    };

    const labelStyle = {
        marginBottom: '5px',
        fontWeight: 'bold',
    };

    const inputStyle = {
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
    };
    return (
        <div className="text-center m-5">
            <h1 className="text-2xl font-bold text-[#2725c]">Statement of Work Form</h1>
            <form className="max-w-lg mx-auto mt-5">
                <div className="mb-4">
                    <label className="font-semibold block mb-1">SOW Number:</label>
                    <input type="text" name="sowNumber" value={formData.sowNumber} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100" />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">Project Name:</label>
                    <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">Start Date:</label>
                    <input type="date" name="sowStartDate" value={formData.sowStartDate} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>

                <div className="mb-4">
                    <label className="font-semibold block mb-1">SOW End Date:</label>
                    <input type="date" name="sowEndDate" value={formData.sowEndDate} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>

                <div className="mb-4">
                    <div className="font-semibold block mb-1">Client Sample SOW Owner:</div>
                    <input type="text" name="Sow Owner Name" value={formData.clientSOWOwner} onChange={handleChange} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100"/>

                </div>
                <div className="mb-4">
                    <div className="font-semibold block">Relevantz Account Manager:</div>
                    <input type="text" name="Sow Owner Name" value={formData.relevantzAccountManager} onChange={handleChange} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100"/>
                </div>
                <div className="mb-4">
                    <div className="font-semibold">Location:</div>
                    <input type="text" name="Sow Owner Name" value={formData.location} onChange={handleChange} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100"/>
                </div>
                <div className="mb-4">
                    <div className="font-semibold">No. of Resources:</div>
                    <input type="text" name="Sow Owner Name" value={formData.numberOfResources} onChange={handleChange} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100"/>

                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">SOW Duration:</label>
                    <input type="text" name="sowDuration" value={formData.sowDuration} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">Role:</label>
                    <input type="text" name="role" value={formData.role} onChange={handleChange} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100"/>
                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">Cost Per Month / Per Resource (INR):</label>
                    <input type="text" name="costPerMonth" value={formData.costPerMonth} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">Total Monthly Cost:</label>
                    <input type="text" name="totalMonthlyCost" value={formData.totalMonthlyCost} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">Printed Name:</label>
                    <input type="text" name="printedName" value={formData.printedName} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">Director:</label>
                    <input type="text" name="director" value={formData.director} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="p-2 border border-gray-300 rounded w-full" />
                </div>
                <div className="mb-4">
                    <label className="font-semibold block mb-1">Date:</label>
                    <input type="text" name="date" value={formData.date} readOnly className="p-2 border border-gray-300 rounded w-full bg-gray-100" />
                </div>
            </form>
            <div style={{ marginTop: "20px" }}>
                <button
                    onClick={generateSOWPDF}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        cursor: "pointer",
                        backgroundColor: "#27235c", // Set background color
                        color: "white", // Set text color
                        border: "none", // Remove default border
                        borderRadius: "5px", // Optional: add border radius for rounded corners
                    }}>
                    Create PDF
                </button>
            </div>
        </div>
    );
};
export default SOWDocument;