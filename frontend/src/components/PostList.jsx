import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import moment from 'moment';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostList = ({ posts: postsProp }) => {
  const { posts: contextPosts, isLoadingPosts, userdata, deletePost, likePost, updatePostInContext } = useContext(AppContext);
  const navigate = useNavigate();
  const posts = postsProp || contextPosts;

  axios.defaults.withCredentials = true;
  const [localLikes, setLocalLikes] = useState({});
  const [localLoading, setLocalLoading] = useState({});

  if (isLoadingPosts && !postsProp) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleProfileClick = (userId) => {
    navigate(`/view-users/${userId}`);
  };

  const handleLike = async (postId) => {
    if (!userdata?.user?._id) {
      navigate('/login');
      return;
    }
    
    if (localLoading[postId]) return;
    setLocalLoading(prev => ({ ...prev, [postId]: true }));

    try {
      const post = posts.find(p => p._id === postId);
      const isCurrentlyLiked = post.likes.includes(userdata.user._id);
      
      const updatedPost = {
        ...post,
        likes: isCurrentlyLiked 
          ? post.likes.filter(id => id !== userdata.user._id)
          : [...post.likes, userdata.user._id]
      };
      
      updatePostInContext(updatedPost);
      await likePost(postId);
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setLocalLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-0 xl:px-2 py-6">
      {posts.length === 0 ? (
        <div className="max-w-3xl mx-auto text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No posts yet</h3>
          <p className="mt-1 text-gray-500">Be the first to share something!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {posts.map(post => {
            const isLiked = localLikes[post._id] ?? post.likes?.includes(userdata?.user?._id);
            const likeCount = post.likes?.length || 0;
            const isLoading = localLoading[post._id];

            return (
              <div 
                key={post._id} 
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden hover:-translate-y-1"
              >
                <div className="p-5">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="relative group flex-shrink-0">
                      <img 
                        src={post.author?.photo || assets.user_image} 
                        alt="User avatar" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white cursor-pointer hover:opacity-90 transition-opacity duration-200"
                        onClick={() => handleProfileClick(post.author?._id)}
                      />
                      <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none"></div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{post.author?.name}</h3>
                      <p className="text-gray-500 text-sm">
                        @{post.author?.username} · {moment(post.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                  
                  {post.content && (
                    <p className="whitespace-pre-line text-gray-700 mb-4">{post.content}</p>
                  )}
                  
                  {post.imageUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-gray-100">
                      <img 
                        src={post.imageUrl} 
                        alt="Post content" 
                        className="w-full h-auto max-h-80 object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center pt-3 border-t border-gray-100">
                    <button 
                      className={`flex items-center space-x-1 mr-4 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} transition-colors duration-200`}
                      onClick={() => handleLike(post._id)}
                      disabled={isLoading}
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill={isLiked ? 'currentColor' : 'none'} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                      <span>{likeCount}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PostList;