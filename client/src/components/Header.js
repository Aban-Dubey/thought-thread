import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // If you are using react-router for navigation
import { FaPlus, FaUser, FaPowerOff } from 'react-icons/fa'; // Assuming you are using react-icons for icons

const Header = () => {
  const navigate = useNavigate();
  
  //Logout user component
  function handleLogout(){
    localStorage.removeItem('token');
    navigate('/');
}
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">Thought Thread</div>
      <div className="flex items-center space-x-4">
        <Link to="/bloghome" className="hover:text-gray-400">
          Home
        </Link>
        <Link to="/myblogs" className="hover:text-gray-400">
          My Blogs
        </Link>
        <Link to="/profile" className="hover:text-gray-400">
          <FaUser />
        </Link>
        <Link to="/addblog" className="hover:text-gray-400">
          <FaPlus />
        </Link>
        <Link onClick={handleLogout} className="hover:text-gray-400">
          <FaPowerOff />
        </Link>
      </div>
    </header>
  );
};

export default Header;
