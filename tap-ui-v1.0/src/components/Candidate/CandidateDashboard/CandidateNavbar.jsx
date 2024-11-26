import React from 'react';
import logo from "../../../assets/CandidateDashboard/RelevantzLogo.png";
import { Link, useNavigate } from 'react-router-dom';

function CandidateNavbar() {
  const navigate = useNavigate();

  // Correcting the function definition
  function logout() {
    sessionStorage.clear();
    navigate('/'); // Redirect to the home page or login page after logout
  }

  return (
    <div>
      <header className="bg-gray-100 py-2 w-full flex justify-center justify-between items-center shadow-md">
        <Link to="/candidatedashboard">
          <img
            src={logo}
            className="ml-14"
            alt="Relevantz Technology Services"
            width="170"
            height="44"
          />
        </Link>
        <nav>
          <ul className="flex mr-14 text-black/1000 font-sm space-x-8">
            <li>
              <Link to="/" onClick={logout} className="hover:text-[#27235C]">Logout</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}

export default CandidateNavbar;