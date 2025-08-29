import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMessageSquare, FiUser, FiHeart, FiSend } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const CommentsModal = ({ postId, onClose }) => {
  const { getPostComments, userdata, addComment } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getPostComments(postId);
        // Match the backend response structure
        setComments(response.comments || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
        setError(err.message || "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchComments();
    }
  }, [postId, getPostComments]);

 const handleAddComment = async () => {
  if (!newComment.trim() || submitting) return;
  
  try {
    setSubmitting(true);
    if (addComment) {
      await addComment(postId, newComment);
      // Refresh the comments list to get the latest data
      const refreshedResponse = await getPostComments(postId);
      setComments(refreshedResponse.comments || []);
    } else {
      // Mock implementation
      const mockComment = {
        _id: Date.now().toString(),
        content: newComment,
        author: {
          _id: userdata.user._id,
          name: userdata.user.name,
          username: userdata.user.username,
          photo: userdata.user.photo
        },
        likes: [],
        createdAt: new Date().toISOString()
      };
      
      setComments([mockComment, ...comments]);
    }
    setNewComment("");
  } catch (err) {
    console.error("Error adding comment:", err);
    setError(err.message || "Failed to add comment");
  } finally {
    setSubmitting(false);
  }
};
console.log(comments,"4555")
  const handleViewProfile = (userId) => {
    // onClose();
    navigate(`/view-specific-user/${userId}`);
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      if (diffInMinutes < 1) return "Just now";
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiMessageSquare className="text-blue-500" />
              Comments
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 text-center text-red-500">{error}</div>
            ) : comments.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No comments yet
              </div>
            ) : (
              <div className="p-4">
                {comments.map((comment) => (
                  
                  <div
                    key={comment._id}
                    className="mb-6 last:mb-0"
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={comment.author.photo || "/default-avatar.png"}
                          alt={comment.author.name}
                          className="w-full h-full object-cover"
                           onClick={() => handleViewProfile(comment.author._id)}
                          onError={(e) => {
                            e.target.src = "/default-avatar.png"; 
                      
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="bg-gray-100 rounded-2xl p-4">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-semibold text-gray-800">
                              {comment.author.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTime(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 whitespace-pre-line">
                            {comment.content}
                          </p>
                        </div>
                      
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Comment Form */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === "Enter") handleAddComment();
                }}
                disabled={submitting}
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim() || submitting}
                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSend />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CommentsModal;