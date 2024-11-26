import React from 'react'
import Navbar from './CommonNavbar';
import { Link } from 'react-router-dom';
import Layout from '../../views/Recruiter/Layout';

function Maindashoard() {

    return (
      
    <div className="min-h-screen flex flex-col bg-gray-100 mt-16 ml-16">
      <Navbar/>
      <div className="w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('carosel.jpg')" }}>
      </div>
 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-6">
      <Link to="/lay" className="bg-white shadow-md rounded-lg p-4" style={{ textDecoration: 'none', color: 'inherit' }}>
            MRF
        </Link>
        <div className="bg-white shadow-md rounded-lg p-4">Job Posts</div>
        <div className="bg-white shadow-md rounded-lg p-4">Resume Bank</div>
        <div className="bg-white shadow-md rounded-lg p-4">Assessment</div>
        <div className="bg-white shadow-md rounded-lg p-4">Offer</div>
      </div>
 
      <footer className="w-full bg-gray-200 text-black py-4 text-center">
        Relevantz technology services.
      </footer>
    </div>
  );
}

export default Maindashoard

