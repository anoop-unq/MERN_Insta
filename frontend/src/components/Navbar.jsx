import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { FaUser, FaSignOutAlt, FaEnvelope, FaChevronDown } from 'react-icons/fa';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { userdata, backendUrl, setIsLogged, setUserData } = useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/logout");
      if (data.success) {
        setIsLogged(false);
        setUserData(false);
        navigate("/");
        toast.success(`${userdata.name} logged out successfully`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/verify-otp");
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo - removed SmartLinked text from mobile */}
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="Logo"
            className={`h-8 transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}
          />
          {/* Text only visible on md screens and up */}
          <span className="hidden md:block ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            SmartLinked
          </span>
        </div>

        {/* User controls */}
        {userdata ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-white rounded-full pl-3 pr-1 py-1 shadow-sm border border-gray-200 hover:shadow-md transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                {userdata.name[0].toUpperCase()}
              </div>
              <FaChevronDown className={`text-gray-500 transition-transform ${showMenu ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none animate-fadeIn">
                <div className="py-1">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-900">Signed in as</p>
                    <p className="text-sm text-gray-500 truncate">{userdata.email}</p>
                  </div>
                  
                  {!userdata.isAccountVerified && (
                    <button
                      onClick={sendVerificationOtp}
                      className="flex w-full items-center px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-100"
                    >
                      <FaEnvelope className="mr-3 text-blue-500" />
                      Verify Email
                    </button>
                  )}
                  
                  <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-100"
                  >
                    <FaSignOutAlt className="mr-3 text-red-500" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
          
            <button
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};