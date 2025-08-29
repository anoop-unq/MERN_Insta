import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { 
  FaArrowLeft, FaEdit, FaTrash, FaCalendarAlt, FaEnvelope, 
  FaPhone, FaVenusMars, FaCheckCircle, FaTimesCircle 
} from "react-icons/fa";
import { 
  FiMessageSquare, FiHeart, FiUser, FiMapPin, FiFileText, 
  FiPlus, FiCalendar, FiEdit2, FiTrash2, FiMail, FiPhone, 
  FiMap, FiNavigation, FiGlobe, FiHash, FiActivity, 
  FiCheckCircle, FiLink, FiExternalLink, FiEdit, FiAtSign,
  FiBook, FiBookOpen, FiAward, FiTarget, FiClock, FiFileText as FiFileTextIcon
} from "react-icons/fi";
import { motion } from "framer-motion";
import LikesModal from "./LikesModal";
import CommentsModal from "./CommentsModal";
import ConfirmationModal from "./ConfirmModal";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    posts = [],
    userdata,
    deletePost,
    getUserById
  } = useContext(AppContext);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");

  const [showLikesModal, setShowLikesModal] = useState(false);
const [showCommentsModal, setShowCommentsModal] = useState(false);
const [selectedPostId, setSelectedPostId] = useState(null);
const [selectedUserId, setSelectedUserId] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if it's the current user
        if (userdata?.user?._id === id) {
          setProfileUser(userdata.user);
          const userPostsData = posts.filter(post => post?.author?._id === id);
          setUserPosts(userPostsData);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch user by ID
        const userData = await getUserById(id);
        if (userData) {
          setProfileUser(userData);
          const userPostsData = posts.filter(post => post?.author?._id === id);
          setUserPosts(userPostsData);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, getUserById, posts, userdata]);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
      // Update posts list after deletion
      setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
    }
  };

const handleShowLikes = (postId, userId,id) => {
  setSelectedPostId(postId);
  setSelectedUserId(userId); // You need to create this state
  setShowLikesModal(true);
};

