import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserFriends, FaSearch, FaRocket, FaLinkedin, FaHandshake,FaChartLine } from "react-icons/fa";
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { userdata } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isNewUser, setIsNewUser] = useState(false);
  const [isReturningUser, setIsReturningUser] = useState(false);
  console.log(userdata,"55")
  useEffect(() => {
    // Check localStorage for signup flag
    const justSignedUp = localStorage.getItem('justSignedUp') === 'true';
    const justLoggedIn = localStorage.getItem('justLoggedIn') === 'true';
    
    if (justSignedUp) {
      setIsNewUser(true);
      localStorage.removeItem('justSignedUp'); // Clear the flag
    } else if (justLoggedIn) {
      setIsReturningUser(true);
      localStorage.removeItem('justLoggedIn'); // Clear the flag
    }
  }, [userdata]); // Run when userdata changes

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30 -z-10"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200/20 rounded-full filter blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-200/20 rounded-full filter blur-3xl -z-10"></div>

      <header className="relative py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 mt-3">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mt-10 md:mt-3">
          {/* Left Section */}
          <div className="space-y-8 md:space-y-10 order-2 lg:order-1">
            {/* Greeting */}
            <div className="flex items-center gap-3 animate-fadeIn">
              <div className="bg-blue-100 p-2 rounded-full">
                <FaHandshake className="text-blue-600 text-xl md:text-2xl" />
              </div>
              <h4 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                {isNewUser ? `Welcome to your professional community, ${userdata?.name?.split(' ')[0]}!` : 
                 isReturningUser ? `Great to see you again, ${userdata?.name?.split(' ')[0]}!` :
                 userdata ? `Welcome back, ${userdata?.name?.split(' ')[0]}!` : 
                 "Ready to connect?"}
              </h4>
            </div>

            {/* Main Heading - Hidden on small screens, shown on md and up */}
            <h1 className="hidden md:block text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Meaningful</span> Connections
            </h1>

            {/* Alternative heading for mobile */}
            <h1 className="md:hidden text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              {userdata ? "Your Professional Network" : "Connect & Grow"}
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
              {isNewUser ? "Your journey starts here! Begin building your network and unlock new opportunities." :
               isReturningUser ? "Continue growing your professional relationships and discovering new possibilities." :
               "Elevate your career through powerful networking. Discover opportunities and grow together."}
            </p>

            {/* Mobile Image */}
            <div className="lg:hidden mt-8 rounded-xl overflow-hidden shadow-2xl border border-gray-100/50">
              <img
                src={assets.networking_illustration || assets.header_img}
                alt="Professional networking"
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Features Grid */}
            {userdata && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  {
                    icon: <FaUserFriends className="text-blue-500 text-2xl" />,
                    title: "Grow Your Network",
                    desc: "Connect with professionals in your field",
                  },
                  {
                    icon: <FaLinkedin className="text-blue-400 text-2xl" />,
                    title: "Smart Profiles",
                    desc: "Showcase your skills and experience",
                  },
                  {
                    icon: <FaSearch className="text-purple-500 text-2xl" />,
                    title: "Targeted Search",
                    desc: "Find exactly who you need",
                  },
                  {
                    icon: <FaRocket className="text-indigo-500 text-2xl" />,
                    title: "Career Growth",
                    desc: "Discover new opportunities",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-50 p-2 rounded-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={() => navigate(userdata ? "/home" : "/signup")}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {
                 isReturningUser ? "Continue Exploring" :
                 userdata ? "Explore Connections" : "Get Started - Free"}
              </button>
              {!userdata && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50"
                >
                  Existing User? Login
                </button>
              )}
            </div>
          </div>

          {/* Desktop Image */}
          <div className="hidden lg:flex justify-center items-center order-1 lg:order-2 relative">
            <div className="relative">
              <img
                src={assets.networking_illustration || assets.header_img}
                alt="Professional networking"
                className="w-full max-w-md xl:max-w-lg rounded-xl shadow-2xl border border-gray-100/50 transform hover:scale-[1.01] transition duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-float">
                <div className="flex items-center gap-2">
                  <div className="bg-green-100 p-2 rounded-full">
                    <FaUserFriends className="text-green-600" />
                  </div>
                  <span className="font-medium">500+ New Connections Today</span>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-gray-100 animate-float-delay">
                <div className="flex items-center gap-2">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FaChartLine className="text-purple-600" />
                  </div>
                  <span className="font-medium">85% Career Growth</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;