


import React from 'react';
import CandidateNavbar from './CandidateNavbar';
import logo from '../../../assets/nap.jpg'

function CandidateCareerPage() {
  return (
    <div>
      <CandidateNavbar />
      {/* Hero Section */}
      {/* <header className="bg-cover bg-center h-screen" style={{ backgroundImage: "url('https://pbs.twimg.com/media/GGW2IEzW0AAuFQh.jpg')" }}></header> */}
      <header className="bg-cover bg-center h-screen">
        <img src={logo} alt=""  className="w-full h-auto object-center"  />
      </header>

      {/* What We Do Section */}
      <section id="what-we-do" className="py-40 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">What We Do</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="relative group rounded-lg overflow-hidden shadow-md">
              <img
                src="https://hexaware.com/wp-content/uploads/2024/09/Hexaware-CD-Blog-Nn-Content-Strategy-CX-Cluster.jpg"
                alt="Customer Experience"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center text-center text-white">
                <div className="p-4">
                  <h3 className="text-2xl font-bold">Customer Experience</h3>
                  <p>Enhancing customer satisfaction and engagement.</p>
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="relative group rounded-lg overflow-hidden shadow-md">
              <img
                src="https://cdn.pixabay.com/photo/2021/10/11/17/54/technology-6701504_1280.jpg"
                alt="Technology Acceleration"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center text-center text-white">
                <div className="p-4">
                  <h3 className="text-2xl font-bold">Technology Acceleration</h3>
                  <p>Driving innovation through advanced technology.</p>
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="relative group rounded-lg overflow-hidden shadow-md">
              <img
                src="https://img.freepik.com/free-photo/saas-concept-collage_23-2149399285.jpg"
                alt="Cloud and Infrastructure"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center text-center text-white">
                <div className="p-4">
                  <h3 className="text-2xl font-bold">Cloud and Infrastructure</h3>
                  <p>Providing robust cloud solutions for businesses.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="hiring-process" className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <h2 className="text-3xl font-bold text-center pt-1 mb-8 text-[#27235C]">Our Hiring Process</h2>
    
    {/* Stepper */}
    <div className="flex justify-between items-center relative">
      {/* Connecting Line */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-300"></div>

      {/* Step 1: Application Submission */}
      <div className="flex flex-col items-center z-10 relative">
        {/* Circle for Step 1 */}
        <div className="w-12 h-12 rounded-full border-2 border-[#4CAF50] bg-[#4CAF50] text-white flex items-center justify-center mb-2">
          <span className="text-lg font-semibold">✔</span>
        </div>
        <p className="text-center font-medium text-[#4CAF50]">Application Submission</p>
      </div>

      {/* Step 2: Shortlisting */}
      <div className="flex flex-col items-center z-10 relative">
        {/* Circle for Step 2 */}
        <div className="w-12 h-12 rounded-full border-2 border-[#FF9800] bg-white text-[#FF9800] flex items-center justify-center mb-2">
          <span className="text-lg font-semibold">2</span>
        </div>
        <p className="text-center font-medium text-[#FF9800]">Shortlisting</p>
      </div>

      {/* Step 3: Business/Technical Interview */}
      <div className="flex flex-col items-center z-10 relative">
        {/* Circle for Step 3 */}
        <div className="w-12 h-12 rounded-full border-2 border-[#2196F3] bg-white text-[#2196F3] flex items-center justify-center mb-2">
          <span className="text-lg font-semibold">3</span>
        </div>
        <p className="text-center font-medium text-[#2196F3]">Business/Technical Interview</p>
      </div>

      {/* Step 4: HR Interview */}
      <div className="flex flex-col items-center z-10 relative">
        {/* Circle for Step 4 */}
        <div className="w-12 h-12 rounded-full border-2 border-[#FFC107] bg-white text-[#FFC107] flex items-center justify-center mb-2">
          <span className="text-lg font-semibold">4</span>
        </div>
        <p className="text-center font-medium text-[#FFC107]">HR Interview</p>
      </div>

      {/* Step 5: Decision and Offer */}
      <div className="flex flex-col items-center z-10 relative">
        {/* Circle for Step 5 */}
        <div className="w-12 h-12 rounded-full border-2 border-[#9C27B0] bg-white text-[#9C27B0] flex items-center justify-center mb-2">
          <span className="text-lg font-semibold">5</span>
        </div>
        <p className="text-center font-medium text-[#9C27B0]">Decision and Offer</p>
      </div>
    </div>

    {/* Hiring Process Card */}
    <div className="mt-16 bg-[#f9f9f9] p-8 rounded-lg shadow-lg max-w-6xl mx-auto">
      <h3 className="text-2xl font-semibold text-center mb-4 text-[#27235C]">Why Join Us?</h3>
      <p className="text-lg text-gray-600 mb-6">
        At Relevantz, we believe in building a collaborative and innovative work culture that empowers our team to grow and thrive. 
        Our hiring process ensures that we find the best talent that aligns with our core values. We want to invest in people who are 
        passionate about technology and eager to make an impact.
      </p>
      <p className="text-lg text-gray-600 mb-6">
        Take the first step towards a fulfilling career with us today. We can’t wait to see what you bring to the table.
      </p>

      {/* Button to Navigate to Another Page */}
      <div className="flex justify-center">
        <a href="/candidatejobapplypage" className="bg-[#FFDD57] text-[#27235C] py-3 px-6 rounded-lg shadow-md hover:bg-[#f3e656] transition duration-300 font-semibold">
          Apply Now
        </a>
      </div>
    </div>
  </div>
</section>



      {/* Careers Card Section */}
      <section className="py-20 bg-white-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8">Careers at Relevantz</h2>
          <div className="max-w-6xl mx-auto lg:flex lg:space-x-8">
            <div className="w-full lg:w-2/3 bg-gradient-to-r from-[#27235C] to-[#524F7D] text-white shadow-lg rounded-lg p-14">
              <div className="mb-6">
                <p className="text-lg">
                  We invite you to supercharge your potential. Find what inspires and drives you. Find your spark.
                </p>
              </div>
              <div className="flex justify-center">
                <a href="/candidatejobapplypage" className="bg-[#FFDD57] text-[#27235C] py-3 px-6 rounded hover:bg-[#f3e656] transition duration-300 font-semibold">
                  Visit Our Career Page
                </a>
              </div>
            </div>
            <div className="mt-6 lg:mt-0 lg:w-1/3 flex items-center">
              <img 
                src="https://img.freepik.com/free-photo/career-hiring-human-resources-job-occupation-concept_53876-13893.jpg" 
                alt="A professional interaction" 
                className="rounded-lg shadow-md h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section for Core Values */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 py-4 text-[#27235C]">Our Core Values - PORIE</h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
            {/* Core Value 1 */}
            <div className="flex flex-col items-center">
              <img src="https://qa.relevantz.com/wp-content/uploads/2024/11/P.png" alt="Predictability" className="mb-4" />
              <h3 className="text-xl font-bold text-purple-600">Predictability | Air</h3>
              <p className="text-center font-extrabold py-4">Transparent | Reliable </p>
              <p className="text-center font-serif">I say what I do, I do what I say.</p>
            </div>
            {/* Core Value 2 */}
            <div className="flex flex-col items-center">
              <img src="https://qa.relevantz.com/wp-content/uploads/2024/11/O.png" alt="Ownership" className="mb-4" />
              <h3 className="text-xl font-bold text-green-600">Ownership | Earth</h3>
              <p className="text-center font-extrabold py-4">Accountable | Invested  </p>
              <p className="text-center font-serif">I am conscious of the impact I create.</p>
            </div>
            {/* Core Value 3 */}
            <div className="flex flex-col items-center">
              <img src="https://qa.relevantz.com/wp-content/uploads/2024/11/R.png" alt="Receptiveness" className="mb-4" />
              <h3 className="text-xl font-bold text-blue-600">Receptiveness | Space</h3>
              <p className="text-center font-extrabold py-4">Open-minded | Empathetic   </p>

              <p className="text-center font-serif">I act with compassion and respect.</p>
            </div>
            {/* Core Value 4 */}
            <div className="flex flex-col items-center">
              <img src="https://qa.relevantz.com/wp-content/uploads/2024/11/I.png" alt="Integrity" className="mb-4" />
              <h3 className="text-xl font-bold text-red-600">Integrity | Fire</h3>
              <p className="text-center font-extrabold py-4">Ethical | Trustworthy   </p>

              <p className="text-center font-serif">I do things right because it is right.</p>
            </div>
            {/* Core Value 5 */}
            <div className="flex flex-col items-center">
              <img src="https://qa.relevantz.com/wp-content/uploads/2024/11/E.png" alt="Engineering Mindset" className="mb-4" />
              <h3 className="text-xl font-bold text-yellow-600">Engineering Mindset | Water</h3>
              <p className="text-center font-extrabold py-4">Curious | Creative    </p>

              <p className="text-center font-serif">I dream, build and deliver.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#27235C]">
        <div className="container mx-auto px-6 flex flex-col lg:flex-row">
          {/* Left Side - Contact Information */}
          <div className="w-full lg:w-2/3 mb-6 text-white lg:mb-0">
            <h2 className="text-3xl font-semibold mb-4">Contact Us</h2>
            <p className="text-lg mb-4">We’d love to hear from you!</p>
            <p className="mb-6">
              If you are an enterprise looking for a digital transformation partner, you can trust us to propel your innovation efforts forward and fill internal competency and capacity gaps. Whether it is a simple question or a valuable suggestion, we are here 24/7. You can give us a call or email us directly.
            </p>

            <h3 className="font-bold text-lg mb-2">Get in touch with us</h3>
            <ul className="list-none mb-4">
              <li>Email: <a href="mailto:sales@relevantz.com" className="text-white-600 hover:underline">sales@relevantz.com</a></li>
              <li>Atlanta, US : <span className="font-semibold">+1 470-210-3330</span></li>
              <li>Chennai, India : <span className="font-semibold">+91 44-4006-1234</span></li>
              <li>Ottawa, Canada : <span className="font-semibold">+1 613-670-5841</span></li>
            </ul>
          </div>

          {/* Right Side - Contact Form */}
          <div className="w-full lg:w-1/3 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <form>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="name">Name *</label>
                <input type="text" id="name" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2" htmlFor="email">Email *</label>
                <input type="email" id="email" className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500" required />
              </div>

              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input type="checkbox" className="form-checkbox h-5 w-5 text-purple-600" required />
                  <span className="ml-2 text-lg">I agree to Relevantz's Privacy Policy. Relevantz may use this information for sales and marketing purposes but will not sell your data to any third parties.</span>
                </label>
              </div>
              <button type="submit" className="w-full bg-[#27235C] hover:bg-[#524F7D] text-white font-semibold py-2 rounded-lg">Send Message</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="py-6 bg-[#27235C] text-white">
        <div className="container mx-auto px-6 text-center">
          <p>© {new Date().getFullYear()} Relevantz Technology Services Pvt.Ltd. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default CandidateCareerPage;
