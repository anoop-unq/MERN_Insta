// import React, { useContext, useState, useRef, useEffect } from 'react';
// import { AppContext } from '../context/AppContext';
// import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom';
// import { FaArrowLeft, FaCamera, FaSave, FaTimes } from 'react-icons/fa';
// import { motion } from 'framer-motion';

// const EditProfile = () => {
//   const { userdata, updateUserProfile, updateUserPhoto } = useContext(AppContext);
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
  
//   const [formData, setFormData] = useState({
//     name: '',
//     bio: '',
//     mobile: '',
//     dateOfBirth: '',
//     gender: ''
//   });
//   const [photoPreview, setPhotoPreview] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isPhotoUploading, setIsPhotoUploading] = useState(false);

//   // Initialize form data when userdata is available
//   useEffect(() => {
//     if (userdata?.user) {
//       const user = userdata.user;
//       setFormData({
//         name: user.name || '',
//         bio: user.bio || '',
//         mobile: user.mobile || '',
//         dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
//         gender: user.gender || 'Prefer not to say'
//       });
//       setPhotoPreview(user.photo || '');
//     }
//   }, [userdata]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handlePhotoChange = async (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (!file.type.match('image.*')) {
//         toast.error('Please select an image file (JPEG, PNG, etc.)');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('Image size should be less than 5MB');
//         return;
//       }
      
//       setIsPhotoUploading(true);
//       try {
//         setPhotoPreview(URL.createObjectURL(file));
//         const success = await updateUserPhoto(userdata.user._id, file);
//         if (!success) {
//           setPhotoPreview(userdata?.user?.photo || '');
//         }
//       } catch (error) {
//         setPhotoPreview(userdata?.user?.photo || '');
//         toast.error('Error uploading photo');
//       } finally {
//         setIsPhotoUploading(false);
//       }
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;
    
//     setIsSubmitting(true);
    
//     try {
//       const success = await updateUserProfile(
//         userdata.user._id,
//         formData
//       );
      
//       if (success) {
//         setTimeout(() => {
//           navigate(`/user-profile/${userdata.user._id}`);
//         }, 500);
//       } else {
//         toast.error('Failed to update profile');
//       }
//     } catch (error) {
//       toast.error('An error occurred. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!userdata) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-pulse flex space-x-4">
//           <div className="rounded-full bg-gray-200 h-12 w-12"></div>
//           <div className="flex-1 space-y-4 py-1">
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             <div className="space-y-2">
//               <div className="h-4 bg-gray-200 rounded"></div>
//               <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       transition={{ duration: 0.3 }}
//       className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8"
//     >
//       <div className="max-w-3xl mx-auto">
//         <div className="flex items-center mb-8">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => navigate(-1)}
//             className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition-all duration-200 ease-in-out shadow-sm border border-gray-200 hover:shadow-md"
//             aria-label="Go back"
//           >
//             <FaArrowLeft className="text-lg" />
//           </motion.button>
//           <h1 className="text-3xl font-bold text-gray-800 ml-4 font-sans">Edit Profile</h1>
//         </div>
        
//         <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//           <form onSubmit={handleSubmit} className="p-6 sm:p-8">
//             {/* Profile Photo Section */}
//             <div className="flex flex-col items-center mb-8">
//               <div className="relative group">
//                 <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
//                   {photoPreview ? (
//                     <img 
//                       src={photoPreview} 
//                       alt="Profile" 
//                       className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-90"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
//                       <span className="text-gray-500 text-lg font-medium">
//                         {userdata.user.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                   )}
//                 </div>
                
//                 <motion.button
//                   type="button"
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={() => fileInputRef.current.click()}
//                   className={`absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-all duration-200 shadow-lg ${
//                     isPhotoUploading ? 'opacity-70 cursor-not-allowed' : ''
//                   }`}
//                   disabled={isPhotoUploading}
//                 >
//                   {isPhotoUploading ? (
//                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                   ) : (
//                     <FaCamera className="text-lg" />
//                   )}
//                 </motion.button>
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handlePhotoChange}
//                   accept="image/*"
//                   className="hidden"
//                   disabled={isPhotoUploading}
//                 />
//               </div>
//               <p className="mt-4 text-sm text-gray-500 font-medium">
//                 {isPhotoUploading ? 'Uploading your photo...' : 'Click the camera to update your profile photo'}
//               </p>
//             </div>
            
//             {/* Form Fields */}
//             <div className="space-y-6">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
//                   Full Name *
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     id="name"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
//                     maxLength={50}
//                     required
//                     placeholder="Enter your full name"
//                   />
//                   <span className="absolute right-3 top-3 text-xs text-gray-400">
//                     {formData.name.length}/50
//                   </span>
//                 </div>
//               </div>
              
//               <div>
//                 <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
//                   About You
//                 </label>
//                 <div className="relative">
//                   <textarea
//                     id="bio"
//                     name="bio"
//                     value={formData.bio}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
//                     maxLength={150}
//                     placeholder="Tell us something about yourself..."
//                   />
//                   <span className="absolute right-3 bottom-3 text-xs text-gray-400">
//                     {formData.bio.length}/150
//                   </span>
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="tel"
//                   id="mobile"
//                   name="mobile"
//                   value={formData.mobile}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
//                   placeholder="Enter your mobile number"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
//                   Date of Birth
//                 </label>
//                 <input
//                   type="date"
//                   id="dateOfBirth"
//                   name="dateOfBirth"
//                   value={formData.dateOfBirth}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
//                   Gender
//                 </label>
//                 <select
//                   id="gender"
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
//                 >
//                   <option value="Prefer not to say">Prefer not to say</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>
            
//             {/* Action Buttons */}
//             <div className="mt-10 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
//               <motion.button
//                 type="button"
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 onClick={() => navigate(-1)}
//                 className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
//                 disabled={isSubmitting}
//               >
//                 <FaTimes className="mr-2" />
//                 Cancel
//               </motion.button>
              
//               <motion.button
//                 type="submit"
//                 whileHover={{ scale: 1.03 }}
//                 whileTap={{ scale: 0.97 }}
//                 className={`flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 font-medium shadow-md ${
//                   isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
//                 }`}
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <FaSave className="mr-2" />
//                     Save Changes
//                   </>
//                 )}
//               </motion.button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default EditProfile;


import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaSave, FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const EditProfile = () => {
  const { userdata, updateUserProfile, updateUserPhoto } = useContext(AppContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    portfolioUrl: '',
    education: [],
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPhotoUploading, setIsPhotoUploading] = useState(false);

  // Initialize form data when userdata is available
  useEffect(() => {
    if (userdata?.user) {
      const user = userdata.user;
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        mobile: user.mobile || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        gender: user.gender || 'Prefer not to say',
        portfolioUrl: user.portfolioUrl || '',
        education: user.education || [],
        address: user.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zipCode: ''
        }
      });
      setPhotoPreview(user.photo || '');
    }
  }, [userdata]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const addEducationEntry = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startYear: '',
          endYear: '',
          description: ''
        }
      ]
    }));
  };

  const removeEducationEntry = (index) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
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
        setPhotoPreview(URL.createObjectURL(file));
        const success = await updateUserPhoto(userdata.user._id, file);
        if (!success) {
          setPhotoPreview(userdata?.user?.photo || '');
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
        formData
      );
      
      if (success) {
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
      <div className="max-w-4xl mx-auto">
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
                  Full Name *
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
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
                    maxLength={150}
                    placeholder="Tell us something about yourself..."
                  />
                  <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                    {formData.bio.length}/150
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
                  placeholder="Enter your 10-digit mobile number"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
                >
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Portfolio URL */}
              <div>
                <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  id="portfolioUrl"
                  name="portfolioUrl"
                  value={formData.portfolioUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
                  placeholder="https://yourportfolio.com"
                />
              </div>

              {/* Education Section */}
              <div className="border-t pt-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Education</h3>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addEducationEntry}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <FaPlus className="mr-1" />
                    Add Education
                  </motion.button>
                </div>

                {formData.education.length === 0 ? (
                  <p className="text-gray-500 text-sm italic mb-4">
                    No education entries added yet.
                  </p>
                ) : (
                  formData.education.map((edu, index) => (
                    <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50 relative">
                      <button
                        type="button"
                        onClick={() => removeEducationEntry(index)}
                        className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                        aria-label="Remove education entry"
                      >
                        <FaTrash size={14} />
                      </button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Institution
                          </label>
                          <input
                            type="text"
                            value={edu.institution || ''}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="University/College"
                            maxLength={100}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Degree
                          </label>
                          <input
                            type="text"
                            value={edu.degree || ''}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Bachelor's, Master's, etc."
                            maxLength={100}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Field of Study
                          </label>
                          <input
                            type="text"
                            value={edu.fieldOfStudy || ''}
                            onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Computer Science, Business, etc."
                            maxLength={100}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Year
                            </label>
                            <input
                              type="number"
                              min="1950"
                              max={new Date().getFullYear()}
                              value={edu.startYear || ''}
                              onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="YYYY"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Year
                            </label>
                            <input
                              type="number"
                              min="1950"
                              max={new Date().getFullYear() + 10}
                              value={edu.endYear || ''}
                              onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="YYYY"
                            />
                          </div>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={edu.description || ''}
                            onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Describe your studies, achievements, etc."
                            maxLength={300}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Address Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Address</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="123 Main St"
                      maxLength={200}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="New York"
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province
                    </label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="California"
                      maxLength={50}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="address.country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="United States"
                      maxLength={50}
                    />
                  </div>
                  
               <div>
  <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 mb-1">
    ZIP/Postal Code
  </label>
  <input
    type="text"
    id="address.zipCode"
    name="address.zipCode"
    value={formData.address.zipCode}
    onChange={(e) => {
      const value = e.target.value;
      // Allow only numbers
      if (value === '' || /^\d+$/.test(value)) {
        handleChange(e);
      } else {
        // Show error toast if not a number
        toast.error('Only numbers are allowed in ZIP/Postal Code', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
    placeholder="10001"
    maxLength={20}
  />
</div>
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