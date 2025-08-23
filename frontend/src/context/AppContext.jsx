
import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true;
  const [islogged, setIsLogged] = useState(false);
  const [userdata, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // Add these to your AppContext state
const [searchQuery, setSearchQuery] = useState('');
const [isSearching, setIsSearching] = useState(false);
  
  // Fetch user data
  const getUserData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/data`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setUserData(response.data.userData);
      } else {
        toast.error(response.data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/user-details/${userId}`, {
      withCredentials: true,
    });

    if (response.data.success) {
      return response.data.userData;
    } else {
      toast.error(response.data.message || "Failed to fetch user data");
      return null;
    }
  } catch (error) {
    toast.error(
      error?.response?.data?.message || error.message || "Something went wrong"
    );
    return null;
  }
};

  // Check auth state
  const getAuthState = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user-auth`, {
        withCredentials: true
      });

      if (response.data.success) {
        setIsLogged(true);
        await getUserData();
      } else {
        setIsLogged(false);
      }
    } catch (error) {
      setIsLogged(false);
      console.warn("Not logged in:", error?.response?.data?.message);
    }
  };

  // Fetch all posts
  const fetchPosts = useCallback(async () => {
    setIsLoadingPosts(true);
    try {
      const response = await axios.get(`${backendUrl}/api/posts`,{
        withCredentials:true
      });
     
      setPosts(response.data);
    } catch (error) {
      toast.error("Failed to fetch posts");
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoadingPosts(false);
    }
  }, [backendUrl]);

  


const createPost = useCallback(async (formData) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/posts`,
      formData,
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    console.log('Post creation response:', response.data); // Debug
    
    if (response.data.success && response.data.post) {
      // Transform the post data to match your frontend expectations
      const newPost = {
        ...response.data.post,
        // Add any additional frontend-only fields if needed
      };
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      return true;
    }
    throw new Error(response.data.message || 'Invalid response format');
    
  } catch (error) {
    console.error('Create post error:', error);
    toast.error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Failed to create post'
    );
    return false;
  }
}, [backendUrl]);

  // Add this to your context provider
const updateUserBio = async (userId, bio) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/user/${userId}`,
      { bio },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    if (response.data.success) {
      // Update local state
      if (userdata?.user?._id === userId) {
        setUserData(prev => ({
          ...prev,
          user: {
            ...prev.user,
            bio: response.data.user.bio
          }
        }));
      }
      toast.success("Bio updated successfully");
      return true;
    }
    throw new Error(response.data.message || 'Update failed');
    
  } catch (error) {
    console.error('Bio update failed:', {
      error: error.response?.data || error.message
    });
    toast.error(
      error.response?.data?.message || 
      error.message || 
      'Failed to update bio'
    );
    return false;
  }
};

// Add this to your AppContext.js
// const deletePostImage = useCallback(async (postId) => {
//   try {
//     const response = await axios.delete(
//       `${backendUrl}/api/posts/${postId}/delete-image`,
//       {},
//       { withCredentials: true }
//     );

//     if (response.data.success) {
//       // Update the post in context
//       setPosts(prevPosts => 
//         prevPosts.map(post => 
//           post._id === postId ? response.data.post : post
//         )
//       );
//       toast.success("Image removed successfully");
//       return true;
//     }

//     throw new Error(response.data.message || 'Failed to remove image');

//   } catch (error) {
//     console.error('');
//     toast.error(
        
//      "Post does not have an image to delete"
//       || error.response?.data?.message || 
//       error.message || 
//       'Failed to remove image'
//     );
//     return false;
//   }
// }, [backendUrl]);


const deletePostImage = useCallback(async (postId) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/posts/${postId}/delete-image`,
      {},
      { withCredentials: true }
    );

    if (response.data.success) {
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data.post : post
        )
      );
      toast.success("Image removed successfully");
      return true;
    }

    throw new Error(response.data.message || 'Failed to remove image');
  } catch (error) {
    // Only show error if it's not a 404/400 about missing image
    if (!error.response || 
        (error.response.status !== 400 && error.response.status !== 404)) {
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'Failed to remove image'
      );
    }
    return false;
  }
}, [backendUrl]);


// Update this function in your AppContext
const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await axios.put(
      `${backendUrl}/api/users/edit/${userId}`, 
      profileData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    
    if (response.data.success) {
      setUserData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          ...response.data.user
        }
      }));
      toast.success('Profile updated successfully');
      return true;
    }
    return false;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update profile');
    return false;
  }
};

const getPostLikes = async (postId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/posts/${postId}/likes`, { // ← Remove comma here
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
// Get post comments
 const getPostComments = async (postId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/posts/${postId}/comments`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Add these to your AppContext.js
const [conversations, setConversations] = useState([]);
const [messages, setMessages] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);

