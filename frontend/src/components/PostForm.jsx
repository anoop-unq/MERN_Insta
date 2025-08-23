import { useContext, useState, useCallback, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';

const PostForm = () => {
  const { createPost, islogged, userdata } = useContext(AppContext);
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!content.trim() && !image) {
      toast.error('Post must contain either text or an image');
      return;
    }
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (content.trim()) formData.append('content', content);
      if (image) formData.append('image', image);

      const success = await createPost(formData);
      if (success) {
        setContent('');
        removeImage();
        toast.success('Post created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create post');
      console.error('Post submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [content, image, createPost, isSubmitting]);

  const navigateToProfile = (id) => {
    navigate(`/user-profile/${id}`);
  };

  const navigateToEditProfile = (id) => {
    navigate(`/edit-profile/${id}`);
  };

  const toggleBio = () => {
    setShowFullBio(!showFullBio);
  };

  if (!islogged) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start flex-1 min-w-0" >
          <img 
            src={userdata?.user?.photo || assets.user_image || '/default-avatar.png'} 
            alt="User avatar" 
            className="w-10 h-10 rounded-full mr-3 cursor-pointer flex-shrink-0 object-cover"
            onClick={() => navigateToProfile(userdata.user._id)}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate"  onClick={() => navigateToProfile(userdata.user._id)}>{userdata?.name}</h3>
            <p className="text-gray-500 text-sm truncate" >{userdata?.user?.username}</p>
            {userdata?.user?.bio && (
              <div className="text-gray-500 text-sm mt-1">
                {showFullBio ? (
                  <p className="whitespace-pre-line break-words">{userdata.user.bio}</p>
                ) : (
                  <p className="whitespace-pre-line break-words line-clamp-2">
                    {userdata.user.bio}
                  </p>
                )}
                {userdata.user.bio.length > 100 && (
                  <button
                    onClick={toggleBio}
                    className="text-blue-500 hover:text-blue-700 text-sm mt-1 focus:outline-none"
                  >
                    {showFullBio ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => navigateToEditProfile(userdata.user._id)}
          className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-lg transition-colors md:px-4 md:py-2 flex-shrink-0 ml-2"
          aria-label="Edit profile"
        >
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          maxLength={500}
        />
        
       {imagePreview && (  // Changed from !imagePreview to imagePreview
  <div className="mt-4 relative group">
    <img 
      src={imagePreview} 
      alt="Preview" 
      className="w-full max-h-96 rounded-lg object-contain border border-gray-200"
    />
    <button
      type="button"
      onClick={removeImage}
      className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all"
      aria-label="Remove image"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </button>
  </div>
)}
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-3">
            <label className="inline-flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {image ? 'Change Photo' : 'Add Photo'}
              </span>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </label>
            
            <span className={`text-sm ${content.length === 500 ? 'text-red-500' : 'text-gray-500'}`}>
              {content.length}/500
            </span>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting || (!content.trim() && !image)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </span>
            ) : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;