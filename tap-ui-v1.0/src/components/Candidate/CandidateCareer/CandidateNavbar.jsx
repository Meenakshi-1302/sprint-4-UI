import React from 'react';
import { Link } from 'react-router-dom';

const CandidateNavbar = () => {
  return (
    <nav className="bg-white text-[#27235C] sticky top-0 z-50 shadow-lg py-6 w-full">
      <div className="container mx-auto flex justify-between items-center bg-gradient-to-b from-white to-transparent px-6">
        {/* Company Logo */}
        <div className="text-lg font-semibold">
        <Link to="/candidatecareerpage">

          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFmY-Xsb9oVErwaslePF_53V6IMFBzSeUoFA&s" 
            alt="Company Logo" 
            className="h-10 w-auto"
            
          />
          </Link>
        </div>
        <ul className="flex space-x-8 text-lg">

        <li>
        <a href="#about" className="hover:bg-[#27235c] hover:text-white transition duration-300">Services</a>
          </li>
          <li>
            <a href="#about" className="hover:bg-[#27235c] hover:text-white transition duration-300">Blog</a>
          </li>

          <li>
            <a href="#about" className="hover:bg-[#27235c] hover:text-white transition duration-300">About</a>
          </li>
          <li>
            <a href="#what-we-do" className="hover:bg-[#27235c] hover:text-white transition duration-300">What We Do</a>
          </li>
          <li>
            <a href="#contact" className="hover:bg-[#27235c] hover:text-white transition duration-300">Contact</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default CandidateNavbar;