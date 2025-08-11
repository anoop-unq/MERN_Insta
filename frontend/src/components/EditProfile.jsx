import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EditProfile = () => {
  const { userdata, updateUserProfile, updateUserPhoto } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: userdata?.user?.name || '',
    bio: userdata?.user?.bio || ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(userdata?.user?.photo || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setIsPhotoUploading(true);
      try {
        // Show preview immediately
        setPhotoPreview(URL.createObjectURL(file));
        
        // Upload to server
        const success = await updateUserPhoto(userdata.user._id, file);
        if (!success) {
          // Revert if upload fails
          setPhotoPreview(userdata?.user?.photo || '');
          toast.error('Failed to upload photo. Please try again.');
        }
      } catch (error) {
        setPhotoPreview(userdata?.user?.photo || '');
        toast.error('Error uploading photo');
      } finally {
        setIsPhotoUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await updateUserProfile(
        userdata.user._id,
        formData.name,
        formData.bio
      );
      
      if (success) {
        toast.success('Profile updated successfully!');
        setTimeout(() => {
          navigate(`/user-profile/${userdata.user._id}`);
        }, 500);
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userdata) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm border border-gray-200 hover:shadow-md"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-lg" />
          </motion.button>
          <h1 className="text-3xl font-bold text-gray-800 ml-4 font-sans">Edit Profile</h1>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Profile" 
                      className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">
                        {userdata.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current.click()}
                  className={`absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg ${
                    isPhotoUploading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                  disabled={isPhotoUploading}
                >
                  {isPhotoUploading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FaCamera className="text-lg" />
                  )}
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isPhotoUploading}
                />
              </div>
              <p className="mt-4 text-sm text-gray-500 font-medium">
                {isPhotoUploading ? 'Uploading your photo...' : 'Click the camera to update your profile photo'}
              </p>
            </div>
            
            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
                    maxLength={50}
                    required
                    placeholder="Enter your full name"
                  />
                  <span className="absolute right-3 top-3 text-xs text-gray-400">
                    {formData.name.length}/50
                  </span>
                </div>
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  About You
                </label>
                <div className="relative">
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
                    maxLength={200}
                    placeholder="Tell us something about yourself..."
                  />
                  <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {formData.bio.length}/500
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
                disabled={isSubmitting}
              >
                <FaTimes className="mr-2" />
                Cancel
              </motion.button>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-md ${
                  isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Changes
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default EditProfile;