import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/MyBlogs.module.css';
import MyBlogCard from './MyBlogCard';
import toast, { Toaster } from 'react-hot-toast';
import { fetchUserBlogs } from '../helper/blogHelper';

function MyBlogs() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        const userBlogsData = await fetchUserBlogs(userId);
        setUserBlogs(userBlogsData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleUpdate = async () => {
    try {
      // Fetch user blogs after an update (e.g., deletion)
      const updatedUserBlogs = await fetchUserBlogs(userId);
      setUserBlogs(updatedUserBlogs);

      toast.success('Blog deleted successfully!', {
        duration: 3000,
      });
    } catch (error) {
      setError(error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error fetching blogs: {error.message}</p>;
  }

  return (
    <section>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <header>
        <Header />
      </header>
      <div className={`mx-auto ${styles.blogContainer} ${styles.container} `}>
        <div className={`${styles.main}`}>
          <h1 className="text-2xl font-bold mb-4 text-center">My Blogs</h1>
          {userBlogs.length === 0 ? (
            <p>No blogs found for this user.</p>
          ) : (
            <div className="flex flex-wrap justify-center">
              {userBlogs.map((blog) => (
                <MyBlogCard key={blog._id} blog={blog} onUpdate={handleUpdate} />
              ))}
            </div>
          )}
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </section>
  );
}

export default MyBlogs;
