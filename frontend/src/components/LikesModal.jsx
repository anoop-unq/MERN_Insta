import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiHeart, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const LikesModal = ({ postId, onClose }) => {
  const { getPostLikes } = useContext(AppContext);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPostLikes(postId);
        console.log(response)
        setLikes(response.likes || []);
      } catch (err) {
        console.error("Error fetching likes:", err);
        setError(err.message || "Failed to load likes");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchLikes();
    }
  }, [postId, getPostLikes]);
  console.log(likes)
  
  const handleViewProfile = (userId) => {
    onClose();
    navigate(`/view-specific-user/${userId}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiHeart className="text-red-500" />
              Likes
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : likes.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No likes yet
              </div>
            ) : (
              <div className="p-4">
                {likes.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={user.photo || assets.man_image}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = assets.man_image;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {user.name}
                      </h3>
                    </div>
                    <button 
                      className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                      onClick={() => handleViewProfile(user._id)}
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LikesModal;