// Fetch conversations
const fetchConversations = useCallback(async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/messages/conversations`, {
      withCredentials: true
    });
    if (response.data.success) {
      setConversations(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching conversations:", error);
  }
}, [backendUrl]);

const fetchMessages = useCallback(async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/api/messages/${userId}`, {
      withCredentials: true
    });
    if (response.data.success) {
      setMessages(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    // Add error handling (e.g., toast notification)
  }
}, [backendUrl]);

const sendMessage = useCallback(async (recipient, text) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/messages`,
      { recipient, text },
      { withCredentials: true }
    );
    
    if (response.data.success) {
      // Add the new message to existing messages
      setMessages(prev => [...prev, response.data.data.message]);
      
      // Update conversations list
      setConversations(prev => {
        const existingConvIndex = prev.findIndex(conv => 
          conv.participants.some(p => p._id === recipient)
        );
        
        if (existingConvIndex >= 0) {
          const updated = [...prev];
          updated[existingConvIndex] = response.data.data.conversation;
          return updated;
        }
        
        return [response.data.data.conversation, ...prev];
      });
      
      return true;
    }
    
    throw new Error(response.data.message || 'Failed to send message');
  } catch (error) {
    console.error("Full send error:", {
      config: error.config,
      response: error.response?.data
    });
    
    toast.error(
      error.response?.data?.message || 
      'Failed to send message. Please try again.'
    );
    return false;
  }
}, [backendUrl]);

// Get unread count
const getUnreadCount = useCallback(async () => {
  try {
    const response = await axios.get(`${backendUrl}/api/messages/unread/count`, {
      withCredentials: true
    });
    if (response.data.success) {
      setUnreadCount(response.data.data.unreadCount);
    }
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }
}, [backendUrl]);



// const addComment = async (postId, content) => {
//   try {
//     const response = await axios.post(
//       `${backendUrl}/api/posts/${postId}/comments`,
//       { content },
//       { withCredentials: true }
//     );
    
//     if (response.data.success && response.data.comment) {
      
//       // Ensure author data is properly structured
//       const comment = response.data.comment;
//       if (!comment.author) {
//         comment.author = {
//           name: 'Unknown User',
//           username: 'unknown',
//           photo: assets.user_image
//         };
//       }
//       return {
//         success: true,
//         message: response.data.message,
//         comment: comment
//       };
    
//     }
//     throw new Error(response.data.message || 'Failed to add comment');
//   } catch (error) {
//     console.error('Add comment error:', error);
//     throw error;
//   }
// };

// Add this to your AppContext.js
// const fetchComments = async (postId) => {
//   try {
//     const response = await axios.get(
//       `${backendUrl}/api/posts/${postId}/user-comments`,
//       { withCredentials: true }
//     );
    
//     if (response.data.success) {
//       return response.data.comments.map(comment => ({
//         ...comment,
//         // Ensure author exists
//         author: comment.author || {
//           name: 'Unknown User',
//           username: 'unknown',
//           photo: assets.user_image
//         }
//       }));
//     }
//     throw new Error(response.data.message || 'Failed to fetch comments');
//   } catch (error) {
//     console.error('Fetch comments error:', error);
//     throw error;
//   }
// };


// Updated fetchComments function for your AppContext.js


const addComment = async (postId, content) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/posts/${postId}/comments`,
      { content },
      { withCredentials: true }
    );
    
    if (response.data.success && response.data.comment) {
      const comment = response.data.comment;
      
      // Ensure author data is properly structured
      if (!comment.author) {
        comment.author = {
          name: 'Unknown User',
          username: 'unknown',
          photo: assets.user_image
        };
      }
      
      return {
        success: true,
        message: response.data.message,
        comment: comment
      };
    }
    throw new Error(response.data.message || 'Failed to add comment');
  } catch (error) {
    console.error('Add comment error:', error);
    
    // Provide more specific error messages
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Network error or server unavailable');
    }
  }
};

