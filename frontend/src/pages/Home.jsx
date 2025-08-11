

import { useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

import { Navbar } from '../components/Navbar';
import Header from '../components/Header'

const Home = () => {
  const { fetchPosts } = useContext(AppContext);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div>
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;