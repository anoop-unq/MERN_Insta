import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import PostList from './PostList';
import { assets } from '../assets/assets';
import { FaArrowLeft } from 'react-icons/fa';

const ViewUsers = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userdata, posts } = useContext(AppContext);
  const [showPosts, setShowPosts] = useState(false);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  // Find the user in existing data
  const viewedUser = userId === userdata?.user?._id 
    ? userdata.user 
    : posts.find(post => post.author?._id === userId)?.author;

  // Check if user has a custom photo (not the default asset)
  const hasCustomPhoto = viewedUser?.photo && viewedUser.photo !== assets.user_image;

  const togglePosts = () => {
    if (!showPosts) {
      setIsLoadingPosts(true);
      setTimeout(() => {
        setShowPosts(true);
        setIsLoadingPosts(false);
      }, 1000);
    } else {
      setShowPosts(false);
    }
  };

  const handleImageClick = () => {
    if (hasCustomPhoto) {
      navigate(`/view-users/image/${userId}`);
    }
  };

  // Filter posts by this user
  const userPosts = posts.filter(post => post.author?._id === userId);

  if (!viewedUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
        <div 
          className={`relative group ${hasCustomPhoto ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={handleImageClick}
        >
          <img 
            src={viewedUser?.photo || assets.user_image} 
            alt="Profile" 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300 hover:border-blue-400 hover:shadow-xl"
          />
          {hasCustomPhoto && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-white font-medium transition-opacity duration-300">
                View
              </span>
            </div>
          )}
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{viewedUser?.name}</h1>
          {/* {viewedUser?.bio && (
            <p className="mt-2 text-gray-700 max-w-md">
              {viewedUser.bio}
            </p>
          )} */}
        </div>
      </div>

      {/* Posts Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {userPosts.length} {userPosts.length === 1 ? 'Post' : 'Posts'}
          </h2>
          <button
            onClick={togglePosts}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
          >
            {showPosts ? 'Hide Posts' : 'View Posts'}
          </button>
        </div>

        {isLoadingPosts ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : showPosts && (
          <div className="space-y-6 animate-fadeIn">
            <PostList posts={userPosts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewUsers;