
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


const updateUserProfile = async (userId, name, bio) => {
  try {
    const response = await axios.put(`${backendUrl}/api/users/edit/${userId}`, { name, bio });
    if (response.data.success) {
      setUserData(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: name || prev.user.name,
          bio: bio || prev.user.bio
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
    searchPosts
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};