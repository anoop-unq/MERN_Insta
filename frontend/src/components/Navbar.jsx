// import React, { useContext, useEffect, useState } from 'react';
// import { assets } from '../assets/assets';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { AppContext } from '../context/AppContext';
// import { FaUser, FaSignOutAlt, FaEnvelope, FaChevronDown } from 'react-icons/fa';

// export const Navbar = () => {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const navigate = useNavigate();
//   const [showMenu, setShowMenu] = useState(false);
//   const { userdata, backendUrl, setIsLogged, setUserData } = useContext(AppContext);

//   const logout = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.post(backendUrl + "/api/logout");
//       if (data.success) {
//         setIsLogged(false);
//         setUserData(false);
//         navigate("/");
//         toast.success(`${userdata.name} logged out successfully`);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Logout failed");
//     }
//   };

//   const sendVerificationOtp = async () => {
//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.post(backendUrl + "/api/verify-otp");
//       if (data.success) {
//         navigate("/email-verify");
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Verification failed");
//     }
//   };

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
//       isScrolled 
//         ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
//         : 'bg-transparent py-4'
//     }`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
//         {/* Logo - removed SmartLinked text from mobile */}
//         <div 
//           className="flex items-center cursor-pointer group"
//           onClick={() => navigate("/")}
//         >
//           <img
//             src={assets.logo}
//             alt="Logo"
//             className={`h-8 transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}
//           />
//           {/* Text only visible on md screens and up */}
//           <span className="hidden md:block ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//             Smart_Insta
//           </span>
//         </div>

//         {/* User controls */}
//         {userdata ? (
//           <div className="relative">
//             <button
//               onClick={() => setShowMenu(!showMenu)}
//               className="flex items-center gap-2 bg-white rounded-full pl-3 pr-1 py-1 shadow-sm border border-gray-200 hover:shadow-md transition-all"
//             >
//          {userdata.user.photo ? (
//   // If photo exists, show the image
//   <img
//     src={userdata.user.photo}
//     alt="Profile"
//     className="w-8 h-8 rounded-full object-cover"
//   />
// ) : (
//   // Else, show the initial fallback
//   <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
//     {userdata.name[0].toUpperCase()}
//   </div>
// )}
             
//               <FaChevronDown className={`text-gray-500 transition-transform ${showMenu ? 'transform rotate-180' : ''}`} />
//             </button>

//             {/* Dropdown menu */}
//             {showMenu && (
//               <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black/5 focus:outline-none animate-fadeIn">
//                 <div className="py-1">
//                   <div className="px-4 py-3 border-b">
//                     <p className="text-sm font-medium text-gray-900">Signed in as</p>
//                     <p className="text-sm text-gray-500 truncate">{userdata.email}</p>
//                   </div>
                  
//                   {!userdata.isAccountVerified && (
//                     <button
//                       onClick={sendVerificationOtp}
//                       className="flex w-full items-center px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-100"
//                     >
//                       <FaEnvelope className="mr-3 text-blue-500" />
//                       Verify Email
//                     </button>
//                   )}
                  
//                   <button
//                     onClick={logout}
//                     className="flex w-full items-center px-4 py-2.5 text-sm text-left text-gray-700 hover:bg-gray-100"
//                   >
//                     <FaSignOutAlt className="mr-3 text-red-500" />
//                     Sign out
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="flex gap-3">
          
//             <button
//               className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all"
//               onClick={() => navigate("/signup")}
//             >
//               Get Started
//             </button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';
import { FaUser, FaSignOutAlt, FaEnvelope, FaChevronDown, FaCheckCircle } from 'react-icons/fa';

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('.user-menu-container')) {
        setShowMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src={assets.logo}
            alt="Logo"
            className={`h-9 transition-all duration-300 ${isScrolled ? 'scale-95' : 'scale-100'}`}
          />
          <span className="hidden md:block ml-3 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart_Insta
          </span>
        </div>

        {/* User controls */}
        {userdata ? (
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-white/0 rounded-full pl-1 pr-2 py-1 transition-all hover:bg-white/10"
            >
              {/* User profile image/avatar */}
              <div className="relative">
                {userdata.user?.photo ? (
                  <img
                    src={userdata.user.photo}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-md hover:border-blue-400 transition-all duration-300"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                    {userdata.name[0].toUpperCase()}
                  </div>
                )}
                
                {userdata.isAccountVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                    <FaCheckCircle className="text-blue-500 text-xs" />
                  </div>
                )}
              </div>
              
              <FaChevronDown className={`text-gray-600 transition-transform duration-300 ${showMenu ? 'transform rotate-180' : ''}`} />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 mt-3 w-64 origin-top-right bg-white rounded-xl shadow-xl ring-1 ring-gray-200 focus:outline-none overflow-hidden animate-fadeIn">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                  <div className="flex items-center mb-3">
                    {userdata.user?.photo ? (
                      <img
                        src={userdata.user.photo}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xl">
                        {userdata.name[0].toUpperCase()}
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-semibold text-gray-900">{userdata.name}</p>
                      <p className="text-xs text-gray-500 truncate">{userdata.email}</p>
                    </div>
                  </div>
                  
                  {userdata.isAccountVerified ? (
                    <div className="flex items-center text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full w-fit">
                      <FaCheckCircle className="mr-1" />
                      Verified Account
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded-full w-fit">
                      <FaEnvelope className="mr-1" />
                      Unverified Account
                    </div>
                  )}
                </div>
                
                <div className="p-2">
                  {!userdata.isAccountVerified && (
                    <button
                      onClick={sendVerificationOtp}
                      className="flex w-full items-center px-4 py-3 text-sm text-left text-gray-700 hover:bg-blue-50 rounded-lg transition-colors mb-1"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-3">
                        <FaEnvelope className="text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Verify Email</p>
                        <p className="text-xs text-gray-500">Secure your account</p>
                      </div>
                    </button>
                  )}
                  
                  <button
                    onClick={logout}
                    className="flex w-full items-center px-4 py-3 text-sm text-left text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mr-3">
                      <FaSignOutAlt className="text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium">Sign out</p>
                      <p className="text-xs text-gray-500">See you soon!</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3">
            <button
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-full shadow-sm hover:shadow-md transition-all hover:from-blue-500 hover:to-purple-500"
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