import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import { FaArrowLeft } from 'react-icons/fa';

const HomePage = () => {
  const { fetchPosts } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center bg-white text-gray-700 rounded-full p-3 w-12 h-12 hover:bg-gray-100 transition duration-200 ease-in-out shadow-sm border border-gray-200"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h1 className="text-2xl font-bold ml-4">Public Feed</h1>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-8">
          <PostForm />
        </div>
        <div className="space-y-6">
          <PostList />
        </div>
      </main>

      {/* Floating back button for mobile */}
      <div className="md:hidden fixed bottom-6 right-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center bg-blue-500 text-white rounded-full p-4 w-14 h-14 hover:bg-blue-600 transition duration-200 ease-in-out shadow-lg"
          aria-label="Go back"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </div>
    </div>
  );
}

export default HomePage;