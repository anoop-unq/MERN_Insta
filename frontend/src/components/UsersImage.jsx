import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const UserImage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { userdata, posts } = useContext(AppContext);

  const viewedUser = userId === userdata?.user?._id 
    ? userdata.user 
    : posts.find(post => post.author?._id === userId)?.author;

  if (!viewedUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">User not found</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
        <button
          onClick={() => navigate(`/view-users/${viewedUser._id}`)}
          className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>

      <div className="flex justify-center items-center p-4">
        <div className="max-w-2xl w-full">
          <img 
            src={viewedUser?.photo || assets.user_image} 
            alt="Profile" 
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-xl border-4 border-white"
          />
          {/* <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-gray-800">{viewedUser?.name}</h1>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default UserImage;