const fetchComments = async (postId) => {
  try {
    console.log('Fetching comments for postId:', postId);
    
    const response = await axios.get(
      `${backendUrl}/api/posts/${postId}/user-comments`,
      { withCredentials: true }
    );
    
    console.log('fetchComments raw response:', response.data);
    console.log('Response status:', response.status);
    console.log('Comments received:', response.data.comments);
    
    if (response.data.success) {
      // Ensure comments is always an array
      const comments = Array.isArray(response.data.comments) ? response.data.comments : [];
      
      console.log('Processing', comments.length, 'comments');
      
      // Process each comment to ensure proper structure
      const processedComments = comments.map((comment, index) => {
        console.log(`Processing comment ${index}:`, comment);
        
        // Handle case where comment might be just an ID string
        if (typeof comment === 'string') {
          console.warn('Comment is just a string ID:', comment);
          return {
            _id: comment,
            content: 'Comment details not found',
            author: {
              _id: null,
              name: 'Unknown User',
              username: 'unknown',
              photo: assets.user_image
            },
            createdAt: new Date().toISOString()
          };
        }
        
        // Ensure comment has all required fields
        const processedComment = {
          _id: comment._id || `temp-${Date.now()}-${index}`,
          content: comment.content || 'No content available',
          createdAt: comment.createdAt || new Date().toISOString(),
          author: null // Will be set below
        };
        
        // Handle author data
        if (comment.author) {
          // If author is populated
          if (typeof comment.author === 'object') {
            processedComment.author = {
              _id: comment.author._id || null,
              name: comment.author.name || comment.author.username || 'Unknown User',
              username: comment.author.username || 'unknown',
              photo: comment.author.photo || comment.author.profilePicture || assets.user_image
            };
          } else if (typeof comment.author === 'string') {
            // If author is just an ID (not populated)
            console.warn('Author not populated for comment:', comment._id);
            processedComment.author = {
              _id: comment.author,
              name: 'User',
              username: 'user',
              photo: assets.user_image
            };
          }
        } else {
          // No author data at all
          console.warn('No author data for comment:', comment._id);
          processedComment.author = {
            _id: null,
            name: 'Anonymous User',
            username: 'anonymous',
            photo: assets.user_image
          };
        }
        
        console.log('Processed comment:', processedComment);
        return processedComment;
      });
      
      console.log('Final processed comments:', processedComments);
      return processedComments;
    } else {
      console.error('API returned success: false', response.data);
      throw new Error(response.data.message || 'Failed to fetch comments');
    }
  } catch (error) {
    console.error('Fetch comments error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Error message:', error.message);
    
    // Don't throw the error, return empty array to prevent UI crashes
    return [];
  }
};



// Add this function to your context
const searchPosts = useCallback(async (query) => {
  setIsSearching(true);
  try {
    const response = await axios.get(`${backendUrl}/api/posts/search?q=${query}`, {
      withCredentials: true
    });
    setPosts(response.data);
  } catch (error) {
    toast.error("Failed to search posts");
    console.error("Search error:", error);
  } finally {
    setIsSearching(false);
  }
}, [backendUrl]);



const updateUserPhoto = async (userId, photoFile) => {
  try {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const response = await axios.put(
      `${backendUrl}/api/users/edit/${userId}/photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setUserData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          photo: response.data.photoUrl
        }
      }));
      toast.success('Profile photo updated successfully');
      return true;
    }
    return false;
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to update profile photo');
    return false;
  }
};

const updatePost = useCallback(async (postId, formData) => {
  try {
    // Determine if we're sending FormData (for images) or JSON (for text-only updates)
    const isFormData = formData instanceof FormData;
    
    const config = {
      withCredentials: true,
      headers: {
        'Content-Type': isFormData ? 'multipart/form-data' : 'application/json'
      }
    };

    const response = await axios.put(
      `${backendUrl}/api/posts/${postId}`,
      isFormData ? formData : { content: formData },
      config
    );

    if (response.data.success && response.data.post) {
      // Update the post in context
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId ? response.data.post : post
        )
      );
      toast.success("Post updated successfully");
      return true;
    }
    throw new Error(response.data.message || 'Invalid response format');
  } catch (error) {
    console.error('Update post error:', {
      error: error.response?.data || error.message
    });
    toast.error(
      error.response?.data?.error || 
      error.response?.data?.message || 
      error.message || 
      'Failed to update post'
    );
    return false;
  }
}, [backendUrl]);

// In your AppContext provider
const updatePostInContext = (updatedPost) => {
  setPosts(prevPosts => 
    prevPosts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    )
  );
};

const likePost = async (postId) => {
  try {
    const response = await axios.post(
      `${backendUrl}/api/posts/${postId}/like`,
      {},
      { withCredentials: true }
    );
    return response.data; // Return the updated post data
  } catch (error) {
    console.error('Like failed:', error);
    throw error; // Re-throw to handle in component
  }
};

  // Delete post
  const deletePost = useCallback(async (postId) => {
    console.log(postId,"deleter")
    try {
      await axios.delete(`${backendUrl}/api/posts/${postId}`, {
        withCredentials: true
      });
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      toast.success("Post deleted successfully");
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete post");
      return false;
    }
  }, [backendUrl]);

  // Initial data loading
  useEffect(() => {
    getAuthState();
    fetchPosts();
  }, []);

  const value = {
    backendUrl,
    getUserData,
    islogged,
    setIsLogged,
    userdata,
    setUserData,
    posts,
    fetchPosts,
    createPost,
    deletePost,
    isLoadingPosts,
    updateUserBio,
    updateUserProfile,
    updatePost,
    updateUserPhoto,
    likePost,
    deletePostImage,
    updatePostInContext,
    addComment,
    searchPosts,
    fetchComments,
      conversations,
  messages,
  unreadCount,
  fetchConversations,
  fetchMessages,
  sendMessage,
  getUnreadCount,
  getUserById,
  getPostLikes,
  getPostComments 
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};