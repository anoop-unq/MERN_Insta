import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import { 
  FaArrowLeft, FaEnvelope, FaInfoCircle, FaPhone, FaBirthdayCake, 
  FaVenusMars, FaMapMarkerAlt, FaGraduationCap, FaGlobe, FaLink,
  FaHome, FaCity, FaMapPin, FaFlag, FaChevronDown, FaChevronUp,
  FaUser, FaCalendarAlt, FaTransgender, FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';

const ViewSpecificUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userdata, posts, getUserById } = useContext(AppContext);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Find the user in existing data for basic info
  const viewedUser = userId === userdata?.user?._id 
    ? userdata.user 
    : posts.find(post => post.author?._id === userId)?.author;

  // Check if user has a custom photo (not the default asset)
  const hasCustomPhoto = viewedUser?.photo && viewedUser.photo !== assets.user_image;

  // Fetch detailed user information when details button is clicked
  useEffect(() => {
    if (showDetails && !userDetails && userId) {
      fetchUserDetails();
    }
  }, [showDetails, userId, userDetails]);

  const fetchUserDetails = async () => {
    setIsLoadingDetails(true);
    try {
      const details = await getUserById(userId);
      setUserDetails(details);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const toggleDetails = async () => {
    if (!showDetails) {
      setShowDetails(true);
      // Fetch details if not already loaded
      if (!userDetails) {
        await fetchUserDetails();
      }
    } else {
      setShowDetails(false);
    }
  };

  const handleMessageClick = () => {
    navigate(`/messages/${userId}`);
  };

  const handleImageClick = () => {
    if (hasCustomPhoto) {
      navigate(`/view-users/image/${userId}`);
    }
  };

  // Format date of birth for display
  const formatDateOfBirth = (dateString) => {
    if (!dateString) return 'Not provided';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Calculate age from date of birth
  const calculateAge = (dateString) => {
    if (!dateString) return null;
    
    try {
      const today = new Date();
      const birthDate = new Date(dateString);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age;
    } catch (error) {
      return null;
    }
  };

  if (!viewedUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <FaUser className="text-4xl text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">User Not Found</h2>
          <p className="text-gray-600 mb-6">The user you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate(`/user-profile/${userdata.user._id}`)}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg w-full"
          >
            Return to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/user-profile/${userdata.user._id}`)}
            className="flex items-center justify-center bg-white text-gray-700 rounded-xl p-3 w-12 h-12 hover:bg-gray-50 transition-all duration-300 shadow-sm border border-gray-200 hover:shadow-md hover:-translate-y-0.5"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="relative">
            {/* Profile header background */}
            <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            
            <div className="px-6 pb-6">
              {/* Profile image */}
              <div className="flex justify-center md:justify-start">
                <div 
                  className={`relative -mt-16 group ${hasCustomPhoto ? 'cursor-pointer' : 'cursor-default'}`}
                  onClick={handleImageClick}
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                    <img 
                      src={viewedUser?.photo || assets.user_image} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>
                  {hasCustomPhoto && (
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full transition-all duration-300 flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300 text-sm bg-black bg-opacity-50 px-2 py-1 rounded-full">
                        View Photo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* User info */}
              <div className="mt-4 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{viewedUser?.name}</h1>
                
                {viewedUser?.bio && (
                  <p className="text-gray-600 mb-6 max-w-md mx-auto md:mx-0">
                    {viewedUser.bio}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={toggleDetails}
                    disabled={isLoadingDetails}
                    className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoadingDetails ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </>
                    ) : (
                      <>
                        <FaInfoCircle className="mr-2" />
                        {showDetails ? 'Hide Details' : 'Show Details'}
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleMessageClick}
                    className="flex items-center justify-center px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <FaEnvelope className="mr-2 text-blue-500" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Section */}
        {showDetails && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 animate-fadeIn border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FaUser className="text-blue-600 text-sm" />
                </div>
                User Information
              </h3>
              <button 
                onClick={toggleDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FaTimesCircle className="text-xl" />
              </button>
            </div>
            
            {isLoadingDetails ? (
              <div className="flex justify-center items-center py-12">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                  <span className="text-gray-600">Loading user details...</span>
                </div>
              </div>
            ) : userDetails ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-100 transition-all duration-300">
                  <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-100">
                    <FaPhone className="text-blue-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Mobile</p>
                    <p className="font-medium text-gray-800">
                      {userDetails.mobile || 'Not provided'}
                    </p>
                  </div>
                </div>

                {/* Gender */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-pink-50 hover:border-pink-100 transition-all duration-300">
                  <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-100">
                    <FaVenusMars className="text-pink-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Gender</p>
                    <p className="font-medium text-gray-800">
                      {userDetails.gender || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-purple-50 hover:border-purple-100 transition-all duration-300">
                  <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-100">
                    <FaCalendarAlt className="text-purple-500 text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                    <p className="font-medium text-gray-800">
                      {formatDateOfBirth(userDetails.dateOfBirth)}
                      {userDetails.dateOfBirth && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({calculateAge(userDetails.dateOfBirth)} years old)
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-green-50 hover:border-green-100 transition-all duration-300">
                  <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-100">
                    {userDetails.isAccountActive ? (
                      <FaCheckCircle className="text-green-500 text-lg" />
                    ) : (
                      <FaTimesCircle className="text-red-500 text-lg" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Account Status</p>
                    <p className="font-medium text-gray-800">
                      {userDetails.isAccountActive ? 'Active' : 'Deactivated'}
                      {!userDetails.isAccountVerified && userDetails.isAccountActive && (
                        <span className="text-sm text-yellow-600 ml-2">(Pending Verification)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-cyan-50 hover:border-cyan-100 transition-all duration-300 md:col-span-2">
                  <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-100">
                    <FaEnvelope className="text-cyan-500 text-lg" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-800 truncate">
                      {userDetails.email.replace(/(.{2})(.*)(@.*)/, '$1*****$3')}
                    </p>
                  </div>
                </div>

                {/* Portfolio */}
                {userDetails.portfolioUrl && (
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-teal-50 hover:border-teal-100 transition-all duration-300 md:col-span-2">
                    <div className="bg-white p-3 rounded-xl shadow-sm mr-4 border border-gray-100">
                      <FaGlobe className="text-teal-500 text-lg" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm text-gray-500 mb-1">Portfolio</p>
                      <a 
                        href={userDetails.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-gray-800 hover:text-blue-600 transition-colors duration-300 flex items-center truncate"
                      >
                        <span className="truncate">{userDetails.portfolioUrl}</span>
                        <FaLink className="ml-2 text-sm flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-red-50 rounded-xl border border-red-100">
                <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimesCircle className="text-xl text-red-500" />
                </div>
                <p className="text-red-600 font-medium">Failed to load user details</p>
                <p className="text-gray-600 mt-1">Please try again later</p>
                <button
                  onClick={fetchUserDetails}
                  className="mt-4 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSpecificUser;