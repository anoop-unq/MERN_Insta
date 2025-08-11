
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaArrowLeft } from 'react-icons/fa';

export const AddBio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateUserBio, userdata } = useContext(AppContext);
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle back navigation
  const handleBack = () => {
    // Navigate to user profile if we have the ID, otherwise to home
    if (id) {
      navigate(`/user-profile/${id}`);
    } else {
      navigate('/home');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bio.trim()) return;
    
    setLoading(true);
    try {
      const success = await updateUserBio(id, bio);
      if (success) {
        // Navigate to user profile after successful update
        navigate(`/user-profile/${id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200 mr-4"
          aria-label="Go back"
          disabled={loading}
        >
          <FaArrowLeft className="text-xl" />
        </button>
        <h1 className="text-2xl font-bold">Add Your Bio</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          className="w-full p-3 border rounded-lg mb-4"
          rows="5"
          maxLength="200"
        />
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            disabled={loading || !bio.trim()}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : 'Save Bio'}
          </button>
        </div>
      </form>
    </div>
  );
};