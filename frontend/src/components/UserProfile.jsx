import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa";
import { FiMessageSquare, FiHeart } from "react-icons/fi";
import { motion } from "framer-motion";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    posts = [],
    users = [],
    userdata,
    deletePost,
  } = useContext(AppContext);
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (userdata?.user?._id === id) {
      setProfileUser(userdata.user);
      setLoading(false);
      return;
    }

    const userFromList = users.find((user) => user._id === id);
    if (userFromList) {
      setProfileUser(userFromList);
      setLoading(false);
      return;
    }

    const postWithUser = posts.find((post) => post?.author?._id === id);
    if (postWithUser) {
      setProfileUser(postWithUser.author);
      setLoading(false);
      return;
    }

    setProfileUser(null);
    setLoading(false);
  }, [id, posts, users, userdata]);

  const userPosts = posts.filter((post) => post?.author?._id === id);

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePost(postId);
    }
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-3">User not found</h2>
          <p className="text-gray-600 mb-6">
            The user you're looking for doesn't exist or hasn't created any content yet.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/home")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
          >
            Go Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 2 }}
        className="py-4 flex items-center sticky top-0 bg-white z-10 border-b shadow-sm"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 2.5 }}
          onClick={() => navigate("/home")}
          className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm border border-gray-200 flex-shrink-0"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </motion.button>
        <h1 className="text-xl md:text-2xl font-bold ml-4 truncate max-w-[calc(100%-5rem)] text-gray-800">
          {profileUser.name}'s Profile
        </h1>
      </motion.header>

      {/* Profile Content */}
      <div className="py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-6"
        >
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex-shrink-0"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img
                    src={profileUser.photo || assets.user_image || "/default-avatar.png"}
                    alt="User avatar"
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => navigate(`/view-user/image/${profileUser._id}`)}
                  />
                </div>
                <div className="absolute inset-0 rounded-full border-2 border-transparent hover:border-blue-400 transition-all duration-300 pointer-events-none" />
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-gray-800 truncate">
                  {profileUser.name}
                </h1>
                <p className="text-gray-500 truncate">@{profileUser.username}</p>
                
                {profileUser.bio && (
                  <div className="mt-3 text-gray-700">
                    <div className={`whitespace-pre-line break-words ${showFullBio ? '' : 'line-clamp-2'}`}>
                      {profileUser.bio}
                    </div>
                    {profileUser.bio.length > 100 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleBio}
                        className="text-blue-500 hover:text-blue-600 text-sm mt-1 font-medium transition-colors duration-200"
                      >
                        {showFullBio ? "Show less" : "Read more"}
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-center py-4 border-t border-gray-100">
              <div className="text-center px-6">
                <p className="text-2xl font-bold text-gray-800">{userPosts.length}</p>
                <p className="text-gray-500 text-sm">Posts</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Posts Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Posts</h2>
          
          {userPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 3 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center min-w-0">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 border border-gray-200">
                          <img
                            src={post.author?.photo || assets.user_image || "/default-avatar.png"}
                            alt={post.author?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {post.author?.name}
                          </h3>
                          <p className="text-gray-500 text-sm truncate">
                            @{post.author?.username}
                          </p>
                        </div>
                      </div>
                      {userdata?.user?._id === post.author?._id && (
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate(`/edit-post/${post._id}`)}
                            className="text-blue-500 hover:text-blue-600 flex-shrink-0 transition-colors duration-200"
                            aria-label="Edit post"
                          >
                            <FaEdit />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeletePost(post._id)}
                            className="text-red-500 hover:text-red-600 flex-shrink-0 transition-colors duration-200"
                            aria-label="Delete post"
                          >
                            <FaTrash />
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Post Content */}
                    {post.content && (
                      <p className="mb-3 whitespace-pre-line break-words text-gray-700 flex-grow">
                        {post.content}
                      </p>
                    )}

                    {/* Responsive Image */}
                    {post.imageUrl && (
                      <motion.div
                        whileHover={{ scale: 0.98 }}
                        className="mb-3 rounded-lg overflow-hidden border border-gray-100"
                      >
                        <div className="aspect-w-16 aspect-h-9 w-full bg-gray-100">
                          <img
                            src={post.imageUrl}
                            alt="Post content"
                            className="w-full h-full object-cover cursor-pointer"
                            loading="lazy"
                            // onClick={() => navigate(`/post/${post._id}`)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
                      <div className="flex items-center space-x-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200"
                        >
                          <FiHeart className="text-lg" />
                          <span>{post.likes?.length || 0}</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200"
                          onClick={() => navigate(`/post/${post._id}`)}
                        >
                          <FiMessageSquare className="text-lg" />
                          <span>{post.comments?.length || 0}</span>
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
              className="bg-white rounded-xl shadow-md p-8 text-center"
            >
              <div className="text-gray-400 mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No posts yet
              </h3>
              <p className="text-gray-500 mb-6">
                {userdata?.user?._id === profileUser._id
                  ? "Share your thoughts with the world!"
                  : "This user hasn't posted anything yet."}
              </p>
              {userdata?.user?._id === profileUser._id && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/home"
                    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-full shadow-md transition-all duration-300"
                  >
                    Create your first post
                  </Link>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;