const handleShowComments = (postId) => {
  setSelectedPostId(postId);
  setShowCommentsModal(true);
};


  const handleDeleteClick = (postId) => {
    setPostToDelete(postId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePost(postToDelete);
      setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postToDelete));
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full"
        >
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto w-20 h-20 flex items-center justify-center bg-red-100 rounded-full mb-4"
            >
              <FiUser className="text-3xl text-red-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">User not found</h2>
            <p className="text-gray-600 mb-6">
              {error || "The user you're looking for doesn't exist."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/home")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 shadow-md"
            >
              Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const isCurrentUser = userdata?.user?._id === profileUser._id;
  const memberSince = profileUser.createdAt ? new Date(profileUser.createdAt).getFullYear() : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 pb-12">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b shadow-sm py-4 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm border border-gray-200 flex-shrink-0"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </motion.button>
          <h1 className="text-xl md:text-2xl font-bold ml-4 truncate max-w-[calc(100%-5rem)] text-gray-800">
            {profileUser.name}'s Profile
          </h1>
        </div>
      </motion.header>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Profile Header with Cover Photo */}
          <div className="h-40 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 md:h-48 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          
          <div className="px-6 pb-6 relative">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start gap-6 -mt-20 sm:-mt-16">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex-shrink-0"
              >
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
                  <img
                    src={profileUser.photo || assets.user_image || "/default-avatar.png"}
                    alt={profileUser.name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => window.open(profileUser.photo || assets.user_image, '_blank')}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow-md">
                  {profileUser.isAccountVerified ? (
                    <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center" title="Verified Account">
                      <FaCheckCircle className="text-white text-sm" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 bg-gray-400 rounded-full flex items-center justify-center" title="Unverified Account">
                      <FaTimesCircle className="text-white text-sm" />
                    </div>
                  )}
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0 mt-4 sm:mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 truncate flex items-center">
                      {profileUser.name}
                      {profileUser.isAccountActive ? (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                      ) : (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Inactive</span>
                      )}
                    </h1>
                    
                    {memberSince && (
                      <p className="text-gray-500 mt-1 flex items-center md:mt-7 sm:mt-8">
                        <FiMapPin className="mr-1" />
                        Member since {memberSince}
                      </p>
                    )}
                  </div>
                  
                  {isCurrentUser && (
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(59, 130, 246, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/edit-profile/${id}`)}
                      className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-5 rounded-full transition-all duration-300 flex items-center shadow-md"
                    >
                      <FaEdit className="mr-2" />
                      Edit Profile
                    </motion.button>
                  )}
                </div>
                
                {/* Bio */}
                {profileUser.bio && profileUser.bio !== "gshgd" && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h3 className="text-sm font-semibold text-blue-800 mb-1">Bio</h3>
                    <p className="text-gray-700 whitespace-pre-line break-words">
                      {profileUser.bio}
                    </p>
                  </div>
                )}
                
                {/* User Details */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {profileUser.dateOfBirth && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaCalendarAlt className="mr-2 text-blue-500" />
                        <span className="text-sm font-medium">Age</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{calculateAge(profileUser.dateOfBirth)} years</p>
                    </div>
                  )}
                  
                  {profileUser.gender && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaVenusMars className="mr-2 text-pink-500" />
                        <span className="text-sm font-medium">Gender</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{profileUser.gender}</p>
                    </div>
                  )}
                  
                  {profileUser.email && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaEnvelope className="mr-2 text-green-500" />
                        <span className="text-sm font-medium">Email</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800 truncate">{profileUser.email}</p>
                    </div>
                  )}
                  
                  {profileUser.mobile && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="flex items-center text-gray-600 mb-1">
                        <FaPhone className="mr-2 text-purple-500" />
                        <span className="text-sm font-medium">Phone</span>
                      </div>
                      <p className="text-lg font-semibold text-gray-800">{profileUser.mobile}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col md:flex-row justify-around items-center py-8 px-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 mt-8">
              {/* Posts Counter */}
              <div className="text-center px-6 py-4 mb-6 md:mb-0 transform transition-all duration-300 hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-3">
                  <FiFileTextIcon className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-800">{userPosts.length}</p>
                <p className="text-gray-600 mt-1">Posts Created</p>
              </div>

              {/* Verification Status */}
              <div className="text-center px-6 py-4">
                {profileUser.isAccountVerified ? (
                  <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-4 shadow-md">
                      <FiCheckCircle className="h-8 w-8 text-emerald-600" />
                    </div>
                    <p className="text-xl font-semibold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full">Verified Account</p>
                    <p className="text-sm text-emerald-500 mt-2 flex items-center">
                      Secured since {new Date().toLocaleDateString('default', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center transform transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-4 shadow-md">
                      <FiActivity className="h-8 w-8 text-amber-600" />
                    </div>
                    <p className="text-lg font-medium text-amber-700 mb-2">Account Not Verified</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center font-semibold"
                    >
                      Verify Now
                    </button>
                    <p className="text-xs text-gray-500 mt-3">Secure your account in just a few steps</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs and Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-4 px-6 text-center font-medium text-sm flex-1 flex items-center justify-center ${activeTab === "posts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                Posts
                {userPosts.length > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {userPosts.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`py-4 px-6 text-center font-medium text-sm flex-1 flex items-center justify-center ${activeTab === "about" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                About
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
      {activeTab === "posts" && (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <FiFileText className="text-blue-600" />
      Posts
      <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full ml-2">
        {userPosts.length}
      </span>
    </h2>
    
    {userPosts.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userPosts.map((post) => (
          <motion.div
            key={post._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
          >
            <div className="p-5 h-full flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center min-w-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 border-2 border-blue-100 shadow-sm">
                    <img
                      src={post.author?.photo  || assets.user_image || "/default-avatar.png"}
                      alt={post.author?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {post.author?.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <FiCalendar className="text-gray-400" />
                      {post.createdAt && formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                {isCurrentUser && (
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => navigate(`/edit-post/${post._id}`)}
                      className="text-blue-500 hover:text-blue-600 flex-shrink-0 transition-colors duration-200 p-2 rounded-lg bg-blue-50 hover:bg-blue-100"
                      aria-label="Edit post"
                    >
                      <FiEdit2 className="text-lg" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteClick(post._id)}
                      className="text-red-500 hover:text-red-600 flex-shrink-0 transition-colors duration-200 p-2 rounded-lg bg-red-50 hover:bg-red-100"
                      aria-label="Delete post"
                    >
                      <FiTrash2 className="text-lg" />
                    </motion.button>
  
                  </div>
                  
                )}
              </div>

              {/* Post Content */}
              {post.content && (
                <p className="mb-4 whitespace-pre-line break-words text-gray-700 flex-grow leading-relaxed">
                  {post.content}
                </p>
              )}

              {/* Responsive Image */}
              {post.imageUrl && (
                <motion.div
                  whileHover={{ scale: 0.98 }}
                  className="mb-4 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <div className="aspect-w-16 aspect-h-9 w-full bg-gray-100">
                    <img
                      src={post.imageUrl}
                      alt="Post content"
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                      onClick={() => window.open(post.imageUrl, '_blank')}
                    />
                  </div>
                </motion.div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <div className="flex items-center space-x-4">
                <motion.button
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  onClick={() => handleShowLikes(post._id, id)} // Pass both post._id and id
  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors duration-200 p-2 rounded-lg hover:bg-red-50"
>
  <FiHeart className="text-lg" />
  <span className="text-sm font-medium">{post.likes?.length || 0}</span>
</motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShowComments(post._id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <FiMessageSquare className="text-lg" />
                    <span className="text-sm font-medium">{post.comments?.length || 0}</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    ) : (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 text-center border-2 border-dashed border-blue-200"
      >
        <div className="text-blue-400 mb-6">
          <FiFileText className="h-20 w-20 mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">
          No posts yet
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {isCurrentUser
            ? "Share your thoughts and experiences with the community!"
            : "This user hasn't shared any posts yet."}
        </p>
        {isCurrentUser && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/home"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:shadow-xl"
            >
              <FiPlus className="text-lg" />
              Create your first post
            </Link>
          </motion.div>
        )}
      </motion.div>
    )}

    {/* Likes Modal */}
  {showLikesModal && (
  <LikesModal 
    postId={selectedPostId} 
    userId={selectedUserId} // Pass the userId to the modal
    onClose={() => setShowLikesModal(false)} 
  />
)}

    {/* Comments Modal */}
    {showCommentsModal && (
      <CommentsModal 
        postId={selectedPostId} 
        onClose={() => setShowCommentsModal(false)} 
      />
    )}
  </div>
)}

{activeTab === "about" && (
  <div className="p-4 md:p-6">
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2">
      <FiUser className="text-purple-600 text-lg md:text-xl" />
      About
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {/* Personal Information Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
          <FiUser className="text-blue-600 text-sm md:text-base" />
          Personal Information
        </h3>
        <div className="space-y-3 md:space-y-4">
          <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-blue-50">
            <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
              <FiUser className="text-blue-500 text-sm md:text-base" />
              Full Name
            </span>
            <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.name}</span>
          </div>
          {profileUser.username && (
            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-green-50">
              <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <FiAtSign className="text-green-500 text-sm md:text-base" />
                Username
              </span>
              <span className="font-medium text-gray-800 text-sm md:text-base">@{profileUser.username}</span>
            </div>
          )}
          {profileUser.dateOfBirth && (
            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-purple-50">
              <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <FiCalendar className="text-purple-500 text-sm md:text-base" />
                Date of Birth
              </span>
              <span className="font-medium text-gray-800 text-sm md:text-base">{formatDate(profileUser.dateOfBirth)}</span>
            </div>
          )}
          {profileUser.gender && (
            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-pink-50">
              <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <FiHeart className="text-pink-500 text-sm md:text-base" />
                Gender
              </span>
              <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.gender}</span>
            </div>
          )}
        </div>
      </div>

      {/* Contact Information Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
          <FiMail className="text-green-600 text-sm md:text-base" />
          Contact Information
        </h3>
        <div className="space-y-3 md:space-y-4">
        {profileUser.email && (
  <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-green-50">
    <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
      <FiMail className="text-green-500 text-sm md:text-base" />
      Email
    </span>
    <span className="font-medium text-gray-800 text-sm md:text-base break-all">
      {'' + profileUser.email.slice(4, 6) + '*****' + profileUser.email.slice(-10)}
    </span>
  </div>
)}

          {profileUser.mobile && (
            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-blue-50">
              <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <FiPhone className="text-blue-500 text-sm md:text-base" />
                Phone
              </span>
              <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.mobile}</span>
            </div>
          )}
          {profileUser.address && (
            <>
              {profileUser.address.street && (
                <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                    <FiMapPin className="text-gray-500 text-sm md:text-base" />
                    Street
                  </span>
                  <span className="font-medium text-gray-800 text-sm md:text-base text-right">{profileUser.address.street}</span>
                </div>
              )}
              {profileUser.address.city && (
                <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                    <FiMap className="text-gray-500 text-sm md:text-base" />
                    City
                  </span>
                  <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.city}</span>
                </div>
              )}
              {profileUser.address.state && (
                <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                    <FiNavigation className="text-gray-500 text-sm md:text-base" />
                    State
                  </span>
                  <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.state}</span>
                </div>
              )}
              {profileUser.address.country && (
                <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                    <FiGlobe className="text-gray-500 text-sm md:text-base" />
                    Country
                  </span>
                  <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.country}</span>
                </div>
              )}
              {profileUser.address.zipCode && (
                <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-gray-50">
                  <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                    <FiHash className="text-gray-500 text-sm md:text-base" />
                    Zip Code
                  </span>
                  <span className="font-medium text-gray-800 text-sm md:text-base">{profileUser.address.zipCode}</span>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-yellow-50">
            <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
              <FiActivity className="text-yellow-500 text-sm md:text-base" />
              Account Status
            </span>
            <span className={`font-medium text-sm md:text-base ${profileUser.isAccountActive ? 'text-green-600' : 'text-red-600'}`}>
              {profileUser.isAccountActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-indigo-50">
            <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
              <FiCheckCircle className="text-indigo-500 text-sm md:text-base" />
              Verification
            </span>
            <span className={`font-medium text-sm md:text-base ${profileUser.isAccountVerified ? 'text-green-600' : 'text-red-600'}`}>
              {profileUser.isAccountVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </div>
      </div>

      {/* Portfolio Card */}
      {profileUser.portfolioUrl && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
            <FiLink className="text-purple-600 text-sm md:text-base" />
            Portfolio
          </h3>
          <div className="space-y-3 md:space-y-4">
            <div className="flex justify-between items-center p-2 md:p-3 rounded-lg bg-purple-50">
              <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                <FiExternalLink className="text-purple-500 text-sm md:text-base" />
                Website
              </span>
              <a 
                href={profileUser.portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200 flex items-center gap-1 text-sm md:text-base"
              >
                Visit Portfolio
                <FiExternalLink className="text-sm" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Education Card */}
      {profileUser.education && profileUser.education.length > 0 && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
            <FiBook className="text-green-600 text-sm md:text-base" />
            Education
          </h3>
          <div className="space-y-4 md:space-y-6">
            {profileUser.education.map((edu, index) => (
              <div key={index} className="border-l-4 border-green-200 pl-3 md:pl-4 py-2">
                <div className="bg-white p-3 md:p-4 rounded-lg md:rounded-xl shadow-sm border border-gray-100">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
                    <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                      <FiBookOpen className="text-green-500 text-sm md:text-base" />
                      Institution
                    </span>
                    <span className="font-semibold text-gray-800 text-sm md:text-base md:text-right">{edu.institution}</span>
                  </div>
                  {edu.degree && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
                      <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                        <FiAward className="text-blue-500 text-sm md:text-base" />
                        Degree
                      </span>
                      <span className="font-medium text-gray-800 text-sm md:text-base md:text-right">{edu.degree}</span>
                    </div>
                  )}
                  {edu.fieldOfStudy && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
                      <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                        <FiTarget className="text-purple-500 text-sm md:text-base" />
                        Field of Study
                      </span>
                      <span className="font-medium text-gray-800 text-sm md:text-base md:text-right">{edu.fieldOfStudy}</span>
                    </div>
                  )}
                  {(edu.startYear || edu.endYear) && (
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-0">
                      <span className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                        <FiClock className="text-orange-500 text-sm md:text-base" />
                        Duration
                      </span>
                      <span className="font-medium text-gray-800 text-sm md:text-base md:text-right">
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </span>
                    </div>
                  )}
                  {edu.description && (
                    <div className="mt-3 md:mt-4 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 block mb-1 md:mb-2 flex items-center gap-2 text-sm md:text-base">
                        <FiFileText className="text-gray-500 text-sm md:text-base" />
                        Description
                      </span>
                      <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed text-sm md:text-base">
                        {edu.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bio Card */}
      {profileUser.bio && profileUser.bio !== "gshgd" && (
        <div className="bg-gradient-to-br from-white to-gray-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 md:col-span-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 border-b pb-2 md:pb-3 flex items-center gap-2">
            <FiEdit className="text-indigo-600 text-sm md:text-base" />
            Bio
          </h3>
          <div className="p-3 md:p-4 bg-indigo-50 rounded-lg md:rounded-xl">
            <p className="text-gray-700 whitespace-pre-line break-words leading-relaxed text-sm md:text-base md:text-lg">
              {profileUser.bio}
            </p>
          </div>
        </div>
      )}
    </div>
  </div>
)}
 <ConfirmationModal
   
        isOpen={isModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        loading={isDeleting}
      />
</div>

        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;



